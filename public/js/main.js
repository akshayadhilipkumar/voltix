// ENTRY: splash, sidebar, theme, hash router (with protected routes)
import'./infy.js';
import{api}from'./api.js';import{state,$,esc}from'./ui.js';import*as P from'./pages.js';
const LOGO='<svg width="64" height="64" viewBox="0 0 100 100" fill="none" stroke-width="12" stroke-linecap="round"><path d="M18 12 L50 78" stroke="#8165f3"/><path d="M86 14 L58 56" stroke="#8165f3"/><path d="M50 78 L74 40" stroke="#c9f031"/></svg>';
async function sidebar(){
 const cats=await api('/categories').catch(()=>[]);const h=location.hash;
 const L=(href,i,t)=>`<a href="${href}" class="${h.split('?')[0]===href.split('?')[0]&&(h===href||!href.includes('?'))?'on':''}">${i} ${esc(t)}</a>`;
 $('#side').innerHTML=`<div class="brand">${LOGO}<h3 style="letter-spacing:.4em">VOLTIX</h3><small>SMART TECH, MADE SIMPLE</small></div>
 <div class="nav"><div class="nav-t">YOUR STORE</div>${L('#/','🏠','Home')}${cats.map(c=>L('#/products?category='+c.slug,c.icon,c.name)).join('')}
 <div class="nav-t">ACCOUNT</div>${L('#/wishlist','💜','Wishlist')}${L('#/cart','🛍','Cart')}${L('#/orders','📦','Orders')}${state.user?L('#/profile','👤',state.user.name):L('#/login','👤','Login / Sign up')}
 ${state.user?.role==='admin'?'<a href="/admin/">⚙️ Admin panel</a>':''}</div>`;
 $('#side').classList.remove('open');
}
const PROTECTED=['wishlist','orders','order','profile','checkout'];
async function route(){
 const[path,qs='']=location.hash.slice(2).split('?'),[name='',id]=path.split('/');
 if(PROTECTED.includes(name)&&!state.user){location.hash='#/login';return}
 if((name==='login'||name==='signup')&&state.user){location.hash='#/';return}
 window.scrollTo(0,0);
 try{
  if(name==='')await P.home();else if(name==='products')await P.products(qs);else if(name==='product')await P.product(id);
  else if(name==='cart'){if(!state.user){location.hash='#/login';return}await P.cart()}
  else if(name==='wishlist')await P.wishlist();else if(name==='checkout')await P.checkout();else if(name==='orders')await P.orders();
  else if(name==='order')await P.order(id,qs.includes('new'));else if(name==='profile')await P.profile();
  else if(name==='login'||name==='signup')P.auth(name,()=>{location.hash='#/';sidebar()});
  else $('#view').innerHTML='<div class="panel empty"><b>404</b>Page not found</div>';
 }catch(e){if(e.status===401){state.user=null;location.hash='#/login'}else $('#view').innerHTML=`<div class="panel empty"><b>⚠️</b>${esc(e.message)}</div>`}
 sidebar();
}
(async()=>{
 const t=localStorage.theme||'light';document.documentElement.dataset.theme=t;$('#theme').textContent=t==='dark'?'☀️':'🌙';
 $('#theme').onclick=()=>{const n=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=n;localStorage.theme=n;$('#theme').textContent=n==='dark'?'☀️':'🌙'};
 $('#menu').onclick=()=>$('#side').classList.toggle('open');
 $('#q').onkeydown=e=>{if(e.key==='Enter')location.hash='#/products?q='+encodeURIComponent(e.target.value)};
 try{state.user=(await api('/auth/me')).user;await P.loadWish();await P.refreshCart()}catch{}
 addEventListener('hashchange',route);await route();
 setTimeout(()=>$('#splash').classList.add('hide'),2900); // logo animation plays first
})();
