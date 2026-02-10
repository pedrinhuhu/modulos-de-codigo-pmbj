import { useState, useEffect } from 'react';
import { FileText, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { setPdf, getPdf } from "../../utils/storage";
import { PDF } from "../../utils/pdf";
import { extractTextFromPDF } from "../../utils/pdfUtils";
import { enrichPdf } from '../../utils/pdfUtils';
import { Pesquisa } from '../Pesquisa/Pesquisa';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export function PDFCardSystem() {
  const [pdfs, setPdfs] = useState([]);
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastEdition, setLastEdition] = useState(null);

  useEffect(() => {
    getPdf().then(pdfs => {
      if (pdfs.length) setLastEdition(pdfs[pdfs.length - 1].edicao);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const all = await getPdf();
      const enriched = all.map(enrichPdf);
      setPdfs(enriched);
      setFilteredPdfs(enriched);
    })();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedPDF ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [selectedPDF]);

  async function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    const semana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    for (const file of files) {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        const dataUrl = await new Promise(resolve => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        const textoExtraido = await extractTextFromPDF(dataUrl);
        const edicao = lastEdition ? lastEdition + 1 : 1;
        setLastEdition(edicao);

        const data = new Date();
        const descricao = `Edição Nº ${edicao} de ${semana[data.getDay()]}, ${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;

        const pdf = new PDF(file.name, descricao, null, textoExtraido, edicao);
        pdf.url = dataUrl;
        await setPdf(pdf);
      }
    }

    const all = await getPdf();
    const enriched = all.map(enrichPdf);
    setPdfs(enriched);
    setFilteredPdfs(enriched);
  }

  function handleSearch(q) {
    const query = (q || '').toLowerCase().trim();
    if (!query) return setFilteredPdfs(pdfs);

    setFilteredPdfs(
      pdfs.filter(p =>
        (p.titulo || '').toLowerCase().includes(query) ||
        (p.descricao || '').toLowerCase().includes(query) ||
        (p.textoExtraido || '').toLowerCase().includes(query)
      )
    );
  }

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setCurrentPage(1);
  }

  return (
    <main 
      id="conteudo-principal"
      className="min-h-screen p-8"
      role="main"
    >
      <div className="max-w-7xl mx-auto">
        <Pesquisa onSearch={handleSearch} />

        {filteredPdfs.length === 0 && (
          <div 
            className="text-gray-600 text-center text-xl"
            role="status"
            aria-live="polite"
          >
            Nenhum PDF encontrado.
          </div>
        )}

        <section 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Lista de documentos do Diário Oficial"
        >
          {filteredPdfs.map(pdf => (
            <article
              key={pdf.id}
              className="bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col items-center"
            >
              <FileText 
                className="w-12 h-12 text-blue-600 mb-3" 
                aria-hidden="true"
              />
              <h3 className="font-semibold text-center">
                {pdf.descricao}
              </h3>

              <button
                onClick={() => setSelectedPDF(pdf)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg flex gap-2 mt-4 items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                aria-label={`Visualizar ${pdf.descricao}`}
              >
                <Eye size={16} aria-hidden="true" /> Visualizar
              </button>
            </article>
          ))}
        </section>
      </div>

      {selectedPDF && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white w-[90vw] h-[90vh] rounded-lg flex flex-col">

            <div className="flex justify-between px-6 py-4 border-b">
              <h2 
                id="modal-title"
                className="text-xl font-bold"
              >
                Leitura do Diário
              </h2>
              <button 
                onClick={() => setSelectedPDF(null)}
                className="focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                aria-label="Fechar visualização do PDF"
              >
                <X size={26} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-100 flex justify-center py-6">
              <Document 
                file={selectedPDF.blobUrl} 
                onLoadSuccess={onLoadSuccess}
                aria-label="Visualizador de PDF"
              >
                <Page 
                  pageNumber={currentPage} 
                  scale={1.6}
                  aria-label={`Página ${currentPage} de ${numPages || '?'}`}
                />
              </Document>
            </div>

            <nav 
              className="flex justify-between px-6 py-4 border-t"
              aria-label="Navegação do PDF"
            >
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage <= 1}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} aria-hidden="true" /> Anterior
              </button>

              <div className="flex flex-col items-center gap-2">
                <span 
                  className="font-medium"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  Página {currentPage} de {numPages || '?'}
                </span>
                <button
                  onClick={() => window.open(selectedPDF.blobUrl, '_blank')}
                  className="bg-green-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                  aria-label="Abrir PDF em nova aba para impressão"
                >
                  Imprimir 🖨️
                </button>
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))}
                disabled={currentPage >= numPages}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Próxima página"
              >
                Próxima <ChevronRight size={16} aria-hidden="true" />
              </button>
            </nav>

          </div>
        </div>
      )}
    </main>
  );
}