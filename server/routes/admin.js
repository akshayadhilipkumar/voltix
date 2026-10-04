// ADMIN API: every route needs login (auth) AND role=admin
const router=require('express').Router(),db=require('../db'),{auth,admin}=require('../middleware/auth');
router.use(auth,admin);
const STATUS=['Pending','Confirmed','Processing','Shipped','Delivered'];
router.get('/stats',(q,res)=>res.json({
 products:db.prepare('SELECT COUNT(*) c FROM products').get().c,
 users:db.prepare("SELECT COUNT(*) c FROM users WHERE role='customer'").get().c,
 orders:db.prepare('SELECT COUNT(*) c FROM orders').get().c,
 revenue:db.prepare('SELECT COALESCE(SUM(total),0) s FROM orders').get().s,
 lowStock:db.prepare('SELECT id,name,stock FROM products WHERE stock<=5 ORDER BY stock').all(),
 recent:db.prepare('SELECT o.id,o.total,o.status,o.created_at,u.name FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC LIMIT 5').all()}));
function clean(b){
 const e=[],n=String(b.name||'').trim(),brand=String(b.brand||'').trim(),price=+b.price,mrp=+b.mrp||price,stock=+b.stock,cat=+b.category_id;
 if(n.length<2)e.push('Name required');if(!(price>=0))e.push('Valid price required');if(!(stock>=0&&Number.isInteger(stock)))e.push('Valid stock required');
 if(!db.prepare('SELECT 1 FROM categories WHERE id=?').get(cat))e.push('Valid category required');
 let specs={};try{specs=typeof b.specs==='string'?JSON.parse(b.specs||'{}'):b.specs||{}}catch{e.push('Specs must be valid JSON')}
 return{e,v:[cat,n,String(b.tagline||''),String(b.description||''),price,mrp,stock,brand,String(b.emoji||'📦'),String(b.image||''),JSON.stringify(specs)]};
}
router.get('/products',(q,res)=>res.json(db.prepare('SELECT p.*,c.name category FROM products p JOIN categories c ON c.id=p.category_id ORDER BY p.id DESC').all()));
router.post('/products',(req,res)=>{const{e,v}=clean(req.body);if(e.length)return res.status(400).json({error:e.join(', ')});
 res.json({id:db.prepare('INSERT INTO products(category_id,name,tagline,description,price,mrp,stock,brand,emoji,image,specs) VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(...v).lastInsertRowid});});
router.put('/products/:id',(req,res)=>{const{e,v}=clean(req.body);if(e.length)return res.status(400).json({error:e.join(', ')});
 db.prepare('UPDATE products SET category_id=?,name=?,tagline=?,description=?,price=?,mrp=?,stock=?,brand=?,emoji=?,image=?,specs=? WHERE id=?').run(...v,+req.params.id);res.json({ok:true});});
router.delete('/products/:id',(req,res)=>{db.prepare('DELETE FROM products WHERE id=?').run(+req.params.id);res.json({ok:true});});
router.get('/orders',(q,res)=>res.json(db.prepare('SELECT o.*,u.name,u.email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC').all()));
router.get('/orders/:id',(req,res)=>{const o=db.prepare('SELECT o.*,u.name uname,u.email FROM orders o JOIN users u ON u.id=o.user_id WHERE o.id=?').get(+req.params.id);
 if(!o)return res.status(404).json({error:'Not found'});res.json({...o,address:JSON.parse(o.address),items:db.prepare('SELECT * FROM order_items WHERE order_id=?').all(o.id),events:db.prepare('SELECT status,at FROM order_events WHERE order_id=? ORDER BY id').all(o.id)});});
router.put('/orders/:id/status',(req,res)=>{const o=db.prepare('SELECT status FROM orders WHERE id=?').get(+req.params.id);
 if(!o)return res.status(404).json({error:'Not found'});
 if(STATUS.indexOf(req.body.status)!==STATUS.indexOf(o.status)+1)return res.status(400).json({error:`Next status must be ${STATUS[STATUS.indexOf(o.status)+1]||'none (already delivered)'}`});
 let d=req.body.deliveryDate;if(d&&!/^\d{4}-\d{2}-\d{2}$/.test(d))return res.status(400).json({error:'Delivery date must be YYYY-MM-DD'});
 db.transaction(()=>{db.prepare('UPDATE orders SET status=? WHERE id=?').run(req.body.status,+req.params.id);
  db.prepare('INSERT INTO order_events(order_id,status) VALUES(?,?)').run(+req.params.id,req.body.status);
  if(d)db.prepare('UPDATE orders SET est_delivery=? WHERE id=?').run(d,+req.params.id); // admin can set the promised delivery date
  else if(req.body.status==='Shipped')db.prepare("UPDATE orders SET est_delivery=date('now','+3 day') WHERE id=?").run(+req.params.id); // shipped => ~3 days to deliver
  else if(req.body.status==='Delivered')db.prepare("UPDATE orders SET est_delivery=date('now') WHERE id=?").run(+req.params.id);})();
 res.json({ok:true});});
router.get('/users',(q,res)=>res.json(db.prepare("SELECT id,name,email,role,created_at,(SELECT COUNT(*) FROM orders WHERE user_id=users.id) orders FROM users ORDER BY id DESC").all()));
router.delete('/users/:id',(req,res)=>{if(+req.params.id===req.user.id)return res.status(400).json({error:"You can't delete yourself"});
 const u=db.prepare('SELECT role FROM users WHERE id=?').get(+req.params.id);if(u?.role==='admin')return res.status(400).json({error:'Cannot delete an admin'});
 try{db.prepare('DELETE FROM users WHERE id=?').run(+req.params.id);res.json({ok:true});}catch{res.status(400).json({error:'User has orders; cannot delete'});}});
module.exports=router;
