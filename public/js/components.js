import{esc,money,state}from'./ui.js';
// ---- Product pictures -------------------------------------------------------
// Uses the real photo at p.image (e.g. /img/products/samsung-galaxy-s24-5g.jpg).
// If the file is missing, it draws a clean brand-coloured device picture instead (never an emoji).
const COL=[['black','#2b2b30'],['onyx','#2b2b30'],['midnight','#1f2937'],['navy','#1e3a8a'],['blue','#3b82f6'],['iceblue','#93c5fd'],['violet','#8b5cf6'],['purple','#8b5cf6'],['lilac','#c4b5fd'],['lavender','#c4b5fd'],['yellow','#facc15'],['amber','#f59e0b'],['gold','#d4a95a'],['orange','#fb923c'],['red','#ef4444'],['pink','#f472b6'],['rose','#fb7185'],['green','#22c55e'],['mint','#6ee7b7'],['teal','#14b8a6'],['white','#e5e7eb'],['silver','#cbd5e1'],['starlight','#e7e2d8'],['gr','#8b95a5'],['titanium','#8b95a5'],['cobalt','#4f6bd8'],['marble','#9ca3af']];
const colour=n=>{n=String(n).toLowerCase();for(const[k,v]of COL)if(n.includes(k))return v;return'#8165f3'};
const SHAPE={
 smartphones:c=>`<rect x="70" y="14" width="60" height="132" rx="12" fill="${c}"/><rect x="75" y="22" width="50" height="116" rx="7" fill="#fff" opacity=".18"/><circle cx="82" cy="30" r="5" fill="#000" opacity=".45"/><circle cx="94" cy="30" r="3" fill="#000" opacity=".3"/>`,
 laptops:c=>`<rect x="38" y="30" width="124" height="80" rx="7" fill="${c}"/><rect x="44" y="36" width="112" height="68" rx="3" fill="#fff" opacity=".2"/><path d="M20 116h160l-10 14H30z" fill="${c}" opacity=".85"/>`,
 tablets:c=>`<rect x="46" y="20" width="108" height="124" rx="12" fill="${c}"/><rect x="53" y="28" width="94" height="108" rx="5" fill="#fff" opacity=".2"/>`,
 smartwatches:c=>`<rect x="82" y="6" width="36" height="34" rx="8" fill="${c}" opacity=".7"/><rect x="82" y="120" width="36" height="34" rx="8" fill="${c}" opacity=".7"/><rect x="66" y="36" width="68" height="88" rx="20" fill="${c}"/><rect x="72" y="44" width="56" height="72" rx="14" fill="#fff" opacity=".2"/>`,
 audio:c=>`<path d="M52 92V80a48 48 0 0 1 96 0v12" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/><rect x="40" y="86" width="26" height="46" rx="12" fill="${c}"/><rect x="134" y="86" width="26" height="46" rx="12" fill="${c}"/>`,
 gaming:c=>`<rect x="30" y="52" width="140" height="68" rx="34" fill="${c}"/><rect x="56" y="76" width="30" height="8" rx="3" fill="#fff" opacity=".6"/><rect x="67" y="65" width="8" height="30" rx="3" fill="#fff" opacity=".6"/><circle cx="130" cy="72" r="6" fill="#fff" opacity=".6"/><circle cx="147" cy="88" r="6" fill="#fff" opacity=".6"/>`,
 accessories:c=>`<rect x="78" y="22" width="44" height="64" rx="8" fill="${c}"/><rect x="90" y="86" width="20" height="26" fill="${c}" opacity=".7"/><path d="M100 112v22" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`};
export function art(p){
 const c=colour(p.name),sh=(SHAPE[p.cslug]||SHAPE.accessories)(c),b=String(p.brand||'').slice(0,18).replace(/[<>&"']/g,'');
 return'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 170"><ellipse cx="100" cy="152" rx="62" ry="6" fill="#000" opacity=".12"/>${sh}<text x="100" y="168" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="#6b6a85">${b}</text></svg>`);
}
export function pimg(p,cls=''){const f=art(p);
 return`<img class="pi ${cls}" src="${esc(p.image||f)}" data-f="${esc(f)}" alt="${esc(p.name)}" loading="lazy" onerror="this.onerror=null;this.src=this.dataset.f">`}
export function card(p,i=0){
 const off=Math.round((1-p.price/p.mrp)*100),st=p.stock===0?'<span class="out">Out of stock</span>':p.stock<=5?'<span class="low">Low stock</span>':'<span class="ok">In stock</span>';
 return`<div class="card" data-id="${p.id}" style="animation-delay:${Math.min(i,8)*50}ms">
 ${off>0?`<span class="disc">-${off}%</span>`:''}<button class="heart" data-w="${p.id}" aria-label="Wishlist">${state.wish.has(p.id)?'💜':'🤍'}</button>
 <div class="img">${pimg(p)}</div><div class="bd">${esc(p.brand||'')}</div><h3>${esc(p.name)}</h3><div class="t">${esc(p.tagline)}</div>
 <div class="row"><span class="price">${money(p.price)}<s>${money(p.mrp)}</s></span></div>
 <div class="row"><span>⭐ ${p.rating} · ${st}</span><button class="btn sm" data-c="${p.id}" ${p.stock?'':'disabled'}>ADD TO CART</button></div></div>`;
}
export const empty=(i,t)=>`<div class="empty"><b>${i}</b>${t}</div>`;
export const media=p=>pimg(p); // used by product page, cart and checkout (same photo/illustration logic as cards)
