// DATABASE LAYER: schema + seed data (SQLite file voltix.db). Same tables work in PostgreSQL/Supabase.
const Database=require('better-sqlite3'),bcrypt=require('bcryptjs'),path=require('path');
const db=new Database(path.join(__dirname,'../voltix.db'));
db.pragma('foreign_keys=ON');
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'customer',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS categories(id INTEGER PRIMARY KEY,name TEXT UNIQUE NOT NULL,slug TEXT UNIQUE NOT NULL,icon TEXT);
CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY,category_id INTEGER NOT NULL REFERENCES categories(id),name TEXT NOT NULL,tagline TEXT,description TEXT,price INTEGER NOT NULL CHECK(price>=0),mrp INTEGER NOT NULL,stock INTEGER NOT NULL DEFAULT 0 CHECK(stock>=0),rating REAL DEFAULT 4.5,reviews INTEGER DEFAULT 0,brand TEXT,model TEXT,emoji TEXT,image TEXT,specs TEXT DEFAULT '{}',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS cart(user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,qty INTEGER NOT NULL CHECK(qty>0),PRIMARY KEY(user_id,product_id));
CREATE TABLE IF NOT EXISTS wishlist(user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,PRIMARY KEY(user_id,product_id));
CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),total INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'Pending',address TEXT NOT NULL,payment TEXT,est_delivery TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS order_items(id INTEGER PRIMARY KEY,order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,product_id INTEGER,name TEXT NOT NULL,emoji TEXT,price INTEGER NOT NULL,qty INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS order_events(id INTEGER PRIMARY KEY,order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,status TEXT NOT NULL,at TEXT DEFAULT CURRENT_TIMESTAMP);
`);
// MIGRATION for databases created by older versions (adds new columns without losing data)
const has=(t,c)=>db.prepare(`PRAGMA table_info(${t})`).all().some(x=>x.name===c);
[['products','brand'],['products','model'],['orders','est_delivery']].forEach(([t,c])=>{if(!has(t,c))db.exec(`ALTER TABLE ${t} ADD COLUMN ${c} TEXT`)});
db.exec("INSERT INTO order_events(order_id,status,at) SELECT id,'Pending',created_at FROM orders WHERE id NOT IN(SELECT order_id FROM order_events)");
db.exec("UPDATE orders SET est_delivery=date(created_at,'+6 day') WHERE est_delivery IS NULL");
function seed(){
 const{build}=require('./catalog');
 const cats=[['Smartphones','smartphones','📱'],['Laptops','laptops','💻'],['Tablets','tablets','📲'],['Smartwatches','smartwatches','⌚'],['Earbuds & headphones','audio','🎧'],['Gaming','gaming','🎮'],['Accessories','accessories','🔌']];
 const ic=db.prepare('INSERT OR IGNORE INTO categories(name,slug,icon) VALUES(?,?,?)');cats.forEach(c=>ic.run(...c));
 // First run OR old demo data (12 "Nexora" products) => load the 500-product real-brand catalog.
 const n=db.prepare('SELECT COUNT(*) c FROM products').get().c,old=db.prepare("SELECT COUNT(*) c FROM products WHERE name LIKE 'Nexora%'").get().c;
 if(n<100||old){
  const cid=Object.fromEntries(db.prepare('SELECT id,slug FROM categories').all().map(c=>[c.slug,c.id]));
  const ins=db.prepare('INSERT INTO products(category_id,name,tagline,description,price,mrp,stock,rating,reviews,brand,model,emoji,image,specs) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  db.transaction(()=>{db.prepare('DELETE FROM products').run(); // cart/wishlist rows cascade; past orders keep their own item names
   build().forEach(p=>ins.run(cid[p.cat],p.name,p.tagline,p.description,p.price,p.mrp,p.stock,p.rating,p.reviews,p.brand,p.model,p.emoji,p.image,JSON.stringify(p.specs)));})();
  console.log('Seeded '+db.prepare('SELECT COUNT(*) c FROM products').get().c+' products.');
 }
 if(!db.prepare("SELECT 1 FROM users WHERE role='admin'").get()){
  db.prepare('INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)').run('Voltix Admin','admin@voltix.com',bcrypt.hashSync('Admin@123',10),'admin');
  console.log('Admin: admin@voltix.com / Admin@123');}
}
seed();
module.exports=db;
