/**
 * @component Rodape
 * @description Rodapé institucional com informações da prefeitura:
 * nome do prefeito, CNPJ, contatos, endereço, horário e copyright dinâmico.
 * @returns {JSX.Element}
 */
export function Rodape() {

  /** @type {number} Ano atual, usado no copyright */
  const ano = new Date().getFullYear();

  /** @type {string} Nome do prefeito exibido na seção institucional */
  const prefeito = "Affonso Monnerat";

  return (
    <footer
      className="bg-[#1351B4] text-white text-center py-12 text-sm"
      role="contentinfo"
      aria-label="Rodapé institucional da Prefeitura Municipal de Bom Jardim"
    >
      <h2 className="font-semibold text-2xl p-5" id="titulo-rodape">
        Prefeitura Municipal de Bom Jardim - RJ
      </h2>

      <div
        className="flex flex-col md:flex-row justify-center w-full max-w-5xl mx-auto mt-4 text-left px-6 md:px-10 py-6 gap-8"
        aria-labelledby="titulo-rodape"
      >
        {/* Institucional */}
        <section aria-labelledby="institucional" className="flex-1">
          <h3 id="institucional" className="font-semibold mb-3 text-base">
            Institucional
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>Prefeito {prefeito}</li>
            <li>CNPJ: 28.561.041/0001-76</li>
          </ul>
        </section>

        {/* Contatos */}
        <section aria-labelledby="contatos" className="flex-1">
          <h3 id="contatos" className="font-semibold mb-3 text-base">
            Contatos
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a
                href="tel:+552225662916"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded transition"
                aria-label="Ligar para o telefone (22) 2566-2916"
              >
                (22) 2566-2916
              </a>
            </li>
            <li>
              <a
                href="mailto:ouvidoriabomjardim@gmail.com"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded transition"
                aria-label="Enviar email para a Ouvidoria de Bom Jardim"
              >
                ouvidoriabomjardim@gmail.com
              </a>
            </li>
          </ul>
        </section>

        {/* Endereço */}
        <section aria-labelledby="endereco" className="flex-1">
          <h3 id="endereco" className="font-semibold mb-3 text-base">
            Endereço e horário
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
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

      <p
        className="text-sm mt-6 opacity-90"
        aria-label={`Direitos autorais do Diário Oficial, ano ${ano}`}
      >
        &copy; {ano} Diário Oficial. Todos os direitos reservados.
      </p>
      <p
        className="text-sm mt-2 opacity-90"
        aria-label="Desenvolvido pela equipe de TIC da Prefeitura Municipal de Bom Jardim-RJ"
      >
        Desenvolvido pela equipe de TIC da Prefeitura Municipal de Bom Jardim-RJ
      </p>
    </footer>
  );
}