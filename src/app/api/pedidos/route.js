import crypto from 'node:crypto';
import loja from '@/config/loja';
import { produtoPorId } from '@/config/catalogo';
import { limparTelemovel, telefoneValido } from '@/lib/format';
import { guardarRegisto, limiteExcedido, resposta, texto } from '@/lib/servidor';

export const runtime = 'nodejs';

// POST /api/pedidos — regista uma encomenda para levantar na loja
export async function POST(req) {
  if (limiteExcedido(req, 'pedidos', 5)) {
    return resposta({ erro: 'Demasiados pedidos. Aguarde um minuto.' }, 429);
  }
  let corpo;
  try {
    corpo = await req.json();
  } catch {
    return resposta({ erro: 'Pedido inválido.' }, 400);
  }

  const nome = texto(corpo.nome, 80);
  const telefone = limparTelemovel(corpo.telefone);
  const notas = texto(corpo.notas, 500);
  const lojaEscolhida = loja.lojas.find((l) => l.id === corpo.loja);
  const dataHora = new Date(corpo.dataHora);

  if (nome.length < 2) return resposta({ erro: 'Indique o seu nome.' }, 400);
  if (!telefoneValido(telefone)) return resposta({ erro: 'Número de telefone inválido.' }, 400);
  if (!lojaEscolhida) return resposta({ erro: 'Loja inválida.' }, 400);
  if (Number.isNaN(dataHora.getTime()) || dataHora.getTime() < Date.now() + 20 * 60 * 1000) {
    return resposta({ erro: 'Escolha um dia e hora futuros para o levantamento.' }, 400);
  }
  if (dataHora.getTime() > Date.now() + 90 * 24 * 3600 * 1000) {
    return resposta({ erro: 'Só aceitamos encomendas até 90 dias de antecedência.' }, 400);
  }

  // Recalcula os produtos no servidor (nunca confiar nos dados do browser)
  const itens = [];
  for (const i of Array.isArray(corpo.itens) ? corpo.itens.slice(0, 50) : []) {
    const produto = produtoPorId(i?.id);
    const quantidade = Number(i?.quantidade);
    if (!produto || !Number.isInteger(quantidade) || quantidade < 1 || quantidade > 99) continue;
    itens.push({ id: produto.id, nome: produto.nome, quantidade, preco: produto.preco });
  }
  if (!itens.length) return resposta({ erro: 'O pedido está vazio.' }, 400);

  const temPrecos = itens.every((i) => typeof i.preco === 'number');
  const total = temPrecos ? Math.round(itens.reduce((s, i) => s + i.preco * i.quantidade, 0) * 100) / 100 : null;

  const numero = 'CT-' + Date.now().toString(36).toUpperCase().slice(-5) + crypto.randomBytes(1).toString('hex').toUpperCase();
  await guardarRegisto('pedidos.json', {
    numero,
    criadoEm: new Date().toISOString(),
    nome,
    telefone,
    loja: lojaEscolhida.nome,
    levantamento: dataHora.toISOString(),
    notas,
    itens,
    total,
    estado: 'novo'
  });
  console.log(`🧁 Novo pedido ${numero} de ${nome} (${itens.length} produtos)`);

  return resposta({ numero, total });
}
