// Shared helpers + app state
export const state={user:null,cart:[],wish:new Set()};
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); // XSS protection
export const money=n=>'₹'+Number(n).toLocaleString('en-IN');
export const $=s=>document.querySelector(s);
export function toast(msg,bad){const t=document.createElement('div');t.className='toast'+(bad?' bad':'');t.textContent=msg;document.body.append(t);setTimeout(()=>t.remove(),2600);}
export const spinner='<div class="spin" role="status"></div>';
