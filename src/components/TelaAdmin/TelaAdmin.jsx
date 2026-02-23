import { useState, useEffect } from "react";
import { getPdf } from "../../utils/storage";
import { enrichPdf } from "../../utils/pdfUtils";
import { AdicionarPDF } from "../AdicionarPDF/AdicionarPDF";
import { FileText } from "lucide-react";
import { Breadcrumb } from "../Breadcrumb/Breadcrumb";

/**
 * @component TelaAdmin
 * @description Tela exclusiva do administrador. Exibe a seção de upload de PDFs
 * e a lista de publicações já cadastradas. Acessível apenas via `RotaPrivada`.
 *
 * @returns {JSX.Element}
 */
export function TelaAdmin() {
  /** @type {[PDF[], Function]} Lista completa de PDFs carregados do storage */
  const [pdfs, setPdfs] = useState([]);

  /** @type {[number, Function]} Número da última edição cadastrada, repassado ao AdicionarPDF */
  const [lastEdition, setLastEdition] = useState(0);

  // Carrega e ordena todos os PDFs do storage ao montar o componente
  useEffect(() => {
    (async () => {
      const all = await getPdf();

      if (all.length) {
        setLastEdition(Math.max(...all.map((p) => p.edicao)));
      }

      const enriched = all.map(enrichPdf).sort((a, b) => b.edicao - a.edicao);

      setPdfs(enriched);
    })();
  }, []);

  /**
   * @function handleUploadSuccess
   * @description Recebe a lista atualizada de PDFs do `AdicionarPDF` após um upload
   * bem-sucedido e sincroniza o estado local.
   * @param {{ enrichedPdfs: PDF[], lastEdicao: number }} payload
   * @returns {void}
   */
  function handleUploadSuccess({ enrichedPdfs, lastEdicao }) {
    setPdfs(enrichedPdfs);
    setLastEdition(lastEdicao);
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Painel Administrativo" },
        ]}
      />
      <main
        id="conteudo-principal"
        className="p-4 md:p-8 max-w-7xl mx-auto"
        aria-label="Painel administrativo do Diário Oficial"
      >
        {/* Título da página */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1351B4]">
            Painel Administrativo
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie as publicações do Diário Oficial do Município de Bom
            Jardim.
          </p>
        </header>

        {/* Seção de upload */}
        <AdicionarPDF
          lastEdition={lastEdition}
          onUploadSuccess={handleUploadSuccess}
        />

        {/* Lista de PDFs cadastrados */}
        <section aria-label="Publicações cadastradas">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Publicações Cadastradas
            {pdfs.length > 0 && (
              <span className="ml-2 text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {pdfs.length}
              </span>
            )}
          </h2>

          {pdfs.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-lg text-gray-400"
              aria-label="Nenhuma publicação cadastrada"
            >
              <FileText
                size={40}
                className="mb-3 opacity-30"
                aria-hidden="true"
              />
              <p className="text-sm">Nenhuma publicação cadastrada ainda.</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              aria-label="Lista de publicações cadastradas"
            >
              {pdfs.map((pdf) => (
                <article
                  key={pdf.id}
                  className="bg-white border-l-4 border-[#1351B4] p-5 shadow-sm rounded-lg"
                  aria-label={`Edição ${pdf.edicao} do Diário Oficial`}
                >
                  <FileText
                    size={28}
                    className="mb-3 text-[#1351B4]"
                    aria-hidden="true"
                  />

                  <p className="font-semibold text-[#1351B4]">
                    Edição Nº {pdf.edicao}
                  </p>

                  <p className="text-sm text-gray-500 mt-1 capitalize">
                    {new Date(pdf.createdAt).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  {/* Tags da publicação */}
                  {pdf.tags?.length > 0 && (
                    <div
                      className="flex flex-wrap gap-1.5 mt-3"
                      aria-label="Tags da publicação"
                    >
                      {pdf.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-semibold bg-blue-50 text-[#1351B4] border border-blue-100 px-2 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
