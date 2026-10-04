// INFY chat widget (floating button + panel). All text is escaped before display (XSS safe).
import{api}from'./api.js';import{esc,money,$}from'./ui.js';
const CH=['Phone under ₹30,000 with a good camera','Laptop under ₹70,000 with 16GB RAM for programming','Compare iPhone 15, Galaxy S24 and OnePlus 12','Which laptop suits a college student?'];
const el=document.createElement('div');
el.innerHTML=`<button id="ifab" aria-label="Open INFY AI shopping assistant" title="Ask our AI shopping assistant">✨ Ask INFY AI</button>
<section id="ibox" hidden><header><b>✨ INFY</b> <small>Voltix shopping assistant</small><button id="ix" aria-label="Close">✕</button></header><div id="imsgs"></div><div id="ichips"></div>
<div class="ibar"><input id="iin" maxlength="300" placeholder="Ask about any product…" aria-label="Message INFY"><button id="isend">Send</button></div></section>`;
document.body.append(el);
const msgs=$('#imsgs');let busy=false;
const add=(who,html)=>{const d=document.createElement('div');d.className='im '+who;d.innerHTML=html;msgs.append(d);msgs.scrollTop=msgs.scrollHeight;return d};
add('bot','Hi! I\'m INFY 👋 Tell me your budget and need, and I\'ll pick from our real stock, compare products and explain why.');
$('#ichips').innerHTML=CH.map(c=>`<button>${esc(c)}</button>`).join('');
$('#ichips').onclick=e=>{if(e.target.tagName==='BUTTON')send(e.target.textContent)};
$('#ifab').onclick=()=>{$('#ibox').hidden=false;$('#ifab').hidden=true;$('#iin').focus()};
$('#ix').onclick=()=>{$('#ibox').hidden=true;$('#ifab').hidden=false};
$('#isend').onclick=()=>send($('#iin').value);$('#iin').onkeydown=e=>{if(e.key==='Enter')send(e.target.value)};
async function send(text){
 text=text.trim();if(!text||busy)return;busy=true;$('#iin').value='';$('#ichips').hidden=true;
 add('me',esc(text));const t=add('bot','<span class="dots">Thinking<i>.</i><i>.</i><i>.</i></span>');
 try{
  const r=await api('/infy',{method:'POST',body:{message:text}});
  let h=esc(r.reply).replace(/\n/g,'<br>');
  if(r.table)h+=`<div class="tw"><table><tr>${r.table.head.map((x,i)=>`<th>${esc(x)}</th>`).join('')}</tr>${r.table.rows.map(row=>'<tr>'+row.map((c,i)=>i?`<td>${esc(c)}</td>`:`<th>${esc(c)}</th>`).join('')+'</tr>').join('')}</table></div>`;
  if(r.products.length)h+='<div class="ip">'+r.products.map(p=>`<a href="#/product/${p.id}">${esc(p.emoji)} ${esc(p.name)} · ${money(p.price)}</a>`).join('')+'</div>';
  t.innerHTML=h;
 }catch(e){t.textContent=e.message||'INFY is unavailable right now. Please try again.'}
 busy=false;msgs.scrollTop=msgs.scrollHeight;
}
