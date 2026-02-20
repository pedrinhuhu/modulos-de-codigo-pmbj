import { Routes, Route } from 'react-router-dom'
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { SkipNavigation } from './components/SkipNavigation/SkipNavigation';
import { BarraTopo } from './components/BarraTopo/BarraTopo';
import { Cabecalho } from './components/Cabecalho/Cabecalho';
import { PDFCardSystem } from './components/PDFCardSystem/PDFCardSystem';
import { Rodape } from './components/Rodape/Rodape';
import { Acessibilidade } from './components/Acessibilidade/Acessibilidade';
import { Login } from './components/TelaUser/Login';
import { TelaAdmin } from './components/TelaAdmin/TelaAdmin';
import { RotaPrivada } from './routes/RotaPrivada';
import { PaginaAcessibilidade } from './components/Acessibilidade/PaginaAcessibilidade';
import './App.css';

/**
 * @component App
 * @description Componente raiz da aplicação. Define o layout global e as rotas:
 *
 * | Rota              | Componente          | Acesso   |
 * |-------------------|---------------------|----------|
 * | `/`               | PDFCardSystem        | Público  |
 * | `/login`          | Login                | Público  |
 * | `/admin`          | TelaAdmin            | Privado  |
 * | `/acessibilidade` | PaginaAcessibilidade | Público  |
 *
 * O layout global (SkipNavigation, BarraTopo, Cabecalho, Acessibilidade, Rodape)
 * é compartilhado entre todas as rotas.
 *
 * @returns {JSX.Element}
 */
export function App() {
  return (
    <AccessibilityProvider>
      <SkipNavigation />
      <BarraTopo />
      <Cabecalho />
      <Routes>
        <Route path="/" element={<PDFCardSystem />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<RotaPrivada><TelaAdmin /></RotaPrivada>} />
        <Route path="/acessibilidade" element={<PaginaAcessibilidade />} />
      </Routes>
      <Acessibilidade />
      <Rodape />
    </AccessibilityProvider>
  );
}