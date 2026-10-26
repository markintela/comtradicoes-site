// ─────────────────────────────────────────────────────────────
//  DEFINIÇÕES DA LOJA — altere aqui os dados do site.
//  Os campos entre [ ] ainda estão por preencher.
// ─────────────────────────────────────────────────────────────

const loja = {
  nome: 'Com Tradições',
  subtitulo: 'Pastelaria · Refeições',

  // O SEU número MB WAY (o da loja), 9 dígitos
  mbwayNumber: '912345678',

  contactos: {
    telefone: '[TELEFONE]',
    email: '[EMAIL]',
    instagram: '[@INSTAGRAM]',
    instagramUrl: '' // ex.: 'https://instagram.com/comtradicoes'
  },

  lojas: [
    {
      id: 'loja-1',
      nome: 'Loja Baixa (demonstração)',
      morada: 'Praça do Comércio, Lisboa — localização de demonstração',
      horario: '[DIAS E HORÁRIO]',
      telefone: '[TELEFONE]',
      coordenadas: '38.70775,-9.13659'
    },
    {
      id: 'loja-2',
      nome: 'Loja Avenida (demonstração)',
      morada: 'Avenida da Liberdade, Lisboa — localização de demonstração',
      horario: '[DIAS E HORÁRIO]',
      telefone: '[TELEFONE]',
      coordenadas: '38.72038,-9.14512'
    }
  ],

  // Pagamento MB WAY
  valorMinimo: 0.5,
  valorMaximo: 500,
  tempoConfirmacao: 240 // segundos para confirmar na app
};

export default loja;
