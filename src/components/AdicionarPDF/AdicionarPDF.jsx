import { useState, useRef, useCallback } from "react";
import { FileText, Upload, Trash2, CheckCircle } from "lucide-react";
import { setPdf, getPdf } from "../../utils/storage";
import { PDF } from "../../utils/pdf";
import { extractTextFromPDF, enrichPdf } from "../../utils/pdfUtils";

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
 * @component AdicionarPDF
 * @description Seção de upload de PDFs do Diário Oficial.
 * Permite selecionar arquivos via drag & drop ou clique, informar metadados
 * (edição e data) e classificar com tags antes de confirmar a publicação.
 * Toda a lógica de storage é encapsulada aqui.
 *
 * @param {Object} props
 * @param {number} props.lastEdition - Número da última edição cadastrada
 * @param {Function} props.onUploadSuccess - Callback chamado após publicar com sucesso;
 *   recebe ({ enrichedPdfs: PDF[], lastEdicao: number })
 * @returns {JSX.Element}
 */
export function AdicionarPDF({ lastEdition, onUploadSuccess }) {
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

  /** @type {[boolean, Function]} Indica se o upload foi concluído com sucesso */
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileRef = useRef();

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

  /** @function resetUpload - Limpa todos os campos do formulário */
  const resetUpload = () => {
    setFiles([]);
    setSelectedTags([]);
    setEdicao("");
    setData("");
    setUploadSuccess(false);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const canConfirm = files.length > 0 && selectedTags.length > 0;

  /**
   * @function handleSubmit
   * @description Processa cada arquivo PDF: incrementa a edição, converte para base64,
   * extrai o texto, associa as tags e persiste no storage via `setPdf`.
   * Ao final, chama `onUploadSuccess` com a lista atualizada.
   * @returns {Promise<void>}
   */
  async function handleSubmit() {
    if (!canConfirm) return;

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
      pdf.tags = selectedTags;
      await setPdf(pdf);
    }

    const all = await getPdf();
    const enrichedPdfs = all
      .map(enrichPdf)
      .sort((a, b) => b.edicao - a.edicao);

    onUploadSuccess({ enrichedPdfs, lastEdicao: edicaoNum });
    setUploadSuccess(true);
    setTimeout(resetUpload, 2500);
  }

  return (
    <section
      className="mb-8 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
      aria-label="Seção de adição de publicação em PDF"
    >
      {/* Cabeçalho */}
      <header className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-[#1351B4]">Adicionar Publicação</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Faça upload de PDFs do Diário Oficial e classifique com as tags correspondentes.
        </p>
      </header>

      {/* Feedback de sucesso */}
      {uploadSuccess ? (
        <div
          className="flex flex-col items-center justify-center gap-3 py-12"
          aria-live="polite"
          aria-label="Publicação realizada com sucesso"
        >
          <CheckCircle size={44} className="text-green-500" aria-hidden="true" />
          <p className="text-sm font-semibold text-gray-600">Publicação realizada com sucesso!</p>
        </div>
      ) : (
        <div className="px-6 py-5 flex flex-col gap-5">

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
            <p className="text-sm font-semibold text-gray-600 mb-2">Arquivos PDF</p>
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
              <Upload
                size={28}
                className={`mx-auto mb-2 ${dragging ? "text-[#1351B4]" : "text-gray-400"}`}
                aria-hidden="true"
              />
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
                    <FileText size={18} className="text-[#1351B4] shrink-0" aria-hidden="true" />
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

          {/* Rodapé com ações */}
          <footer className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              {files.length} arquivo{files.length !== 1 ? "s" : ""} · {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={handleSubmit}
              disabled={!canConfirm}
              className="bg-[#1351B4] text-white px-6 py-2.5 rounded-lg hover:bg-[#0c3c8c] transition font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
              aria-label="Confirmar upload e publicar os arquivos selecionados"
              aria-disabled={!canConfirm}
            >
              Publicar
            </button>
          </footer>

        </div>
      )}
    </section>
  );
}