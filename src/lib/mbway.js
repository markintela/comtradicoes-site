// Integração MB WAY (API v2 da ifthenpay). Só corre no servidor.
import crypto from 'node:crypto';

export const config = {
  mock: String(process.env.MBWAY_MOCK ?? 'true').toLowerCase() !== 'false',
  chave: process.env.MBWAY_KEY || '',
  apiUrl: process.env.MBWAY_API_URL || 'https://api.ifthenpay.com/spg/payment/mbway',
  estadoUrl: process.env.MBWAY_STATUS_URL || 'https://api.ifthenpay.com/spg/payment/mbway/status',
  chaveCallback: process.env.MBWAY_CALLBACK_KEY || ''
};

// Pedidos em memória (num servidor com várias instâncias, usar uma base de dados)
export const pedidos = globalThis.__ctMbway || (globalThis.__ctMbway = new Map());
export const pagosPorCallback = globalThis.__ctMbwayPagos || (globalThis.__ctMbwayPagos = new Set());

export function novoOrderId() {
  return ('CT' + Date.now().toString(36) + crypto.randomBytes(2).toString('hex')).toUpperCase().slice(0, 15);
}

export function traduzirEstado(status) {
  switch (String(status)) {
    case '000': return 'pago';
    case '020':
    case '122': return 'recusado';
    case '101': return 'expirado';
    default: return 'pendente';
  }
}
