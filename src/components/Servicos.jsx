import { IconeBolo, IconePastelaria, IconeRefeicao, IconeTelemovelOk } from './Icones';

const servicos = [
  { Icone: IconePastelaria, titulo: 'Pastelaria diária', texto: 'Bolos, tartes e pastelaria feitos todos os dias, para comer ao balcão ou levar.' },
  { Icone: IconeRefeicao, titulo: 'Refeições', texto: 'Prato do dia, tostas, hambúrgueres e omeletes ao almoço.' },
  { Icone: IconeBolo, titulo: 'Bolos por encomenda', texto: 'Bolos de aniversário e para eventos. Encomende com antecedência e levante na loja.' },
  { Icone: IconeTelemovelOk, titulo: 'Take-away e MB WAY', texto: 'Peça para levar e pague com MB WAY, diretamente no telemóvel.' }
];

export default function Servicos() {
  return (
    <section id="servicos" className="contentor seccao">
      <div className="seccao-cabecalho">
        <div>
          <span className="etiqueta">Serviços</span>
          <h2>O que fazemos</h2>
        </div>
      </div>
      <div className="grelha grelha-servicos">
        {servicos.map(({ Icone, titulo, texto }) => (
          <div key={titulo} className="cartao servico">
            <div className="icone"><Icone /></div>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
