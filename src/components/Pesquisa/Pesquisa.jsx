import { useState } from 'react';

/**
 * @component Pesquisa
 * @description Formulário de pesquisa com filtros por ano, mês e texto livre.
 * Ao submeter, chama `onSearch` com os três valores.
 *
 * @param {Object} props
 * @param {(query: string, mes: string, ano: string) => void} props.onSearch - Callback disparado ao submeter o formulário
 * @returns {JSX.Element}
 */
export function Pesquisa({ onSearch }) {
  /** @type {[string, Function]} Texto livre para busca no conteúdo dos atos */
  const [query, setQuery] = useState('');

  /** @type {[string, Function]} Mês selecionado (1–12) ou vazio para todos */
  const [mes, setMes] = useState('');

  /** @type {[string, Function]} Ano digitado ou vazio para todos */
  const [ano, setAno] = useState('');

  /**
   * @function handleSubmit
   * @description Previne o comportamento padrão do form e dispara `onSearch`
   * com os filtros atuais.
   * @param {React.FormEvent<HTMLFormElement>} e
   * @returns {void}
   */
  function handleSubmit(e) {
    e.preventDefault();
    onSearch(query, mes, ano);
  }

  return (
    <section
      className="mb-16 bg-white border border-gray-200 p-6 md:p-10 shadow-sm rounded-lg"
      aria-label="Formulário de pesquisa oficial"
    >
      <h2
        className="text-xl md:text-2xl font-sans font-semibold tracking-normal mb-6 md:mb-8 text-[#1351B4] border-b border-gray-200 pb-4"
        id="titulo-pesquisa"
      >
        Pesquisa Oficial
      </h2>

      <form
        className="flex flex-col md:flex-row gap-3 md:gap-4"
        role="search"
        aria-labelledby="titulo-pesquisa"
        onSubmit={handleSubmit}
      >
        <label htmlFor="pesquisa-ano" className="sr-only">Filtrar por ano</label>
        <input
          id="pesquisa-ano"
          type="number"
          placeholder="Ano"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          className="w-full md:flex-1 px-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-[#1351B4] transition"
          aria-label="Filtrar por ano"
          min="1900"
          max="2100"
        />

        <label htmlFor="pesquisa-mes" className="sr-only">Filtrar por mês</label>
        <select
          id="pesquisa-mes"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="w-full md:flex-1 px-4 py-3 border border-gray-300 bg-white rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-[#1351B4] transition"
          aria-label="Filtrar por mês"
        >
          <option value="">Todos</option>
          {[
            'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
            'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
          ].map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>

        <label htmlFor="pesquisa-texto" className="sr-only">Pesquisar no conteúdo dos atos</label>
        <input
          id="pesquisa-texto"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar no conteúdo dos atos"
          className="w-full md:flex-1 px-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-[#1351B4] transition"
          aria-label="Campo de pesquisa por texto"
        />

        <button
          type="submit"
          className="w-full md:w-auto bg-[#1351B4] text-white px-8 py-3 tracking-normal text-sm font-semibold rounded-lg cursor-pointer hover:bg-[#0c3c8c] transition focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
          aria-label="Executar pesquisa"
        >
          Pesquisar
        </button>
      </form>
    </section>
  );
}