'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { produtoPorId } from '@/config/catalogo';

const CarrinhoContext = createContext(null);
const CHAVE = 'comtradicoes-carrinho';

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState({}); // { idProduto: quantidade }
  const [carregado, setCarregado] = useState(false);

  // Recupera o carrinho guardado neste browser
  useEffect(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CHAVE) || '{}');
      if (guardado && typeof guardado === 'object') {
        const limpo = {};
        for (const [id, q] of Object.entries(guardado)) {
          if (produtoPorId(id) && Number.isInteger(q) && q > 0) limpo[id] = Math.min(q, 99);
        }
        setItens(limpo);
      }
    } catch {
      /* armazenamento indisponível: começa vazio */
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(itens));
    } catch {
      /* ignorar */
    }
  }, [itens, carregado]);

  const valor = useMemo(() => {
    const definirQuantidade = (id, q) =>
      setItens((atual) => {
        const novo = { ...atual };
        if (q <= 0) delete novo[id];
        else novo[id] = Math.min(q, 99);
        return novo;
      });

    const lista = Object.entries(itens)
      .map(([id, quantidade]) => ({ produto: produtoPorId(id), quantidade }))
      .filter((l) => l.produto);

    const totalItens = lista.reduce((s, l) => s + l.quantidade, 0);
    const temPrecos = lista.length > 0 && lista.every((l) => typeof l.produto.preco === 'number');
    const totalValor = temPrecos ? lista.reduce((s, l) => s + l.quantidade * l.produto.preco, 0) : null;

    return {
      itens,
      lista,
      totalItens,
      totalValor,
      quantidade: (id) => itens[id] || 0,
      adicionar: (id) => definirQuantidade(id, (itens[id] || 0) + 1),
      remover: (id) => definirQuantidade(id, (itens[id] || 0) - 1),
      limpar: () => setItens({})
    };
  }, [itens]);

  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>;
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) throw new Error('useCarrinho tem de estar dentro de CarrinhoProvider');
  return ctx;
}
