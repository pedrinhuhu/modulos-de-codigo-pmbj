
        <div className="mb-6 flex justify-between items-center">
          <label
            htmlFor="pdfUpload"
            className="bg-[#0a2a43] text-white px-10 py-4 uppercase tracking-[0.2em] text-sm border border-[#c9a227] cursor-pointer inline-block"
            aria-label="Adicionar novos arquivos PDF"
          >
            Adicionar PDF
          </label>

          <input
            id="pdfUpload"
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Selecionar arquivos PDF para upload"
          />
        </div>