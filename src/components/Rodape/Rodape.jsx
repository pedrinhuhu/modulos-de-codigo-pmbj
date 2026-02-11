export function Rodape() {
  const ano = new Date().getFullYear();

  return (
    <footer
      className="bg-[#0a2a43] text-gray-300 text-center py-8 text-xs tracking-[0.3em] uppercase"
      role="contentinfo"
      aria-label="Rodapé institucional da Prefeitura Municipal de Bom Jardim"
    >
      <h2
        className="font-bold text-3xl p-5"
        id="titulo-rodape"
      >
        Prefeitura Municipal de Bom Jardim - RJ
      </h2>

      <div
        className="flex flex-col md:flex-row justify-between w-full max-w-5xl mx-auto mt-4 text-left p-10 gap-6"
        aria-labelledby="titulo-rodape"
      >
        <div className="flex flex-row justify-center gap-20 pl-18">
        {/* Institucional */}
        <section aria-labelledby="institucional">
          <h3 id="institucional" className="font-bold mb-2">
            Institucional
          </h3>
          <ul className="flex flex-col gap-1">
            <li>Prefeito Affonso Monnerat</li>
            <li>CNPJ: 28.561.041/0001-76</li>
          </ul>
        </section>

        {/* Contatos */}
        <section aria-labelledby="contatos">
          <h3 id="contatos" className="font-bold mb-2">
            Contatos
          </h3>
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href="tel:+552225662916"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
                aria-label="Ligar para o telefone (22) 2566-2916"
              >
                (22) 2566-2916
              </a>
            </li>
            <li>
              <a
                href="mailto:ouvidoriabomjardim@gmail.com"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
                aria-label="Enviar email para a Ouvidoria de Bom Jardim"
              >
                ouvidoriabomjardim@gmail.com
              </a>
            </li>
          </ul>
        </section>

        {/* Endereço */}
        <section aria-labelledby="endereco">
          <h3 id="endereco" className="font-bold mb-2">
            Endereço e horário
          </h3>
          <ul className="flex flex-col gap-1">
            <li>
              <address
                className="not-italic"
                aria-label="Endereço da Prefeitura Municipal de Bom Jardim"
              >
                R. Nilo Peçanha, 68 - Centro, 28660-000
              </address>
            </li>
            <li>
              <time
                aria-label="Horário de funcionamento"
                dateTime="Mo-Fr 09:00-17:00"
              >
                Segunda a sexta de 9 às 17h
              </time>
            </li>
          </ul>
        </section>
      </div>
    </div>

      <p
        className="text-sm mt-6"
        aria-label={`Direitos autorais do Diário Oficial, ano ${ano}`}
      >
        &copy; {ano} Diário Oficial. Todos os direitos reservados.
      </p>
    </footer>
  );
}
