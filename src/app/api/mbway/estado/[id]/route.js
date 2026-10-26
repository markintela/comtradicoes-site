import loja from '@/config/loja';
import { config, pagosPorCallback, pedidos, traduzirEstado } from '@/lib/mbway';
import { resposta } from '@/lib/servidor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/mbway/estado/:id — estado do pagamento
export async function GET(_req, { params }) {
  const requestId = params.id;
  const pedido = pedidos.get(requestId);
  if (!pedido) return resposta({ erro: 'Pedido desconhecido.' }, 404);
  if (pedido.estado !== 'pendente') return resposta({ estado: pedido.estado });

  const idadeSeg = (Date.now() - pedido.criadoEm) / 1000;

  if (config.mock) {
    if (idadeSeg > 8) pedido.estado = 'pago'; // demonstração: aceite ao fim de 8 s
    return resposta({ estado: pedido.estado });
  }

  if (pagosPorCallback.has(requestId)) {
    pedido.estado = 'pago';
    return resposta({ estado: 'pago' });
  }

  try {
    const url = `${config.estadoUrl}?mbWayKey=${encodeURIComponent(config.chave)}&requestId=${encodeURIComponent(requestId)}`;
    const r = await fetch(url, { cache: 'no-store' });
    const dados = await r.json().catch(() => ({}));
    let estado = traduzirEstado(dados.Status);
    if (estado === 'pendente' && idadeSeg > loja.tempoConfirmacao + 30) estado = 'expirado';
    pedido.estado = estado;
    return resposta({ estado });
  } catch (err) {
    console.error('Erro ao consultar estado MB WAY:', err);
    return resposta({ estado: 'pendente' });
  }
}
