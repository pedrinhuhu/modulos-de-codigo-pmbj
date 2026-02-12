import { Search, Headset, Info, HeartHandshake } from 'lucide-react';

// Links externos usados na barra de topo

const linkOuvidoria = 'https://bomjardim1.websiteseguro.com/ouvidoria/?pagina=fale_conosco_ouvidoria.php';
const linkTransparencia = 'https://bomjardim1.websiteseguro.com/e-sic/';
const linkAcessibilidade = 'https://www.bomjardim.rj.gov.br/e-sic/?pagina=../acessibilidade.php';
const linkPesquisa = '#pesquisa';

export function BarraTopo() {
  return (
    <nav 
      className="bg-[#1351B4] text-white flex items-center justify-between px-8 py-3 border-b  shadow-sm"
      aria-label="Navegação principal"
    >
      <a 
        href='/' 
        className="font-semibold tracking-normal text-sm focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-3 py-2 transition hover:bg-[#0c3c8c]"
        aria-label="Ir para página inicial da Prefeitura Municipal de Bom Jardim"
      >
        Prefeitura Municipal de Bom Jardim
      </a>
      <ul className="flex flex-row gap-8 items-center">
        <li>
          <a 
            href={linkOuvidoria}
            target='_blank'
            className="flex items-center gap-2 tracking-normal text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-3 py-2 transition hover:bg-[#0c3c8c]"
            aria-label="Acessar página da Ouvidoria"
          >
            <Headset size={18} aria-hidden="true" />
            Ouvidoria
          </a>
        </li>
        <li>
          <a 
            href={linkTransparencia}
            target='_blank'
            className="flex items-center gap-2 tracking-normal text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-3 py-2 transition hover:bg-[#0c3c8c]"
          >
            <Info size={18} aria-hidden="true" />
            Transparência
          </a>
        </li>
        <li>
          <a 
            href={linkAcessibilidade}
            target='_blank'
            className="flex items-center gap-2 tracking-normal text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-3 py-2 transition hover:bg-[#0c3c8c]"
            aria-label="Ir para menu de acessibilidade"
          >
            <HeartHandshake size={18} aria-hidden="true" />
            Acessibilidade
          </a>
        </li>
        <li>
          <a 
            href='#pesquisa' 
            className="flex items-center gap-2 tracking-normal text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-3 py-2 transition hover:bg-[#0c3c8c]"
            aria-label="Ir para campo de pesquisa"
          >
            <Search size={18} aria-hidden="true" />
            Pesquisar
          </a>
        </li>
      </ul>
    </nav>
  );
}