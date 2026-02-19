/**
 * @module storage
 * @description Wrapper simples de `localStorage` para persistência de PDFs.
 */

/**
 * @function setPdf
 * @description Insere ou atualiza um PDF na lista salva em `localStorage["pdfs"]`.
 * Gera `id` e `createdAt` automaticamente se ausentes.
 * @param {import('./pdf').PDF} pdf - PDF a ser salvo ou atualizado
 * @returns {Promise<void>}
 */
export async function setPdf(pdf) {
  const existing = JSON.parse(localStorage.getItem("pdfs") || "[]");

  if (!pdf.id) {
    pdf.id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  pdf.createdAt = pdf.createdAt || Date.now();

  // Atualiza se já existe, senão adiciona ao final
  const index = existing.findIndex(p => p.id === pdf.id);
  if (index >= 0) {
    existing[index] = pdf;
  } else {
    existing.push(pdf);
  }

  localStorage.setItem("pdfs", JSON.stringify(existing));
}

/**
 * @function getPdf
 * @description Retorna todos os PDFs salvos em `localStorage["pdfs"]`.
 * @returns {Promise<import('./pdf').PDF[]>} Lista de PDFs ou array vazio se não houver dados
 */
export async function getPdf() {
  return JSON.parse(localStorage.getItem("pdfs") || "[]");
}