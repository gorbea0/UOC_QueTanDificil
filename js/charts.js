/** Gráficos SVG sin dependencias externas. */
window.UGE = window.UGE || {};
UGE.lineChart = function lineChart(selector, seriesList) {
  const labels = [...new Set(seriesList.flatMap(series => Object.keys(series.data)))].sort((a,b)=>UGE.semesterKey(a)-UGE.semesterKey(b));
  const target = UGE.$(selector);
  if (!labels.length) {target.innerHTML='<div class="empty">Sin datos para este filtro</div>';return;}
  const values=seriesList.flatMap(series=>Object.values(series.data));
  const w=760,h=260,pl=42,pr=22,pt=18,pb=38,max=Math.max(10,Math.ceil(Math.max(...values,0)/10)*10);
  const x=index=>labels.length===1?w/2:pl+index*(w-pl-pr)/(labels.length-1);
  const y=value=>h-pb-value/max*(h-pt-pb);
  let svg=`<svg viewBox="0 0 ${w} ${h}">`;
  for(let i=0;i<=5;i++){const n=max*i/5,yy=y(n);svg+=`<line x1="${pl}" y1="${yy}" x2="${w-pr}" y2="${yy}" stroke="var(--l)"/><text x="2" y="${yy+4}" fill="var(--m)" font-size="11">${n.toFixed(0)}%</text>`;}
  labels.forEach((label,index)=>svg+=`<text x="${x(index)}" y="${h-9}" text-anchor="middle" fill="var(--m)" font-size="10">${label}</text>`);
  seriesList.forEach(series=>{const points=labels.map((label,index)=>series.data[label]==null?null:[x(index),y(series.data[label]),series.data[label],label]).filter(Boolean);const path=points.map((point,index)=>(index?'L':'M')+point[0]+','+point[1]).join(' ');svg+=`<path d="${path}" fill="none" stroke="${series.css}" stroke-width="4" stroke-linecap="round" ${series.dash?`stroke-dasharray="${series.dash}"`:''}/>`;points.forEach(point=>svg+=`<circle cx="${point[0]}" cy="${point[1]}" r="4" fill="var(--p)" stroke="${series.css}" stroke-width="3"><title>${series.name} · ${point[3]}: ${point[2].toFixed(1)}%</title></circle>`);});
  target.innerHTML=svg+'</svg>';
};
