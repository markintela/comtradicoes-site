const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true
};

export const IconePastelaria = (p) => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 13h16v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M6 13V9a6 6 0 0 1 12 0v4" /><path d="M12 3v2" />
  </svg>
);
export const IconeRefeicao = (p) => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="13" r="7" /><path d="M12 9v4l2.5 2" /><path d="M3 4l3 3M21 4l-3 3" />
  </svg>
);
export const IconeBolo = (p) => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 21h16" /><path d="M5 21v-7h14v7" /><path d="M7 14v-3h10v3" /><path d="M12 11V7" /><path d="M12 7c-1-1-1-2.5 0-4 1 1.5 1 3 0 4z" />
  </svg>
);
export const IconeTelemovelOk = (p) => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...base} {...p}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M11 18.5h2" /><path d="M9.5 9.5l2 2 3.5-3.5" />
  </svg>
);
export const IconeTelemovel = ({ tamanho = 22, ...p }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" {...base} {...p}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M11 18.5h2" />
  </svg>
);
export const IconeLocal = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} stroke="#6B3E26" {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const IconeRelogio = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} stroke="#6B3E26" {...p}>
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);
export const IconeTelefone = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} stroke="#6B3E26" {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);
export const IconeMais = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" {...base} strokeWidth="2.4" {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconeMenos = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" {...base} strokeWidth="2.4" {...p}><path d="M5 12h14" /></svg>
);
export const IconeCheck = ({ tamanho = 34, ...p }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" {...base} strokeWidth="2.2" {...p}><path d="M5 12.5 10 17 19 7.5" /></svg>
);
export const IconeX = (p) => (
  <svg width="32" height="32" viewBox="0 0 24 24" {...base} strokeWidth="2.2" {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconeEnviar = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} strokeWidth="2" {...p}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
);
