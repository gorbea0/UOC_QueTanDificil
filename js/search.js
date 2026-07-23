/** Adaptador de búsqueda para mantener la UI desacoplada del DataStore. */
window.UGE = window.UGE || {};
UGE.SearchService = class SearchService {
  constructor(store) {this.store=store;}
  find(query, subjects, limit=10) {return this.store.search(query,subjects,limit);}
};
