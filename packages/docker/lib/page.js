'use strict';
const { MONTHS } = require('./guide');

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function page() {
  const rows = MONTHS.map((m) => `<tr><th>${esc(m.month)}</th><td>${m.high}&deg;C</td><td>${esc(m.note)}</td></tr>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Abu Dhabi car care guide</title>
<style>
body{font:16px/1.5 system-ui,sans-serif;max-width:760px;margin:2rem auto;padding:0 1rem;color:#1b1b1f}
h1{margin-bottom:.2rem}label{display:block;margin:.5rem 0}input{width:6rem;padding:.3rem}
button{padding:.5rem 1rem;margin-top:.5rem}table{border-collapse:collapse;width:100%}
td,th{border-bottom:1px solid #ddd;padding:.4rem;text-align:left;vertical-align:top}
#out{margin-top:1rem;padding:1rem;border-radius:8px;background:#f2f4f7}
</style></head><body>
<h1>Abu Dhabi car care guide</h1>
<p>Check whether now is a good time to wash your car outdoors, and see what each month means for your paint.</p>
<h2>Wash window</h2>
<form id="f">
<label>Temperature (&deg;C) <input name="temp" type="number" step="any"></label>
<label>Wind (km/h) <input name="wind" type="number" step="any"></label>
<label>Dust, PM10 (&micro;g/m&sup3;) <input name="dust" type="number" step="any"></label>
<label>Humidity (%) <input name="humidity" type="number" step="any"></label>
<button type="submit">Check</button>
</form>
<div id="out" hidden></div>
<h2>Month by month</h2>
<table>${rows}</table>
<script>
document.getElementById('f').addEventListener('submit',async function(e){
  e.preventDefault();
  var q=new URLSearchParams();
  new FormData(e.target).forEach(function(v,k){if(v!=='')q.set(k,v)});
  var out=document.getElementById('out');out.hidden=false;
  var r=await fetch('/api/wash-window?'+q);var j=await r.json();
  if(!r.ok){out.textContent=j.error;return}
  out.textContent='';
  var h=document.createElement('strong');h.textContent=j.verdict.toUpperCase()+' ('+j.score+'/100): '+j.reasons.join(', ');
  out.appendChild(h);
  j.tips.forEach(function(t){var p=document.createElement('p');p.textContent=t;out.appendChild(p)});
});
</script>
</body></html>`;
}

module.exports = { page };
