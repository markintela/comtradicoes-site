'use client';

import { useState } from 'react';
import { categorias, produtos } from '@/config/catalogo';
import { formatPreco } from '@/lib/format';
import { useCarrinho } from './Carrinho';

const nomeCategoria = Object.fromEntries(categorias.map((c) => [c.id, c.nome]));
const filtros = [{ id: 'todos', nome: 'Todos' }, ...categorias];

export default function Catalogo() {
  const [filtro, setFiltro] = useState('todos');
  const { quantidade, adicionar } = useCarrinho();
  const visiveis = produtos.filter((p) => filtro === 'todos' || p.categoria === filtro);

  return (
    <section id="catalogo" className="contentor seccao">
      <div className="seccao-cabecalho">
        <div className="seccao-titulo">
          <span className="etiqueta">Catálogo</span>
          <h2>Os nossos produtos</h2>
          <p className="nota">Preços de demonstração; confirme os valores na loja.</p>
        </div>
        <div className="filtros" role="group" aria-label="Filtrar catálogo">
          {filtros.map((f) => (
            <button
              key={f.id}
              type="button"
              className="filtro"
              aria-pressed={filtro === f.id}
              onClick={() => setFiltro(f.id)}
            >
              {f.nome}
            </button>
          ))}
        </div>
      </div>

      <div className="grelha grelha-produtos">
        {visiveis.map((p) => {
          const q = quantidade(p.id);
          return (
            <article key={p.id} className="cartao produto">
              <div className="produto-foto">
                {p.foto ? <img src={p.foto} alt={p.nome} /> : '[FOTO]'}
              </div>
              <div className="produto-corpo">
                <span className="produto-categoria">{nomeCategoria[p.categoria]}</span>
                <h3>{p.nome}</h3>
                <div className="produto-rodape">
                  <span className="preco">{formatPreco(p.preco)}</span>
                  <button
                    type="button"
                    className={`botao botao-principal botao-pequeno ${q > 0 ? 'botao-adicionado' : ''}`}
                    onClick={() => adicionar(p.id)}
                    aria-label={`Adicionar ${p.nome} ao pedido`}
                  >
                    {q > 0 ? `No pedido (${q})` : 'Adicionar'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
