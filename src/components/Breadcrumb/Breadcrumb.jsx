/**
 * @component Breadcrumb
 * @description Migalha de pão para orientação do usuário na estrutura do site.
 * Recomendação 3.4 do eMAG 3.1.
 *
 * @param {{ label: string, href?: string }[]} items - Itens do caminho.
 * O último item é a página atual (sem link).
 */
export function Breadcrumb({ items }) {
  return (
    <nav
      aria-label="Caminho da página"
      className="px-6 md:px-16 py-2 bg-[#f0f4fb] border-b border-blue-100"
    >
      <ol className="flex flex-wrap items-center gap-1 text-sm max-w-7xl mx-auto">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1">
              {isLast ? (
                <span
                  className="text-gray-500"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <a
                    href={item.href}
                    className="text-[#1351B4] hover:underline focus:outline-none focus:ring-2 focus:ring-[#1351B4] rounded"
                  >
                    {item.label}
                  </a>
                  <span aria-hidden="true" className="text-gray-400">
                    ›
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}