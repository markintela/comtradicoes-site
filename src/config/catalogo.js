// ─────────────────────────────────────────────────────────────
//  CATÁLOGO — produtos do site.
//  preco: preço ilustrativo em euros; confirmar os valores com a loja.
//  foto: caminho em /public (ex.: '/fotos/pao-de-lo.jpg') ou null.
// ─────────────────────────────────────────────────────────────

export const categorias = [
  { id: 'bolos', nome: 'Bolos' },
  { id: 'pastelaria', nome: 'Pastelaria' },
  { id: 'refeicoes', nome: 'Refeições' }
];

export const produtos = [
  // Bolos (do cartaz "Os nossos bolos")
  { id: 'pao-de-lo', categoria: 'bolos', nome: 'Pão de ló', preco: 12.5, foto: '/fotos/bolo-caseiro.jpg' },
  { id: 'tarte-amendoa', categoria: 'bolos', nome: 'Tarte de amêndoa', preco: 16, foto: '/fotos/tarte-frutas.jpg' },
  { id: 'tarte-limao', categoria: 'bolos', nome: 'Tarte merengada de limão', preco: 18, foto: '/fotos/tarte-cremosa.jpg' },
  { id: 'bolo-bolacha', categoria: 'bolos', nome: 'Bolo de bolacha', preco: 18, foto: '/fotos/bolo-cobertura.jpg' },
  { id: 'bolo-brigadeiro', categoria: 'bolos', nome: 'Bolo brigadeiro', preco: 22, foto: '/fotos/bolo-chocolate.jpg' },
  { id: 'bolo-choc-morango', categoria: 'bolos', nome: 'Bolo de chocolate e morango', preco: 24, foto: '/fotos/bolo-morango.jpg' },
  { id: 'delicia-choc', categoria: 'bolos', nome: 'Delícia de chocolate', preco: 18, foto: '/fotos/bolo-chocolate.jpg' },
  { id: 'cheesecake', categoria: 'bolos', nome: 'Cheesecake', preco: 20, foto: '/fotos/tarte-cremosa.jpg' },
  { id: 'tarte-choc', categoria: 'bolos', nome: 'Tarte de chocolate', preco: 18, foto: '/fotos/bolo-cobertura.jpg' },
  { id: 'tarte-laranja', categoria: 'bolos', nome: 'Tarte de laranja', preco: 16, foto: '/fotos/tarte-frutas.jpg' },

  // Pastelaria (confirmar)
  { id: 'pastel-nata', categoria: 'pastelaria', nome: 'Pastel de nata', preco: 1.3, foto: '/fotos/pastelaria.jpg' },
  { id: 'croissant', categoria: 'pastelaria', nome: 'Croissant', preco: 1.6, foto: '/fotos/croissant.jpg' },
  { id: 'bola-berlim', categoria: 'pastelaria', nome: 'Bola de Berlim', preco: 2, foto: '/fotos/pao-artesanal.jpg' },

  // Refeições (do quadro)
  { id: 'prato-dia', categoria: 'refeicoes', nome: 'Prato do dia', preco: 9.5, foto: '/fotos/prato-refeicao.jpg' },
  { id: 'tosta-mista', categoria: 'refeicoes', nome: 'Tosta mista', preco: 5.5, foto: '/fotos/tosta-omelete.jpg' },
  { id: 'hamburguer', categoria: 'refeicoes', nome: 'Hambúrguer', preco: 8.5, foto: '/fotos/hamburguer.jpg' },
  { id: 'omelete', categoria: 'refeicoes', nome: 'Omelete com salada', preco: 7.5, foto: '/fotos/salada-refeicao.jpg' }
];

export function produtoPorId(id) {
  return produtos.find((p) => p.id === id);
}
