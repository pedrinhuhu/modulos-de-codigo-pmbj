import { Search, Headset, Info, Accessibility, HeartHandshake } from 'lucide-react';

const linkOuvidoria = 'https://bomjardim1.websiteseguro.com/ouvidoria/?pagina=fale_conosco_ouvidoria.php';
const linkTransparencia = 'https://bomjardim1.websiteseguro.com/e-sic/';
const linkAcessibilidade = 'https://www.bomjardim.rj.gov.br/e-sic/?pagina=../acessibilidade.php';
const linkPesquisa = '#pesquisa';

export function BarraTopo() {
  return (
    <nav 
      className="bg-gray-100 flex items-center justify-between backdrop-blur-sm px-4 py-2 shadow-lg"
      aria-label="Navegação principal"
    >
      <a 
        href='/' 
        className='text-blue-600 font-semibold p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded'
        aria-label="Ir para página inicial da Prefeitura Municipal de Bom Jardim"
      >
        Prefeitura Municipal de Bom Jardim
      </a>
      <ul className='flex flex-row gap-6 p-3 pr-10'>
        <li>
          <a 
            href={linkOuvidoria}
            target='_blank'
            className='text-black font-semibold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1'
            aria-label="Acessar página da Ouvidoria"
          >
            <Headset size={16} aria-hidden="true" />
            Ouvidoria
          </a>
        </li>
        <li>
          <a 
            href={linkTransparencia}
            target='_blank'
            className='text-black font-semibold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1'
            aria-label="Acessar Portal da Transparência"
          >
            <Info size={16} aria-hidden="true" />
            Transparência
          </a>
        </li>
        <li>
          <a 
            href={linkAcessibilidade}
            target='_blank'
            className='text-black font-semibold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1'
            aria-label="Ir para menu de acessibilidade"
          >
            <HeartHandshake size={16} aria-hidden="true" />
            Acessibilidade
          </a>
        </li>
        <li>
          <a 
            href='#pesquisa' 
            className='text-black font-semibold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1'
            aria-label="Ir para campo de pesquisa"
          >
            <Search size={16} aria-hidden="true" />
            Pesquisar
          </a>
        </li>
      </ul>
    </nav>
  );
}