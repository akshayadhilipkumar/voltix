// AUTH MIDDLEWARE: verifies JWT from httpOnly cookie; admin() blocks non-admin roles
const jwt=require('jsonwebtoken'),db=require('../db');
const SECRET=process.env.JWT_SECRET||'dev-secret-change-me';
const sign=u=>jwt.sign({id:u.id},SECRET,{expiresIn:'7d'});
function auth(req,res,next){
 try{const p=jwt.verify(req.cookies.token,SECRET);
  const u=db.prepare('SELECT id,name,email,role FROM users WHERE id=?').get(p.id);
  if(!u)throw 0;req.user=u;next();}
 catch{res.status(401).json({error:'Please login to continue'});}
}
const admin=(req,res,next)=>req.user.role==='admin'?next():res.status(403).json({error:'Admins only'});
module.exports={sign,auth,admin};
