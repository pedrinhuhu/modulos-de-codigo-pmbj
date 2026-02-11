import { Navigate } from "react-router-dom";

export function RotaPrivada({ children }) {
  const logado = localStorage.getItem("logado");

  return logado ? children : <Navigate to="/" replace />;
}