import { useState } from 'react';
import { Search, Headset, Info, HeartHandshake, Menu, X } from 'lucide-react';

/** @type {string} URL externa da Ouvidoria */
const linkOuvidoria = 'https://bomjardim1.websiteseguro.com/ouvidoria/?pagina=fale_conosco_ouvidoria.php';

/** @type {string} URL externa do portal de Transparência (e-SIC) */
const linkTransparencia = 'https://bomjardim1.websiteseguro.com/e-sic/';

/** @type {string} Rota interna da página de Acessibilidade */
const linkAcessibilidade = "/acessibilidade";

/** @type {string} Âncora para o campo de pesquisa na página */
const linkPesquisa = '#pesquisa';

export function BarraTopo() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="bg-[#1351B4] text-white px-4 md:px-8 py-3 border-b shadow-sm"
      aria-label="Navegação principal"
    >
      <div className="flex items-center justify-between">

        <a
          href='/'
          className="font-semibold tracking-normal text-sm focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-3 py-2 transition hover:bg-[#0c3c8c]"
          aria-label="Ir para página inicial da Prefeitura Municipal de Bom Jardim"
        >
          Prefeitura Municipal de Bom Jardim
        </a>

        {/* Botão hamburguer — mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[#0c3c8c] focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Menu desktop */}
        <ul
          id="menu-principal"
          className="hidden md:flex flex-row gap-8 items-center"
        >
          <li>
            <a
              href={linkOuvidoria}
              target='_blank'
              className="flex items-center gap-2 tracking-normal text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-3 py-2 transition hover:bg-[#0c3c8c]"
              aria-label="Acessar página da Ouvidoria (abre em nova aba)"
            >
              <Headset size={18} aria-hidden="true" /> Ouvidoria
            </a>
          </li>

          <li>
            <a
              href={linkTransparencia}
              target='_blank'
              className="flex items-center gap-2 tracking-normal text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-3 py-2 transition hover:bg-[#0c3c8c]"
              aria-label="Ir para página de transparência (abre em nova aba)"
            >
              <Info size={18} aria-hidden="true" /> Transparência
            </a>
          </li>

          <li>
            <a
              href={linkAcessibilidade}
              className="flex items-center gap-2 tracking-normal text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-3 py-2 transition hover:bg-[#0c3c8c]"
              aria-label="Ir para menu de acessibilidade"
            >
              <HeartHandshake size={18} aria-hidden="true" /> Acessibilidade
            </a>
          </li>

          {/* Menu principal — accessKey 2 */}
          <li>
            <a
              href="#menu-principal"
              accessKey="2"
              aria-label="Ir para menu principal [2]"
              className="flex items-center gap-2 tracking-normal text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-3 py-2 transition hover:bg-[#0c3c8c]"
            >
              Menu [2]
            </a>
          </li>

          {/* Pesquisar — accessKey 3 */}
          <li>
            <a
              href={linkPesquisa}
              accessKey="3"
              aria-label="Ir para campo de pesquisa [3]"
              className="flex items-center gap-2 tracking-normal text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white rounded-lg px-3 py-2 transition hover:bg-[#0c3c8c]"
            >
              <Search size={18} aria-hidden="true" /> Pesquisar [3]
            </a>
          </li>
        </ul>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col mt-2 gap-1">

          <li>
            <a
              href={linkOuvidoria}
              target='_blank'
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-[#0c3c8c] transition"
              aria-label="Acessar página da Ouvidoria (abre em nova aba)"
            >
              <Headset size={18} aria-hidden="true" /> Ouvidoria
            </a>
          </li>

          <li>
            <a
              href={linkTransparencia}
              target='_blank'
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-[#0c3c8c] transition"
            >
              <Info size={18} aria-hidden="true" /> Transparência
            </a>
          </li>

          <li>
            <a
              href={linkAcessibilidade}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-[#0c3c8c] transition"
              aria-label="Ir para menu de acessibilidade"
            >
              <HeartHandshake size={18} aria-hidden="true" /> Acessibilidade
            </a>
          </li>

          {/* Menu principal — accessKey 2 */}
          <li>
            <a
              href="#menu-principal"
              accessKey="2"
              aria-label="Ir para menu principal [2]"
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-[#0c3c8c] transition"
            >
              Menu [2]
            </a>
          </li>

          {/* Pesquisar — accessKey 3 */}
          <li>
            <a
              href={linkPesquisa}
              accessKey="3"
              aria-label="Ir para campo de pesquisa [3]"
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-[#0c3c8c] transition"
            >
              <Search size={18} aria-hidden="true" /> Pesquisar [3]
            </a>
          </li>

        </ul>
      )}
    </nav>
  );
}