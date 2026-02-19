/**
 * @component SkipNavigation
 * @description Link de acessibilidade invisível que aparece ao receber foco (via Tab).
 * Permite que usuários de teclado pulem direto para o conteúdo principal,
 * ignorando a navegação repetitiva. O destino deve ter `id="conteudo-principal"`.
 * @returns {JSX.Element}
 */
export function SkipNavigation() {
  return (
    <a 
      href="#conteudo-principal" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      aria-label="Pular para o conteúdo principal"
    >
      Pular para o conteúdo principal
    </a>
  );
}