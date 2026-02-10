        <div className="mb-6 flex justify-between items-center">
          <label 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold cursor-pointer focus-within:ring-2 focus-within:ring-blue-600"
            tabIndex={0}
          >
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Selecionar arquivos PDF para adicionar"
            />
            Adicionar PDF
          </label>
        </div>