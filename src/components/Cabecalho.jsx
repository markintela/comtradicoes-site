'use client';

import { useState } from 'react';
import loja from '@/config/loja';
import { useCarrinho } from './Carrinho';

export default function Cabecalho() {
  const { totalItens } = useCarrinho();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="cabecalho">
      <div className="contentor cabecalho-linha">
        <a href="#inicio" className="marca" aria-label={`${loja.nome} — início`}>
          <img src="/logo-com-tradicoes.svg" alt={loja.nome} width="170" height="44" />
          <span>{loja.subtitulo}</span>
        </a>
        <button
          type="button"
          className="menu-alternar"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {menuAberto ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <nav id="menu-principal" className={`menu${menuAberto ? ' menu-aberto' : ''}`} aria-label="Menu principal">
          <a href="#servicos" onClick={() => setMenuAberto(false)}>Serviços</a>
          <a href="#catalogo" onClick={() => setMenuAberto(false)}>Catálogo</a>
          <a href="#lojas" onClick={() => setMenuAberto(false)}>Lojas</a>
          <a href="#contacto" onClick={() => setMenuAberto(false)}>Contacto</a>
          <a href="#pedido" className="botao botao-principal" onClick={() => setMenuAberto(false)}>
            Fazer pedido
            {totalItens > 0 && (
              <span className="contador-carrinho" aria-label={`${totalItens} no pedido`}>{totalItens}</span>
            )}
          </a>
        </nav>
      </div>
    </header>
  );
}
