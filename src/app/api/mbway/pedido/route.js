import crypto from 'node:crypto';
import loja from '@/config/loja';
import { config, novoOrderId, pedidos } from '@/lib/mbway';
import { limiteExcedido, resposta, texto } from '@/lib/servidor';

export const runtime = 'nodejs';

// POST /api/mbway/pedido — envia o pedido de pagamento para o telemóvel do cliente
export async function POST(req) {
  if (limiteExcedido(req, 'mbway', 5)) {
    return resposta({ erro: 'Demasiados pedidos. Aguarde um minuto.' }, 429);
  }
  if (!config.mock && !config.chave) {
    return resposta({ erro: 'Pagamentos MB WAY ainda não configurados.' }, 503);
  }
  let corpo;
  try {
    corpo = await req.json();
  } catch {
    return resposta({ erro: 'Pedido inválido.' }, 400);
  }

  const telemovel = String(corpo?.telemovel || '').replace(/\D/g, '').replace(/^351(?=\d{9}$)/, '');
  const valor = Number(corpo?.valor);
  const referencia = texto(corpo?.referencia, 20);

  if (!/^9[1236]\d{7}$/.test(telemovel)) return resposta({ erro: 'Número de telemóvel inválido.' }, 400);
  if (!Number.isFinite(valor) || valor < loja.valorMinimo || valor > loja.valorMaximo) {
    return resposta({ erro: 'Valor inválido.' }, 400);
  }

  const orderId = novoOrderId();
  const amount = valor.toFixed(2);

  if (config.mock) {
    const requestId = 'DEMO-' + crypto.randomUUID();
    pedidos.set(requestId, { orderId, valor: amount, criadoEm: Date.now(), estado: 'pendente' });
    console.log(`[MB WAY demo] ${orderId} · €${amount} · ${telemovel}${referencia ? ' · ' + referencia : ''}`);
    return resposta({ requestId, orderId, demo: true });
  }

  try {
    const r = await fetch(config.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mbWayKey: config.chave,
        orderId,
        amount,
        mobileNumber: telemovel,
        description: `${loja.nome} ${referencia || orderId}`.slice(0, 100)
      })
    });
    const dados = await r.json().catch(() => ({}));
    if (String(dados.Status) !== '000' || !dados.RequestId) {
      console.warn('MB WAY recusou o pedido:', dados);
      return resposta({ erro: 'Não foi possível enviar o pedido MB WAY. Confirme o número e tente de novo.' }, 502);
    }
    pedidos.set(dados.RequestId, { orderId, valor: amount, criadoEm: Date.now(), estado: 'pendente' });
    return resposta({ requestId: dados.RequestId, orderId });
  } catch (err) {
    console.error('Erro ao contactar a ifthenpay:', err);
    return resposta({ erro: 'Serviço de pagamento indisponível. Tente mais tarde.' }, 502);
  }
}
