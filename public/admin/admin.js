// ADMIN PANEL (plain JS). Role is enforced by the SERVER; this only hides UI.
const $=s=>document.querySelector(s),R=$('#root');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'₹'+Number(n).toLocaleString('en-IN');
const STATUS=['Pending','Confirmed','Processing','Shipped','Delivered'];
async function api(p,m='GET',b){const r=await fetch('/api'+p,{method:m,headers:{'Content-Type':'application/json'},body:b&&JSON.stringify(b)});const d=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(new Error(d.error||'Failed'),{status:r.status});return d}
function toast(t,bad){const e=document.createElement('div');e.className='toast'+(bad?' bad':'');e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2500)}
let cats=[];
function login(msg=''){
 R.innerHTML=`<div class="login"><h2 style="letter-spacing:.3em">VOLTIX</h2><p style="color:#6b6a85;margin-bottom:18px">Admin sign in</p><label>Email</label><input id="e" type="email"><label>Password</label><input id="p" type="password"><p style="color:#dc2626;min-height:1.2em" id="m">${msg}</p><button class="btn l" id="b" style="width:100%">Login</button></div>`;
 $('#b').onclick=async()=>{try{const u=(await api('/auth/login','POST',{email:$('#e').value,password:$('#p').value})).user;if(u.role!=='admin'){await api('/auth/logout','POST');return $('#m').textContent='Admin access only'}shell()}catch(e){$('#m').textContent=e.message}}
}
async function shell(){
 try{const u=(await api('/auth/me')).user;if(u.role!=='admin')return login('Admin access only')}catch{return login()}
 cats=await api('/categories');
 R.innerHTML=`<div class="wrap"><nav><h2>VOLTIX</h2><small>ADMIN PANEL</small>${['dashboard','products','orders','users'].map(t=>`<a data-t="${t}">${{dashboard:'📊',products:'📦',orders:'🧾',users:'👥'}[t]} ${t[0].toUpperCase()+t.slice(1)}</a>`).join('')}<a href="/">🛍 View store</a><a id="lo">🚪 Logout</a></nav><main id="m"></main></div>`;
 document.querySelectorAll('nav [data-t]').forEach(a=>a.onclick=()=>tab(a.dataset.t));
 $('#lo').onclick=async()=>{await api('/auth/logout','POST');login()};tab('dashboard');
}
async function tab(t){
 document.querySelectorAll('nav [data-t]').forEach(a=>a.classList.toggle('on',a.dataset.t===t));
 $('#m').innerHTML='Loading…';
 try{await({dashboard,products,orders,users}[t])()}catch(e){if(e.status===401||e.status===403)login(e.message);else $('#m').innerHTML=`<div class="box">⚠️ ${esc(e.message)} <button class="btn" onclick="location.reload()">Retry</button></div>`}
}
async function dashboard(){
 const s=await api('/admin/stats');
 $('#m').innerHTML=`<h1>Dashboard</h1><div class="stats">${[['Products',s.products],['Users',s.users],['Orders',s.orders],['Revenue',money(s.revenue)]].map(([a,b])=>`<div class="stat">${a}<b>${b}</b></div>`).join('')}</div>
 <div class="box"><h3>⚠️ Low-stock products</h3><table>${s.lowStock.map(p=>`<tr><td>${esc(p.name)}</td><td class="warn">${p.stock} left</td></tr>`).join('')||'<tr><td>All stocked 👍</td></tr>'}</table></div>
 <div class="box"><h3>Recent orders</h3><table><tr><th>ID<th>Customer<th>Total<th>Status</tr>${s.recent.map(o=>`<tr><td>#${o.id}<td>${esc(o.name)}<td>${money(o.total)}<td><span class="st">${o.status}</span></tr>`).join('')||'<tr><td>No orders yet</td></tr>'}</table></div>`;
}
async function products(){
 const ps=await api('/admin/products');
 $('#m').innerHTML=`<h1>Products (${ps.length}) <button class="btn l" id="add" style="float:right">+ Add product</button></h1><input id="ps" placeholder="Search by name or brand…" style="margin-bottom:12px"><div class="box"><table id="pt"><tr><th><th>Name<th>Brand<th>Category<th>Price<th>Stock<th></tr>${ps.map(p=>`<tr><td style="font-size:1.6rem">${esc(p.emoji)}<td>${esc(p.name)}<td>${esc(p.brand)}<td>${esc(p.category)}<td>${money(p.price)}<td class="${p.stock<=5?'warn':''}">${p.stock}<td><button class="btn g" data-e="${p.id}">Edit</button> <button class="btn d" data-d="${p.id}">Delete</button></tr>`).join('')}</table></div>`;
 $('#add').onclick=()=>form();
 $('#ps').oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('#pt tr').forEach((r,i)=>{if(i)r.style.display=r.textContent.toLowerCase().includes(q)?'':'none'})};
 $('#m').onclick=async e=>{const ed=e.target.dataset.e,de=e.target.dataset.d;
  if(ed)form(ps.find(p=>p.id==ed));
  if(de&&confirm('Delete this product?')){try{await api('/admin/products/'+de,'DELETE');toast('Deleted');products()}catch(x){toast(x.message,1)}}};
}
function form(p={}){
 const m=document.createElement('div');m.className='modal';
 m.innerHTML=`<div><h2 style="margin-bottom:14px">${p.id?'Edit':'Add'} product</h2><div class="g2">
 <div><label>Name</label><input id="n" value="${esc(p.name)}"></div><div><label>Category</label><select id="c">${cats.map(c=>`<option value="${c.id}" ${c.id==p.category_id?'selected':''}>${esc(c.name)}</option>`).join('')}</select></div>
 <div><label>Price ₹</label><input id="pr" type="number" min="0" value="${p.price??''}"></div><div><label>MRP ₹</label><input id="mr" type="number" min="0" value="${p.mrp??''}"></div>
 <div><label>Stock</label><input id="s" type="number" min="0" value="${p.stock??''}"></div><div><label>Brand</label><input id="br" value="${esc(p.brand)}" placeholder="Samsung, Apple…"></div><div><label>Emoji icon (fallback)</label><input id="em" value="${esc(p.emoji||'📦')}"></div></div>
 <label>Tagline</label><input id="t" value="${esc(p.tagline)}"><label>Description</label><textarea id="d" rows="2">${esc(p.description)}</textarea>
 <label>Image URL or /img/products/name.jpg (optional)</label><input id="im" value="${esc(p.image)}"><label>Specifications (JSON)</label><textarea id="sp" rows="3">${esc(p.specs||'{"RAM":"8GB"}')}</textarea>
 <p id="er" style="color:#dc2626"></p><button class="btn l" id="sv">Save</button> <button class="btn g" id="x">Cancel</button></div>`;
 document.body.append(m);$('#x').onclick=()=>m.remove();
 $('#sv').onclick=async e=>{e.target.disabled=true;const b={name:$('#n').value,category_id:$('#c').value,price:$('#pr').value,mrp:$('#mr').value,stock:$('#s').value,brand:$('#br').value,emoji:$('#em').value,tagline:$('#t').value,description:$('#d').value,image:$('#im').value,specs:$('#sp').value};
  try{await api('/admin/products'+(p.id?'/'+p.id:''),p.id?'PUT':'POST',b);m.remove();toast('Saved ✓');products()}catch(x){$('#er').textContent=x.message;e.target.disabled=false}};
}
async function orders(){
 const os=await api('/admin/orders');
 $('#m').innerHTML=`<h1>Orders</h1><div class="box"><table><tr><th>ID<th>Customer<th>Total<th>Date<th>Status<th>Delivery<th></tr>${os.map(o=>{const n=STATUS[STATUS.indexOf(o.status)+1];return`<tr><td>#${o.id}<td>${esc(o.name)}<br><small>${esc(o.email)}</small><td>${money(o.total)}<td>${new Date(o.created_at+'Z').toLocaleDateString()}<td><span class="st">${o.status}</span><td>${o.est_delivery?new Date(o.est_delivery+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'}):'-'}<td><button class="btn g" data-v="${o.id}">Details</button> ${n?`<button class="btn" data-s="${o.id}" data-n="${n}">→ ${n}</button>`:''}</tr>`}).join('')||'<tr><td>No orders yet</td></tr>'}</table></div>`;
 $('#m').onclick=async e=>{const d=e.target.dataset;
  if(d.s){let dd;if(d.n==='Shipped'||d.n==='Processing'||d.n==='Confirmed'){dd=prompt('Promised delivery date (YYYY-MM-DD). Leave blank for automatic:','');if(dd===null)return;dd=dd.trim()||undefined}
   e.target.disabled=true;try{await api(`/admin/orders/${d.s}/status`,'PUT',{status:d.n,deliveryDate:dd});toast('Status updated');orders()}catch(x){toast(x.message,1)}}
  if(d.v){const o=await api('/admin/orders/'+d.v),m=document.createElement('div');m.className='modal';
   m.innerHTML=`<div><h2>Order #${o.id} <span class="st">${o.status}</span></h2><p>${esc(o.uname)} · ${esc(o.email)}</p><table>${o.items.map(i=>`<tr><td>${esc(i.emoji)} ${esc(i.name)} × ${i.qty}<td>${money(i.price*i.qty)}</tr>`).join('')}</table><p><b>Total ${money(o.total)}</b></p><p>🚚 Delivery: ${o.est_delivery||'-'}<br><small>${o.events.map(x=>x.status+' · '+new Date(x.at.replace(' ','T')+'Z').toLocaleString('en-IN')).join('<br>')}</small></p><p>📍 ${esc(o.address.name)}, ${esc(o.address.phone)}<br>${esc(o.address.line)}, ${esc(o.address.city)} - ${esc(o.address.pin)}</p><br><button class="btn g" id="x">Close</button></div>`;document.body.append(m);$('#x').onclick=()=>m.remove()}};
}
async function users(){
 const us=await api('/admin/users');
 $('#m').innerHTML=`<h1>Users</h1><div class="box"><table><tr><th>Name<th>Email<th>Role<th>Orders<th>Joined<th></tr>${us.map(u=>`<tr><td>${esc(u.name)}<td>${esc(u.email)}<td><span class="st">${u.role}</span><td>${u.orders}<td>${new Date(u.created_at+'Z').toLocaleDateString()}<td>${u.role==='customer'?`<button class="btn d" data-d="${u.id}">Delete</button>`:''}</tr>`).join('')}</table></div>`;
 $('#m').onclick=async e=>{const id=e.target.dataset.d;if(id&&confirm('Delete this user?')){try{await api('/admin/users/'+id,'DELETE');toast('User removed');users()}catch(x){toast(x.message,1)}}};
}
shell();
