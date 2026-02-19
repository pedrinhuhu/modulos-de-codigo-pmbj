import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, X, ChevronLeft, ChevronRight, Upload, Trash2 } from "lucide-react";
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

/** Tags disponíveis para classificação de publicações, agrupadas por categoria */
const TAGS = {
  "Tipo de Ato": [
    { id: "portaria", label: "#portaria" },
    { id: "decreto", label: "#decreto" },
    { id: "edital", label: "#edital" },
    { id: "contrato", label: "#contrato" },
    { id: "lei", label: "#lei" },
    { id: "extrato", label: "#extrato" },
    { id: "aviso", label: "#aviso" },
    { id: "resolucao", label: "#resolução" },
  ],
  "Área Temática": [
    { id: "saude", label: "#saúde" },
    { id: "educacao", label: "#educação" },
    { id: "assistencia-social", label: "#assistência-social" },
    { id: "infraestrutura", label: "#infraestrutura" },
    { id: "financeiro", label: "#financeiro" },
    { id: "cultura-esporte", label: "#cultura-esporte" },
    { id: "meio-ambiente", label: "#meio-ambiente" },
    { id: "habitacao", label: "#habitação" },
  ],
  "Pessoal e RH": [
    { id: "nomeacao", label: "#nomeação" },
    { id: "exoneracao", label: "#exoneração" },
    { id: "aposentadoria", label: "#aposentadoria" },
    { id: "cessao", label: "#cessão" },
    { id: "licenca", label: "#licença" },
    { id: "concurso", label: "#concurso" },
  ],
  "Licitações": [
    { id: "pregao", label: "#pregão" },
    { id: "registro-precos", label: "#registro-de-preços" },
    { id: "dispensa", label: "#dispensa" },
    { id: "resultado", label: "#resultado" },
    { id: "aditivo", label: "#aditivo" },
  ],
};

/**
 * @component UploadModal
 * @description Modal de upload de PDFs com seleção de tags, drag & drop e metadados.
 * Exibido apenas no modo `admin`.
 *
 * @param {Object} props
 * @param {boolean} props.open - Controla a visibilidade do modal
 * @param {Function} props.onClose - Callback para fechar o modal
 * @param {Function} props.onConfirm - Callback chamado ao confirmar o upload; recebe ({ files, tags, edicao, data })
 */
function UploadModal({ open, onClose, onConfirm }) {
  /** @type {[File[], Function]} Arquivos PDF selecionados pelo usuário */
  const [files, setFiles] = useState([]);

  /** @type {[string[], Function]} IDs das tags selecionadas */
  const [selectedTags, setSelectedTags] = useState([]);

  /** @type {[boolean, Function]} Indica se o usuário está arrastando arquivos sobre a zona de drop */
  const [dragging, setDragging] = useState(false);

  /** @type {[string, Function]} Número da edição informado manualmente */
  const [edicao, setEdicao] = useState("");

  /** @type {[string, Function]} Data de publicação informada manualmente */
  const [data, setData] = useState("");

  const fileRef = useRef();

  // Reseta o estado interno ao fechar o modal
  useEffect(() => {
    if (!open) {
      setFiles([]);
      setSelectedTags([]);
      setEdicao("");
      setData("");
    }
  }, [open]);

  /**
   * @function addFiles
   * @description Filtra arquivos por tipo PDF e evita duplicatas pelo nome.
   * @param {FileList|File[]} newFiles
   */
  const addFiles = (newFiles) => {
    const pdfs = Array.from(newFiles).filter((f) => f.type === "application/pdf");
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...pdfs.filter((f) => !names.has(f.name))];
    });
  };

  /** @function removeFile - Remove um arquivo da lista pelo nome */
  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));

  /** @function toggleTag - Adiciona ou remove uma tag da seleção pelo ID */
  const toggleTag = (id) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const canConfirm = files.length > 0 && selectedTags.length > 0;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Modal de upload de publicações"
    >
      <div className="bg-white w-full max-w-2xl max-h-[92vh] flex flex-col rounded-xl shadow-2xl overflow-hidden">

        {/* Cabeçalho do modal */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-[#1351B4]">Adicionar Publicação</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
            aria-label="Fechar modal de upload"
          >
            <X size={22} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Metadados: edição e data */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="upload-edicao" className="block text-sm font-semibold text-gray-600 mb-1">
                Nº da Edição
              </label>
              <input
                id="upload-edicao"
                type="text"
                placeholder="Ex: 503"
                value={edicao}
                onChange={(e) => setEdicao(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1351B4] bg-gray-50"
                aria-label="Número da edição do Diário Oficial"
              />
            </div>
            <div>
              <label htmlFor="upload-data" className="block text-sm font-semibold text-gray-600 mb-1">
                Data de Publicação
              </label>
              <input
                id="upload-data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1351B4] bg-gray-50"
                aria-label="Data de publicação do Diário Oficial"
              />
            </div>
          </div>

          {/* Zona de drag & drop */}
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Arquivos PDF</p>
            <div
              role="button"
              tabIndex={0}
              aria-label="Área de upload. Clique ou arraste arquivos PDF aqui"
              onClick={() => fileRef.current.click()}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current.click()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition
                ${dragging
                  ? "border-[#1351B4] bg-blue-50"
                  : "border-gray-300 hover:border-[#1351B4] bg-gray-50"
                }`}
            >
              <Upload size={28} className={`mx-auto mb-2 ${dragging ? "text-[#1351B4]" : "text-gray-400"}`} />
              <p className="text-sm font-semibold text-gray-600">
                {dragging ? "Solte os arquivos aqui" : "Arraste PDFs ou clique para selecionar"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Apenas arquivos .pdf • Múltiplos permitidos</p>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="application/pdf"
                onChange={(e) => addFiles(e.target.files)}
                className="hidden"
                aria-hidden="true"
              />
            </div>

            {/* Lista de arquivos selecionados */}
            {files.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2" aria-label="Arquivos selecionados para upload">
                {files.map((file) => (
                  <li
                    key={file.name}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5"
                  >
                    <FileText size={18} className="text-[#1351B4] shrink-0" />
                    <span className="flex-1 text-sm text-gray-700 truncate">{file.name}</span>
                    <span className="text-xs text-gray-400 shrink-0">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="text-gray-300 hover:text-red-500 transition focus:outline-none focus:ring-2 focus:ring-[#1351B4] rounded"
                      aria-label={`Remover arquivo ${file.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Seleção de tags por grupo */}
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">
              Tags de Classificação
              {selectedTags.length > 0 && (
                <span className="ml-2 bg-[#1351B4] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {selectedTags.length} selecionada{selectedTags.length > 1 ? "s" : ""}
                </span>
              )}
            </p>

            <div className="flex flex-col gap-4" role="group" aria-label="Grupos de tags para classificação">
              {Object.entries(TAGS).map(([group, tags]) => (
                <div key={group}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">{group}</p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label={`Tags do grupo ${group}`}>
                    {tags.map((tag) => {
                      const active = selectedTags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          aria-pressed={active}
                          aria-label={`Tag ${tag.label}${active ? ", selecionada" : ""}`}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-[#1351B4]
                            ${active
                              ? "bg-[#1351B4] text-white border-[#1351B4]"
                              : "bg-white text-gray-600 border-gray-300 hover:border-[#1351B4] hover:text-[#1351B4]"
                            }`}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé com ações */}
        <footer className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-400">
            {files.length} arquivo{files.length !== 1 ? "s" : ""} · {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
              aria-label="Cancelar upload e fechar modal"
            >
              Cancelar
            </button>
            <button
              onClick={() => canConfirm && onConfirm({ files, tags: selectedTags, edicao, data })}
              disabled={!canConfirm}
              className="bg-[#1351B4] text-white px-6 py-2.5 rounded-lg hover:bg-[#0c3c8c] transition font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
              aria-label="Confirmar upload dos arquivos selecionados"
              aria-disabled={!canConfirm}
            >
              Publicar
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/**
 * @component PDFCardSystem
 * @description Lista, pesquisa e visualiza edições do Diário Oficial em PDF.
 * No modo `admin`, também permite o upload de novos arquivos via modal com tags.
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

  /** @type {[boolean, Function]} Controla a visibilidade do modal de upload */
  const [uploadOpen, setUploadOpen] = useState(false);

  // Carrega e ordena todos os PDFs do storage ao montar o componente
  useEffect(() => {
    (async () => {
      const all = await getPdf();

      if (all.length) {
        setLastEdition(Math.max(...all.map((p) => p.edicao)));
      }

      const enriched = all
        .map(enrichPdf)
        .sort((a, b) => b.edicao - a.edicao);

      setPdfs(enriched);
      setFilteredPdfs(enriched);
    })();
  }, []);

  /**
   * @function handleConfirmUpload
   * @description Processa os arquivos confirmados no modal de upload. Para cada arquivo:
   * incrementa o número de edição, converte para base64, extrai o texto, associa as tags
   * e persiste no storage via `setPdf`.
   * @param {{ files: File[], tags: string[], edicao: string, data: string }} payload
   * @returns {Promise<void>}
   */
  async function handleConfirmUpload({ files, tags, edicao, data }) {
    let edicaoNum = lastEdition;

    for (const file of files) {
      if (file.type !== "application/pdf") continue;
      edicaoNum++;

      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const texto = await extractTextFromPDF(dataUrl);
      const createdAt = data ? new Date(data) : new Date();

      const pdf = new PDF(
        file.name,
        edicao ? `Edição Nº ${edicao}` : `Edição Nº ${edicaoNum}`,
        null,
        texto,
        edicao ? Number(edicao) : edicaoNum,
        createdAt,
        createdAt.getMonth() + 1,
        createdAt.getFullYear()
      );

      pdf.url = dataUrl;
      pdf.tags = tags;
      await setPdf(pdf);
    }

    const all = await getPdf();
    const enriched = all
      .map(enrichPdf)
      .sort((a, b) => b.edicao - a.edicao);

    setPdfs(enriched);
    setFilteredPdfs(enriched);
    setLastEdition(edicaoNum);
    setUploadOpen(false);
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

      {/* Botão de upload — visível apenas no modo admin */}
      {mode === "admin" && (
        <button
          onClick={() => setUploadOpen(true)}
          className="bg-[#1351B4] text-white px-6 py-3 cursor-pointer inline-flex items-center gap-2 mb-8 rounded-lg hover:bg-[#0c3c8c] transition font-semibold focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
          aria-label="Abrir modal para adicionar nova publicação em PDF"
        >
          <Upload size={18} />
          Adicionar PDF
        </button>
      )}

      {/* Modal de upload com seleção de tags */}
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onConfirm={handleConfirmUpload}
      />

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