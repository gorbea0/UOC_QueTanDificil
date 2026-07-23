/** Arranque de la aplicación web estática para GitHub Pages. */
window.UGE = window.UGE || {};
UGE.APP_VERSION = '1.0.1';
UGE.DATA_URL = 'data/uoc_statistics.json';

UGE.showLoadError = (title, details=[]) => {
  const box=UGE.$('#loadscreen'); box.classList.add('error');
  UGE.$('#loadtitle').textContent=title;
  UGE.$('#loaddetail').innerHTML=(details.length?`<ul>${details.map(x=>`<li>${UGE.escapeHtml(x)}</li>`).join('')}</ul>`:'') +
    '<p>La publicación debe servirse mediante GitHub Pages. Comprueba que <code>data/uoc_statistics.json</code> exista en el repositorio y que GitHub Pages esté activado.</p>';
  UGE.$('#pickDataset').hidden=false;
};

UGE.loadPayload = async () => {
  try {
    const response=await fetch(UGE.DATA_URL,{cache:'no-store'});
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch(fetchError) {
    throw fetchError;
  }
};

UGE.start = payload => {
  const store=new UGE.DataStore(payload),engine=new UGE.AnalysisEngine(),app=new UGE.AppController(store,engine);
  window.ugeApp=app; document.documentElement.dataset.theme=localStorage.ugeTheme||'light'; app.render();
  UGE.$('#loadscreen').hidden=true;
  UGE.$('#datasetStatus').textContent=`${store.records.length.toLocaleString('es-ES')} registros · ${payload.generated_at?.slice(0,10)||'fecha desconocida'}`;
  UGE.$('#theme').onclick=()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.ugeTheme=t;};
  UGE.$('#period').onchange=e=>{app.period=e.target.value;app.render();app.home();}; UGE.$('#language').onchange=e=>{app.language=e.target.value;app.render();app.home();};
  UGE.$('#q').oninput=e=>app.search(e.target.value); UGE.$('#back').onclick=()=>app.home();
  document.onclick=e=>{const g=e.target.closest('[data-grade]');if(g&&app.currentSubject){app.currentGrade=g.dataset.grade;app.renderSubjectChart();app.renderHistory(app.currentRows());return;}const l=e.target.closest('[data-sub-lang]');if(l&&app.currentSubject){app.subjectLanguage=l.dataset.subLang;app.sync();app.renderSubject();return;}const p=e.target.closest('[data-sub-period]');if(p&&app.currentSubject){app.subjectPeriod=p.dataset.subPeriod;app.sync();app.renderSubject();return;}const s=e.target.closest('[data-k]');if(s){app.show(s.dataset.k);UGE.$('#results').classList.remove('open');}};
  const panel=UGE.$('#devpanel'),toggle=()=>{panel.classList.toggle('open');panel.setAttribute('aria-hidden',String(!panel.classList.contains('open')));};
  const summary=store.summary(); UGE.$('#devVersion').textContent=UGE.APP_VERSION; UGE.$('#devSchema').textContent=payload.schema_version??'—'; UGE.$('#devGenerated').textContent=payload.generated_at||'—'; UGE.$('#devRecords').textContent=summary.records.toLocaleString('es-ES'); UGE.$('#devSubjects').textContent=summary.subjects; UGE.$('#devSemesters').textContent=summary.semesters; UGE.$('#devDegrees').textContent=summary.degrees; UGE.$('#devLoad').textContent=store.loadTimeMs.toFixed(1)+' ms'; UGE.$('#devStatus').textContent=store.validation.warnings.length?'OK con avisos':'OK';
  document.onkeydown=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();UGE.$('#q').focus();}if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='d'){e.preventDefault();toggle();}if(e.key==='Escape')UGE.$('#results').classList.remove('open');};
  const hash=decodeURIComponent(location.hash.slice(1));if(hash.startsWith('asignatura/'))app.show(hash.slice(11));
};

document.addEventListener('DOMContentLoaded',async()=>{
  UGE.$('#pickDataset').onclick=()=>UGE.$('#datasetFile').click();
  UGE.$('#datasetFile').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;UGE.start(JSON.parse(await file.text()));}catch(error){UGE.showLoadError('El archivo seleccionado no es válido.',error.details||[error.message]);}};
  try{UGE.start(await UGE.loadPayload());}catch(error){UGE.showLoadError('No se ha podido cargar data/uoc_statistics.json.',error.details||[error.message]);}
});
