import loja from '@/config/loja';

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="contentor rodape-linha">
        <a href="#inicio" className="marca" aria-label={`${loja.nome} — início`}>
          <img src="/logo-com-tradicoes-branco.svg" alt={loja.nome} width="170" height="44" />
          <span>{loja.subtitulo}</span>
        </a>
        <nav aria-label="Rodapé">
          <a href="#servicos">Serviços</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#lojas">Lojas</a>
          <a href="#pedido">Fazer pedido</a>
          <a href="#contacto">Contacto</a>
          <a href="/pagar">Pagar com MB WAY</a>
        </nav>
        <small>© {new Date().getFullYear()} {loja.nome}</small>
      </div>
    </footer>
  );
}
