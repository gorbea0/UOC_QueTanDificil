/** Utilidades compartidas. */
window.UGE = window.UGE || {};
UGE.$ = selector => document.querySelector(selector);
UGE.$$ = selector => [...document.querySelectorAll(selector)];
UGE.GRADES = ['mh','ex','no','ap','su'];
UGE.GRADE_LABELS = {mh:'matrículas de honor',ex:'excelentes',no:'notables',ap:'aprobados',su:'suspensos'};
UGE.GRADE_SHORT = {mh:'MH',ex:'EX',no:'NO',ap:'AP',su:'SU'};
UGE.escapeHtml = value => String(value).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
UGE.mean = values => values.length ? values.reduce((a,b)=>a+b,0)/values.length : 0;
UGE.clamp = (value,min,max) => Math.max(min,Math.min(max,value));
UGE.semesterKey = semester => { const text=String(semester||''); const m=text.match(/(\d{4})\/(\d{2})-(\d)/)||text.match(/(\d{4})[^\d]?(\d)?/); return m?Number(m[1])*10+Number(m[3]||m[2]||0):0; };
UGE.periodRows = (rows,count) => {
  if(count==='all') return [...rows];
  const semesterValues=[...new Set(rows.map(r=>Number(r.semester_value)||UGE.semesterKey(r.semester)))].sort((a,b)=>b-a).slice(0,Number(count));
  return rows.filter(r=>semesterValues.includes(Number(r.semester_value)||UGE.semesterKey(r.semester)));
};
