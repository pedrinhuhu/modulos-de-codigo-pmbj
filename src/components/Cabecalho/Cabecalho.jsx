export function Cabecalho() {
  return (
    <header
      className="bg-[#0a2a43] text-white px-16 py-10 border-b-[6px] border-[#c9a227] shadow-2xl"
      role="banner"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <a
          href="/"
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-white rounded"
          aria-label="Ir para o site oficial da Prefeitura Municipal de Bom Jardim"
        >
          <img
            src="src\assets\brasao.png"
            alt="Brasão da Prefeitura Municipal de Bom Jardim"
            className="w-24"
          />
        </a>
        <div className="text-center">
          <h1
            className="text-5xl font-[Cinzel] tracking-[0.35em] uppercase pr-74"
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
