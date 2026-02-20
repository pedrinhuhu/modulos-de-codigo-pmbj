import { useState, useEffect } from "react";
import { FileText, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { DadosAbertos } from "../DadosAbertos/DadosAbertos";
import { getPdf } from "../../utils/storage";
import { enrichPdf } from "../../utils/pdfUtils";
import { Pesquisa } from "../Pesquisa/Pesquisa";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * @component PDFCardSystem
 * @description Lista, pesquisa e visualiza edições do Diário Oficial em PDF.
 *
 * @returns {JSX.Element}
 */
export function PDFCardSystem() {
  /** @type {[PDF[], Function]} Lista completa de PDFs carregados do storage */
  const [pdfs, setPdfs] = useState([]);

  /** @type {[PDF[], Function]} Subconjunto de `pdfs` filtrado pela pesquisa */
  const [filteredPdfs, setFilteredPdfs] = useState([]);

  /** @type {[PDF|null, Function]} PDF atualmente aberto no modal de visualização */
  const [selectedPDF, setSelectedPDF] = useState(null);

  /** @type {[number, Function]} Página atual exibida no visualizador */
  const [currentPage, setCurrentPage] = useState(1);

  /** @type {[number|null, Function]} Total de páginas do PDF aberto */
  const [numPages, setNumPages] = useState(null);

  // Carrega e ordena todos os PDFs do storage ao montar o componente
  useEffect(() => {
    (async () => {
      const all = await getPdf();

      const enriched = all
        .map(enrichPdf)
        .sort((a, b) => b.edicao - a.edicao);

      setPdfs(enriched);
      setFilteredPdfs(enriched);
    })();
  }, []);

  /**
   * @function handleSearch
   * @description Filtra `pdfs` pelo termo buscado, comparando contra
   * `titulo`, `descricao` e `textoExtraido` (case-insensitive).
   * @param {string} q - Termo de busca
   * @returns {void}
   */
  function handleSearch(q) {
    const query = (q || "").toLowerCase();

    setFilteredPdfs(
      pdfs.filter(
        (p) =>
          (p.titulo || "").toLowerCase().includes(query) ||
          (p.descricao || "").toLowerCase().includes(query) ||
          (p.textoExtraido || "").toLowerCase().includes(query)
      )
    );
  }

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto">
      <DadosAbertos />
      <Pesquisa onSearch={handleSearch} />

      {/* Grid de cards de PDFs */}
      <section
        id="section__pdf"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-label="Lista de edições do Diário Oficial"
      >
        {filteredPdfs.map((pdf) => (
          <article
            key={pdf.id}
            className="bg-white border-l-4 border-[#1351B4] p-6 shadow-sm rounded-lg hover:shadow-md transition"
            aria-label={`Edição ${pdf.edicao} do Diário Oficial`}
          >
            <FileText size={32} className="mb-4 text-[#1351B4]" aria-hidden="true" />

            <p className="font-semibold text-lg text-[#1351B4]">
              Edição Nº {pdf.edicao}
            </p>

            <p className="text-sm text-gray-600 mt-1 capitalize">
              {new Date(pdf.createdAt).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            {/* Tags associadas ao PDF */}
            {pdf.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3" aria-label="Tags da publicação">
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

            <button
              onClick={() => {
                setSelectedPDF(pdf);
                setCurrentPage(1);
              }}
              className="mt-6 bg-[#1351B4] text-white px-6 py-2.5 rounded-lg cursor-pointer hover:bg-[#0c3c8c] transition font-semibold focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
              aria-label={`Visualizar edição ${pdf.edicao} do Diário Oficial`}
            >
              Visualizar
            </button>
          </article>
        ))}
      </section>

      {/* Modal de visualização do PDF */}
      {selectedPDF && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-2 md:p-0"
          role="dialog"
          aria-modal="true"
          aria-label={`Visualizando edição ${selectedPDF.edicao} do Diário Oficial`}
        >
          <div className="bg-white w-full md:w-[90vw] h-[95vh] md:h-[92vh] flex flex-col rounded-xl shadow-2xl overflow-hidden">

            <header className="flex justify-between items-center px-4 md:px-6 py-4 border-b border-gray-200 bg-white">
              <h2 className="text-base md:text-lg font-semibold text-[#1351B4]">Leitura Oficial</h2>
              <button
                onClick={() => setSelectedPDF(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
                aria-label="Fechar visualização do PDF"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </header>

            <div
              className="flex-1 flex justify-center overflow-auto bg-gray-50 py-6 md:py-10"
              aria-label={`Conteúdo da edição ${selectedPDF.edicao}, página ${currentPage} de ${numPages}`}
            >
              <Document
                file={selectedPDF.blobUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                <Page
                  pageNumber={currentPage}
                  scale={window.innerWidth < 768 ? 0.8 : 1.6}
                />
              </Document>
            </div>

            <nav
              className="flex justify-between items-center px-4 md:px-6 py-4 border-t border-gray-200 bg-white"
              aria-label="Navegação entre páginas do PDF"
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-[#1351B4] text-white rounded-lg hover:bg-[#0c3c8c] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
                aria-label="Ir para a página anterior"
              >
                <ChevronLeft size={20} aria-hidden="true" /> Anterior
              </button>

              <span className="text-sm font-medium text-gray-700" aria-live="polite" aria-atomic="true">
                {currentPage} / {numPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, numPages))}
                disabled={currentPage === numPages}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-[#1351B4] text-white rounded-lg hover:bg-[#0c3c8c] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
                aria-label="Ir para a próxima página"
              >
                Próxima <ChevronRight size={20} aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </main>
  );
}