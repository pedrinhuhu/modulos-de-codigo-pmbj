import brasao from '../../assets/brasao.png';

/**
 * @component Cabecalho
 * @description Cabeçalho principal do site. Exibe o brasão da prefeitura
 * (link para home) e o título "Diário Oficial".
 * @returns {JSX.Element}
 */
export function Cabecalho() {
  return (
    <header
      className="bg-[#1351B4] text-white px-4 sm:px-6 md:px-16 py-3 md:py-6 border-b-4 border-[#FFCD07] shadow-md"
      role="banner"
    >
      <div className="flex items-center gap-3 max-w-7xl mx-auto">
        <a
          href="/"
          className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
          aria-label="Ir para o site oficial da Prefeitura Municipal de Bom Jardim"
        >
          <img
            src={brasao}
            alt="Brasão da Prefeitura Municipal de Bom Jardim"
            className="w-10 sm:w-14 md:w-24"
          />
        </a>
        <div className="flex-1 min-w-0">
          <h1
            className="text-lg sm:text-2xl md:text-5xl font-sans font-semibold tracking-wide uppercase leading-tight truncate sm:whitespace-normal text-center"
            aria-label="Título do site: Diário Oficial"
          >
            Diário Oficial
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-blue-200 text-center font-light tracking-widest uppercase mt-0.5 hidden xs:block">
            Prefeitura Municipal de Bom Jardim
          </p>
        </div>
      </div>
    </header>
  );
}