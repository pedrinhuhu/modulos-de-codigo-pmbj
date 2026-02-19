import { createContext, useContext, useState, useEffect } from 'react';

/**
 * @typedef {Object} AccessibilityContextValue
 * @property {boolean} highContrast - Indica se o alto contraste está ativo
 * @property {Function} setHighContrast - Alterna o alto contraste
 * @property {number} fontSize - Tamanho atual da fonte em px (min: 12, max: 24)
 * @property {Function} setFontSize - Atualiza o tamanho da fonte
 */

/** @type {React.Context<AccessibilityContextValue>} */
const AccessibilityContext = createContext();

/**
 * @component AccessibilityProvider
 * @description Provedor de contexto de acessibilidade. Persiste `highContrast` e
 * `fontSize` no `localStorage` e os aplica ao `document` via atributo
 * `data-theme` e `style.fontSize`.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function AccessibilityProvider({ children }) {
  /** @type {[boolean, Function]} Alto contraste — persiste em `localStorage` e define `data-theme` no `<html>` */
  const [highContrast, setHighContrast] = useState(false);

  /** @type {[number, Function]} Tamanho da fonte — persiste em `localStorage` e define `fontSize` no `<html>` */
  const [fontSize, setFontSize] = useState(16);

  // Restaura preferências salvas no localStorage ao montar
  useEffect(() => {
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = localStorage.getItem('fontSize');

    if (savedContrast) setHighContrast(true);
    if (savedFontSize) setFontSize(Number(savedFontSize));
  }, []);

  // Aplica/remove `data-theme="high-contrast"` no <html> e persiste no localStorage
  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-theme', 'high-contrast');
      localStorage.setItem('highContrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('highContrast', 'false');
    }
  }, [highContrast]);

  // Aplica o tamanho da fonte no <html> e persiste no localStorage
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  return (
    <AccessibilityContext.Provider value={{ highContrast, setHighContrast, fontSize, setFontSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

/**
 * @function useAccessibility
 * @description Hook para consumir o `AccessibilityContext`.
 * @throws {Error} Se usado fora de `AccessibilityProvider`
 * @returns {AccessibilityContextValue}
 */
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}