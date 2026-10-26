import loja from '@/config/loja';
import { IconeLocal, IconeRelogio, IconeTelefone } from './Icones';

export default function Lojas() {
  return (
    <section id="lojas" className="contentor seccao">
      <div className="seccao-cabecalho">
        <div className="seccao-titulo">
          <span className="etiqueta">Lojas</span>
          <h2>Onde estamos</h2>
          <p className="nota">Localizações de demonstração em Lisboa; substitua-as pelos endereços reais.</p>
        </div>
      </div>
      <div className="grelha grelha-lojas">
        {loja.lojas.map((l) => (
          <article key={l.id} className="cartao loja">
            <div className="loja-mapa">
              <iframe
                title={`Mapa: ${l.nome}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(l.coordenadas)}&z=15&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="loja-corpo">
              <h3>{l.nome}</h3>
              <div className="linha-info"><IconeLocal /><span>{l.morada}</span></div>
              <div className="linha-info"><IconeRelogio /><span>{l.horario}</span></div>
              <div className="linha-info"><IconeTelefone /><span>{l.telefone}</span></div>
              <a
                className="botao botao-contorno botao-pequeno"
                style={{ alignSelf: 'flex-start', marginTop: 4 }}
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(l.coordenadas)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Como chegar
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
