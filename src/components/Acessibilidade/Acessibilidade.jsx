import { useState } from 'react';
import { Accessibility, Plus, Minus } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import './Acessibilidade.css';

export function Acessibilidade() {
  const [showMenu, setShowMenu] = useState(false);
  const { highContrast, setHighContrast, fontSize, setFontSize } = useAccessibility();

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const handleTheme = (theme) => {
    setHighContrast(theme === "high-contrast");
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        className="fixed bottom-6 right-6 flex flex-col items-center justify-center border-4 rounded-full bg-blue-600 border-white text-white w-16 h-16 z-50 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
        onClick={() => setShowMenu(v => !v)}
        aria-label={showMenu ? "Fechar menu de acessibilidade" : "Abrir menu de acessibilidade"}
        aria-expanded={showMenu}
        aria-controls="accessibility-menu"
      >
        <Accessibility size={32} aria-hidden="true" />
      </button>

      {showMenu && (
        <aside
          id="accessibility-menu"
          className="fixed bottom-24 right-6 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-6 w-80 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-acessibilidade"
        >
          <h2
            id="titulo-acessibilidade"
            className="text-xl font-bold mb-4"
          >
            Acessibilidade
          </h2>

          {/* Tamanho da fonte */}
          <section
            className="mb-5"
            aria-labelledby="font-size-label"
          >
            <h3
              id="font-size-label"
              className="block text-sm font-medium mb-2"
            >
              Tamanho da fonte
            </h3>

            <div className="flex gap-2 items-center">
              <button
                onClick={decreaseFontSize}
                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 flex items-center gap-1"
                aria-label="Diminuir tamanho da fonte"
              >
                <Minus size={14} aria-hidden="true" /> A
              </button>

              <span
                className="px-4 py-2 bg-gray-100 rounded text-center min-w-15"
                aria-live="polite"
                aria-atomic="true"
                aria-label="Tamanho atual da fonte"
              >
                {fontSize}px
              </span>

              <button
                onClick={increaseFontSize}
                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 flex items-center gap-1"
                aria-label="Aumentar tamanho da fonte"
              >
                <Plus size={14} aria-hidden="true" /> A
              </button>

              <button
                onClick={() => setFontSize(16)}
                className={`px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  fontSize === 16
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label="Redefinir tamanho da fonte para o padrão"
                aria-pressed={fontSize === 16}
              >
                Redefinir
              </button>
            </div>
          </section>

          {/* Contraste */}
          <section
            className="mb-5"
            aria-labelledby="theme-label"
          >
            <h3
              id="theme-label"
              className="block text-sm font-medium mb-2"
            >
              Contraste
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => handleTheme("default")}
                className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  !highContrast
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label="Ativar contraste padrão"
                aria-pressed={!highContrast}
              >
                Padrão
              </button>

              <button
                onClick={() => handleTheme("high-contrast")}
                className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  highContrast
                    ? 'bg-black text-yellow-400 border-2 border-yellow-400'
                    : 'bg-black text-yellow-400 hover:bg-gray-900'
                }`}
                aria-label="Ativar alto contraste"
                aria-pressed={highContrast}
              >
                Alto Contraste
              </button>
            </div>
          </section>

          <div className="pt-4 border-t">
            <p
              className="text-xs text-gray-600"
              aria-live="polite"
            >
              As configurações são salvas automaticamente
            </p>
          </div>
        </aside>
      )}
    </>
  );
}
