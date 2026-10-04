const router=require('express').Router(),bcrypt=require('bcryptjs'),db=require('../db'),{sign,auth}=require('../middleware/auth');
const cookieOpt={httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:7*864e5};
const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
router.post('/signup',(req,res)=>{
 const name=String(req.body.name||'').trim(),email=String(req.body.email||'').trim().toLowerCase(),pw=String(req.body.password||'');
 if(name.length<2)return res.status(400).json({error:'Name must be at least 2 characters'});
 if(!emailRe.test(email))return res.status(400).json({error:'Enter a valid email'});
 if(!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pw))return res.status(400).json({error:'Password needs 8+ chars with a letter and a number'});
 if(db.prepare('SELECT 1 FROM users WHERE email=?').get(email))return res.status(409).json({error:'Email already exists'});
 const r=db.prepare("INSERT INTO users(name,email,password,role) VALUES(?,?,?, 'customer')").run(name,email,bcrypt.hashSync(pw,10)); // role forced to customer
 res.cookie('token',sign({id:r.lastInsertRowid}),cookieOpt).json({user:{id:r.lastInsertRowid,name,email,role:'customer'}});
});
router.post('/login',(req,res)=>{
 const email=String(req.body.email||'').trim().toLowerCase(),u=db.prepare('SELECT * FROM users WHERE email=?').get(email);
 if(!u||!bcrypt.compareSync(String(req.body.password||''),u.password))return res.status(401).json({error:'Invalid email or password'});
 res.cookie('token',sign(u),cookieOpt).json({user:{id:u.id,name:u.name,email:u.email,role:u.role}});
});
router.post('/logout',(req,res)=>res.clearCookie('token').json({ok:true}));
router.get('/me',auth,(req,res)=>res.json({user:req.user}));
router.put('/me',auth,(req,res)=>{
 const name=String(req.body.name||'').trim();if(name.length<2)return res.status(400).json({error:'Name too short'});
 db.prepare('UPDATE users SET name=? WHERE id=?').run(name,req.user.id);res.json({user:{...req.user,name}});
});
module.exports=router;
