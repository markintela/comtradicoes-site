import loja from '@/config/loja';

export default function Inicio() {
  return (
    <section id="inicio" className="inicio">
      <div className="contentor inicio-linha">
        <div className="inicio-texto">
          <span className="etiqueta" style={{ color: 'var(--castanho)' }}>{loja.subtitulo}</span>
          <h1>Bolos caseiros e refeições do dia, com tradição.</h1>
          <p>
            Pastelaria fresca, prato do dia e bolos por encomenda para todas as ocasiões. Encomende
            online e levante na loja.
          </p>
          <div className="acoes">
            <a href="#pedido" className="botao botao-principal">Fazer pedido</a>
            <a href="#catalogo" className="botao botao-contorno">Ver catálogo</a>
          </div>
        </div>
        <div className="inicio-imagem">
          <img src="/logo-menina.svg" alt="Logótipo Com Tradições com a menina a pintar" width="460" height="412" />
        </div>
      </div>
    </section>
  );
}
