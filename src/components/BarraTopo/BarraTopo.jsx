import { Search, Headset, Info, HeartHandshake } from 'lucide-react';

// Links externos usados na barra de topo

const linkOuvidoria = 'https://bomjardim1.websiteseguro.com/ouvidoria/?pagina=fale_conosco_ouvidoria.php';
const linkTransparencia = 'https://bomjardim1.websiteseguro.com/e-sic/';
const linkAcessibilidade = 'https://www.bomjardim.rj.gov.br/e-sic/?pagina=../acessibilidade.php';
const linkPesquisa = '#pesquisa';

export function BarraTopo() {
  return (
    <nav 
      className="bg-white text-[#0a2a43] flex items-center justify-between px-8 py-3 border-b border-[#c9a227] shadow-md"
      aria-label="Navegação principal"
    >
      <a 
        href='/' 
        className="font-bold tracking-wide uppercase text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a227] rounded px-3 py-2 transition hover:text-[#c9a227]"
        aria-label="Ir para página inicial da Prefeitura Municipal de Bom Jardim"
      >
        Prefeitura Municipal de Bom Jardim
      </a>
      <ul className="flex flex-row gap-8 items-center">
        <li>
          <a 
            href={linkOuvidoria}
            target='_blank'
            className="flex items-center gap-2 uppercase tracking-wider text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#c9a227] rounded px-3 py-2 transition hover:text-[#c9a227]"
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
            className="flex items-center gap-2 uppercase tracking-wider text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#c9a227] rounded px-3 py-2 transition hover:text-[#c9a227]"
          >
            <Info size={16} aria-hidden="true" />
            Transparência
          </a>
        </li>
        <li>
          <a 
            href={linkAcessibilidade}
            target='_blank'
            className="flex items-center gap-2 uppercase tracking-wider text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#c9a227] rounded px-3 py-2 transition hover:text-[#c9a227]"
            aria-label="Ir para menu de acessibilidade"
          >
            <HeartHandshake size={16} aria-hidden="true" />
            Acessibilidade
          </a>
        </li>
        <li>
          <a 
            href='#pesquisa' 
            className="flex items-center gap-2 uppercase tracking-wider text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#c9a227] rounded px-3 py-2 transition hover:text-[#c9a227]"
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