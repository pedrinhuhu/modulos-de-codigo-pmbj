import { useState, useEffect } from "react";
import { FileText, X, ChevronLeft, ChevronRight, Trash } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { setPdf, getPdf, removePdf } from "../../utils/storage";
import { PDF } from "../../utils/pdf";
import { extractTextFromPDF, enrichPdf } from "../../utils/pdfUtils";
import { Pesquisa } from "../Pesquisa/Pesquisa";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export function PDFCardSystem({ mode = "public" }) {
  const [pdfs, setPdfs] = useState([]);
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [lastEdition, setLastEdition] = useState(0);

  useEffect(() => {
    (async () => {
      const all = await getPdf();

      if (all.length) setLastEdition(all[all.length - 1].edicao);

      const enriched = all
        .map(enrichPdf)
        .sort((a, b) => b.createdAt - a.createdAt); // 🔥 MAIS NOVO PRIMEIRO

      setPdfs(enriched);
      setFilteredPdfs(enriched);
    })();
  }, []);

  async function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    let edicao = lastEdition;

    for (const file of files) {
      if (file.type !== "application/pdf") continue;
      edicao++;

      const dataUrl = await new Promise(resolve => {
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
      .sort((a, b) => b.createdAt - a.createdAt); // 🔥 MAIS NOVO PRIMEIRO

    setPdfs(enriched);
    setFilteredPdfs(enriched);
    setLastEdition(edicao);

    // 🔴 ESSENCIAL
    event.target.value = "";
  }

  async function removerPdf(id) {
    if (!window.confirm("Deseja remover este PDF?")) return;

    await removePdf(id);

    const all = (await getPdf())
      .map(enrichPdf)
      .sort((a, b) => b.createdAt - a.createdAt); // 🔥 MANTÉM ORDEM

    setPdfs(all);
    setFilteredPdfs(all);
    setSelectedPDF(null);
  }

  function handleSearch(q) {
    const query = (q || "").toLowerCase();

    setFilteredPdfs(
      pdfs.filter(
        p =>
          (p.titulo || "").toLowerCase().includes(query) ||
          (p.descricao || "").toLowerCase().includes(query) ||
          (p.textoExtraido || "").toLowerCase().includes(query)
      )
    );
  }

  return (
    <main className="p-8 max-w-7xl mx-auto">

      <Pesquisa onSearch={handleSearch} />

      {mode === "admin" && (
        <label className="bg-[#0a2a43] text-white px-6 py-3 cursor-pointer inline-block mb-8">
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          Adicionar PDF
        </label>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredPdfs.map(pdf => (
          <article
            key={pdf.id}
            className="bg-[#fffdfa] border-l-8 border-[#0a2a43] p-8 shadow"
          >
            <FileText size={36} className="mb-4 text-[#0a2a43]" />

            {/* ✅ EDIÇÃO + DATA DE UPLOAD */}
            <p className="font-medium">
              Edição Nº {pdf.edicao} de{" "}
              {new Date(pdf.createdAt).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </p>

            <button
              onClick={() => {
                setSelectedPDF(pdf);
                setCurrentPage(1);
              }}
              className="mt-6 bg-[#0a2a43] text-white px-6 py-3 uppercase"
            >
              Visualizar
            </button>

            {mode === "admin" && (
              <button
                onClick={() => removerPdf(pdf.id)}
                className="mt-3 bg-red-600 text-white px-6 py-2 flex gap-2 items-center"
              >
                <Trash size={16} /> Remover
              </button>
            )}
          </article>
        ))}
      </section>

      {selectedPDF && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-[#fdfcf9] w-[90vw] h-[92vh] flex flex-col border-4 border-[#0a2a43]">
            <header className="flex justify-between px-6 py-4 border-b">
              <h2>Leitura Oficial</h2>
              <button onClick={() => setSelectedPDF(null)}>
                <X />
              </button>
            </header>

            <div className="flex-1 flex justify-center overflow-auto bg-[#e9e6e1] py-10">
              <Document
                file={selectedPDF.blobUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                <Page pageNumber={currentPage} scale={1.6} />
              </Document>
            </div>

            <nav className="flex justify-between px-6 py-4 border-t">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
                <ChevronLeft /> Anterior
              </button>

              <span>
                Página {currentPage} de {numPages}
              </span>

              <button onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))}>
                Próxima <ChevronRight />
              </button>
            </nav>

            {mode === "admin" && (
              <button
                onClick={() => removerPdf(selectedPDF.id)}
                className="bg-red-700 text-white py-3"
              >
                Excluir PDF
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
