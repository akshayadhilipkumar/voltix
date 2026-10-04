// INFY AI endpoint. Products come from the DB (grounded). Gemini (optional) only rewrites the explanation using that data.
const router=require('express').Router(),db=require('../db'),{answer}=require('../infy/engine');
const hits=new Map(); // simple rate limit: 20 msgs/min per IP
async function polish(msg,r){
 const key=process.env.GEMINI_API_KEY;if(!key)return null;
 const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),8000);
 try{
  const prompt=`You are INFY, the shopping assistant of Voltix electronics store. Rewrite the DRAFT as a short, friendly answer to the customer. Use ONLY the facts in DRAFT and PRODUCTS. Never invent products, prices or specs. Reply in the same language style as the customer (English/Tanglish). Max 90 words, plain text.\nCUSTOMER: ${msg}\nDRAFT: ${r.reply}\nPRODUCTS: ${JSON.stringify(r.products.map(p=>({name:p.name,price:p.price,specs:p.specs})))}`;
  const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL||'gemini-2.0-flash'}:generateContent`,{method:'POST',signal:ctl.signal,headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
  const d=await res.json();return d.candidates?.[0]?.content?.parts?.[0]?.text?.trim()||null;
 }catch{return null}finally{clearTimeout(t)}
}
router.post('/',async(req,res)=>{
 const ip=req.ip,now=Date.now(),h=(hits.get(ip)||[]).filter(t=>now-t<6e4);
 if(h.length>=20)return res.status(429).json({error:'Too many messages. Please wait a minute.'});
 hits.set(ip,[...h,now]);
 const msg=String(req.body.message||'').trim();
 if(!msg||msg.length>300)return res.status(400).json({error:'Message must be 1-300 characters'});
 const all=db.prepare('SELECT p.*,c.slug cslug FROM products p JOIN categories c ON c.id=p.category_id').all().map(p=>({...p,specs:JSON.parse(p.specs||'{}')}));
 const r=answer(all,msg),ai=r.products.length?await polish(msg,r):null;
 res.json({reply:ai||r.reply,ai:!!ai,table:r.table||null,products:r.products.map(p=>({id:p.id,name:p.name,emoji:p.emoji,price:p.price}))});
});
module.exports=router;
