import { useState } from 'react';

export function Pesquisa({ onSearch }) {
  const [query, setQuery] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');

  return (
    <section
      className="mb-16 bg-white border border-gray-200 p-10 shadow-sm rounded-lg"
      aria-label="Formulário de pesquisa oficial"
    >
      <h2
        className="text-2xl font-sans font-semibold tracking-normal mb-8 text-[#1351B4] border-b border-gray-200 pb-4"
        id="titulo-pesquisa"
      >
        Pesquisa
      </h2>

      <div className="flex gap-4" role="search" aria-labelledby="titulo-pesquisa">
        
        {/* Ano */}
        <label htmlFor="pesquisa-ano" className="sr-only">
          Filtrar por ano
        </label>
        <input
          id="pesquisa-ano"
          type="number"
          placeholder="Ano"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-[#1351B4] transition"
          aria-label="Filtrar por ano"
          min="1900"
          max="2100"
        />

        {/* Mês */}
        <label htmlFor="pesquisa-mes" className="sr-only">
          Filtrar por mês
        </label>
        <select
          id="pesquisa-mes"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 bg-white rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-[#1351B4] transition"
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

        {/* Texto */}
        <label htmlFor="pesquisa-texto" className="sr-only">
          Pesquisar no conteúdo dos atos
        </label>
        <input
          id="pesquisa-texto"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar no conteúdo dos atos"
          className="flex-1 px-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-[#1351B4] transition"
          aria-label="Campo de pesquisa por texto"
        />

        {/* Botão */}
        <button
          type="button"
          onClick={() => onSearch(query, mes, ano)}
          className="bg-[#1351B4] text-white px-8 py-3 tracking-normal text-sm font-semibold rounded-lg cursor-pointer hover:bg-[#0c3c8c] transition focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
          aria-label="Executar pesquisa"
        >
          Pesquisar
        </button>
      </div>
    </section>
  );
}