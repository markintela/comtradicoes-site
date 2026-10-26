'use client';

import { useState } from 'react';
import loja from '@/config/loja';
import { formatEuro, formatPreco, telefoneValido } from '@/lib/format';
import { useCarrinho } from './Carrinho';
import { IconeCheck, IconeMais, IconeMenos } from './Icones';

const vazio = { nome: '', telefone: '', loja: loja.lojas[0]?.id || '', dataHora: '', notas: '' };

function validar(dados) {
  const erros = {};
  if (dados.nome.trim().length < 2) erros.nome = 'Indique o seu nome.';
  if (!telefoneValido(dados.telefone)) erros.telefone = 'Indique um número português com 9 dígitos.';
  if (!dados.loja) erros.loja = 'Escolha a loja.';
  if (!dados.dataHora) erros.dataHora = 'Escolha o dia e a hora.';
  else if (new Date(dados.dataHora).getTime() < Date.now() + 30 * 60 * 1000)
    erros.dataHora = 'Escolha uma hora com pelo menos 30 minutos de antecedência.';
  return erros;
}

export default function Pedido() {
  const { lista, totalItens, totalValor, adicionar, remover, limpar } = useCarrinho();
  const [dados, setDados] = useState(vazio);
  const [erros, setErros] = useState({});
  const [estado, setEstado] = useState('form'); // form | enviando | enviado
  const [erroGeral, setErroGeral] = useState('');
  const [resultado, setResultado] = useState(null);

  const alterar = (campo) => (e) => {
    setDados((d) => ({ ...d, [campo]: e.target.value }));
    setErros((er) => ({ ...er, [campo]: undefined }));
  };

  async function enviar(e) {
    e.preventDefault();
    const encontrados = validar(dados);
    setErros(encontrados);
    if (Object.keys(encontrados).length || totalItens === 0) return;
    setEstado('enviando');
    setErroGeral('');
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dados,
          dataHora: new Date(dados.dataHora).toISOString(),
          itens: lista.map((l) => ({ id: l.produto.id, quantidade: l.quantidade }))
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.erro || 'Não foi possível enviar o pedido.');
      setResultado(json);
      setEstado('enviado');
      limpar();
      setDados(vazio);
    } catch (err) {
      setErroGeral(err.message);
      setEstado('form');
    }
  }

  return (
    <section id="pedido" className="pedido">
      <div className="contentor">
        <div className="seccao-cabecalho">
          <div>
            <span className="etiqueta">Fazer pedido</span>
            <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 38px)', fontWeight: 700 }}>Encomende e levante na loja</h2>
          </div>
        </div>

        {estado === 'enviado' && resultado ? (
          <div className="cartao confirmacao" role="status">
            <div className="circulo-ok"><IconeCheck /></div>
            <h3>Pedido n.º {resultado.numero} enviado</h3>
            <p>Vamos confirmar o seu pedido por telefone. Pode pagar no levantamento ou já com MB WAY.</p>
            <div className="acoes" style={{ justifyContent: 'center' }}>
              {typeof resultado.total === 'number' && (
                <a
                  className="botao botao-principal"
                  href={`/pagar?valor=${resultado.total.toFixed(2)}&ref=${encodeURIComponent(resultado.numero)}`}
                >
                  Pagar {formatEuro(resultado.total)} com MB WAY
                </a>
              )}
              <button type="button" className="botao botao-contorno" onClick={() => setEstado('form')}>
                Fazer novo pedido
              </button>
            </div>
          </div>
        ) : (
          <form className="pedido-linha" onSubmit={enviar} noValidate>
            <div className="cartao painel pedido-resumo">
              <h3>O seu pedido</h3>
              {lista.length === 0 ? (
                <p className="nota" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
                  Ainda não adicionou produtos. Escolha no <a href="#catalogo" style={{ fontWeight: 600 }}>catálogo</a> o
                  que quer encomendar.
                </p>
              ) : (
                <>
                  {lista.map(({ produto, quantidade }) => (
                    <div key={produto.id} className="item-pedido">
                      <span>
                        {produto.nome}
                        <br />
                        <small className="nota">{formatPreco(produto.preco)}</small>
                      </span>
                      <div className="quantidade">
                        <button type="button" onClick={() => remover(produto.id)} aria-label={`Retirar ${produto.nome}`}><IconeMenos /></button>
                        <output aria-live="polite">{quantidade}</output>
                        <button type="button" onClick={() => adicionar(produto.id)} aria-label={`Adicionar mais ${produto.nome}`}><IconeMais /></button>
                      </div>
                    </div>
                  ))}
                  <div className="total">
                    <span>Total</span>
                    <span>{totalValor !== null ? formatEuro(totalValor) : 'A confirmar'}</span>
                  </div>
                </>
              )}
            </div>

            <div className="cartao painel formulario">
              <div className="campo">
                <label htmlFor="ped-nome">Nome</label>
                <input id="ped-nome" autoComplete="name" value={dados.nome} onChange={alterar('nome')}
                  aria-invalid={!!erros.nome} aria-describedby={erros.nome ? 'erro-ped-nome' : undefined} />
                {erros.nome && <span id="erro-ped-nome" className="erro-campo">{erros.nome}</span>}
              </div>
              <div className="campo">
                <label htmlFor="ped-tel">Telemóvel</label>
                <input id="ped-tel" type="tel" inputMode="tel" autoComplete="tel" value={dados.telefone} onChange={alterar('telefone')}
                  aria-invalid={!!erros.telefone} aria-describedby={erros.telefone ? 'erro-ped-tel' : undefined} />
                {erros.telefone && <span id="erro-ped-tel" className="erro-campo">{erros.telefone}</span>}
              </div>
              <div className="campo">
                <label htmlFor="ped-loja">Loja de levantamento</label>
                <select id="ped-loja" value={dados.loja} onChange={alterar('loja')} aria-invalid={!!erros.loja}>
                  {loja.lojas.map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
                </select>
              </div>
              <div className="campo">
                <label htmlFor="ped-data">Dia e hora</label>
                <input id="ped-data" type="datetime-local" value={dados.dataHora} onChange={alterar('dataHora')}
                  aria-invalid={!!erros.dataHora} aria-describedby={erros.dataHora ? 'erro-ped-data' : undefined} />
                {erros.dataHora && <span id="erro-ped-data" className="erro-campo">{erros.dataHora}</span>}
              </div>
              <div className="campo campo-largo">
                <label htmlFor="ped-notas">Notas (opcional)</label>
                <textarea id="ped-notas" rows={3} maxLength={500} placeholder="Ex.: escrita no bolo, alergias…" value={dados.notas} onChange={alterar('notas')} />
              </div>
              {erroGeral && <div className="aviso-erro" role="alert">{erroGeral}</div>}
              <div className="formulario-rodape">
                <span className="nota">Pagamento no levantamento ou por MB WAY.</span>
                <button type="submit" className="botao botao-principal" disabled={totalItens === 0 || estado === 'enviando'}>
                  {estado === 'enviando' ? 'A enviar…' : 'Enviar pedido'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
