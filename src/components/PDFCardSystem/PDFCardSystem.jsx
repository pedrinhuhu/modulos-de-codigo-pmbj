import { useState, useEffect } from 'react';
import { FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const semana = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

    let edicaoAtual = lastEdition ?? 0;

    for (const file of files) {
      if (file.type !== 'application/pdf') continue;
      edicaoAtual++;

      const reader = new FileReader();
      const dataUrl = await new Promise(resolve => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const textoExtraido = await extractTextFromPDF(dataUrl);
      const data = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
      );

      const descricao = `Edição Nº ${edicaoAtual} de ${semana[data.getDay()]}, ${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;

      const pdf = new PDF(file.name, descricao, null, textoExtraido, edicaoAtual, data, data.getMonth() + 1, data.getFullYear());
      pdf.url = dataUrl;
      await setPdf(pdf);
    }

    setLastEdition(edicaoAtual);

    const all = await getPdf();
    const enriched = all.map(enrichPdf);
    setPdfs(enriched);
    setFilteredPdfs(enriched);
  }

  function handleSearch(q, mes = '', ano = '') {
    const query = (q || '').toLowerCase().trim();
    if (!query && !mes && !ano) return setFilteredPdfs(pdfs);

    setFilteredPdfs(
      pdfs.filter(p =>
        ((p.titulo || '').toLowerCase().includes(query) ||
         (p.descricao || '').toLowerCase().includes(query) ||
         (p.textoExtraido || '').toLowerCase().includes(query)) &&
        (mes === '' || p.mes.toString() == mes) &&
        (ano === '' || p.ano.toString() == ano)
      )
    );
  }

  return (
    <main className="min-h-screen p-8" role="main" aria-label="Sistema de documentos em PDF">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          aria-label="Lista de PDFs disponíveis"
        >
          {filteredPdfs.map(pdf => (
            <article
              key={pdf.id}
              className="bg-[#fffdfa] border-l-8 border-[#0a2a43] border border-gray-400 p-8 shadow-sm"
            >
              <FileText
                className="text-[#0a2a43] mb-4"
                size={36}
                aria-hidden="true"
              />

              <p className="font-serif text-lg leading-relaxed">
                {pdf.descricao}
              </p>

              <button
                onClick={() => setSelectedPDF(pdf)}
                className="mt-6 bg-[#0a2a43] text-white px-8 py-3 uppercase tracking-[0.2em] text-sm"
                aria-label={`Visualizar ${pdf.descricao}`}
              >
                Visualizar
              </button>
            </article>
          ))}
        </section>
      </div>

      {selectedPDF && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal-pdf"
        >
          <div className="bg-[#fdfcf9] w-[88vw] h-[92vh] border-4 border-[#0a2a43] shadow-2xl flex flex-col">
            <header className="flex justify-between px-6 py-4 border-b">
              <h2
                id="titulo-modal-pdf"
                className="font-[Cinzel] uppercase tracking-widest"
              >
                Leitura Oficial
              </h2>
              <button
                onClick={() => setSelectedPDF(null)}
                aria-label="Fechar visualização do PDF"
              >
                <X aria-hidden="true" />
              </button>
            </header>

            <div
              className="flex-1 bg-[#e9e6e1] flex justify-center py-12 overflow-auto"
              aria-label="Visualizador de PDF"
            >
              <Document file={selectedPDF.blobUrl}>
                <Page
                  pageNumber={currentPage}
                  scale={1.6}
                  aria-label={`Página ${currentPage} de ${numPages || '?'}`}
                />
              </Document>
            </div>

            <nav
              className="flex justify-between px-6 py-4 border-t"
              aria-label="Navegação entre páginas do PDF"
            >
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="bg-[#0a2a43] text-white px-6 py-2 uppercase tracking-wide"
                aria-label="Página anterior"
              >
                <ChevronLeft aria-hidden="true" /> Anterior
              </button>

              <div className="flex flex-col items-center gap-2">
                <span
                  className="font-medium text-center uppercase tracking-wide"
                  aria-live="polite"
                >
                  Página {currentPage} de {numPages || '?'}
                </span>
                <button
                  onClick={() => window.open(selectedPDF.blobUrl, '_blank')}
                  className="bg-[#0a2a43] text-white px-6 py-2 uppercase tracking-wide"
                  aria-label="Abrir PDF em nova aba para impressão"
                >
                  Imprimir 🖨️
                </button>
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))}
                className="bg-[#0a2a43] text-white px-6 py-2 uppercase tracking-wide"
                aria-label="Próxima página"
              >
                Próxima <ChevronRight aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </main>
  );
}
