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

export function PDFCardSystem({ mode = "public" }) {
  const [pdfs, setPdfs] = useState([]);
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [lastEdition, setLastEdition] = useState(0);

  //Carregamento inicial
  useEffect(() => {
    (async () => {
      const all = await getPdf();

      if (all.length) {
        setLastEdition(Math.max(...all.map(p => p.edicao)));
      }

      const enriched = all
        .map(enrichPdf)
        .sort((a, b) => b.edicao - a.edicao); //ordem da edição mais recente primeiro

      setPdfs(enriched);
      setFilteredPdfs(enriched);
    })();
  }, []);

  //Upload de PDFs
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
      .sort((a, b) => b.edicao - a.edicao); //MANTÉM A ORDEM

    setPdfs(enriched);
    setFilteredPdfs(enriched);
    setLastEdition(edicao);

    event.target.value = "";
  }

  //Pesquisa
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
    <main className="p-8 max-w-7xl mx-auto">
      <DadosAbertos />
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
        {filteredPdfs.map((pdf) => (
          <article
            key={pdf.id}
            className="bg-[#fffdfa] border-l-8 border-[#0a2a43] p-8 shadow"
          >
            <FileText size={36} className="mb-4 text-[#0a2a43]" />

            {/*EDIÇÃO */}
            <p className="font-semibold text-lg text-[#0a2a43]">
              Edição Nº {pdf.edicao}
            </p>

            {/*DATA */}
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
              className="mt-6 bg-[#0a2a43] text-white px-6 py-3 uppercase"
            >
              Visualizar
            </button>
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

              <button
                onClick={() =>
                  setCurrentPage(p => Math.min(p + 1, numPages))
                }
              >
                Próxima <ChevronRight />
              </button>
            </nav>
          </div>
        </div>
      )}
    </main>
  );
}
