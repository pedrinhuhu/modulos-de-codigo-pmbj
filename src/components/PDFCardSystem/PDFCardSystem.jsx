import { useState, useEffect } from "react";
import { FileText, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { DadosAbertos } from "../DadosAbertos/DadosAbertos";
import { setPdf, getPdf } from "../../utils/storage";
import { PDF } from "../../utils/pdf";
import { extractTextFromPDF, enrichPdf } from "../../utils/pdfUtils";
import { Pesquisa } from "../Pesquisa/Pesquisa";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * @component PDFCardSystem
 * @description Lista, pesquisa e visualiza edições do Diário Oficial em PDF.
 * No modo `admin`, também permite o upload de novos arquivos.
 *
 * @param {Object} props
 * @param {"public" | "admin"} [props.mode="public"] - Define se o botão de upload é exibido
 * @returns {JSX.Element}
 */
export function PDFCardSystem({ mode = "public" }) {
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

  /** @type {[number, Function]} Número da última edição cadastrada, usado para incremento no upload */
  const [lastEdition, setLastEdition] = useState(0);

  // Carrega e ordena todos os PDFs do storage ao montar o componente
  useEffect(() => {
    (async () => {
      const all = await getPdf();

      if (all.length) {
        setLastEdition(Math.max(...all.map(p => p.edicao)));
      }

      const enriched = all
        .map(enrichPdf)
        .sort((a, b) => b.edicao - a.edicao);

      setPdfs(enriched);
      setFilteredPdfs(enriched);
    })();
  }, []);

  /**
   * @function handleFileUpload
   * @description Processa o upload de um ou mais arquivos PDF. Para cada arquivo:
   * incrementa o número de edição, converte para base64, extrai o texto e persiste
   * no storage via `setPdf`.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   * @returns {Promise<void>}
   */
  async function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    let edicao = lastEdition;

    for (const file of files) {
      if (file.type !== "application/pdf") continue;
      edicao++;

      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const texto = await extractTextFromPDF(dataUrl);
      const data = new Date();

      const pdf = new PDF(
        file.name,
        `Edição Nº ${edicao}`,
        null,
        texto,
        edicao,
        data,
        data.getMonth() + 1,
        data.getFullYear()
      );

      pdf.url = dataUrl;
      await setPdf(pdf);
    }

    const all = await getPdf();
    const enriched = all
      .map(enrichPdf)
      .sort((a, b) => b.edicao - a.edicao);

    setPdfs(enriched);
    setFilteredPdfs(enriched);
    setLastEdition(edicao);

    event.target.value = "";
  }

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

      {mode === "admin" && (
        <label className="bg-[#1351B4] text-white px-6 py-3 cursor-pointer inline-block mb-8 rounded-lg hover:bg-[#0c3c8c] transition font-semibold">
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileUpload}
            className="hidden cursor-pointer"
          />
          Adicionar PDF
        </label>
      )}

      <section id="section__pdf" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPdfs.map((pdf) => (
          <article
            key={pdf.id}
            className="bg-white border-l-4 border-[#1351B4] p-6 shadow-sm rounded-lg hover:shadow-md transition"
          >
            <FileText size={32} className="mb-4 text-[#1351B4]" />

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

            <button
              onClick={() => {
                setSelectedPDF(pdf);
                setCurrentPage(1);
              }}
              className="mt-6 bg-[#1351B4] text-white px-6 py-2.5 rounded-lg cursor-pointer hover:bg-[#0c3c8c] transition font-semibold focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
            >
              Visualizar
            </button>
          </article>
        ))}
      </section>

      {selectedPDF && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-2 md:p-0">
          <div className="bg-white w-full md:w-[90vw] h-[95vh] md:h-[92vh] flex flex-col rounded-xl shadow-2xl overflow-hidden">
            <header className="flex justify-between items-center px-4 md:px-6 py-4 border-b border-gray-200 bg-white">
              <h2 className="text-base md:text-lg font-semibold text-[#1351B4]">Leitura Oficial</h2>
              <button
                onClick={() => setSelectedPDF(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
                aria-label="Fechar visualização"
              >
                <X size={24} />
              </button>
            </header>

            <div className="flex-1 flex justify-center overflow-auto bg-gray-50 py-6 md:py-10">
              <Document
                file={selectedPDF.blobUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                <Page pageNumber={currentPage} scale={window.innerWidth < 768 ? 0.8 : 1.6} />
              </Document>
            </div>

            <nav className="flex justify-between items-center px-4 md:px-6 py-4 border-t border-gray-200 bg-white">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-[#1351B4] text-white rounded-lg hover:bg-[#0c3c8c] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
              >
                <ChevronLeft size={20} /> Anterior
              </button>

              <span className="text-sm font-medium text-gray-700">
                {currentPage} / {numPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))}
                disabled={currentPage === numPages}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-[#1351B4] text-white rounded-lg hover:bg-[#0c3c8c] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
              >
                Próxima <ChevronRight size={20} />
              </button>
            </nav>
          </div>
        </div>
      )}
    </main>
  );
}