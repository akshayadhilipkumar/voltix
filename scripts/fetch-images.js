// Downloads REAL product photos for every model in the catalog into public/img/products/.
// Source: Wikimedia Commons (free-licence photos). Needs internet. Safe to re-run: existing files are skipped.
//   usage:  npm run images            (all models)      |   npm run images -- iphone   (only models matching a word)
const fs=require('fs'),path=require('path'),{build,slug}=require('../server/catalog');
const OUT=path.join(__dirname,'../public/img/products'),API='https://commons.wikimedia.org/w/api.php',UA={'User-Agent':'VoltixDemoShop/1.0 (student e-commerce project)'};
fs.mkdirSync(OUT,{recursive:true});
const only=(process.argv[2]||'').toLowerCase(),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const models=[...new Map(build().map(p=>[slug(p.brand+' '+p.model),p])).entries()].filter(([k])=>!only||k.includes(only));
async function find(q){
 const u=API+'?'+new URLSearchParams({action:'query',generator:'search',gsrnamespace:'6',gsrsearch:q,gsrlimit:'8',prop:'imageinfo',iiprop:'url|mime',iiurlwidth:'600',format:'json'});
 const d=await(await fetch(u,{headers:UA})).json();
 const pages=Object.values(d.query?.pages||{}).sort((a,b)=>a.index-b.index);
 const hit=pages.find(p=>/image\/(jpeg|png)/.test(p.imageinfo?.[0]?.mime||''));
 return hit?{url:hit.imageinfo[0].thumburl||hit.imageinfo[0].url,title:hit.title}:null;
}
(async()=>{
 let ok=0,miss=[];const credits=[];
 for(const[key,p]of models){
  const file=path.join(OUT,key+'.jpg');if(fs.existsSync(file)){ok++;continue}
  try{
   const r=await find(`${p.brand} ${p.model.replace(/ (5G|4G)$/,'')}`)||await find(p.model);
   if(!r){miss.push(key);console.log('✗',key);continue}
   const img=await fetch(r.url,{headers:UA});if(!img.ok)throw new Error('HTTP '+img.status);
   fs.writeFileSync(file,Buffer.from(await img.arrayBuffer()));credits.push(`${key}.jpg  <-  ${r.title}  (https://commons.wikimedia.org/wiki/${encodeURIComponent(r.title.replace(/ /g,'_'))})`);
   ok++;console.log('✓',key);
  }catch(e){miss.push(key);console.log('✗',key,e.message)}
  await sleep(400); // be polite to Wikimedia
 }
 if(credits.length)fs.appendFileSync(path.join(OUT,'CREDITS.txt'),credits.join('\n')+'\n');
 console.log(`\nDone: ${ok} photos ready, ${miss.length} not found (those models keep the clean brand illustration).`);
})();
