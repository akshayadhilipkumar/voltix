// CUSTOMER API: catalog, cart, wishlist, orders. All queries are parameterized (SQL-injection safe).
const router=require('express').Router(),db=require('../db'),{auth}=require('../middleware/auth');
const fs=require('fs'),path=require('path'),IMG=path.join(__dirname,'../../public/img/products');
const photos=()=>{try{return new Set(fs.readdirSync(IMG))}catch{return new Set()}};
// product -> JSON. A local /img/ path is only sent if the photo file exists (otherwise the UI shows clean art instead of a broken image)
const mk=()=>{const have=photos();return p=>p&&{...p,specs:JSON.parse(p.specs||'{}'),image:p.image&&p.image.startsWith('/img/')&&!have.has(path.basename(p.image))?'':p.image}};
router.get('/categories',(q,r)=>r.json(db.prepare('SELECT c.*,(SELECT COUNT(*) FROM products WHERE category_id=c.id) count FROM categories c').all()));
router.get('/brands',(req,res)=>res.json(db.prepare(`SELECT p.brand,COUNT(*) count FROM products p JOIN categories c ON c.id=p.category_id WHERE p.brand IS NOT NULL ${req.query.category?'AND c.slug=?':''} GROUP BY p.brand ORDER BY p.brand`).all(...(req.query.category?[String(req.query.category)]:[]))));
router.get('/products',(req,res)=>{
 const{q,category,brand,sort,min,max}=req.query;const w=[],a=[];
 if(q){w.push('(p.name LIKE ? OR p.brand LIKE ? OR p.tagline LIKE ? OR c.name LIKE ?)');a.push(`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`);}
 if(brand){w.push('p.brand=?');a.push(String(brand));}
 if(category){w.push('c.slug=?');a.push(String(category));}
 if(+min>0){w.push('p.price>=?');a.push(+min);}
 if(+max>0){w.push('p.price<=?');a.push(+max);}
 const order={price_asc:'p.price ASC',price_desc:'p.price DESC',rating:'p.rating DESC',new:'p.id DESC'}[sort]||'p.id ASC'; // whitelist
 const where=w.length?'WHERE '+w.join(' AND '):'',from=`FROM products p JOIN categories c ON c.id=p.category_id ${where}`;
 const total=db.prepare(`SELECT COUNT(*) c ${from}`).get(...a).c,limit=Math.min(Math.max(+req.query.limit||60,1),200),offset=Math.max(+req.query.offset||0,0);
 res.set('X-Total-Count',total).json(db.prepare(`SELECT p.*,c.name category,c.slug cslug ${from} ORDER BY ${order} LIMIT ? OFFSET ?`).all(...a,limit,offset).map(mk()));
});
router.get('/products/:id',(req,res)=>{
 const p=db.prepare('SELECT p.*,c.name category,c.slug cslug FROM products p JOIN categories c ON c.id=p.category_id WHERE p.id=?').get(+req.params.id);
 p?res.json(mk()(p)):res.status(404).json({error:'Product not found'});
});
const cartRows=id=>db.prepare('SELECT p.id,p.name,p.brand,p.emoji,p.image,(SELECT slug FROM categories WHERE id=p.category_id) cslug,p.price,p.stock,c.qty FROM cart c JOIN products p ON p.id=c.product_id WHERE c.user_id=?').all(id).map(mk());
router.get('/cart',auth,(req,res)=>res.json(cartRows(req.user.id)));
router.post('/cart',auth,(req,res)=>{
 const pid=+req.body.productId,add=Math.max(1,+req.body.qty||1),p=db.prepare('SELECT stock FROM products WHERE id=?').get(pid);
 if(!p)return res.status(404).json({error:'Product not found'});
 const cur=db.prepare('SELECT qty FROM cart WHERE user_id=? AND product_id=?').get(req.user.id,pid)?.qty||0;
 if(cur+add>p.stock)return res.status(400).json({error:`Only ${p.stock} in stock`});
 db.prepare('INSERT INTO cart VALUES(?,?,?) ON CONFLICT(user_id,product_id) DO UPDATE SET qty=qty+excluded.qty').run(req.user.id,pid,add);
 res.json(cartRows(req.user.id));
});
router.put('/cart/:pid',auth,(req,res)=>{
 const qty=+req.body.qty,p=db.prepare('SELECT stock FROM products WHERE id=?').get(+req.params.pid);
 if(!p||!(qty>=1))return res.status(400).json({error:'Invalid quantity'});
 if(qty>p.stock)return res.status(400).json({error:`Only ${p.stock} in stock`});
 db.prepare('UPDATE cart SET qty=? WHERE user_id=? AND product_id=?').run(qty,req.user.id,+req.params.pid);res.json(cartRows(req.user.id));
});
router.delete('/cart/:pid',auth,(req,res)=>{db.prepare('DELETE FROM cart WHERE user_id=? AND product_id=?').run(req.user.id,+req.params.pid);res.json(cartRows(req.user.id));});
router.get('/wishlist',auth,(req,res)=>res.json(db.prepare('SELECT p.*,(SELECT slug FROM categories WHERE id=p.category_id) cslug FROM wishlist w JOIN products p ON p.id=w.product_id WHERE w.user_id=?').all(req.user.id).map(mk())));
router.post('/wishlist/:pid',auth,(req,res)=>{
 const a=[req.user.id,+req.params.pid];
 if(db.prepare('SELECT 1 FROM wishlist WHERE user_id=? AND product_id=?').get(...a)){db.prepare('DELETE FROM wishlist WHERE user_id=? AND product_id=?').run(...a);return res.json({saved:false});}
 if(!db.prepare('SELECT 1 FROM products WHERE id=?').get(a[1]))return res.status(404).json({error:'Product not found'});
 db.prepare('INSERT INTO wishlist VALUES(?,?)').run(...a);res.json({saved:true});
});
// ORDERS: stock validated + decremented inside ONE transaction => no overselling, no invalid orders
router.post('/orders',auth,(req,res)=>{
 const a=req.body.address||{};
 for(const k of['name','phone','line','city','pin'])if(!String(a[k]||'').trim())return res.status(400).json({error:`Address: ${k} is required`});
 if(!/^\d{10}$/.test(a.phone))return res.status(400).json({error:'Phone must be 10 digits'});
 if(!/^\d{6}$/.test(a.pin))return res.status(400).json({error:'PIN must be 6 digits'});
 try{
  const id=db.transaction(()=>{
   const items=cartRows(req.user.id);if(!items.length)throw new Error('Your cart is empty');
   for(const i of items)if(i.qty>i.stock)throw new Error(`${i.name}: only ${i.stock} left`);
   const total=items.reduce((s,i)=>s+i.price*i.qty,0);
   const oid=db.prepare("INSERT INTO orders(user_id,total,address,payment,est_delivery) VALUES(?,?,?,?,date('now','+6 day'))").run(req.user.id,total,JSON.stringify(a),'Simulated').lastInsertRowid;
   db.prepare('INSERT INTO order_events(order_id,status) VALUES(?,?)').run(oid,'Pending');
   for(const i of items){
    db.prepare('INSERT INTO order_items(order_id,product_id,name,emoji,price,qty) VALUES(?,?,?,?,?,?)').run(oid,i.id,i.name,i.emoji,i.price,i.qty);
    db.prepare('UPDATE products SET stock=stock-? WHERE id=?').run(i.qty,i.id);}
   db.prepare('DELETE FROM cart WHERE user_id=?').run(req.user.id);return oid;})();
  res.json({orderId:id});
 }catch(e){res.status(400).json({error:e.message});}
});
router.get('/orders',auth,(req,res)=>{
 const items=db.prepare('SELECT name,emoji,qty FROM order_items WHERE order_id=?'),ev=db.prepare("SELECT at FROM order_events WHERE order_id=? AND status='Delivered'");
 res.json(db.prepare('SELECT * FROM orders WHERE user_id=? ORDER BY id DESC').all(req.user.id).map(o=>({...o,items:items.all(o.id),delivered_at:ev.get(o.id)?.at||null})));});
router.get('/orders/:id',auth,(req,res)=>{
 const o=db.prepare('SELECT * FROM orders WHERE id=? AND user_id=?').get(+req.params.id,req.user.id);
 if(!o)return res.status(404).json({error:'Order not found'});
 res.json({...o,address:JSON.parse(o.address),items:db.prepare('SELECT * FROM order_items WHERE order_id=?').all(o.id),events:db.prepare('SELECT status,at FROM order_events WHERE order_id=? ORDER BY id').all(o.id)});
});
module.exports=router;
