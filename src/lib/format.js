export function formatEuro(valor) {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(valor);
}

export function formatPreco(preco) {
  return typeof preco === 'number' ? formatEuro(preco) : '[PREÇO]';
}

// "4,50" / "4.5" → 4.5 ; NaN se inválido
export function parseValor(texto) {
  const t = String(texto || '').trim().replace(/\s/g, '');
  if (!/^\d+([.,]\d{1,2})?$/.test(t)) return NaN;
  return parseFloat(t.replace(',', '.'));
}

// "+351 912 345 678" → "912345678"
export function limparTelemovel(texto) {
  let d = String(texto || '').replace(/\D/g, '');
  if (d.length > 9 && d.startsWith('351')) d = d.slice(3);
  return d;
}

export function telemovelValido(numero) {
  return /^9[1236]\d{7}$/.test(limparTelemovel(numero));
}

export function telefoneValido(numero) {
  // telemóvel ou fixo português (9 dígitos a começar por 2 ou 9)
  return /^[29]\d{8}$/.test(limparTelemovel(numero));
}

export function formatTelemovel(numero) {
  const d = limparTelemovel(numero);
  if (d.length !== 9) return numero;
  return `+351 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export function formatTempo(segundos) {
  const s = Math.max(0, Math.floor(segundos));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || '').trim());
}
