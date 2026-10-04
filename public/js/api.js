// Thin fetch wrapper: sends cookies, throws readable errors
export async function api(path,{method='GET',body}={}){
 const r=await fetch('/api'+path,{method,headers:{'Content-Type':'application/json'},body:body&&JSON.stringify(body)});
 const d=await r.json().catch(()=>({}));
 if(Array.isArray(d)&&r.headers.has('X-Total-Count'))d.total=+r.headers.get('X-Total-Count');
 if(!r.ok)throw Object.assign(new Error(d.error||'Request failed'),{status:r.status});
 return d;
}
