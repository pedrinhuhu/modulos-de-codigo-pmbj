import { useState, useRef } from 'react';
import { Accessibility, Plus, Minus } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import './Acessibilidade.css';

/**
 * @component Acessibilidade
 * @description Botão flutuante que abre um menu com controles de acessibilidade:
 * tamanho de fonte, contraste e leitor de tela.
 * Em mobile, o tamanho máximo da fonte é limitado a 18px para evitar quebra de layout.
 * @requires AccessibilityProvider
 */
export function Acessibilidade() {
  /** @type {boolean} Controla a visibilidade do menu */
  const [showMenu, setShowMenu] = useState(false);

  const { highContrast, setHighContrast, fontSize,
    setFontSize, screenReader, setScreenReader } = useAccessibility();

  /** @type {React.MutableRefObject<Function|null>} Referência ao listener de `focusin` do leitor de tela */
  const focusHandler = useRef(null);

  /** @type {number} Limite máximo de fonte: 18px em mobile, 24px em desktop */
  const maxFontSize = window.innerWidth < 768 ? 18 : 24;

  /**
   * @description Aumenta a fonte em 2px respeitando o limite do dispositivo.
   * @returns {void}
   */
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, maxFontSize));
  };

  /**
   * @description Diminui a fonte em 2px. Mínimo: 12px.
   * @returns {void}
   */
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  /**
   * @description Alterna entre tema padrão e alto contraste.
   * @param {"default" | "high-contrast"} theme
   * @returns {void}
   */
  const handleTheme = (theme) => {
    setHighContrast(theme === "high-contrast");
  };

  /**
   * @description Ativa ou desativa o leitor de tela.
   * @param {"screen-reader" | "off"} reader
   * @returns {void}
   */
  const handleScreenReader = (reader) => {
    const isOn = reader === "screen-reader";
    if (isOn) loadReader();
    else unLoadReader();
    setScreenReader(isOn);
  };

  /**
   * @description Registra listener global de `focusin` para narrar o elemento focado.
   * Prioridade de leitura: `aria-label` → `innerText` → `placeholder`.
   * Evita registro duplicado via `focusHandler.current`.
   * @returns {void}
   */
  function loadReader() {
    if (focusHandler.current) return;

    const handler = (e) => {
      if (!e || !e.target) return;
      const target = e.target;
      const texto = target.getAttribute('aria-label') ||
        target.innerText ||
        target.placeholder;
      if (texto && texto.trim()) falar(texto.trim());
    };

    document.addEventListener('focusin', handler);
    focusHandler.current = handler;
  }

  /**
   * @description Remove o listener de `focusin` e limpa a referência.
   * @returns {void}
   */
  function unLoadReader() {
    if (!focusHandler.current) return;
    document.removeEventListener('focusin', focusHandler.current);
    focusHandler.current = null;
  }

  /**
   * @description Narra um texto via Web Speech API em pt-BR.
   * @param {string} texto
   * @returns {void}
   */
  function falar(texto) {
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = 'pt-BR';
    speechSynthesis.speak(fala);
  }

  return (
    <>
      <button
        className="fixed bottom-6 right-6 flex flex-col items-center justify-center border-4 rounded-full bg-[#1351B4] border-white text-white w-16 h-16 z-50 hover:bg-[#0c3c8c] focus:outline-none focus:ring-4 focus:ring-[#1351B4] shadow-lg cursor-pointer transition"
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
          className="fixed bottom-24 right-4 md:right-6 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-6 w-[calc(100vw-2rem)] md:w-80 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-acessibilidade"
        >
          <h2
            id="titulo-acessibilidade"
            className="text-xl font-semibold mb-4 text-[#1351B4]"
          >
            Acessibilidade
          </h2>

          {/* Tamanho da fonte */}
          <section className="mb-5" aria-labelledby="font-size-label">
            <h3
              id="font-size-label"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Tamanho da fonte
              {window.innerWidth < 768 && (
                <span className="ml-2 text-xs text-gray-400">(máx. {maxFontSize}px no mobile)</span>
              )}
            </h3>

            <div className="flex gap-2 items-center">
              <button
                onClick={decreaseFontSize}
                className="cursor-pointer px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1351B4] flex items-center gap-1 transition"
                aria-label="Diminuir tamanho da fonte"
              >
                <Minus size={14} aria-hidden="true" /> A
              </button>

              <span
                className="px-4 py-2 bg-gray-50 rounded-lg text-center min-w-15 font-medium"
                aria-live="polite"
                aria-atomic="true"
                aria-label="Tamanho atual da fonte"
              >
                {fontSize}px
              </span>

              <button
                onClick={increaseFontSize}
                disabled={fontSize >= maxFontSize}
                className="cursor-pointer px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1351B4] flex items-center gap-1 transition disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Aumentar tamanho da fonte"
              >
                <Plus size={14} aria-hidden="true" /> A
              </button>

              <button
                onClick={() => setFontSize(16)}
                className={`cursor-pointer px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1351B4] transition ${
                  fontSize === 16
                    ? 'bg-[#1351B4] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                aria-label="Redefinir tamanho da fonte para o padrão"
                aria-pressed={fontSize === 16}
              >
                Redefinir
              </button>
            </div>
          </section>

          {/* Contraste */}
          <section className="mb-5" aria-labelledby="theme-label">
            <h3
              id="theme-label"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Contraste
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => handleTheme("default")}
                className={`cursor-pointer px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1351B4] transition ${
                  !highContrast
                    ? 'bg-[#1351B4] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                aria-label="Ativar contraste padrão"
                aria-pressed={!highContrast}
              >
                Padrão
              </button>

              <button
                onClick={() => handleTheme("high-contrast")}
                className={`cursor-pointer px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  highContrast
                    ? 'bg-black text-yellow-400 border-2 border-yellow-400'
                    : 'bg-black text-yellow-400 hover:bg-gray-800'
                }`}
                aria-label="Ativar alto contraste"
                aria-pressed={highContrast}
              >
                Alto Contraste
              </button>
            </div>
          </section>

          {/* Leitor de Tela */}
          <section className="mb-5" aria-labelledby="screen-reader-label">
            <h3
              id="screen-reader-label"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Leitor de Tela
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => handleScreenReader("screen-reader")}
                className={`cursor-pointer px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1351B4] transition ${
                  screenReader
                    ? 'bg-[#1351B4] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                aria-label="Ativar leitor de tela"
                aria-pressed={screenReader}
              >
                Ligado
              </button>

              <button
                onClick={() => handleScreenReader("off")}
                className={`cursor-pointer px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1351B4] transition ${
                  !screenReader
                    ? 'bg-[#1351B4] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                aria-label="Desativar leitor de tela"
                aria-pressed={!screenReader}
              >
                Desligado
              </button>
            </div>
          </section>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500" aria-live="polite">
              As configurações são salvas automaticamente
            </p>
          </div>
        </aside>
      )}
    </>
  );
}