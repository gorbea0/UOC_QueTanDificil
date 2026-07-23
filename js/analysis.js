/** Motor estadístico independiente de la interfaz. */
window.UGE = window.UGE || {};
UGE.AnalysisEngine = class AnalysisEngine {
  metrics(rows){const out={};UGE.GRADES.forEach(g=>out[g]=UGE.mean(rows.map(r=>Number(r[g])||0)));return out;}
  series(rows,grade){const grouped=rows.reduce((a,r)=>{(a[r.semester]||=[]).push(Number(r[grade])||0);return a;},{});return Object.fromEntries(Object.keys(grouped).sort((a,b)=>{const ra=rows.find(r=>r.semester===a),rb=rows.find(r=>r.semester===b);return (ra?.semester_value||0)-(rb?.semester_value||0);}).map(s=>[s,UGE.mean(grouped[s])]));}
  stats(rows){const metrics=this.metrics(rows),ordered=[...rows].sort((a,b)=>a.semester_value-b.semester_value),values=ordered.map(r=>Number(r.su)||0),deviation=Math.sqrt(UGE.mean(values.map(v=>(v-metrics.su)**2))),n=Math.min(2,values.length),delta=values.length?UGE.mean(values.slice(-n))-UGE.mean(values.slice(0,n)):0;return{metrics,deviation,delta};}
  difficulty(v){return v>=40?'Muy alta':v>=30?'Alta':v>=20?'Media-alta':v>=12?'Media':'Baja';}
  availableLanguages(s){return['es','ca'].filter(l=>s.languages[l]?.length).map(l=>l.toUpperCase()).join(' · ');}
  enrichSubjects(subjects){return subjects.map(s=>({...s,...this.metrics(s.rows)}));}
};
