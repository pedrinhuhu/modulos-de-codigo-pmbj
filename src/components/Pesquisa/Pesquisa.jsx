import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/** Tags disponíveis para filtro avançado, agrupadas por categoria */
const TAGS = {
  "Tipo de Ato": [
    { id: "portaria", label: "#portaria" },
    { id: "decreto", label: "#decreto" },
    { id: "edital", label: "#edital" },
    { id: "contrato", label: "#contrato" },
    { id: "lei", label: "#lei" },
    { id: "extrato", label: "#extrato" },
    { id: "aviso", label: "#aviso" },
    { id: "resolucao", label: "#resolução" },
  ],
  "Área Temática": [
    { id: "saude", label: "#saúde" },
    { id: "educacao", label: "#educação" },
    { id: "assistencia-social", label: "#assistência-social" },
    { id: "infraestrutura", label: "#infraestrutura" },
    { id: "financeiro", label: "#financeiro" },
    { id: "cultura-esporte", label: "#cultura-esporte" },
    { id: "meio-ambiente", label: "#meio-ambiente" },
    { id: "habitacao", label: "#habitação" },
  ],
  "Pessoal e RH": [
    { id: "nomeacao", label: "#nomeação" },
    { id: "exoneracao", label: "#exoneração" },
    { id: "aposentadoria", label: "#aposentadoria" },
    { id: "cessao", label: "#cessão" },
    { id: "licenca", label: "#licença" },
    { id: "concurso", label: "#concurso" },
  ],
  "Licitações": [
    { id: "pregao", label: "#pregão" },
    { id: "registro-precos", label: "#registro-de-preços" },
    { id: "dispensa", label: "#dispensa" },
    { id: "resultado", label: "#resultado" },
    { id: "aditivo", label: "#aditivo" },
  ],
};

/**
 * @component Pesquisa
 * @description Formulário de pesquisa com filtros por ano, mês, texto livre
 * e pesquisa avançada por tags. Ao submeter, chama `onSearch` com todos os filtros.
 *
 * @param {Object} props
 * @param {(query: string, mes: string, ano: string, tags: string[]) => void} props.onSearch
 * @returns {JSX.Element}
 */
export function Pesquisa({ onSearch }) {
  const [query, setQuery] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');

  /** @type {[string[], Function]} Tags selecionadas para filtro avançado */
  const [selectedTags, setSelectedTags] = useState([]);

  /** @type {[boolean, Function]} Controla visibilidade do painel de tags */
  const [avancado, setAvancado] = useState(false);

  const toggleTag = (id) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const limparTags = () => setSelectedTags([]);

  const limparTudo = () => {
    setQuery('');
    setMes('');
    setAno('');
    setSelectedTags([]);
    onSearch('', '', '', []);
  };

  const temFiltrosAtivos = query || mes || ano || selectedTags.length > 0;

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(query, mes, ano, selectedTags);
  }

  return (
    <section
      className="mb-16 bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden"
      aria-label="Formulário de pesquisa oficial"
    >
      <div className="p-6 md:p-10">
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

          {temFiltrosAtivos && (
            <button
              type="button"
              onClick={limparTudo}
              className="w-full md:w-auto px-8 py-3 text-sm font-semibold rounded-lg border border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500 transition focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
              aria-label="Remover todos os filtros"
            >
              Limpar tudo
            </button>
          )}
        </form>

        {/* Botão para expandir pesquisa avançada por tags */}
        <button
          type="button"
          onClick={() => setAvancado((v) => !v)}
          className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-[#1351B4] hover:text-[#0c3c8c] transition focus:outline-none focus:ring-2 focus:ring-[#1351B4] rounded"
          aria-expanded={avancado}
          aria-controls="pesquisa-avancada"
        >
          {avancado ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          Pesquisa avançada por tags
          {selectedTags.length > 0 && (
            <span className="ml-1 bg-[#1351B4] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {selectedTags.length}
            </span>
          )}
        </button>
      </div>

      {/* Painel de tags — expande/recolhe */}
      {avancado && (
        <div
          id="pesquisa-avancada"
          className="border-t border-gray-100 px-6 md:px-10 py-6 bg-gray-50"
          aria-label="Filtro avançado por tags"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-600">
              Filtrar por tags
            </p>
            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={limparTags}
                className="text-xs text-gray-400 hover:text-red-500 transition focus:outline-none focus:ring-2 focus:ring-[#1351B4] rounded"
                aria-label="Limpar todas as tags selecionadas"
              >
                Limpar filtros
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4" role="group" aria-label="Grupos de tags para filtro">
            {Object.entries(TAGS).map(([group, tags]) => (
              <div key={group}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                  {group}
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label={`Tags do grupo ${group}`}>
                  {tags.map((tag) => {
                    const active = selectedTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        aria-pressed={active}
                        aria-label={`Filtrar por ${tag.label}${active ? ", ativo" : ""}`}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-[#1351B4]
                          ${active
                            ? "bg-[#1351B4] text-white border-[#1351B4]"
                            : "bg-white text-gray-600 border-gray-300 hover:border-[#1351B4] hover:text-[#1351B4]"
                          }`}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Tags selecionadas ativas */}
          {selectedTags.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-400 mb-2">Filtrando por:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((id) => {
                  const tag = Object.values(TAGS).flat().find((t) => t.id === id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleTag(id)}
                      className="flex items-center gap-1 px-3 py-1 bg-[#1351B4] text-white text-xs font-semibold rounded-full hover:bg-red-500 transition focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
                      aria-label={`Remover filtro ${tag?.label}`}
                    >
                      {tag?.label} ×
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botão de aplicar filtros de tags */}
          <button
            type="button"
            onClick={() => onSearch(query, mes, ano, selectedTags)}
            className="mt-5 bg-[#1351B4] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0c3c8c] transition focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
            aria-label="Aplicar filtros de tags"
          >
            Aplicar filtros
          </button>
        </div>
      )}
    </section>
  );
}