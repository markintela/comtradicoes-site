'use client';

import { useState } from 'react';
import loja from '@/config/loja';
import { emailValido } from '@/lib/format';
import { IconeCheck } from './Icones';

const vazio = { nome: '', email: '', mensagem: '' };

export default function Contacto() {
  const [dados, setDados] = useState(vazio);
  const [erros, setErros] = useState({});
  const [estado, setEstado] = useState('form');
  const [erroGeral, setErroGeral] = useState('');
  const { contactos } = loja;

  const alterar = (campo) => (e) => {
    setDados((d) => ({ ...d, [campo]: e.target.value }));
    setErros((er) => ({ ...er, [campo]: undefined }));
  };

  async function enviar(e) {
    e.preventDefault();
    const encontrados = {};
    if (dados.nome.trim().length < 2) encontrados.nome = 'Indique o seu nome.';
    if (!emailValido(dados.email)) encontrados.email = 'Indique um email válido.';
    if (dados.mensagem.trim().length < 5) encontrados.mensagem = 'Escreva a sua mensagem.';
    setErros(encontrados);
    if (Object.keys(encontrados).length) return;
    setEstado('enviando');
    setErroGeral('');
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.erro || 'Não foi possível enviar a mensagem.');
      setEstado('enviado');
      setDados(vazio);
    } catch (err) {
      setErroGeral(err.message);
      setEstado('form');
    }
  }

  return (
    <section id="contacto" className="contentor seccao">
      <div className="contacto-linha">
        <div className="contacto-info">
          <span className="etiqueta">Contacto</span>
          <h2>Fale connosco</h2>
          <p>Dúvidas, encomendas grandes ou eventos? Envie-nos uma mensagem.</p>
          <div className="lista-contactos">
            <span><strong>Telefone:</strong> {contactos.telefone}</span>
            <span><strong>Email:</strong> {contactos.email}</span>
            <span>
              <strong>Instagram:</strong>{' '}
              {contactos.instagramUrl ? (
                <a href={contactos.instagramUrl} target="_blank" rel="noopener noreferrer">{contactos.instagram}</a>
              ) : contactos.instagram}
            </span>
          </div>
        </div>

        <div className="cartao painel contacto-form">
          {estado === 'enviado' ? (
            <div className="confirmacao" role="status" style={{ padding: '30px 10px' }}>
              <div className="circulo-ok"><IconeCheck /></div>
              <h3 style={{ fontSize: 22 }}>Mensagem enviada</h3>
              <p>Obrigado! Respondemos o mais depressa possível.</p>
              <button type="button" className="botao botao-contorno" onClick={() => setEstado('form')}>Enviar outra mensagem</button>
            </div>
          ) : (
            <form className="formulario" onSubmit={enviar} noValidate>
              <div className="campo">
                <label htmlFor="ct-nome">Nome</label>
                <input id="ct-nome" autoComplete="name" value={dados.nome} onChange={alterar('nome')} aria-invalid={!!erros.nome} />
                {erros.nome && <span className="erro-campo">{erros.nome}</span>}
              </div>
              <div className="campo">
                <label htmlFor="ct-email">Email</label>
                <input id="ct-email" type="email" autoComplete="email" value={dados.email} onChange={alterar('email')} aria-invalid={!!erros.email} />
                {erros.email && <span className="erro-campo">{erros.email}</span>}
              </div>
              <div className="campo campo-largo">
                <label htmlFor="ct-msg">Mensagem</label>
                <textarea id="ct-msg" rows={4} maxLength={2000} value={dados.mensagem} onChange={alterar('mensagem')} aria-invalid={!!erros.mensagem} />
                {erros.mensagem && <span className="erro-campo">{erros.mensagem}</span>}
              </div>
              {erroGeral && <div className="aviso-erro" role="alert">{erroGeral}</div>}
              <div className="formulario-rodape" style={{ justifyContent: 'flex-end' }}>
                <button type="submit" className="botao botao-principal" disabled={estado === 'enviando'}>
                  {estado === 'enviando' ? 'A enviar…' : 'Enviar mensagem'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
