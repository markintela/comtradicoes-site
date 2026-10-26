// Utilitários usados só no servidor (rotas de API).
import { promises as fs } from 'node:fs';
import path from 'node:path';

const PASTA = path.resolve(process.env.PASTA_DADOS || './dados');

// Acrescenta um registo a um ficheiro JSON (ex.: dados/pedidos.json).
// Simples e suficiente para uma loja; para muitos acessos use uma base de dados.
let fila = Promise.resolve();
export function guardarRegisto(ficheiro, registo) {
  fila = fila.then(async () => {
    await fs.mkdir(PASTA, { recursive: true });
    const caminho = path.join(PASTA, ficheiro);
    let lista = [];
    try {
      lista = JSON.parse(await fs.readFile(caminho, 'utf8'));
      if (!Array.isArray(lista)) lista = [];
    } catch {
      /* ficheiro novo */
    }
    lista.push(registo);
    await fs.writeFile(caminho, JSON.stringify(lista, null, 2), 'utf8');
  });
  return fila;
}

// Limite simples de pedidos por IP (por minuto)
const tentativas = globalThis.__ctTentativas || (globalThis.__ctTentativas = new Map());
export function limiteExcedido(req, chave, maximo = 5) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local';
  const id = `${chave}:${ip}`;
  const agora = Date.now();
  const lista = (tentativas.get(id) || []).filter((t) => agora - t < 60_000);
  lista.push(agora);
  tentativas.set(id, lista);
  return lista.length > maximo;
}

export function texto(valor, max) {
  return String(valor ?? '').trim().slice(0, max);
}

export function resposta(dados, status = 200) {
  return Response.json(dados, { status });
}
