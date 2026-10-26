import { emailValido } from '@/lib/format';
import { guardarRegisto, limiteExcedido, resposta, texto } from '@/lib/servidor';

export const runtime = 'nodejs';

// POST /api/contacto — guarda uma mensagem do formulário de contacto
export async function POST(req) {
  if (limiteExcedido(req, 'contacto', 3)) {
    return resposta({ erro: 'Demasiadas mensagens. Aguarde um minuto.' }, 429);
  }
  let corpo;
  try {
    corpo = await req.json();
  } catch {
    return resposta({ erro: 'Pedido inválido.' }, 400);
  }
  const nome = texto(corpo.nome, 80);
  const email = texto(corpo.email, 120);
  const mensagem = texto(corpo.mensagem, 2000);

  if (nome.length < 2) return resposta({ erro: 'Indique o seu nome.' }, 400);
  if (!emailValido(email)) return resposta({ erro: 'Email inválido.' }, 400);
  if (mensagem.length < 5) return resposta({ erro: 'Escreva a sua mensagem.' }, 400);

  await guardarRegisto('mensagens.json', { criadoEm: new Date().toISOString(), nome, email, mensagem });
  console.log(`✉️  Nova mensagem de ${nome} <${email}>`);
  return resposta({ ok: true });
}
