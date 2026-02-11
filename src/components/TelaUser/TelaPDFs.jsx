import { useNavigate } from "react-router-dom";


export function TelaPDFs() {

  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("logado");
    navigate("/login");
  }

  const handleFileUpload = (event) => {
    const files = event.target.files;
    console.log(files);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">

    <div className="p-6">
      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Sair
      </button>
    </div>

      <h1 className="text-3xl font-bold mb-6">
        Adicionar, editar e remover PDFs
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <label
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-blue-700 focus-within:ring-2 focus-within:ring-blue-600"
          tabIndex={0}
          aria-label="Adicionar novo PDF"
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

    </div>
  );
}