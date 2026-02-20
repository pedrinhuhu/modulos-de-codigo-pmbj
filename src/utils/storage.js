/**
 * @module storage
 * @description Wrapper de IndexedDB para persistência de PDFs.
 * Substitui o localStorage, que tem limite de ~5MB e não comporta PDFs em base64.
 */

const DB_NAME = "diario-oficial";
const DB_VERSION = 1;
const STORE_NAME = "pdfs";

/**
 * @function openDB
 * @description Abre (ou cria) o banco IndexedDB.
 * @returns {Promise<IDBDatabase>}
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * @function setPdf
 * @description Insere ou atualiza um PDF no IndexedDB.
 * Gera `id` e `createdAt` automaticamente se ausentes.
 * @param {import('./pdf').PDF} pdf - PDF a ser salvo ou atualizado
 * @returns {Promise<void>}
 */
export async function setPdf(pdf) {
  if (!pdf.id) {
    pdf.id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  pdf.createdAt = pdf.createdAt || new Date().toISOString();

  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(pdf);

    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * @function getPdf
 * @description Retorna todos os PDFs salvos no IndexedDB.
 * @returns {Promise<import('./pdf').PDF[]>} Lista de PDFs ou array vazio
 */
export async function getPdf() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (e) => resolve(e.target.result || []);
    request.onerror = (e) => reject(e.target.error);
  });
}