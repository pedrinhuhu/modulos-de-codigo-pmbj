// Simple localStorage wrapper for storing PDFs

export async function setPdf(pdf) {
  const existing = JSON.parse(localStorage.getItem("pdfs") || "[]");

  if (!pdf.id) {
    pdf.id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  pdf.createdAt = pdf.createdAt || Date.now();

  // Update or insert
  const index = existing.findIndex(p => p.id === pdf.id);
  if (index >= 0) {
    existing[index] = pdf;
  } else {
    existing.push(pdf);
  }

  localStorage.setItem("pdfs", JSON.stringify(existing));
}

export async function getPdf() {
  return JSON.parse(localStorage.getItem("pdfs") || "[]");
}

/* ===============================
   ✅ REMOVER PDF (NOVA FUNÇÃO)
================================ */
export async function removePdf(id) {
  const existing = JSON.parse(localStorage.getItem("pdfs") || "[]");
  const updated = existing.filter(pdf => pdf.id !== id);
  localStorage.setItem("pdfs", JSON.stringify(updated));
}
