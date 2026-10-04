// CATALOG: 500 real-brand products (Flipkart-style names with colour / storage variants).
// Prices are approximate Indian market prices for demo use. Edit anything later from the Admin panel.
const rnd=(s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296})(2026); // seeded => same catalog every run
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const EMOJI={smartphones:'📱',laptops:'💻',tablets:'📲',smartwatches:'⌚',audio:'🎧',gaming:'🎮',accessories:'🔌'};
const QUOTA={smartphones:160,laptops:88,tablets:52,smartwatches:55,audio:60,gaming:45,accessories:40}; // = 500
const FAM=[];
const f=(cat,brand,model,tag,price,specs,variants,colours)=>FAM.push({cat,brand,model,tag,price,specs,variants:variants||[['',{},0]],colours});
const st=n=>n>=1024?n/1024+' TB':n+' GB';

// ---------- SMARTPHONES ----------
const ph=(b,m,price,disp,cam,bat,chip,vars,cols,tag)=>f('smartphones',b,m,tag||'5G smartphone',price,{Display:disp,Camera:cam,Battery:bat,Processor:chip},vars.map(([r,s,d])=>[r+' GB RAM, '+st(s),{RAM:r+' GB',Storage:st(s)},d]),cols);
ph('Samsung','Galaxy S24 Ultra 5G',129999,'6.8" QHD+ AMOLED 120Hz','200MP + 50MP + 12MP + 10MP','5000mAh','Snapdragon 8 Gen 3',[[12,256,0],[12,512,10000],[12,1024,30000]],['Titanium Black','Titanium Gray','Titanium Violet','Titanium Yellow'],'Galaxy AI. Built-in S Pen.');
ph('Samsung','Galaxy S24 5G',74999,'6.2" FHD+ AMOLED 120Hz','50MP + 12MP + 10MP','4000mAh','Exynos 2400',[[8,128,0],[8,256,5000]],['Onyx Black','Marble Gray','Cobalt Violet','Amber Yellow'],'Galaxy AI in your hand.');
ph('Samsung','Galaxy A55 5G',39999,'6.6" Super AMOLED 120Hz','50MP OIS + 12MP + 5MP','5000mAh','Exynos 1480',[[8,128,0],[8,256,3000]],['Awesome Navy','Awesome Iceblue','Awesome Lilac'],'Premium metal frame. Great camera.');
ph('Samsung','Galaxy A35 5G',30999,'6.6" Super AMOLED 120Hz','50MP OIS + 8MP + 5MP','5000mAh','Exynos 1380',[[8,128,0],[8,256,3000]],['Awesome Navy','Awesome Iceblue','Awesome Lilac'],'Super AMOLED, IP67.');
ph('Samsung','Galaxy M35 5G',19999,'6.6" Super AMOLED 120Hz','50MP OIS + 8MP + 2MP','6000mAh','Exynos 1380',[[6,128,0],[8,128,2000],[8,256,4000]],['Moonlight Blue','Daybreak Blue','Thunder Grey'],'6000mAh monster battery.');
ph('Samsung','Galaxy F55 5G',26999,'6.7" Super AMOLED+ 120Hz','50MP OIS + 8MP + 2MP','5000mAh','Snapdragon 7 Gen 1',[[8,128,0],[12,256,3000]],['Apricot Crush','Raisin Black'],'Vegan leather back.');
ph('Samsung','Galaxy A15 5G',16499,'6.5" Super AMOLED 90Hz','50MP + 5MP + 2MP','5000mAh','Dimensity 6100+',[[6,128,0],[8,128,1500]],['Blue Black','Light Blue'],'Everyday 5G with AMOLED.');
ph('Samsung','Galaxy Z Flip6 5G',109999,'6.7" Foldable AMOLED 120Hz','50MP + 12MP','4000mAh','Snapdragon 8 Gen 3',[[12,256,0],[12,512,10000]],['Silver Shadow','Blue','Yellow'],'Fold it. Flaunt it.');
ph('Apple','iPhone 15',69900,'6.1" Super Retina XDR OLED','48MP + 12MP','3349mAh','A16 Bionic',[[6,128,0],[6,256,10000],[6,512,30000]],['Black','Blue','Green','Pink','Yellow'],'Dynamic Island. USB-C.');
ph('Apple','iPhone 15 Plus',79900,'6.7" Super Retina XDR OLED','48MP + 12MP','4383mAh','A16 Bionic',[[6,128,0],[6,256,10000],[6,512,30000]],['Black','Blue','Green','Pink','Yellow'],'Big screen, big battery.');
ph('Apple','iPhone 15 Pro',134900,'6.1" Super Retina XDR ProMotion','48MP + 12MP + 12MP','3274mAh','A17 Pro',[[8,128,0],[8,256,10000],[8,512,30000],[8,1024,50000]],['Black Titanium','White Titanium','Blue Titanium','Natural Titanium'],'Titanium. So strong. So light.');
ph('Apple','iPhone 15 Pro Max',159900,'6.7" Super Retina XDR ProMotion','48MP + 12MP + 12MP','4441mAh','A17 Pro',[[8,256,0],[8,512,20000],[8,1024,40000]],['Black Titanium','White Titanium','Blue Titanium','Natural Titanium'],'5x telephoto. Titanium design.');
ph('Apple','iPhone 16',79900,'6.1" Super Retina XDR OLED','48MP + 12MP','3561mAh','A18',[[8,128,0],[8,256,10000],[8,512,30000]],['Black','White','Pink','Teal','Ultramarine'],'Camera Control. Apple Intelligence.');
ph('Apple','iPhone 16 Pro',119900,'6.3" Super Retina XDR ProMotion','48MP + 48MP + 12MP','3582mAh','A18 Pro',[[8,128,0],[8,256,10000],[8,512,30000],[8,1024,50000]],['Black Titanium','White Titanium','Natural Titanium','Desert Titanium'],'Pro camera system.');
ph('Apple','iPhone 14',59900,'6.1" Super Retina XDR OLED','12MP + 12MP','3279mAh','A15 Bionic',[[6,128,0],[6,256,10000]],['Midnight','Blue','Purple','Starlight','Yellow'],'Crash Detection. Great value.');
ph('Apple','iPhone 13',49900,'6.1" Super Retina XDR OLED','12MP + 12MP','3240mAh','A15 Bionic',[[4,128,0],[4,256,10000]],['Midnight','Starlight','Blue','Pink'],'Still a fantastic iPhone.');
ph('OnePlus','12',64999,'6.82" LTPO AMOLED 120Hz','50MP + 48MP + 64MP','5400mAh','Snapdragon 8 Gen 3',[[12,256,0],[16,512,5000]],['Silky Black','Flowy Emerald'],'Hasselblad camera. 100W charging.');
ph('OnePlus','12R',39999,'6.78" LTPO AMOLED 120Hz','50MP + 8MP + 2MP','5500mAh','Snapdragon 8 Gen 2',[[8,128,0],[16,256,4000]],['Cool Blue','Iron Gray'],'Flagship speed, smart price.');
ph('OnePlus','Nord 4 5G',29999,'6.74" AMOLED 120Hz','50MP OIS + 8MP','5500mAh','Snapdragon 7+ Gen 3',[[8,128,0],[8,256,2500],[12,256,4500]],['Mercurial Silver','Obsidian Midnight','Oasis Green'],'All-metal unibody.');
ph('OnePlus','Nord CE4 5G',24999,'6.7" AMOLED 120Hz','50MP OIS + 8MP','5500mAh','Snapdragon 7 Gen 3',[[8,128,0],[8,256,2000]],['Celadon Marble','Dark Chrome'],'100W SUPERVOOC.');
ph('Xiaomi','14',69999,'6.36" LTPO AMOLED 120Hz','50MP Leica + 50MP + 50MP','4610mAh','Snapdragon 8 Gen 3',[[12,512,0]],['Jade Green','Matte Black','White'],'Leica optics.');
ph('Redmi','Note 13 Pro+ 5G',31999,'6.67" AMOLED 120Hz','200MP OIS + 8MP + 2MP','5000mAh','Dimensity 7200 Ultra',[[8,256,0],[12,512,3000]],['Fusion Purple','Fusion Black','Arctic White'],'200MP camera. 120W HyperCharge.');
ph('Redmi','Note 13 5G',17999,'6.67" AMOLED 120Hz','108MP + 2MP','5000mAh','Dimensity 6080',[[6,128,0],[8,256,2000]],['Stealth Black','Arctic White','Prism Gold'],'108MP camera, AMOLED.');
ph('Redmi','13C 5G',10999,'6.74" HD+ 90Hz','50MP + 0.08MP','5000mAh','Dimensity 6100+',[[4,128,0],[6,128,1000],[8,256,2000]],['Starshine Green','Starlight Black','Startrail Silver'],'Budget 5G.','');
ph('POCO','X6 Pro 5G',26999,'6.67" AMOLED 120Hz','64MP OIS + 8MP + 2MP','5000mAh','Dimensity 8300 Ultra',[[8,256,0],[12,512,3000]],['Racing Grey','Spectre Black','Yellow'],'Performance beast.');
ph('POCO','M6 Pro 5G',11999,'6.79" FHD+ 90Hz','50MP + 2MP','5000mAh','Snapdragon 4 Gen 2',[[6,128,0],[8,256,1500]],['Forest Green','Power Black'],'Big display, big value.');
ph('realme','GT 6',40999,'6.78" LTPO AMOLED 120Hz','50MP + 50MP + 8MP','5500mAh','Snapdragon 8s Gen 3',[[8,256,0],[12,256,3000],[16,512,6000]],['Razor Green','Fluid Silver'],'Flagship killer.');
ph('realme','12 Pro+ 5G',29999,'6.7" Curved AMOLED 120Hz','50MP + 64MP Periscope + 8MP','5000mAh','Snapdragon 7s Gen 2',[[8,128,0],[8,256,2000],[12,256,3500]],['Submarine Blue','Navigator Beige'],'Periscope portrait camera.');
ph('realme','Narzo 70 Pro 5G',19999,'6.67" AMOLED 120Hz','50MP Sony OIS + 8MP','5000mAh','Dimensity 7050',[[8,128,0],[8,256,2000]],['Glass Gold','Glass Green'],'Air Gesture. Sony camera.');
ph('realme','C65 5G',10499,'6.67" HD+ 120Hz','50MP + 0.08MP','5000mAh','Dimensity 6300',[[4,128,0],[6,128,1000],[8,128,2000]],['Feather Green','Glowing Black'],'Budget 5G with 120Hz.');
ph('vivo','V30 5G',33999,'6.78" AMOLED 120Hz','50MP OIS + 50MP','5000mAh','Snapdragon 7 Gen 3',[[8,128,0],[8,256,2000],[12,512,5000]],['Andaman Blue','Peacock Green','Classic Black'],'Portrait king with Aura Light.');
ph('vivo','T3 5G',19999,'6.67" AMOLED 120Hz','50MP Sony OIS + 2MP','5000mAh','Dimensity 7200',[[8,128,0],[8,256,2000]],['Crystal Flake','Cosmic Blue'],'Sony IMX882 camera.');
ph('vivo','X100 5G',63999,'6.78" LTPO AMOLED 120Hz','50MP Zeiss + 64MP Periscope + 50MP','5000mAh','Dimensity 9300',[[12,256,0],[16,512,6000]],['Asteroid Black','Stargaze Blue'],'ZEISS APO telephoto.');
ph('vivo','Y28 5G',12999,'6.56" HD+ 90Hz','50MP + 2MP','5000mAh','Dimensity 6020',[[4,128,0],[6,128,1000],[8,128,2000]],['Glitter Aqua','Crystal Purple'],'Budget 5G with 15W charging.');
ph('OPPO','Reno12 Pro 5G',36999,'6.7" Curved AMOLED 120Hz','50MP OIS + 50MP + 8MP','5000mAh','Dimensity 7300 Energy',[[12,256,0],[12,512,4000]],['Sunset Gold','Nebula Silver'],'AI portrait camera.');
ph('OPPO','F25 Pro 5G',23999,'6.7" AMOLED 120Hz','64MP OIS + 8MP + 2MP','5000mAh','Dimensity 7050',[[8,128,0],[8,256,2000]],['Coral Purple','Lava Red'],'Colour-changing design.');
ph('OPPO','A3x 4G',11499,'6.67" HD+ 90Hz','8MP + 0.08MP','5100mAh','Snapdragon 6s 4G',[[4,64,0],[4,128,1000]],['Sparkle Black','Sparkle Purple'],'Military-grade durability.');
ph('Google','Pixel 8',75999,'6.2" Actua OLED 120Hz','50MP + 12MP','4575mAh','Tensor G3',[[8,128,0],[8,256,6000]],['Obsidian','Hazel','Rose'],'The AI phone from Google.');
ph('Google','Pixel 8a',52999,'6.1" OLED 120Hz','64MP + 13MP','4492mAh','Tensor G3',[[8,128,0],[8,256,5000]],['Obsidian','Porcelain','Bay','Aloe'],'7 years of updates.');
ph('Google','Pixel 9',79999,'6.3" Actua OLED 120Hz','50MP + 48MP','4700mAh','Tensor G4',[[12,128,0],[12,256,8000]],['Obsidian','Porcelain','Wintergreen','Peony'],'Gemini built in.');
ph('Motorola','Edge 50 Pro 5G',31999,'6.7" pOLED 144Hz','50MP + 13MP + 10MP','4500mAh','Snapdragon 7 Gen 3',[[8,256,0],[12,256,2000],[12,512,5000]],['Luxe Lavender','Black Beauty','Moonlight Pearl'],'Pantone validated colours.');
ph('Motorola','G84 5G',17999,'6.55" pOLED 120Hz','50MP OIS + 8MP','5000mAh','Snapdragon 695',[[8,128,0],[12,256,2000]],['Viva Magenta','Midnight Blue','Marshmallow Blue'],'pOLED with vegan leather.');
ph('Motorola','G45 5G',9999,'6.5" HD+ 120Hz','50MP + 2MP','5000mAh','Snapdragon 6s Gen 3',[[4,128,0],[8,128,1000],[8,256,2000]],['Brilliant Blue','Vivid Green','Brilliant Green'],'Budget 5G, clean Android.');
ph('Nothing','Phone (2a) 5G',23999,'6.7" Flexible AMOLED 120Hz','50MP + 50MP','5000mAh','Dimensity 7200 Pro',[[8,128,0],[8,256,2000],[12,256,4000]],['Black','White','Milk'],'Glyph interface.');
ph('Nothing','Phone (2) 5G',39999,'6.7" LTPO OLED 120Hz','50MP + 50MP','4700mAh','Snapdragon 8+ Gen 1',[[8,128,0],[12,256,5000],[12,512,10000]],['Dark Grey','White'],'Iconic transparent design.');
ph('CMF by Nothing','Phone 1 5G',15999,'6.67" AMOLED 120Hz','50MP + 2MP','5000mAh','Dimensity 7300',[[6,128,0],[8,128,1000],[8,256,2000]],['Black','Blue','Light Green','Orange'],'Swappable back cases.');
ph('iQOO','12 5G',52999,'6.78" LTPO AMOLED 144Hz','50MP OIS + 50MP + 64MP','5000mAh','Snapdragon 8 Gen 3',[[12,256,0],[16,512,6000]],['Legend','Alpha'],'Gaming flagship with Q1 chip.');
ph('iQOO','Neo 9 Pro 5G',36999,'6.78" AMOLED 144Hz','50MP OIS + 8MP','5160mAh','Snapdragon 8 Gen 2',[[8,128,0],[8,256,2500],[12,256,4000]],['Conqueror Black','Fiery Red'],'Racing-inspired performance.');
ph('iQOO','Z9 5G',19999,'6.67" AMOLED 120Hz','50MP Sony OIS + 2MP','5000mAh','Dimensity 7200',[[8,128,0],[8,256,2000]],['Brushed Green','Graphene Blue'],'Segment-best brightness.');

// ---------- LAPTOPS ----------
const lp=(b,m,price,disp,gpu,bat,vars,cols,tag)=>f('laptops',b,m,tag,price,{Display:disp,GPU:gpu,Battery:bat},vars.map(([c,r,s,d])=>[`${r} GB RAM, ${st(s)} SSD`,{CPU:c,RAM:r+' GB',Storage:st(s)+' SSD'},d]),cols);
lp('Apple','MacBook Air 13" M2',99900,'13.6" Liquid Retina','8-core GPU','Up to 18h',[['Apple M2',8,256,0],['Apple M2',8,512,20000],['Apple M2',16,512,40000]],['Midnight','Starlight','Silver','Space Grey'],'Strikingly thin. Fast M2.');
lp('Apple','MacBook Air 15" M3',134900,'15.3" Liquid Retina','10-core GPU','Up to 18h',[['Apple M3',8,256,0],['Apple M3',16,512,40000]],['Midnight','Starlight','Silver','Space Grey'],'Big display, thin design.');
lp('Apple','MacBook Pro 14" M3 Pro',199900,'14.2" Liquid Retina XDR','14-core GPU','Up to 17h',[['Apple M3 Pro',18,512,0],['Apple M3 Pro',18,1024,40000]],['Space Black','Silver'],'Pro performance.');
lp('Dell','Inspiron 15 3520',42990,'15.6" FHD 120Hz','Intel UHD','Up to 8h',[['Intel Core i5-1235U',8,512,0],['Intel Core i5-1235U',16,512,6000],['Intel Core i7-1255U',16,1024,16000]],['Carbon Black','Platinum Silver'],'Everyday performance.');
lp('Dell','XPS 13 9340',139990,'13.4" OLED 3K','Intel Arc','Up to 14h',[['Intel Core Ultra 7',16,512,0],['Intel Core Ultra 7',32,1024,30000]],['Platinum','Graphite'],'Premium ultraportable.');
lp('Dell','G15 5530 Gaming',84990,'15.6" FHD 120Hz','NVIDIA RTX 3050 6GB','Up to 6h',[['Intel Core i5-13450HX',16,512,0],['Intel Core i7-13650HX',16,1024,20000]],['Dark Shadow Grey'],'Gaming built for speed.');
lp('HP','Pavilion 15',58990,'15.6" FHD IPS','Intel Iris Xe','Up to 9h',[['Intel Core i5-1335U',16,512,0],['Intel Core i7-1355U',16,1024,15000]],['Natural Silver','Warm Gold'],'Reliable all-rounder.');
lp('HP','Victus 15 Gaming',69990,'15.6" FHD 144Hz','NVIDIA RTX 3050 6GB','Up to 7h',[['AMD Ryzen 5 5600H',8,512,0],['AMD Ryzen 5 7535HS',16,512,6000],['Intel Core i5-12450H',16,1024,12000]],['Performance Blue','Mica Silver'],'Game-ready value.');
lp('HP','Envy x360 2-in-1',99990,'14" 2.8K OLED Touch','Intel Iris Xe','Up to 12h',[['AMD Ryzen 7 7730U',16,512,0],['AMD Ryzen 7 7730U',16,1024,12000]],['Meteor Silver'],'2-in-1 with OLED.');
lp('Lenovo','IdeaPad Slim 3',38990,'15.6" FHD','Intel UHD','Up to 8h',[['Intel Core i3-1315U',8,512,0],['Intel Core i5-13420H',16,512,10000]],['Arctic Grey','Abyss Blue'],'Light, slim, student friendly.');
lp('Lenovo','ThinkPad E14 Gen 5',69990,'14" WUXGA IPS','Intel Iris Xe','Up to 12h',[['Intel Core i5-1335U',16,512,0],['Intel Core i7-1355U',16,1024,15000]],['Graphite Black'],'Business-class durability.');
lp('Lenovo','LOQ 15 Gaming',74990,'15.6" FHD 144Hz','NVIDIA RTX 4050 6GB','Up to 6h',[['Intel Core i5-12450H',12,512,0],['AMD Ryzen 7 7840HS',16,512,12000],['Intel Core i7-13650HX',16,1024,22000]],['Storm Grey'],'Entry gaming powerhouse.');
lp('Lenovo','Legion 5 Pro',139990,'16" WQXGA 165Hz','NVIDIA RTX 4060 8GB','Up to 7h',[['AMD Ryzen 7 7745HX',16,1024,0],['AMD Ryzen 9 7945HX',32,1024,20000]],['Storm Grey'],'Pro-level gaming.');
lp('ASUS','Vivobook 15',37990,'15.6" FHD','Intel UHD','Up to 8h',[['Intel Core i3-1215U',8,512,0],['Intel Core i5-1235U',16,512,8000]],['Quiet Blue','Cool Silver'],'Slim everyday laptop.');
lp('ASUS','TUF Gaming F15',72990,'15.6" FHD 144Hz','NVIDIA RTX 3050 4GB','Up to 8h',[['Intel Core i5-11400H',16,512,0],['Intel Core i7-12700H',16,1024,18000]],['Mecha Gray','Graphite Black'],'Military-grade toughness.');
lp('ASUS','ROG Strix G16',149990,'16" QHD+ 240Hz','NVIDIA RTX 4060 8GB','Up to 6h',[['Intel Core i7-13650HX',16,1024,0],['Intel Core i9-13980HX',32,1024,35000]],['Eclipse Gray'],'Republic of Gamers.');
lp('ASUS','Zenbook 14 OLED',89990,'14" 2.8K OLED','Intel Arc','Up to 16h',[['Intel Core Ultra 5',16,512,0],['Intel Core Ultra 7',16,1024,20000]],['Ponder Blue','Foggy Silver'],'Featherlight OLED.');
lp('Acer','Aspire 5',44990,'15.6" FHD IPS','Intel UHD','Up to 8h',[['Intel Core i5-1235U',8,512,0],['Intel Core i5-1335U',16,512,8000]],['Steel Gray'],'Dependable everyday laptop.');
lp('Acer','Nitro V 15',69990,'15.6" FHD 144Hz','NVIDIA RTX 4050 6GB','Up to 7h',[['Intel Core i5-13420H',16,512,0],['Intel Core i7-13620H',16,1024,18000]],['Obsidian Black'],'Entry gaming.');
lp('Acer','Swift Go 14',79990,'14" 2.8K OLED','Intel Arc','Up to 13h',[['Intel Core Ultra 5',16,512,0],['Intel Core Ultra 7',16,1024,20000]],['Pure Silver'],'Lightweight OLED.');
lp('MSI','Thin GF63',59990,'15.6" FHD 144Hz','NVIDIA RTX 4050 6GB','Up to 6h',[['Intel Core i5-12450H',8,512,0],['Intel Core i5-12450H',16,512,6000],['Intel Core i7-12650H',16,1024,16000]],['Black'],'Slim gaming laptop.');
lp('MSI','Modern 14',44990,'14" FHD IPS','Intel UHD','Up to 10h',[['Intel Core i5-1235U',16,512,0],['Intel Core i7-1255U',16,1024,14000]],['Classic Black'],'Business-friendly slim laptop.');
lp('Samsung','Galaxy Book4',54990,'15.6" FHD AMOLED','Intel Iris Xe','Up to 15h',[['Intel Core i5-1335U',8,512,0],['Intel Core i7-1355U',16,512,12000]],['Gray','Silver'],'AMOLED, ecosystem sync.');

// ---------- TABLETS ----------
const tb=(b,m,price,disp,bat,vars,cols,tag)=>f('tablets',b,m,tag,price,{Display:disp,Battery:bat},vars.map(([r,s,d,net])=>[`${r} GB RAM, ${st(s)}${net?', '+net:''}`,{RAM:r+' GB',Storage:st(s)},d]),cols);
tb('Apple','iPad 10th Gen',34900,'10.9" Liquid Retina','Up to 10h',[[4,64,0,'Wi-Fi'],[4,256,15000,'Wi-Fi'],[4,64,15000,'Wi-Fi + Cellular']],['Blue','Pink','Yellow','Silver'],'Colourful and capable.');
tb('Apple','iPad Air M2 11"',59900,'11" Liquid Retina','Up to 10h',[[8,128,0,'Wi-Fi'],[8,256,10000,'Wi-Fi'],[8,512,30000,'Wi-Fi']],['Blue','Purple','Starlight','Space Grey'],'Serious performance, M2 chip.');
tb('Apple','iPad Pro M4 11"',99900,'11" Ultra Retina XDR OLED','Up to 10h',[[8,256,0,'Wi-Fi'],[8,512,20000,'Wi-Fi'],[16,1024,60000,'Wi-Fi']],['Space Black','Silver'],'Impossibly thin. Outrageously powerful.');
tb('Apple','iPad mini 6th Gen',49900,'8.3" Liquid Retina','Up to 10h',[[4,64,0,'Wi-Fi'],[4,256,15000,'Wi-Fi']],['Purple','Starlight','Space Grey'],'Mega power. Mini size.');
tb('Samsung','Galaxy Tab S9 FE',36999,'10.9" LCD 90Hz','8000mAh',[[6,128,0,'Wi-Fi'],[8,256,6000,'Wi-Fi'],[6,128,8000,'5G']],['Gray','Mint','Lavender'],'S Pen included. IP68.');
tb('Samsung','Galaxy Tab S9',72999,'11" Dynamic AMOLED 120Hz','8400mAh',[[8,128,0,'Wi-Fi'],[12,256,8000,'Wi-Fi']],['Graphite','Beige'],'Flagship AMOLED tablet.');
tb('Samsung','Galaxy Tab A9+',16999,'11" LCD 90Hz','7040mAh',[[4,64,0,'Wi-Fi'],[8,128,3000,'Wi-Fi'],[8,128,6000,'5G']],['Graphite','Silver','Navy'],'Big screen for family.');
tb('Lenovo','Tab P12',27999,'12.7" 3K 144Hz','10200mAh',[[8,128,0,'Wi-Fi'],[8,256,4000,'Wi-Fi']],['Storm Grey'],'Large 3K display.');
tb('Lenovo','Tab M10 5G',16999,'10.61" 2K','7700mAh',[[4,64,0,'5G'],[6,128,3000,'5G']],['Luna Grey','Storm Grey'],'Entertainment tablet.');
tb('OnePlus','Pad 2',39999,'12.1" 3K 144Hz','9510mAh',[[8,128,0,'Wi-Fi'],[12,256,5000,'Wi-Fi']],['Nimbus Gray'],'Flagship OnePlus tablet.');
tb('OnePlus','Pad Go',19999,'11.35" 2.4K 90Hz','8000mAh',[[8,128,0,'Wi-Fi'],[8,128,3000,'4G LTE'],[8,256,5000,'4G LTE']],['Twin Mint'],'Affordable big screen.');
tb('Xiaomi','Pad 6',26999,'11" 2.8K 144Hz','8840mAh',[[6,128,0,'Wi-Fi'],[8,256,3000,'Wi-Fi']],['Graphite Gray','Mist Blue'],'Flagship display, mid price.');
tb('Redmi','Pad Pro 5G',24999,'12.1" 2.5K 120Hz','10000mAh',[[6,128,0,'5G'],[8,256,3000,'5G']],['Graphite Gray','Mint Green'],'Big battery, big display.');
tb('realme','Pad 2',17999,'11.5" 2K 120Hz','8360mAh',[[6,128,0,'Wi-Fi'],[8,256,3000,'Wi-Fi']],['Inspiring Green','Imagination Grey'],'Slim, light tablet.');

// ---------- SMARTWATCHES ----------
const sw=(b,m,price,disp,bat,vars,cols,tag,sens)=>f('smartwatches',b,m,tag,price,{Display:disp,Battery:bat,Sensors:sens||'HR, SpO2'},vars,cols);
sw('Apple','Watch Series 9',41900,'1.9" Always-On Retina','18h',[['41mm GPS',{Size:'41mm'},0],['45mm GPS',{Size:'45mm'},3000],['45mm GPS + Cellular',{Size:'45mm'},10000]],['Midnight','Starlight','Pink','Silver'],'Double tap. Brighter display.','HR, ECG, SpO2, Temp');
sw('Apple','Watch Ultra 2',89900,'1.92" Always-On Retina','36h',[['49mm GPS + Cellular',{Size:'49mm'},0]],['Titanium Orange Alpine Loop','Titanium Blue Ocean Band'],'Adventure-ready.','HR, ECG, SpO2, Depth');
sw('Apple','Watch SE (2nd Gen)',29900,'1.57" Retina','18h',[['40mm GPS',{Size:'40mm'},0],['44mm GPS',{Size:'44mm'},3000]],['Midnight','Starlight','Silver'],'Essentials at a great price.');
sw('Samsung','Galaxy Watch6',29999,'1.5" Super AMOLED','40h',[['40mm Bluetooth',{Size:'40mm'},0],['44mm Bluetooth',{Size:'44mm'},3000],['44mm LTE',{Size:'44mm'},8000]],['Graphite','Gold','Silver'],'Advanced sleep coaching.','HR, ECG, BIA, SpO2');
sw('Samsung','Galaxy Watch7',32999,'1.5" Super AMOLED','40h',[['40mm Bluetooth',{Size:'40mm'},0],['44mm Bluetooth',{Size:'44mm'},3000]],['Green','Cream','Silver'],'Galaxy AI on your wrist.','HR, ECG, BIA, SpO2');
sw('Samsung','Galaxy Fit3',4999,'1.6" AMOLED','13 days',[['Standard',{},0]],['Gray','Silver','Pink Gold'],'Light fitness band.');
sw('Noise','ColorFit Pro 5',3999,'1.85" AMOLED','7 days',[['Standard',{},0]],['Jet Black','Silver Grey','Rose Pink','Midnight Blue'],'BT calling, AMOLED display.');
sw('Noise','Pulse 2 Max',1499,'1.85" TFT','10 days',[['Standard',{},0]],['Jet Black','Rose Pink','Silver Grey'],'Bluetooth calling smartwatch.');
sw('boAt','Wave Call 3',1799,'1.83" HD','7 days',[['Standard',{},0]],['Active Black','Cherry Blossom','Deep Blue'],'Bluetooth calling with 700+ faces.');
sw('boAt','Lunar Connect Pro',2999,'1.39" AMOLED','7 days',[['Standard',{},0]],['Active Black','Silver'],'Round-dial AMOLED smartwatch.');
sw('Fire-Boltt','Phoenix Pro',1799,'1.39" HD','7 days',[['Standard',{},0]],['Black','Silver','Blue','Pink'],'Bluetooth calling, 120+ sports modes.');
sw('Fire-Boltt','Ninja Call Pro Plus',1299,'1.83" HD','6 days',[['Standard',{},0]],['Black','Navy Blue','Pink'],'AI voice assistant.');
sw('Amazfit','GTR 4',15999,'1.43" AMOLED','14 days',[['Standard',{},0]],['Superspeed Black','Vintage Brown'],'Dual-band GPS.','HR, SpO2, Stress');
sw('Amazfit','Bip 5',7999,'1.91" LCD','10 days',[['Standard',{},0]],['Soft Black','Cream White','Pink'],'Big screen, BT calling.');
sw('Garmin','Venu Sq 2',24990,'1.41" AMOLED','11 days',[['Standard',{},0]],['Cream Gold','Slate'],'Fitness smartwatch.','HR, SpO2, Stress');
sw('OnePlus','Watch 2',24999,'1.43" AMOLED','100h',[['Standard',{},0]],['Black Steel','Radiant Steel'],'Dual-engine long battery.');
sw('Fastrack','Reflex Vox 2',2495,'1.83" HD','7 days',[['Standard',{},0]],['Black','Blue','Pink'],'Alexa built-in.');
sw('Titan','Smart Pro',9995,'1.43" AMOLED','5 days',[['Standard',{},0]],['Black Strap','Brown Strap'],'Classy smartwatch.');

// ---------- AUDIO ----------
const au=(b,m,price,type,bat,anc,cols,tag,vars)=>f('audio',b,m,tag,price,{Type:type,Battery:bat,Noise:anc,Bluetooth:'5.3'},vars,cols);
const V0=[['',{},0]];
au('Apple','AirPods Pro (2nd Gen) USB-C',24900,'True wireless in-ear','6h (30h with case)','Active ANC',['White'],'Adaptive Audio.',V0);
au('Apple','AirPods (3rd Gen)',17900,'True wireless in-ear','6h (30h with case)','None',['White'],'Spatial Audio.',V0);
au('Apple','AirPods Max',59900,'Over-ear','20h','Active ANC',['Space Grey','Silver','Sky Blue','Pink','Green'],'High-fidelity over-ear.',V0);
au('Sony','WH-1000XM5',29990,'Over-ear','30h','Industry-leading ANC',['Black','Silver','Midnight Blue'],'Best-in-class noise cancelling.',V0);
au('Sony','WF-1000XM5',24990,'True wireless in-ear','8h (24h with case)','Active ANC',['Black','Silver'],'Smallest, best ANC earbuds.',V0);
au('Sony','WH-CH520',3990,'On-ear','50h','None',['Black','Blue','Beige','White'],'50-hour battery.',V0);
au('Sony','ULT Wear',17990,'Over-ear','30h','Active ANC',['Black','White','Forest Gray'],'Massive bass.',V0);
au('Samsung','Galaxy Buds2 Pro',17999,'True wireless in-ear','5h (18h with case)','Active ANC',['Graphite','White','Bora Purple'],'Hi-Fi 24-bit audio.',V0);
au('Samsung','Galaxy Buds FE',7999,'True wireless in-ear','8.5h (30h with case)','Active ANC',['Graphite','White'],'Fan-edition ANC.',V0);
au('boAt','Airdopes 141',1099,'True wireless in-ear','7h (42h with case)','None',['Bold Black','Cherry Blossom','Pearl White','Sky Blue'],'42H playback, ENx tech.',V0);
au('boAt','Rockerz 450',1499,'On-ear','15h','None',['Luscious Black','Aggressive Red','Thunder Blue'],'Bluetooth headphones.',V0);
au('boAt','Nirvana Ion ANC',2499,'True wireless in-ear','8h (120h with case)','Hybrid ANC',['Black','White','Green'],'120H battery.',V0);
au('JBL','Tune 230NC TWS',4999,'True wireless in-ear','8h (40h with case)','Active ANC',['Black','White','Blue','Pink'],'Pure Bass sound.',V0);
au('JBL','Live 770NC',9999,'Over-ear','65h','Adaptive ANC',['Black','Blue','White'],'Spatial sound.',V0);
au('Jabra','Elite 4',6999,'True wireless in-ear','5.5h (22h with case)','Active ANC',['Dark Grey','Navy','Lilac'],'Everyday ANC buds.',V0);
au('OnePlus','Buds Pro 3',11999,'True wireless in-ear','10h (43h with case)','Adaptive ANC',['Midnight Opus','Lunar Radiance'],'Dual drivers.',V0);
au('OnePlus','Nord Buds 2r',1999,'True wireless in-ear','7h (38h with case)','Active ANC',['Deep Grey','Triple Blue'],'12.4mm drivers.',V0);
au('Noise','Buds VS104',999,'True wireless in-ear','7h (45h with case)','None',['Carbon Black','Snow White','Forest Green'],'ENC calling.',V0);
au('Bose','QuietComfort Ultra Headphones',35900,'Over-ear','24h','World-class ANC',['Black','White Smoke'],'Immersive audio.',V0);
au('Sennheiser','Momentum 4',29990,'Over-ear','60h','Adaptive ANC',['Black','White'],'Audiophile sound.',V0);
au('realme','Buds T300',2299,'True wireless in-ear','7h (40h with case)','Active ANC',['Youth White','Stylish Black','Vibrant Blue'],'Dual-drivers, 30dB ANC.',V0);
au('Skullcandy','Hesh ANC',8999,'Over-ear','22h','Active ANC',['Black','Bone'],'Rich bass.',V0);

// ---------- GAMING ----------
const gm=(b,m,price,specs,vars,cols,tag)=>f('gaming',b,m,tag,price,specs,vars,cols);
gm('Sony','PlayStation 5 Slim',49990,{Output:'4K 120fps',Storage:'1 TB SSD'},[['Disc Edition',{},0],['Digital Edition',{},-5000]],['White'],'Play has no limits.');
gm('Sony','PlayStation 5 Pro',69990,{Output:'4K 120fps (8K)',Storage:'2 TB SSD'},V0,['Glacier White'],'Most powerful PlayStation.');
gm('Sony','DualSense Wireless Controller',5990,{Connection:'Bluetooth/USB-C',Haptics:'Adaptive triggers'},V0,['White','Midnight Black','Cosmic Red','Nova Pink','Volcanic Red'],'Haptic feedback.');
gm('Sony','Pulse 3D Wireless Headset',8990,{Connection:'2.4GHz USB',Battery:'12h'},V0,['White','Midnight Black'],'3D Audio.');
gm('Microsoft','Xbox Series X',49990,{Output:'4K 120fps',Storage:'1 TB SSD'},V0,['Black'],'The fastest, most powerful Xbox.');
gm('Microsoft','Xbox Series S',29990,{Output:'1440p 120fps',Storage:'512 GB SSD'},V0,['White','Carbon Black'],'Next-gen performance, small size.');
gm('Microsoft','Xbox Wireless Controller',5390,{Connection:'Bluetooth/USB-C',Battery:'40h (AA)'},V0,['Carbon Black','Robot White','Shock Blue','Pulse Red','Velocity Green'],'Textured grip.');
gm('Nintendo','Switch OLED Model',29999,{Display:'7" OLED',Storage:'64 GB'},V0,['White','Neon Blue/Red'],'Vivid 7-inch OLED screen.');
gm('Nintendo','Switch Lite',19999,{Display:'5.5" LCD',Storage:'32 GB'},V0,['Turquoise','Grey','Yellow'],'Handheld-only Switch.');
gm('Logitech','G102 Gaming Mouse',1295,{DPI:'8000',Connection:'USB'},V0,['Black','White','Lilac'],'Lightsync RGB.');
gm('Logitech','G502 HERO',3995,{DPI:'25600',Connection:'USB'},V0,['Black'],'High-performance gaming mouse.');
gm('Logitech','G Pro X Superlight 2',15995,{DPI:'32000',Connection:'Lightspeed Wireless'},V0,['Black','White','Magenta'],'Under 60 grams.');
gm('Razer','DeathAdder Essential',1999,{DPI:'6400',Connection:'USB'},V0,['Black'],'Ergonomic esports mouse.');
gm('Razer','BlackShark V2 X',3999,{Connection:'3.5mm',Driver:'50mm'},V0,['Black','White'],'Esports headset.');
gm('HyperX','Cloud II Gaming Headset',7499,{Connection:'USB/3.5mm',Sound:'7.1 Surround'},V0,['Red','Gunmetal'],'Legendary comfort.');
gm('Redragon','K552 Kumara Mechanical Keyboard',2499,{Switch:'Outemu Blue',Layout:'TKL'},V0,['Black Red','Rainbow','White'],'Compact mechanical.');
gm('ASUS','ROG Ally',54999,{Display:'7" FHD 120Hz',Storage:'512 GB'},V0,['White'],'Windows handheld.');
gm('Valve','Steam Deck OLED',54999,{Display:'7.4" OLED',Storage:'512 GB'},[['512 GB',{},0],['1 TB',{Storage:'1 TB'},12000]],['Black'],'PC gaming handheld.');
gm('SteelSeries','Arctis Nova 1',7499,{Connection:'3.5mm',Driver:'40mm'},V0,['Black','White'],'Hi-res audio.');
gm('Corsair','HS55 Wireless',6999,{Connection:'Bluetooth + 2.4GHz',Battery:'24h'},V0,['Carbon','White'],'Surround sound.');

// ---------- ACCESSORIES ----------
const ac=(b,m,price,specs,vars,cols,tag)=>f('accessories',b,m,tag,price,specs,vars,cols);
ac('Anker','PowerCore 20000mAh Power Bank',2999,{Capacity:'20000mAh',Output:'22.5W',Ports:'2 USB-A, 1 USB-C'},V0,['Black','White'],'Fast charging anywhere.');
ac('Anker','Nano 30W Charger',1999,{Output:'30W',Ports:'1 USB-C'},V0,['Black','White'],'Compact fast charger.');
ac('Apple','20W USB-C Power Adapter',1900,{Output:'20W',Ports:'1 USB-C'},V0,['White'],'Fast charging for iPhone.');
ac('Apple','MagSafe Charger',4500,{Output:'15W',Connection:'Magnetic'},V0,['White'],'Snap on, charge fast.');
ac('Samsung','45W Super Fast Charger',2499,{Output:'45W',Ports:'USB-C'},V0,['Black','White'],'Super fast charging 2.0.');
ac('Samsung','T7 Portable SSD',8999,{Speed:'1050 MB/s',Connection:'USB 3.2'},[['500 GB',{Storage:'500 GB'},0],['1 TB',{Storage:'1 TB'},4500],['2 TB',{Storage:'2 TB'},13000]],['Gray','Blue'],'Pocket-size SSD.');
ac('SanDisk','Ultra Dual Drive 128GB',1199,{Storage:'128 GB',Connection:'USB-A + USB-C'},V0,['Black'],'OTG pendrive.');
ac('SanDisk','Extreme Portable SSD',9499,{Speed:'1050 MB/s',Connection:'USB 3.2'},[['1 TB',{Storage:'1 TB'},0],['2 TB',{Storage:'2 TB'},8000]],['Black'],'Rugged IP65.');
ac('Logitech','MX Master 3S',9995,{DPI:'8000',Connection:'Bluetooth/Bolt'},V0,['Graphite','Pale Grey'],'Quiet clicks, precise scroll.');
ac('Logitech','K380 Multi-Device Keyboard',2995,{Connection:'Bluetooth',Battery:'2 years'},V0,['Black','Rose','Off-White'],'Type on all devices.');
ac('Mi','Power Bank 3i 20000mAh',2199,{Capacity:'20000mAh',Output:'18W',Ports:'2 USB-A, 1 USB-C'},V0,['Black','Metallic Blue'],'18W fast charging.');
ac('Ambrane','27000mAh Power Bank',2499,{Capacity:'27000mAh',Output:'20W',Ports:'USB-C PD'},V0,['Black','Blue'],'Ultra-high capacity.');
ac('boAt','Type-C Cable 1.5m',299,{Connection:'USB-A to USB-C',Output:'60W'},V0,['Black','Red','Blue'],'Braided fast-charge cable.');
ac('Spigen','Ultra Hybrid Case',1599,{Type:'Clear case',Material:'TPU + PC'},[['iPhone 15',{Fits:'iPhone 15'},0],['iPhone 15 Pro',{Fits:'iPhone 15 Pro'},0],['Galaxy S24',{Fits:'Galaxy S24'},0]],['Crystal Clear','Matte Black'],'Crystal-clear protection.');
ac('Belkin','BoostCharge 3-in-1 Wireless Stand',12999,{Output:'15W',Connection:'MagSafe'},V0,['Black','White'],'Charge phone, watch and buds.');
ac('Portronics','Konnect Hub 6-in-1',1999,{Ports:'HDMI, USB-A, USB-C, SD',Output:'100W PD'},V0,['Grey'],'USB-C multiport hub.');
ac('HP','X1000 Wired Mouse',399,{DPI:'1200',Connection:'USB'},V0,['Black'],'Reliable wired mouse.');
ac('Amazon Basics','HDMI Cable 2m',599,{Resolution:'4K 60Hz',Length:'2m'},V0,['Black'],'High-speed HDMI.');
ac('TP-Link','Archer C6 Wi-Fi Router',2499,{Speed:'AC1200 dual-band',Ports:'4 LAN'},V0,['White'],'Wi-Fi for the whole home.');
ac('Epson','EcoTank L3250 Printer',14999,{Type:'Ink tank all-in-one',Connection:'Wi-Fi'},V0,['Black'],'Low cost-per-page.');

function build(){
 const out=[];
 for(const cat of Object.keys(QUOTA)){
  const pools=FAM.filter(x=>x.cat===cat).map(fm=>{const items=[];
   for(const [vl,vs,d] of fm.variants)for(const c of fm.colours)items.push({fm,vl,vs,d,c});
   return items;});
  const picked=[];let i=0;
  while(picked.length<QUOTA[cat]&&pools.some(p=>i<p.length)){for(const p of pools){if(i<p.length&&picked.length<QUOTA[cat])picked.push(p[i])}i++}
  for(const {fm,vl,vs,d,c} of picked){
   const price=fm.price+d,r=rnd(),mrp=Math.max(price,Math.round(price*(1.05+r*0.2)/(price>5000?100:10))*(price>5000?100:10)-(price>5000?1:0));
   const x=rnd(),stock=x<.03?0:x<.1?1+Math.floor(rnd()*5):10+Math.floor(rnd()*140);
   const meta=[vl,c].filter(Boolean).join(', ');
   const name=`${fm.brand} ${fm.model}`+(meta?` (${c}${vl?', '+vl:''})`:'');
   const specs={...fm.specs,...vs,Colour:c};
   out.push({cat,brand:fm.brand,model:fm.model,name,tagline:fm.tag,price,mrp,stock,
    rating:Math.round((3.9+rnd()*0.9)*10)/10,reviews:Math.floor(40+Math.pow(rnd(),2)*18000),emoji:EMOJI[cat],
    image:`/img/products/${slug(fm.brand+' '+fm.model)}.jpg`,specs,
    description:`${fm.tag} ${fm.brand} ${fm.model}${vl?' ('+vl+')':''} in ${c}. Sold by Voltix with 1-year brand warranty, GST invoice and free delivery.`});
  }
 }
 return out;
}
module.exports={build,slug,QUOTA};
if(require.main===module){const b=build();const by={};b.forEach(p=>by[p.cat]=(by[p.cat]||0)+1);console.log(b.length,by,'brands:',new Set(b.map(p=>p.brand)).size)}
