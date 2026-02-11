import { useState } from 'react';

export function Pesquisa({ onSearch }) {
  const [query, setQuery] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');

  return (
    <section
      className="mb-16 bg-[#fffdfa] border border-gray-400 p-10 shadow-inner"
      aria-label="Formulário de pesquisa oficial"
    >
      <h2
        className="text-2xl font-[Cinzel] uppercase tracking-[0.25em] mb-8 text-[#0a2a43] border-b pb-4"
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
          className="flex-1 px-5 py-4 border border-gray-500 bg-[#fdfcf9] font-serif"
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
          className="flex-1 px-5 py-4 border border-gray-500 bg-[#fdfcf9] font-serif"
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
          className="flex-1 px-5 py-4 border border-gray-500 bg-[#fdfcf9] font-serif"
          aria-label="Campo de pesquisa por texto"
        />

        {/* Botão */}
        <button
          type="button"
          onClick={() => onSearch(query, mes, ano)}
          className="bg-[#0a2a43] text-white px-10 py-4 uppercase tracking-[0.2em] text-sm border border-[#c9a227]"
          aria-label="Executar pesquisa"
        >
          Pesquisar
        </button>
      </div>
    </section>
  );
}
