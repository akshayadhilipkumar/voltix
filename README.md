# Voltix – E-commerce (INFYHACKATHON 2.0)
## Run
    npm install
    cp .env.example .env     # set JWT_SECRET
    npm start                # http://localhost:3000   (admin: /admin/)
First start auto-creates voltix.db and seeds 7 categories, **500 real-brand products** (Samsung, Apple, OnePlus, Dell, Sony…) and the admin user.
Upgrading from the old 12-product demo? Just restart: old demo products are replaced, existing orders/users are kept.
Admin login:
admin@voltix.com / Admin@123  (change after first login!)
## Folders
- server/db.js – schema + seed (DATABASE)
- server/middleware/auth.js – JWT cookie check + admin role guard
- server/routes/{auth,shop,admin}.js – REST API (BACKEND)
- public/ – customer site (index.html, css/style.css, js/*.js)
- public/admin/ – admin panel (index.html, admin.css, admin.js)
## INFY AI
Works out of the box (rule-based understanding over real DB products). For smarter wording add GEMINI_API_KEY in .env (server-side only, never in frontend).

## Product photos
Products show a clean brand illustration by default. To download REAL photos (needs internet, free Wikimedia Commons images):

    npm run images              # all models (takes a few minutes, safe to re-run)
    npm run images -- iphone    # only models containing a word

Photos are saved in public/img/products/ and appear automatically. You can also set any product's Image URL in the Admin panel.

## Orders & delivery
Admin → Orders → "→ Shipped" etc. (asks for a promised delivery date, or leave blank for automatic).
Customers see status timeline + delivery date under Orders.
