import{api}from'./api.js';import{state,esc,money,toast,spinner,$}from'./ui.js';import{card,empty,media}from'./components.js';
const v=()=>$('#view');
const fmtD=d=>d?new Date(d+'T00:00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'}):'';
const fmtT=t=>t?new Date(String(t).replace(' ','T')+'Z').toLocaleString('en-IN',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}):'';
const STAGES=[['Pending','Order placed'],['Confirmed','Order confirmed'],['Processing','Packed & processing'],['Shipped','Shipped'],['Delivered','Delivered']];
// one friendly delivery sentence used on Orders list + Order page
const deliveryLine=o=>o.status==='Delivered'?`✅ Delivered on <b>${fmtD((o.delivered_at||o.est_delivery||'').slice(0,10))}</b>`:o.status==='Shipped'?`🚚 Shipped · arriving by <b>${fmtD(o.est_delivery)}</b>`:`📦 Expected delivery by <b>${fmtD(o.est_delivery)}</b>`;
export const go=h=>location.hash=h;
export async function refreshCart(){if(!state.user){state.cart=[];}else state.cart=await api('/cart');$('#cc').textContent=state.cart.reduce((s,i)=>s+i.qty,0);}
function bindCards(){
 v().querySelectorAll('.card').forEach(c=>c.onclick=e=>{
  const w=e.target.closest('[data-w]'),a=e.target.closest('[data-c]');
  if(w)return wish(+w.dataset.w,w);if(a)return add(+a.dataset.c,a);
  c.classList.add('zoom');setTimeout(()=>go('#/product/'+c.dataset.id),220);}); // click animation then navigate
}
async function guard(){if(!state.user){toast('Please login first',1);go('#/login');return false}return true}
async function add(id,btn,qty=1){
 if(!await guard())return;btn.disabled=true; // duplicate-click prevention
 try{state.cart=await api('/cart',{method:'POST',body:{productId:id,qty}});await refreshCart();toast('Added to cart ✓');}
 catch(e){toast(e.message,1)}btn.disabled=false;
}
async function wish(id,el){
 if(!await guard())return;
 try{const r=await api('/wishlist/'+id,{method:'POST'});r.saved?state.wish.add(id):state.wish.delete(id);el.textContent=r.saved?'💜':'🤍';}catch(e){toast(e.message,1)}
}
export async function loadWish(){try{state.wish=new Set((await api('/wishlist')).map(p=>p.id))}catch{state.wish=new Set()}}
async function list(params){
 try{return await api('/products?'+new URLSearchParams(params))}catch(e){v().innerHTML=empty('⚠️',esc(e.message)+' <br><button class="btn" onclick="location.reload()">Retry</button>');return null}
}
export async function home(){
 v().innerHTML=`<section class="hero"><div><h1>TECH THAT<br><span>MOVES YOU</span></h1><p>Thoughtful gear for work, play and everyday life. Discover the tech you'll love — whoever you are.</p>
 <a class="btn lime" href="#/products">EXPLORE DEVICES →</a> <span class="btn" style="background:#2e2a52">FIRST ORDER · 10% OFF</span></div><div class="art">🎧</div></section>
 <h2 class="sec">SHOP BY BRAND</h2><div class="chips" id="br"></div>
 <h2 class="sec">TOP PICKS <small>Best rated devices from top brands</small></h2><div class="grid" id="g">${spinner}</div>`;
 api('/brands').then(b=>{$('#br').innerHTML=b.map(x=>`<a class="chip" href="#/products?brand=${encodeURIComponent(x.brand)}">${esc(x.brand)}</a>`).join('')}).catch(()=>{});
 const ps=await list({sort:'rating',limit:8});if(!ps)return;$('#g').innerHTML=ps.map(card).join('');bindCards();
}
export async function products(qs){
 const p=Object.fromEntries(new URLSearchParams(qs)),PAGE=24;let off=0;
 const brands=await api('/brands'+(p.category?'?category='+encodeURIComponent(p.category):'')).catch(()=>[]);
 v().innerHTML=`<div class="filters"><select class="f" id="s"><option value="">Sort: Featured</option><option value="price_asc">Price: Low → High</option><option value="price_desc">Price: High → Low</option><option value="rating">Top rated</option><option value="new">Newest</option></select>
 <select class="f" id="b"><option value="">All brands</option>${brands.map(b=>`<option value="${esc(b.brand)}">${esc(b.brand)} (${b.count})</option>`).join('')}</select>
 <input class="f" id="mx" type="number" min="0" placeholder="Max price ₹" value="${esc(p.max||'')}"></div>
 <p class="count" id="cnt">${p.q?`Results for “${esc(p.q)}”`:''}</p><div class="grid" id="g">${spinner}</div><div style="text-align:center;margin:22px"><button class="btn" id="more" hidden>Load more</button></div>`;
 $('#s').value=p.sort||'';$('#b').value=p.brand||'';
 const re=()=>{const n={...p,sort:$('#s').value,brand:$('#b').value,max:$('#mx').value};Object.keys(n).forEach(k=>n[k]||delete n[k]);go('#/products?'+new URLSearchParams(n))};
 $('#s').onchange=re;$('#b').onchange=re;$('#mx').onchange=re;
 const load=async()=>{
  const ps=await list({...p,limit:PAGE,offset:off});if(!ps)return;
  if(!off)$('#g').innerHTML='';
  if(!off&&!ps.length)$('#g').innerHTML=empty('🔍','No products match your filters');
  $('#g').insertAdjacentHTML('beforeend',ps.map((x,i)=>card(x,i)).join(''));bindCards();off+=ps.length;
  $('#cnt').textContent=(p.q?`Results for “${p.q}” · `:'')+`Showing ${off} of ${ps.total??off} products`;
  $('#more').hidden=off>=(ps.total??0);};
 $('#more').onclick=async e=>{e.target.disabled=true;await load();e.target.disabled=false};
 await load();
}
export async function product(id){
 v().innerHTML=spinner;let p;
 try{p=await api('/products/'+id)}catch(e){v().innerHTML=empty('😕',esc(e.message));return}
 const off=Math.round((1-p.price/p.mrp)*100);
 v().innerHTML=`<div class="panel detail"><div class="big">${media(p)}</div><div>
 <a href="#/products?category=${esc(p.cslug)}" class="st">${esc(p.category)}</a> ${p.brand?`<a href="#/products?brand=${encodeURIComponent(p.brand)}" class="st">${esc(p.brand)}</a>`:''}<h1 style="margin:12px 0 4px">${esc(p.name)}</h1><p style="color:var(--mute)">${esc(p.tagline)}</p>
 <p style="margin:12px 0">⭐ ${p.rating} (${p.reviews} reviews)</p>
 <p class="price" style="font-size:1.8rem">${money(p.price)}<s>${money(p.mrp)}</s> <span class="disc" style="position:static">-${off}%</span></p>
 <p style="margin:14px 0;line-height:1.6">${esc(p.description)}</p>
 <p>${p.stock===0?'<span class="out">Out of stock</span>':p.stock<=5?`<span class="low">Only ${p.stock} left!</span>`:'<span class="ok">In stock</span>'}</p>
 <h3 style="margin:16px 0 6px">Specifications</h3><table>${Object.entries(p.specs).map(([k,x])=>`<tr><td>${esc(k)}</td><td><b>${esc(x)}</b></td></tr>`).join('')}</table>
 <div style="display:flex;gap:10px;margin-top:20px"><button class="btn lime" id="a" ${p.stock?'':'disabled'}>ADD TO CART</button><button class="btn ghost" id="w">${state.wish.has(p.id)?'💜 Saved':'🤍 Wishlist'}</button></div>
 <div id="opts"></div></div></div>`;
 if(p.model)api('/products?'+new URLSearchParams({brand:p.brand,q:p.model,limit:40})).then(r=>{const o=r.filter(x=>x.model===p.model&&x.id!==p.id);
  if(o.length)$('#opts').innerHTML=`<h3 style="margin:22px 0 8px">Other colours &amp; variants</h3><div class="chips">${o.map(x=>`<a class="chip" href="#/product/${x.id}">${esc(x.name.slice(p.brand.length+p.model.length+2).replace(/^\(|\)$/g,''))} · ${money(x.price)}</a>`).join('')}</div>`}).catch(()=>{});
 $('#a').onclick=e=>add(p.id,e.target);$('#w').onclick=async e=>{await wish(p.id,e.target);e.target.textContent=state.wish.has(p.id)?'💜 Saved':'🤍 Wishlist'};
}
export async function wishlist(){
 v().innerHTML=spinner;const ps=await api('/wishlist');
 v().innerHTML=`<h2 class="sec">Wishlist</h2>`+(ps.length?`<div class="grid">${ps.map(card).join('')}</div>`:empty('💜','Your wishlist is empty'));bindCards();
}
export async function cart(){
 await refreshCart();const c=state.cart;
 if(!c.length){v().innerHTML=`<div class="panel">${empty('🛍','Your cart is empty<br><br><a class="btn" href="#/products">Start shopping</a>')}</div>`;return}
 const tot=c.reduce((s,i)=>s+i.price*i.qty,0),items=c.reduce((s,i)=>s+i.qty,0);
 v().innerHTML=`<div class="panel"><h2>Your shopping cart <small style="color:var(--mute);font-weight:400">(${items} item${items>1?'s':''})</small></h2>
 <table class="ct"><tr class="hd"><th></th><th>Product</th><th>Quantity</th><th>Subtotal</th><th></th></tr>${c.map(i=>`<tr><td class="th">${media(i)}</td><td><b>${esc(i.name)}</b><br><small style="color:var(--mute)">${money(i.price)} each${i.stock<=5?` · <span class="low">only ${i.stock} left</span>`:''}</small></td>
 <td><span class="qty"><button data-q="${i.id}" data-d="-1" aria-label="Decrease quantity">−</button>${i.qty}<button data-q="${i.id}" data-d="1" aria-label="Increase quantity">+</button></span></td><td><b>${money(i.price*i.qty)}</b></td><td><button class="btn ghost sm" data-r="${i.id}">Remove item</button></td></tr>`).join('')}</table>
 <div class="sum"><span>Delivery</span><b class="ok">FREE</b></div>
 <h2 style="text-align:right;margin:16px 0">Order total ${money(tot)}</h2><div style="text-align:right"><a class="btn lime" href="#/checkout">PROCEED TO CHECKOUT →</a></div></div>`;
 v().onclick=async e=>{const q=e.target.closest('[data-q]'),r=e.target.closest('[data-r]');if(!q&&!r)return;
  try{if(q){const it=c.find(x=>x.id==q.dataset.q),n=it.qty+ +q.dataset.d;n<1?await api('/cart/'+it.id,{method:'DELETE'}):await api('/cart/'+it.id,{method:'PUT',body:{qty:n}})}
  else await api('/cart/'+r.dataset.r,{method:'DELETE'});}catch(x){toast(x.message,1)}v().onclick=null;cart();};
}
export async function checkout(){
 await refreshCart();if(!state.cart.length)return go('#/cart');
 let step=0,addr={};const total=()=>state.cart.reduce((s,i)=>s+i.price*i.qty,0),N=['Cart','Address','Summary','Payment'];
 const draw=()=>{
  const bar=`<div class="steps">${N.map((n,i)=>`<span class="${i<step+1?'done':i==step+1?'on':''}">${i+1}. ${n}</span>`).join('')}</div>`;
  if(step==0)v().innerHTML=`<div class="panel">${bar}<h2>Delivery address</h2>${[['name','Full name'],['phone','Phone (10 digits)'],['line','Address'],['city','City'],['pin','PIN code (6 digits)']].map(([k,l])=>`<label>${l}</label><input class="f" id="a_${k}" value="${esc(addr[k]||'')}">`).join('')}<p class="err" id="e"></p><button class="btn lime" id="n">CONTINUE →</button></div>`;
  if(step==1)v().innerHTML=`<div class="panel">${bar}<h2>Review your order</h2><p style="color:var(--mute);margin-bottom:8px">Change quantity or remove items before you pay.</p><table class="ct">${state.cart.map(i=>`<tr><td class="th">${media(i)}</td><td><b>${esc(i.name)}</b><br><small style="color:var(--mute)">${money(i.price)} each</small></td>
   <td><span class="qty"><button data-q="${i.id}" data-d="-1" aria-label="Decrease quantity">−</button>${i.qty}<button data-q="${i.id}" data-d="1" aria-label="Increase quantity">+</button></span></td><td><b>${money(i.price*i.qty)}</b></td><td><button class="btn ghost sm" data-r="${i.id}">Remove</button></td></tr>`).join('')}</table>
   <p style="margin:14px 0">📍 ${esc(addr.name)}, ${esc(addr.line)}, ${esc(addr.city)} - ${esc(addr.pin)}</p><h2>Total ${money(total())}</h2><br><button class="btn ghost" id="b">← Back</button> <button class="btn lime" id="n">PROCEED TO PAYMENT →</button></div>`;
  if(step==2)v().innerHTML=`<div class="panel">${bar}<h2>Payment (simulated)</h2><p style="color:var(--mute)">No real money is charged. Use any dummy details.</p><label>Card number</label><input class="f" value="4242 4242 4242 4242"><label>Name on card</label><input class="f" value="${esc(addr.name)}"><br><br><button class="btn lime" id="n">PAY ${money(total())}</button></div>`;
  const n=$('#n'),b=$('#b');if(b)b.onclick=()=>{step--;draw()};
  if(step==1)v().onclick=async e=>{const q=e.target.closest('[data-q]'),r=e.target.closest('[data-r]');if(!q&&!r)return;
   try{if(q){const it=state.cart.find(x=>x.id==q.dataset.q),k=it.qty+ +q.dataset.d;state.cart=k<1?await api('/cart/'+it.id,{method:'DELETE'}):await api('/cart/'+it.id,{method:'PUT',body:{qty:k}})}
   else state.cart=await api('/cart/'+r.dataset.r,{method:'DELETE'});}catch(x){toast(x.message,1)}
   await refreshCart();if(!state.cart.length){v().onclick=null;return go('#/cart')}draw()};
  else v().onclick=null;
  n.onclick=async()=>{
   if(step==0){for(const k of['name','phone','line','city','pin'])addr[k]=$('#a_'+k).value.trim();
    const m=!addr.name||!addr.line||!addr.city?'Please fill all fields':!/^\d{10}$/.test(addr.phone)?'Phone must be 10 digits':!/^\d{6}$/.test(addr.pin)?'PIN must be 6 digits':'';
    if(m)return $('#e').textContent=m;}
   if(step<2){step++;return draw()}
   n.disabled=true;n.textContent='Processing payment…';await new Promise(r=>setTimeout(r,1500)); // payment simulation
   try{const r=await api('/orders',{method:'POST',body:{address:addr}});await refreshCart();go('#/order/'+r.orderId+'?new=1')}catch(e){toast(e.message,1);n.disabled=false;n.textContent='Retry payment'}};
 };draw();
}
export async function orders(){
 v().innerHTML=spinner;const o=await api('/orders');
 v().innerHTML=`<div class="panel"><h2>My orders</h2>`+(o.length?o.map(x=>`<a class="oc" href="#/order/${x.id}"><div class="oh"><b>Order #${x.id}</b><span class="st">${esc(x.status)}</span><span style="margin-left:auto;color:var(--mute)">Placed ${new Date(x.created_at+'Z').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span></div>
  <div class="oi">${x.items.slice(0,3).map(i=>`${esc(i.emoji)} ${esc(i.name)} × ${i.qty}`).join('<br>')}${x.items.length>3?`<br>+ ${x.items.length-3} more`:''}</div>
  <div class="oh"><span>${deliveryLine(x)}</span><b style="margin-left:auto">${money(x.total)}</b></div></a>`).join(''):empty('📦','No orders yet'))+'</div>';
}
export async function order(id,isNew){
 v().innerHTML=spinner;let o;try{o=await api('/orders/'+id)}catch(e){v().innerHTML=empty('😕',esc(e.message));return}
 const at=Object.fromEntries(o.events.map(e=>[e.status,e.at])),cur=STAGES.findIndex(x=>x[0]===o.status);o.delivered_at=at.Delivered;
 v().innerHTML=`<div class="panel">${isNew?`<div style="text-align:center"><div class="tick">✅</div><h2>Order confirmed!</h2><p style="color:var(--mute)">Thank you for shopping with Voltix.</p></div><br>`:''}
 <h2>Order #${o.id} <span class="st">${esc(o.status)}</span></h2><p class="dl">${deliveryLine(o)}</p>
 <div class="tl">${STAGES.map(([k,l],i)=>`<div class="ts ${i<cur?'done':i==cur?'now':''}"><i>${i<=cur?'✓':i+1}</i><b>${l}</b><small>${at[k]?fmtT(at[k]):''}</small></div>`).join('')}</div>
 <table>${o.items.map(i=>`<tr><td>${esc(i.emoji)} ${esc(i.name)} × ${i.qty}</td><td>${money(i.price*i.qty)}</td></tr>`).join('')}</table>
 <h3 style="margin-top:14px">Total ${money(o.total)}</h3><p style="margin-top:10px">📍 ${esc(o.address.name)}, ${esc(o.address.line)}, ${esc(o.address.city)} - ${esc(o.address.pin)}</p></div>`;
}
export async function profile(){
 const u=state.user;v().innerHTML=`<div class="panel auth"><h2>Profile</h2><label>Name</label><input class="f" id="n" value="${esc(u.name)}"><label>Email</label><input class="f" value="${esc(u.email)}" disabled><p class="err" id="e"></p><button class="btn" id="s">Save</button> <button class="btn ghost" id="o">Logout</button></div>`;
 $('#s').onclick=async()=>{try{state.user=(await api('/auth/me',{method:'PUT',body:{name:$('#n').value}})).user;toast('Saved ✓')}catch(e){$('#e').textContent=e.message}};
 $('#o').onclick=async()=>{await api('/auth/logout',{method:'POST'});state.user=null;state.wish=new Set();await refreshCart();location.hash='#/login';location.reload()};
}
export function auth(mode,onDone){
 const su=mode==='signup',pw=(id,l)=>`<label>${l}</label><div class="pw"><input class="f" type="password" id="${id}" autocomplete="${su?'new-password':'current-password'}"><button type="button" data-show>Show</button></div>`;
 v().innerHTML=`<div class="panel auth"><h2>${su?'👤 Sign Up':'🔐 Login'}</h2>${su?'<label>Name</label><input class="f" id="nm">':''}<label>Email</label><input class="f" id="em" type="email">${pw('pw','Password')}${su?pw('pc','Confirm Password'):''}<p class="err" id="e"></p>
 <button class="btn lime" id="go" style="width:100%">${su?'Create account':'Login'}</button><p style="margin-top:14px;text-align:center">${su?'Have an account? <a href="#/login"><b>Login</b></a>':'New here? <a href="#/signup"><b>Sign up</b></a>'}</p></div>`;
 v().querySelectorAll('[data-show]').forEach(b=>b.onclick=()=>{const i=b.previousElementSibling,h=i.type==='password';i.type=h?'text':'password';b.textContent=h?'Hide':'Show'});
 $('#go').onclick=async e=>{const E=$('#e');E.textContent='';
  const d={email:$('#em').value,password:$('#pw').value};
  if(su){d.name=$('#nm').value;if(d.password!==$('#pc').value)return E.textContent='Passwords do not match'}
  e.target.disabled=true;
  try{state.user=(await api('/auth/'+mode,{method:'POST',body:d})).user;await loadWish();await refreshCart();onDone()}catch(x){E.textContent=x.message;e.target.disabled=false}};
}
