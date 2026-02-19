import { getPdf } from '../../utils/storage';

/**
 * @component DadosAbertos
 * @description Seção que exibe botões para exportar os dados dos PDFs cadastrados
 * nos formatos JSON, CSV e TXT.
 * @returns {JSX.Element}
 */
export function DadosAbertos() {
  return (
    <section className="mb-3 bg-white border border-gray-200 p-10 shadow-sm rounded-lg justify-center items-center" aria-label="Seção de Dados Abertos">
      <h2 className="text-2xl font-sans font-semibold tracking-normal mb-8 text-[#1351B4] border-b border-gray-200 pb-4" aria-label="Seção de Dados Abertos">
        Dados Abertos
      </h2>
      <div className="flex gap-4">
        {['json', 'csv', 'txt'].map(t => (
          <button
            key={t}
            onClick={() => exportPDFs(t)}
            className="bg-[#1351B4] text-white px-6 py-3 tracking-normal text-sm font-semibold rounded-lg cursor-pointer hover:bg-[#0c3c8c] transition focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
            aria-label={`Exportar dados em formato ${t}`}
          >
            Exportar {t.toUpperCase()}
          </button>
        ))}
      </div>
    </section>
  );
}

/**
 * @function exportPDFs
 * @description Busca todos os PDFs via `getPdf()`, filtra apenas os campos públicos
 * e dispara o download do arquivo no formato solicitado.
 * Campos exportados: `id`, `titulo`, `descricao`, `edicao`, `data`, `createdAt`, `mes`, `ano`.
 * @param {"json" | "csv" | "txt"} type - Formato do arquivo de exportação
 * @returns {void}
 */
function exportPDFs(type) {
  getPdf().then(pdfs => {
    let dataStr;
    let mimeType;

    const pdfsExported = pdfs.map(({ id, titulo, descricao, edicao, data, createdAt, mes, ano }) =>
      ({ id, titulo, descricao, edicao, data, createdAt, mes, ano }));

    if (type === 'json') {
      dataStr = JSON.stringify(pdfsExported, null, 2);
      mimeType = 'application/json';
    } else if (type === 'csv') {
      const headers = ['id', 'titulo', 'descricao', 'edicao', 'data', 'createdAt', 'mes', 'ano'];
      const rows = pdfsExported.map(pdf =>
        headers.map(header => `"${(pdf[header] || '').toString().replace(/"/g, '""')}"`).join(',')
      );
      dataStr = [headers.join(','), ...rows].join('\n');
      mimeType = 'text/csv';
    } else if (type === 'txt') {
      dataStr = JSON.stringify(pdfsExported);
      mimeType = 'text/plain';
    } else {
      return;
    }

    // Cria um link temporário no DOM para acionar o download e o remove em seguida
    const blob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diario_oficial_export.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}