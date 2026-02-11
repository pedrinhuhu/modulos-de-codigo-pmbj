export function Cabecalho() {
  return (
    <header 
      className="bg-blue-600 p-5 text-white flex justify-between items-center"
      role="banner"
    >
      <a
        href="/"
        className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-white rounded"
        aria-label="Ir para o site oficial da Prefeitura Municipal de Bom Jardim"
      >
        <img
          src="src\assets\brasao.png" 
          alt="Brasão da Prefeitura Municipal de Bom Jardim"
          className="w-40 h-30 pl-10"
        />
      </a>
        <h1 className="text-5xl font-bold uppercase text-center pr-19" 
            aria-label="Título do site: Diário Oficial">
          Diário Oficial
        </h1>
      <div className="w-12" aria-hidden="true"></div>
    </header>
  );
}