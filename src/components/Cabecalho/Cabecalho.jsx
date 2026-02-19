/**
 * @component Cabecalho
 * @description Cabeçalho principal do site. Exibe o brasão da prefeitura
 * (link para home) e o título "Diário Oficial".
 * @returns {JSX.Element}
 */
export function Cabecalho() {
  return (
    <header
      className="bg-[#1351B4] text-white px-6 md:px-16 py-4 md:py-6 border-b-4 border-[#1351B4] shadow-md"
      role="banner"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <a
          href="/"
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
          aria-label="Ir para o site oficial da Prefeitura Municipal de Bom Jardim"
        >
          <img
            src="src/assets/brasao.png"
            alt="Brasão da Prefeitura Municipal de Bom Jardim"
            className="w-14 md:w-24"
          />
        </a>
        <div className="flex-1 text-center">
          <h1
            className="text-2xl md:text-5xl font-sans font-semibold tracking-wide uppercase"
            aria-label="Título do site: Diário Oficial"
          >
            Diário Oficial
          </h1>
        </div>
      </div>
    </header>
  );
}