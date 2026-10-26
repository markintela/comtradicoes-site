'use client';

import { useEffect, useRef, useState } from 'react';
import loja from '@/config/loja';
import {
  formatEuro,
  formatTelemovel,
  formatTempo,
  limparTelemovel,
  parseValor,
  telemovelValido
} from '@/lib/format';
import { IconeCheck, IconeEnviar, IconeTelemovel, IconeX } from './Icones';

const INTERVALO_CONSULTA = 3000;

export default function PagamentoMbway() {
  // etapa: form | enviando | aguardar | pago | recusado | expirado | erro
  const [etapa, setEtapa] = useState('form');
  const [valorTxt, setValorTxt] = useState('');
  const [telTxt, setTelTxt] = useState('');
  const [referencia, setReferencia] = useState('');
  const [tocado, setTocado] = useState({ valor: false, tel: false });
  const [erro, setErro] = useState('');
  const [pedido, setPedido] = useState(null);
  const [restante, setRestante] = useState(loja.tempoConfirmacao);
  const timers = useRef([]);

  // Pré-preenche o valor quando vem de um pedido do site (/pagar?valor=12.50&ref=CT-...)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const v = p.get('valor');
    if (v && !Number.isNaN(parseValor(v))) setValorTxt(v.replace('.', ','));
    const r = p.get('ref');
    if (r) setReferencia(r.slice(0, 20));
  }, []);

  const valor = parseValor(valorTxt);
  const valorOk = !Number.isNaN(valor) && valor >= loja.valorMinimo && valor <= loja.valorMaximo;
  const telOk = telemovelValido(telTxt);
  const podeEnviar = valorOk && telOk;

  const limparTimers = () => {
    timers.current.forEach((t) => clearInterval(t));
    timers.current = [];
  };
  useEffect(() => limparTimers, []);

  useEffect(() => {
    if (etapa !== 'aguardar' || !pedido) return;
    const inicio = Date.now();
    const relogio = setInterval(() => {
      const r = loja.tempoConfirmacao - (Date.now() - inicio) / 1000;
      setRestante(r);
      if (r <= 0) {
        limparTimers();
        setEtapa('expirado');
      }
    }, 1000);
    const consulta = setInterval(async () => {
      try {
        const res = await fetch(`/api/mbway/estado/${encodeURIComponent(pedido.requestId)}`);
        const { estado } = await res.json();
        if (estado && estado !== 'pendente') {
          limparTimers();
          setEtapa(estado);
        }
      } catch {
        /* falha momentânea: tenta no próximo ciclo */
      }
    }, INTERVALO_CONSULTA);
    timers.current.push(relogio, consulta);
    return limparTimers;
  }, [etapa, pedido]);

  async function enviar(e) {
    e.preventDefault();
    setTocado({ valor: true, tel: true });
    if (!podeEnviar) return;
    setErro('');
    setEtapa('enviando');
    try {
      const res = await fetch('/api/mbway/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor: valor.toFixed(2), telemovel: limparTelemovel(telTxt), referencia })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.erro || 'Não foi possível contactar o serviço de pagamento.');
      setPedido(json);
      setRestante(loja.tempoConfirmacao);
      setEtapa('aguardar');
    } catch (err) {
      setErro(err.message);
      setEtapa('form');
    }
  }

  function recomecar() {
    limparTimers();
    setPedido(null);
    setErro('');
    setValorTxt('');
    setReferencia('');
    setTocado({ valor: false, tel: false });
    setEtapa('form');
  }

  const erroValor = tocado.valor && valorTxt && !valorOk;
  const erroTel = tocado.tel && telTxt && !telOk;

  return (
    <div className="pagar">
      <a href="/" className="pagar-topo" aria-label={`${loja.nome} — voltar ao site`}>
        <img src="/logo-com-tradicoes.svg" alt={loja.nome} width="240" height="63" />
        <span>{loja.subtitulo}</span>
      </a>

      <main className="pagar-conteudo">
        {etapa === 'form' && (
          <>
            <form className="pagar-cartao" onSubmit={enviar} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="selo">MB WAY</span>
                <h1 style={{ marginTop: 6 }}>Pagar a conta</h1>
                <p className="texto-suave">
                  {referencia ? `Pedido ${referencia}. ` : ''}Indique o valor e o seu número. Vai receber o
                  pedido de pagamento na app MB WAY.
                </p>
              </div>

              <div className="campo">
                <label htmlFor="valor">Valor a pagar</label>
                <div className={`entrada entrada-grande ${erroValor ? 'invalida' : valorOk ? 'valida' : ''}`}>
                  <span className="prefixo-euro">€</span>
                  <input id="valor" type="text" inputMode="decimal" autoComplete="off" placeholder="0,00"
                    value={valorTxt}
                    onChange={(e) => setValorTxt(e.target.value.replace(/[^\d.,]/g, '').slice(0, 8))}
                    onBlur={() => setTocado((t) => ({ ...t, valor: true }))}
                    aria-invalid={erroValor ? 'true' : 'false'} />
                </div>
                {erroValor && (
                  <span className="erro-campo" role="alert">
                    Introduza um valor entre {formatEuro(loja.valorMinimo)} e {formatEuro(loja.valorMaximo)}.
                  </span>
                )}
              </div>

              <div className="campo">
                <label htmlFor="tel">O seu número MB WAY</label>
                <div className={`entrada ${erroTel ? 'invalida' : telOk ? 'valida' : ''}`}>
                  <span className="prefixo-tel">+351</span>
                  <input id="tel" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="912 345 678"
                    value={telTxt}
                    onChange={(e) => setTelTxt(e.target.value.replace(/[^\d\s+]/g, '').slice(0, 16))}
                    onBlur={() => setTocado((t) => ({ ...t, tel: true }))}
                    aria-invalid={erroTel ? 'true' : 'false'} />
                </div>
                {erroTel && <span className="erro-campo" role="alert">Introduza um telemóvel português com 9 dígitos.</span>}
              </div>

              <div className="destino">
                <IconeTelemovel />
                <div>
                  <small>Pagamento para</small>
                  <strong>{loja.nome} · {formatTelemovel(loja.mbwayNumber)}</strong>
                </div>
              </div>

              {erro && <div className="aviso-erro" role="alert">{erro}</div>}

              <button type="submit" className="botao botao-principal largura-total" disabled={!podeEnviar} style={{ minHeight: 56 }}>
                <IconeEnviar /> Enviar pedido de pagamento
              </button>
            </form>
            <p className="nota" style={{ textAlign: 'center', padding: '0 12px' }}>
              O pagamento só fica concluído depois de ser confirmado na app MB WAY.
            </p>
          </>
        )}

        {etapa === 'enviando' && (
          <section className="pagar-cartao centrado" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <h1>A enviar pedido…</h1>
            <p className="texto-suave">{formatEuro(valor)} para {loja.nome}</p>
          </section>
        )}

        {etapa === 'aguardar' && (
          <section className="pagar-cartao centrado" aria-live="polite">
            <div className="circulo"><IconeTelemovel tamanho={34} /></div>
            <h1>Confirme na app MB WAY</h1>
            <p className="texto-suave">
              Enviámos o pedido para {formatTelemovel(telTxt)}. Abra a app MB WAY e aceite o pagamento.
            </p>
            <Resumo valor={valor} />
            <div className="contador">
              <span className="spinner pequeno" aria-hidden="true" />
              À espera da confirmação · {formatTempo(restante)}
            </div>
            <button type="button" className="botao botao-contorno largura-total" onClick={recomecar}>Cancelar</button>
          </section>
        )}

        {etapa === 'pago' && (
          <section className="pagar-cartao centrado" aria-live="polite">
            <div className="circulo sucesso"><IconeCheck /></div>
            <h1>Pagamento confirmado</h1>
            <p className="texto-suave">Obrigado pela visita. Volte sempre!</p>
            <Resumo valor={valor} />
            <a href="/" className="botao botao-contorno largura-total">Voltar ao site</a>
          </section>
        )}

        {['recusado', 'expirado', 'erro'].includes(etapa) && (
          <section className="pagar-cartao centrado" aria-live="polite">
            <div className="circulo falha"><IconeX /></div>
            <h1>
              {etapa === 'recusado' && 'Pagamento recusado'}
              {etapa === 'expirado' && 'O pedido expirou'}
              {etapa === 'erro' && 'Algo correu mal'}
            </h1>
            <p className="texto-suave">
              {etapa === 'recusado' && 'O pedido foi recusado na app MB WAY.'}
              {etapa === 'expirado' && 'O tempo para confirmar terminou.'}
              {etapa === 'erro' && 'Não foi possível concluir o pagamento.'} Pode tentar de novo.
            </p>
            <button type="button" className="botao botao-principal largura-total" onClick={() => setEtapa('form')}>
              Tentar novamente
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

function Resumo({ valor }) {
  return (
    <dl className="resumo">
      <div><dt>Valor</dt><dd>{formatEuro(valor)}</dd></div>
      <div><dt>Para</dt><dd>{loja.nome}</dd></div>
    </dl>
  );
}
