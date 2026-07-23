/** DataStore v1.0.1: valida, normaliza e indexa el dataset real del scraper. */
window.UGE = window.UGE || {};
UGE.DataStore = class DataStore {
  static REQUIRED = ['degree','semester_name','semester_value','subject_name','subject_code','language','m','ex','no','a','su'];

  static validate(payload) {
    const errors = [], warnings = [];
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) errors.push('La raíz del JSON debe ser un objeto.');
    const records = payload?.records;
    if (!Array.isArray(records)) errors.push('Falta el array "records".');
    if (Array.isArray(records) && !records.length) errors.push('El array "records" está vacío.');
    if (payload?.schema_version != null && ![1,2].includes(Number(payload.schema_version))) warnings.push(`Esquema ${payload.schema_version}: esta versión está probada con los esquemas 1 y 2.`);
    if (Array.isArray(records)) {
      records.slice(0, 200).forEach((row, index) => {
        if (!row || typeof row !== 'object') { errors.push(`Registro ${index + 1}: no es un objeto.`); return; }
        const missing = this.REQUIRED.filter(key => row[key] === undefined || row[key] === null || row[key] === '');
        if (missing.length) errors.push(`Registro ${index + 1}: faltan ${missing.join(', ')}.`);
      });
    }
    return {ok: !errors.length, errors: [...new Set(errors)].slice(0, 20), warnings: [...new Set(warnings)]};
  }

  constructor(payload) {
    const started = performance.now();
    const validation = UGE.DataStore.validate(payload);
    if (!validation.ok) { const error = new Error('Dataset no válido'); error.details = validation.errors; throw error; }
    this.validation = validation;
    this.payload = payload;
    this.records = payload.records.map((record, index) => this.#normalizeRecord(record, index));
    this.subjectsByCode = new Map();
    this.subjectsByDegree = new Map();
    this.semesters = [];
    this.#buildIndexes();
    this.subjects = [...this.subjectsByCode.values()];
    this.loadTimeMs = performance.now() - started;
  }

  #normalizeRecord(record, index) {
    const languageRaw = String(record.language || '').toLowerCase().trim();
    const language = languageRaw.startsWith('ca') ? 'ca' : 'es';
    return {
      id: index,
      degree: String(record.degree || '').trim(),
      semester: String(record.semester_name || '').trim(),
      semester_value: Number(record.semester_value) || UGE.semesterKey(record.semester_name),
      subject_code: String(record.subject_code || '').trim(),
      subject_name: String(record.subject_name || record.subject_code || '').trim(),
      language,
      mh: this.#number(record.m), ex: this.#number(record.ex), no: this.#number(record.no),
      ap: this.#number(record.a), su: this.#number(record.su),
      scraped_at: String(record.scraped_at || '')
    };
  }

  #number(value) { const n = Number(value); return Number.isFinite(n) ? n : 0; }

  #buildIndexes() {
    const semesters = new Map();
    for (const row of this.records) {
      semesters.set(row.semester, row.semester_value);
      if (!this.subjectsByCode.has(row.subject_code)) {
        this.subjectsByCode.set(row.subject_code, {key:row.subject_code, code:row.subject_code, name:row.subject_name, degree:row.degree, languages:{es:[],ca:[]}, all:[]});
      }
      const subject = this.subjectsByCode.get(row.subject_code);
      subject.all.push(row); subject.languages[row.language].push(row);
      if (!this.subjectsByDegree.has(row.degree)) this.subjectsByDegree.set(row.degree, new Set());
      this.subjectsByDegree.get(row.degree).add(subject);
    }
    this.semesters = [...semesters.entries()].sort((a,b)=>a[1]-b[1]).map(([name])=>name);
    for (const subject of this.subjectsByCode.values()) subject.all.sort((a,b)=>a.semester_value-b.semester_value || a.language.localeCompare(b.language));
  }

  getSubject(code) { return this.subjectsByCode.get(String(code)); }
  getRows({language='all', period='all'}={}) { const rows=language==='all'?this.records:this.records.filter(r=>r.language===language); return UGE.periodRows(rows,period); }
  getSubjects({language='all', period='all'}={}) {
    const allowed = new Set(this.getRows({language,period}).map(r=>r.id));
    return this.subjects.map(subject=>({...subject,rows:subject.all.filter(r=>allowed.has(r.id))})).filter(subject=>subject.rows.length);
  }
  search(query, subjects=this.subjects, limit=10) { const q=String(query||'').trim().toLocaleLowerCase('es'); return q?subjects.filter(s=>`${s.name} ${s.code}`.toLocaleLowerCase('es').includes(q)).slice(0,limit):[]; }
  summary() { return {records:this.records.length,subjects:this.subjects.length,semesters:this.semesters.length,degrees:this.subjectsByDegree.size,languages:[...new Set(this.records.map(r=>r.language))]}; }
};
