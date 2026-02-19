/**
 * @class PDF
 * @description Representa uma edição do Diário Oficial em PDF.
 */
export class PDF {
  /**
   * @param {string} titulo - Nome do arquivo
   * @param {string} descricao - Descrição da edição (ex: "Edição Nº 42")
   * @param {string|null} url - URL ou base64 do arquivo PDF
   * @param {string} textoExtraido - Texto extraído do PDF para pesquisa
   * @param {number} edicao - Número sequencial da edição
   * @param {Date} data - Data de publicação
   */
  constructor(titulo, descricao, url, textoExtraido, edicao, data) {
    /** @type {string} Identificador único gerado automaticamente */
    this.id = crypto.randomUUID();
    this.titulo = titulo;
    this.descricao = descricao;
    this.url = url;
    this.textoExtraido = textoExtraido;
    this.edicao = edicao;
    this.data = data;

    /** @type {string} Data de criação do registro em formato ISO */
    this.createdAt = new Date().toISOString();
  }
}