import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { SkipNavigation } from './components/SkipNavigation/SkipNavigation';
import { BarraTopo } from './components/BarraTopo/BarraTopo';
import { Cabecalho } from './components/Cabecalho/Cabecalho';
import { PDFCardSystem } from './components/PDFCardSystem/PDFCardSystem';
import { Rodape } from './components/Rodape/Rodape';
import { Acessibilidade } from './components/Acessibilidade/Acessibilidade';
import { Login } from './components/TelaUser/Login';
import { TelaPDFs } from './components/TelaUser/TelaPDFs';
import './App.css';

function App() {
  return (
    <AccessibilityProvider>
      <SkipNavigation />
      <BarraTopo />
      <Cabecalho />
      <PDFCardSystem />
      <Rodape />
      <Acessibilidade />
      <Login />
      <TelaPDFs />
    </AccessibilityProvider>
  );
}

export default App;