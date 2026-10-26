import { config, pagosPorCallback } from '@/lib/mbway';
import { guardarRegisto } from '@/lib/servidor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/mbway/callback?key=...&orderId=...&amount=...&requestId=...&payment_datetime=...
// Configure este URL no backoffice da ifthenpay.
export async function GET(req) {
  const q = new URL(req.url).searchParams;
  if (!config.chaveCallback || q.get('key') !== config.chaveCallback) {
    return new Response('Proibido', { status: 403 });
  }
  const requestId = q.get('requestId');
  if (requestId) pagosPorCallback.add(requestId);
  await guardarRegisto('pagamentos.json', {
    recebidoEm: new Date().toISOString(),
    orderId: q.get('orderId'),
    valor: q.get('amount'),
    requestId,
    dataPagamento: q.get('payment_datetime')
  });
  return new Response('OK');
}
