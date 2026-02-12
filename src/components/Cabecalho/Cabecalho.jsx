export function Cabecalho() {
  return (
    <header
      className="bg-[#1351B4] text-white px-16 py-6 border-b-4 border-[#1351B4] shadow-md"
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
            className="w-24"
          />
        </a>
        <div className="text-center">
          <h1
            className="text-5xl font-sans font-semibold tracking-wide uppercase pr-[31vw]"
            aria-label="Título do site: Diário Oficial"
          >
            Diário Oficial
          </h1>
        </div>
      </div>
      <div className="w-24" aria-hidden="true"></div>
    </header>
  );
}
