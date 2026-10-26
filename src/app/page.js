import Cabecalho from '@/components/Cabecalho';
import Inicio from '@/components/Inicio';
import Servicos from '@/components/Servicos';
import Catalogo from '@/components/Catalogo';
import Lojas from '@/components/Lojas';
import Pedido from '@/components/Pedido';
import Contacto from '@/components/Contacto';
import Rodape from '@/components/Rodape';

export default function Home() {
  return (
    <>
      <Cabecalho />
      <main>
        <Inicio />
        <Servicos />
        <Catalogo />
        <Lojas />
        <Pedido />
        <Contacto />
      </main>
      <Rodape />
    </>
  );
}
