import { Navigate } from "react-router-dom";

/**
 * @component RotaPrivada
 * @description Guarda de rota que verifica a chave `"logado"` no `localStorage`.
 * Renderiza os filhos se autenticado, ou redireciona para `/` caso contrário.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo exibido se o usuário estiver logado
 * @returns {JSX.Element}
 */
export function RotaPrivada({ children }) {
  const logado = localStorage.getItem("logado");

  return logado ? children : <Navigate to="/" replace />;
}