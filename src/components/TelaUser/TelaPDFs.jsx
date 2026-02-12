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
      <PDFCardSystem mode="admin" />
    </div>
  );
}
