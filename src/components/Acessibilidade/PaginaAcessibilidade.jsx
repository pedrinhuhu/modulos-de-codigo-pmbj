/**
 * @component PaginaAcessibilidade
 * @description Página estática que documenta os recursos de acessibilidade do site:
 * ajuste de fonte, alto contraste, leitor de tela, VLibras (tradutor de Libras),
 * navegação por teclado e persistência de configurações. Inclui link para a Ouvidoria ao final.
 * @returns {JSX.Element}
 */
export function PaginaAcessibilidade() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <section 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
        aria-labelledby="titulo-acessibilidade"
      >
        <h1 
          id="titulo-acessibilidade"
          className="text-3xl font-semibold text-[#1351B4] mb-4"
        >
          Acessibilidade
        </h1>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recursos de Acessibilidade Disponíveis
        </h2>
        
        <p className="text-base text-gray-700 leading-relaxed mb-8">
          Este site foi desenvolvido seguindo as diretrizes de acessibilidade
          digital para garantir que todos os cidadãos possam acessar as
          informações do Diário Oficial de forma autônoma e eficiente.
        </p>

        <h2 
          className="text-xl font-semibold text-gray-800 mb-6"
          id="funcionalidades"
        >
          Funcionalidades Implementadas
        </h2>
        
        <ul 
          className="space-y-6"
          aria-labelledby="funcionalidades"
        >
          <li className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#1351B4]">
            <h3 className="text-lg font-semibold text-[#1351B4] mb-2">
              Ajuste de Tamanho de Fonte
            </h3>
            <p className="text-gray-700 leading-relaxed">
              O site oferece controle total sobre o tamanho do texto exibido. 
              Você pode aumentar ou diminuir a fonte entre 12px e 24px, 
              facilitando a leitura conforme sua necessidade visual. Há também 
              a opção de redefinir para o tamanho padrão (16px) a qualquer momento.
            </p>
          </li>

          <li className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#1351B4]">
            <h3 className="text-lg font-semibold text-[#1351B4] mb-2">
              Alto Contraste
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Para usuários com baixa visão ou sensibilidade a cores, 
              disponibilizamos o modo de alto contraste. Este recurso altera 
              as cores do site para preto com texto em amarelo, proporcionando 
              maior legibilidade e reduzindo o cansaço visual.
            </p>
          </li>

          <li className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#1351B4]">
            <h3 className="text-lg font-semibold text-[#1351B4] mb-2">
              Leitor de Tela Integrado
            </h3>
            <p className="text-gray-700 leading-relaxed">
              O site conta com um leitor de tela em português brasileiro que 
              vocaliza automaticamente os elementos da página conforme você navega. 
              Quando ativado, o sistema lê títulos, textos, rótulos e placeholders 
              dos campos, auxiliando pessoas com deficiência visual ou dificuldades 
              de leitura.
            </p>
          </li>

          <li className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#1351B4]">
            <h3 className="text-lg font-semibold text-[#1351B4] mb-2">
              VLibras - Tradutor para Língua Brasileira de Sinais
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              O site integra o VLibras, uma ferramenta que traduz conteúdos 
              digitais (texto, áudio e vídeo) para a Língua Brasileira de Sinais (Libras), 
              tornando o site acessível para pessoas surdas ou com deficiência auditiva.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong className="text-gray-800">Como usar:</strong> Localize o ícone do 
              VLibras no canto inferior direito da página (próximo ao botão de acessibilidade). 
              Clique sobre ele para ativar o avatar virtual que fará a tradução em Libras do 
              conteúdo selecionado.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-gray-800">Dica:</strong> Você pode selecionar qualquer 
              texto da página e clicar no avatar para visualizar a tradução em Libras. O VLibras 
              também permite ajustar a velocidade e o tamanho do avatar conforme sua preferência.
            </p>
          </li>

          <li className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#1351B4]">
            <h3 className="text-lg font-semibold text-[#1351B4] mb-2">
              Como Acessar os Recursos
            </h3>
            <p className="text-gray-700 leading-relaxed">
              As funcionalidades de ajuste de fonte, alto contraste e leitor de tela 
              estão disponíveis através do botão flutuante de acessibilidade (ícone de 
              pessoa) localizado no canto inferior direito de todas as páginas. Ao clicar, 
              um menu será aberto com todas as opções de personalização.
            </p>
          </li>

          <li className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#1351B4]">
            <h3 className="text-lg font-semibold text-[#1351B4] mb-2">
              Navegação por Teclado
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              O site é totalmente navegável por teclado, permitindo que usuários 
              que não utilizam mouse possam acessar todos os recursos. Utilize 
              as seguintes teclas de atalho:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="text-gray-700">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Tab</kbd>
                {' '}- Navegar para o próximo elemento interativo
              </li>
              <li className="text-gray-700">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Shift</kbd>
                {' '}+{' '}
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Tab</kbd>
                {' '}- Navegar para o elemento anterior
              </li>
              <li className="text-gray-700">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Enter</kbd>
                {' '}- Ativar botões e links
              </li>
              <li className="text-gray-700">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Espaço</kbd>
                {' '}- Ativar botões e caixas de seleção
              </li>
              <li className="text-gray-700">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Esc</kbd>
                {' '}- Fechar menus e diálogos
              </li>
              <li className="text-gray-700">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Setas</kbd>
                {' '}- Navegar em menus, listas e controles deslizantes
              </li>
            </ul>
          </li>

          <li className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#1351B4]">
            <h3 className="text-lg font-semibold text-[#1351B4] mb-2">
              Persistência de Configurações
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Todas as suas preferências de acessibilidade (tamanho de fonte, 
              contraste e leitor de tela) são salvas automaticamente e permanecerão 
              ativas em suas próximas visitas ao site, garantindo uma experiência 
              personalizada e contínua.
            </p>
          </li>
        </ul>
      </section>

      <section 
        className="bg-blue-50 rounded-lg border border-blue-200 p-6"
        aria-labelledby="contato-acessibilidade"
      >
        <h2 
          id="contato-acessibilidade"
          className="text-lg font-semibold text-[#1351B4] mb-3"
        >
          Precisa de ajuda?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Se você encontrar qualquer barreira de acessibilidade ou tiver 
          sugestões de melhoria, entre em contato através da nossa{' '}
          <a 
            href="https://bomjardim1.websiteseguro.com/ouvidoria/?pagina=fale_conosco_ouvidoria.php"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1351B4] font-semibold underline hover:text-[#0c3c8c] transition focus:outline-none focus:ring-2 focus:ring-[#1351B4] rounded"
            aria-label="Acessar página da Ouvidoria (abre em nova aba)"
          >
            Ouvidoria
          </a>.
        </p>
      </section>
    </main>
  );
}