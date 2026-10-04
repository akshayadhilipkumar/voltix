// INFY ENGINE (pure logic, no DB): understands the request -> ranks REAL products -> explains with their real specs.
const CATS=[['audio',/earbud|headphone|\bbuds\b|airpods|audio/],['smartphones',/\b(phone|phones|mobile|mobiles|smartphone|iphone|galaxy|pixel)\b/],['laptops',/laptop|notebook|macbook|\bbook\b/],['tablets',/tablet|\btab\b/],['smartwatches',/watch/],['accessories',/charger|power ?bank|keyboard|accessor/],['gaming',/gaming|console|controller/]];
const num=s=>parseFloat(String(s||'').replace(/[^\d.]/g,''))||0;
const money=n=>'₹'+Number(n).toLocaleString('en-IN');
function parse(msg){
 const m=msg.toLowerCase();let cat=null;
 for(const[s,re]of CATS)if(re.test(m)){cat=s;break}
 const b=m.match(/(?:under|below|less than|within|upto|up to|max|budget(?: of)?|around)\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)\s*(k|l|lakh)?/)||m.match(/(?:₹|rs\.?)\s*([\d,]+(?:\.\d+)?)\s*(k|l|lakh)?/);
 const budget=b?num(b[1])*(b[2]==='k'?1e3:b[2]?1e5:1):0;
 const ram=/ram/.test(m)&&m.match(/(\d+)\s*gb/)?+m.match(/(\d+)\s*gb/)[1]:0;
 const use=[['programming',/program|coding|developer|software/],['student',/student|college|school/],['gaming',/gaming|gamer|\bgames?\b/],['camera',/camera|photo/],['battery',/battery/]].filter(([,r])=>r.test(m)).map(x=>x[0]);
 const intent=/compar|\bvs\b|versus|difference|differ/.test(m)?'compare':/\bwhy\b|costs? more|worth/.test(m)?'insight':'recommend';
 return{cat,budget,ram,use,intent};
}
function score(p,q){
 let s=p.rating*2,r=[];const S=p.specs;
 if(q.use.includes('programming')){const g=num(S.RAM);s+=g>=16?4:g>=8?1:0;if(/RTX/.test(S.GPU||''))s+=1;r.push(!q.ram&&S.RAM&&S.RAM+' RAM',S.CPU,S.GPU)}
 if(q.use.includes('student')){s-=p.price/10000;r.push(S.Battery&&S.Battery+' battery',p.price<50000&&'pocket-friendly price')}
 if(q.use.includes('gaming')){if(/RTX|4K|Haptics/.test(Object.values(S).join(' ')))s+=3;r.push(S.GPU,S.Output,S.Haptics)}
 if(q.use.includes('camera')){s+=num((S.Camera||'').split('MP')[0])/10;r.push(S.Camera&&S.Camera+' camera')}
 if(q.use.includes('battery'))r.push(S.Battery&&S.Battery+' battery');
 if(q.ram&&S.RAM)r.push(S.RAM+' RAM (you asked '+q.ram+'GB+)');
 if(q.budget)r.push(money(q.budget-p.price)+' under your budget');
 r.push('rated '+p.rating+'/5 by '+p.reviews+' buyers');
 return{p,s,reasons:r.filter(Boolean).slice(0,4)};
}
const fam=p=>(p.brand||'')+' '+(p.model||p.name);
const cheapest=ps=>{const m=new Map();for(const p of ps){const c=m.get(fam(p));if(!c||p.price<c.price)m.set(fam(p),p)}return[...m.values()]}; // one variant per model
function recommend(all,q){
 let pool=all.filter(p=>p.stock>0&&(!q.cat||p.cslug===q.cat));
 const fit=cheapest(pool.filter(p=>(!q.budget||p.price<=q.budget)&&(!q.ram||num(p.specs.RAM)>=q.ram)));
 if(!q.cat&&!q.budget&&!q.use.length)return{reply:"Tell me what you're looking for, like a category, budget or use. Example: \"phone under ₹30,000 with a good camera\".",products:[]};
 if(!fit.length){const near=pool.sort((a,b)=>a.price-b.price).slice(0,2);
  return{reply:near.length?`Nothing matches exactly${q.budget?` under ${money(q.budget)}`:''}. The closest options are ${near.map(p=>p.name+' ('+money(p.price)+')').join(' and ')}.`:"I couldn't find matching products in stock.",products:near};}
 const top=fit.map(p=>score(p,q)).sort((a,b)=>b.s-a.s).slice(0,3);
 return{reply:`Here are my top picks${q.budget?' under '+money(q.budget):''} from our current stock:\n`+top.map((t,i)=>`${i+1}. ${t.p.name} (${money(t.p.price)}): ${t.reasons.join(', ')}.`).join('\n')+`\nMy best pick is ${top[0].p.name}.`,products:top.map(t=>t.p)};
}
const short=p=>((p.brand||'')+' '+(p.model||p.name)).toLowerCase().trim(),shortModel=p=>String(p.model||p.name).toLowerCase().replace(/ (5g|4g)$/,'').trim();
function table(ps){
 const keys=[...new Set(ps.flatMap(p=>Object.keys(p.specs)))];
 return{head:['',...ps.map(p=>p.name)],rows:[['Price',...ps.map(p=>money(p.price))],['Rating',...ps.map(p=>p.rating+' ⭐')],...keys.map(k=>[k,...ps.map(p=>p.specs[k]||'-')])]};
}
function why(a,b){ // a cheaper, b pricier
 const d=Object.keys(b.specs).filter(k=>a.specs[k]&&a.specs[k]!==b.specs[k]).slice(0,3).map(k=>`${k}: ${b.specs[k]} vs ${a.specs[k]}`);
 return`${b.name} costs ${money(b.price-a.price)} more than ${a.name}`+(d.length?`, mainly because of ${d.join('; ')}.`:', mostly due to its higher positioning and rating.');
}
function compare(all,q,msg){
 const m=msg.toLowerCase();let ps=cheapest(all.filter(p=>m.includes(short(p))||m.includes(shortModel(p))));
 if(ps.length<2){if(!q.cat)return{reply:'Which products should I compare? Name two or three, or give a category like "compare laptops".',products:[]};
  ps=cheapest(all.filter(p=>p.cslug===q.cat&&p.stock>0)).sort((a,b)=>b.rating-a.rating).slice(0,3);}
 ps=ps.slice(0,3).sort((a,b)=>a.price-b.price);if(ps.length<2)return{reply:'I need at least two products to compare.',products:ps};
 const lines=ps.slice(1).map(p=>why(ps[0],p));
 return{reply:`Here's a side-by-side of ${ps.map(p=>p.name).join(', ')}.\n`+lines.join('\n'),products:ps,table:table(ps)};
}
function insight(all,q,msg){
 const m=msg.toLowerCase(),ps=cheapest(all.filter(p=>m.includes(short(p))||m.includes(shortModel(p))));
 if(ps.length>=2)return compare(all,q,msg);
 if(ps.length===1){const p=ps[0];return{reply:`${p.name} is ${money(p.price)} (MRP ${money(p.mrp)}, you save ${money(p.mrp-p.price)}). Key specs: ${Object.entries(p.specs).map(([k,v])=>k+' '+v).join(', ')}. ${p.stock<=5?`Only ${p.stock} left in stock.`:'Currently in stock.'}`,products:ps};}
 return recommend(all,q);
}
function answer(all,msg){
 const q=parse(msg);
 return{q,...(q.intent==='compare'?compare(all,q,msg):q.intent==='insight'?insight(all,q,msg):recommend(all,q))};
}
module.exports={answer,parse};
