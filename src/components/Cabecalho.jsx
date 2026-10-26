'use client';

import loja from '@/config/loja';
import { useCarrinho } from './Carrinho';

export default function Cabecalho() {
  const { totalItens } = useCarrinho();
  return (
    <header className="cabecalho">
      <div className="contentor cabecalho-linha">
        <a href="#inicio" className="marca" aria-label={`${loja.nome} — início`}>
          <img src="/logo-com-tradicoes.svg" alt={loja.nome} width="170" height="44" />
          <span>{loja.subtitulo}</span>
        </a>
        <nav className="menu" aria-label="Menu principal">
          <a href="#servicos">Serviços</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#lojas">Lojas</a>
          <a href="#contacto">Contacto</a>
          <a href="#pedido" className="botao botao-principal">
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
