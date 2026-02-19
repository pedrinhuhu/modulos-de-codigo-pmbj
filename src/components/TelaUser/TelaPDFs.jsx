import { useNavigate } from "react-router-dom";
import { PDFCardSystem } from "../PDFCardSystem/PDFCardSystem";

/**
 * @component TelaPDFs
 * @description Tela administrativa de gerenciamento de PDFs.
 * Renderiza o `PDFCardSystem` em modo `admin` e disponibiliza a função de logout.
 * @returns {JSX.Element}
 */
export function TelaPDFs() {
  const navigate = useNavigate();

  /**
   * @function logout
   * @description Remove a chave `"logado"` do `localStorage` e redireciona para `/login`.
   * @returns {void}
   */
  function logout() {
    localStorage.removeItem("logado");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-white">
      <PDFCardSystem mode="admin" />
    </div>
  );
}