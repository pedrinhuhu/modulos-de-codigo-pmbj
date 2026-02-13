import { Routes, Route } from 'react-router-dom'
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { SkipNavigation } from './components/SkipNavigation/SkipNavigation';
import { BarraTopo } from './components/BarraTopo/BarraTopo';
import { Cabecalho } from './components/Cabecalho/Cabecalho';
import { PDFCardSystem } from './components/PDFCardSystem/PDFCardSystem';
import { Rodape } from './components/Rodape/Rodape';
import { Acessibilidade } from './components/Acessibilidade/Acessibilidade';
import { Login } from './components/TelaUser/Login';
import { TelaPDFs } from './components/TelaUser/TelaPDFs';
import { RotaPrivada } from './routes/RotaPrivada';
import { PagAcess } from './components/Acessibilidade/paginaAcessibilidade';
import './App.css';

export function App() {
  return (
    <AccessibilityProvider>
      <SkipNavigation />
      <BarraTopo />
      <Cabecalho />
      <Routes>
        <Route path="/" element={<PDFCardSystem />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pdfs" element={<RotaPrivada><TelaPDFs /></RotaPrivada>}/>
        <Route path="/acessibilidade" element={<PagAcess />}>
        </Route>
      </Routes>
      <Acessibilidade />
      <Rodape />
    </AccessibilityProvider>
  );
}
