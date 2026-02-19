import * as pdfjsLib from "pdfjs-dist";

/**
 * @function extractTextFromPDF
 * @description Extrai todo o texto de um PDF (base64 ou URL) página por página
 * usando a `pdfjs-dist`. O texto de cada página é separado por `\n`.
 * @param {string} dataUrl - URL ou string base64 do arquivo PDF
 * @returns {Promise<string>} Texto completo extraído do PDF
 */
export async function extractTextFromPDF(dataUrl) {
  const loadingTask = pdfjsLib.getDocument(dataUrl);
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
}

/**
 * @function enrichPdf
 * @description Converte a `url` base64 de um PDF em um `Blob` e gera uma
 * `blobUrl` via `URL.createObjectURL` para uso no visualizador.
 * Retorna o objeto original sem alterações se `url` estiver ausente.
 * @param {import('./pdf').PDF} pdf - Instância de PDF com `url` em base64
 * @returns {import('./pdf').PDF & { blob: Blob, blobUrl: string }} PDF enriquecido com `blob` e `blobUrl`
 */
export function enrichPdf(pdf) {
  if (!pdf.url) return pdf;

  const arr = pdf.url.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);

  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  const blob = new Blob([u8arr], { type: mime });

  return {
    ...pdf,
    blob,
    blobUrl: URL.createObjectURL(blob)
  };
}