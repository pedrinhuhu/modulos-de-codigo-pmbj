import { useNavigate } from "react-router-dom";
import { PDFCardSystem } from "../PDFCardSystem/PDFCardSystem";

export function TelaPDFs() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("logado");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 flex justify-end">
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </div>

      <PDFCardSystem mode="admin" />
    </div>
  );
}
