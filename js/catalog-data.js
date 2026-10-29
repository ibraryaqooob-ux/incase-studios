// INCASE STUDIOS — Official Catalog & Poster Data
// Precision Print & Spec Studio — Manchester, UK
// A4 & A3 Formats, Single Prints for Standard, 3-Piece Sets for Islamic Prints Only

const EXACT_SINGLE_PRICES = {
  "a4": {
    "unframed": { price: 7.00, wasPrice: 7.00, label: "Unframed (Hardback Envelope)" },
    "plastic": { price: 19.20, wasPrice: 19.20, label: "Black Plastic Frame" },
    "aluminium": { price: 22.70, wasPrice: 22.70, label: "Black Aluminium Frame" }
  },
  "a3": {
    "unframed": { price: 10.99, wasPrice: 10.99, label: "Unframed (Hardback Envelope)" },
    "plastic": { price: 22.45, wasPrice: 22.45, label: "Black Plastic Frame" },
    "aluminium": { price: 25.95, wasPrice: 25.95, label: "Black Aluminium Frame" }
  }
};

const EXACT_SET_PRICES = {
  "a4": {
    "unframed": { price: 14.63, wasPrice: 19.00, label: "3-Piece Unframed (Hardback Envelope)" },
    "plastic": { price: 32.34, wasPrice: 42.00, label: "3-Piece Black Plastic Frames" },
    "aluminium": { price: 47.74, wasPrice: 62.00, label: "3-Piece Black Aluminium Frames" }
  },
  "a3": {
    "unframed": { price: 24.64, wasPrice: 32.00, label: "3-Piece Unframed (Hardback Envelope)" },
    "plastic": { price: 52.36, wasPrice: 68.00, label: "3-Piece Black Plastic Frames" },
    "aluminium": { price: 73.15, wasPrice: 95.00, label: "3-Piece Black Aluminium Frames" }
  }
};

const EXACT_CUSTOM_CAR_PRICES = {
  "a4": {
    "unframed": { price: 7.69, wasPrice: 9.99, label: "Unframed (Hardback Envelope)" },
    "plastic": { price: 13.85, wasPrice: 17.99, label: "Black Plastic Frame" },
    "aluminium": { price: 19.99, wasPrice: 25.99, label: "Black Aluminium Frame" }
  },
  "a3": {
    "unframed": { price: 11.54, wasPrice: 14.99, label: "Unframed (Hardback Envelope)" },
    "plastic": { price: 21.55, wasPrice: 27.99, label: "Black Plastic Frame" },
    "aluminium": { price: 29.99, wasPrice: 38.99, label: "Black Aluminium Frame" }
  }
};

const SIZE_OPTIONS = [
  { id: "a4", name: "A4", dimensions: "210 × 297 mm", wallScale: 0.65 },
  { id: "a3", name: "A3", dimensions: "297 × 420 mm", wallScale: 0.95 }
];

const FRAME_OPTIONS = [
  { 
    id: "unframed", 
    name: "Unframed (Hardback Envelope)", 
    shortName: "Unframed",
    desc: "Shipped in protective rigid hardback envelope",
    badge: "UNFRAMED 200GSM GLOSSY PRINT • SHIPPED IN RIGID HARDBACK ENVELOPE",
    depthMm: 0,
    frontFaceMm: 0,
    borderClass: "frame-unframed"
  },
  { 
    id: "plastic", 
    name: "Black Plastic Frame (Backloader Extruded PVC)", 
    shortName: "Black Plastic Frame",
    desc: "9mm slim face • 12mm standard side depth • Lightweight black PVC + shatterproof front.",
    badge: "9MM SLIM FACE • 12MM STANDARD SIDE DEPTH • LIGHTWEIGHT BLACK PVC • SHATTERPROOF FRONT",
    depthMm: 12,
    frontFaceMm: 9,
    borderClass: "frame-black-plastic"
  },
  { 
    id: "aluminium", 
    name: "Black Aluminium Frame (Extruded Anodized Metal — ★ Premium)", 
    shortName: "Black Aluminium Frame",
    desc: "9mm slim face • Thicker 18mm heavy-duty side depth (1.5× thicker) • Sturdier brushed metal profile + tension spring clips.",
    badge: "★ PREMIUM UPGRADE • 9MM SLIM FACE • THICKER 18MM HEAVY-DUTY SIDE DEPTH (1.5×) • STURDIER BRUSHED METAL PROFILE",
    depthMm: 18,
    frontFaceMm: 9,
    borderClass: "frame-black-aluminium"
  }
];

const DEFAULT_POSTERS = [
  {
    "id": "porsche-gt3rs",
    "title": "Porsche 911 GT3 RS (992)",
    "subtitle": "Weissach Package Performance Spec",
    "category": "porsche",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 210,
    "bestseller": true,
    "tags": [
      "Porsche",
      "GT3 RS",
      "992",
      "Weissach",
      "Track Weapon"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Weissach engineering captured in high-contrast technical line art. Features the DRS wing aerodynamics, naturally aspirated 4.0L flat-six telemetry, and Stuttgart manufacturing stamp.",
    "image": "assets/Porsche GT 3RS (Minimalistic).png"
  },
  {
    "id": "bmw-m4-competition",
    "title": "BMW M4 Competition",
    "subtitle": "Precision Track-Bred Coupe (G82)",
    "category": "bmw",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 196,
    "bestseller": true,
    "tags": [
      "BMW",
      "M4 Competition",
      "G82",
      "Coupe",
      "M Power",
      "S58"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Sculpted carbon-fiber roof, aggressive frameless vertical kidney grilles, and 503 HP Bavarian power.",
    "image": "assets/m4 comp face_ copy.PNG"
  },
  {
    "id": "bmw-m3-comp-minimal",
    "title": "BMW M3 Competition",
    "subtitle": "Bavarian M Power Performance Saloon",
    "category": "bmw",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 182,
    "bestseller": true,
    "tags": [
      "BMW",
      "M3 Competition",
      "G80",
      "M Power",
      "S58"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "High-revving S58 twin-turbo 3.0-litre inline-six, carbon bucket specifications, and Munich M GmbH engineering data grid.",
    "image": "assets/Bmw M3 (Minimalistic).png"
  },
  {
    "id": "bmw-m3-touring-g81",
    "title": "BMW M3 Touring Competition",
    "subtitle": "510 HP Ultimate M Estate Spec (G81)",
    "category": "bmw",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 184,
    "bestseller": true,
    "tags": [
      "BMW",
      "M3 Touring",
      "G81",
      "Competition",
      "M xDrive"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "The first official M3 Touring in BMW history. S58 twin-turbo engine with M xDrive all-weather traction and wide estate stance.",
    "image": "assets/m3 touring face_ copy.PNG"
  },
  {
    "id": "bmw-m2-g87",
    "title": "BMW M2 Coupe (G87)",
    "subtitle": "Compact Rear-Wheel Drive Track Weapon",
    "category": "bmw",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 4.9,
    "reviewsCount": 109,
    "bestseller": true,
    "tags": [
      "BMW",
      "M2",
      "G87",
      "M Power",
      "Drift Spec"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Widebody muscular stance, short wheelbase precision, and 453 HP twin-turbo S58 motor delivered in pure rear-wheel drive agility.",
    "image": "assets/M2 g87 face copy.PNG"
  },
  {
    "id": "bmw-m5-competition",
    "title": "BMW M5 Competition",
    "subtitle": "625 HP Executive Super Saloon (F90)",
    "category": "bmw",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 134,
    "bestseller": true,
    "tags": [
      "BMW",
      "M5",
      "Competition",
      "M xDrive",
      "V8 BiTurbo"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Switchable rear-wheel drive mode, 0-60 in 3.1 seconds, and carbon-ceramic brake technical blueprint in dark studio finish.",
    "image": "assets/F50 - M5.PNG"
  },
  {
    "id": "bmw-m3-illustrated",
    "title": "BMW M3 (Illustrated Edition)",
    "subtitle": "Bavarian M Power Illustrated Artwork",
    "category": "bmw",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 4.9,
    "reviewsCount": 89,
    "bestseller": false,
    "tags": [
      "BMW",
      "M3",
      "Illustrated",
      "M Power",
      "G80"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Dynamic illustrated styling highlighting the aggressive front aerodynamic splitters and flared M wheel arches.",
    "image": "assets/m3 cartoon design_.PNG"
  },
  {
    "id": "mercedes-g63-amg",
    "title": "Mercedes G63 AMG",
    "subtitle": "Urban Automotive Performance Spec",
    "category": "amg",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 178,
    "bestseller": true,
    "tags": [
      "Mercedes",
      "G63 AMG",
      "Urban",
      "Affalterbach",
      "V8"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Handcrafted AMG 4.0L V8 BiTurbo with aggressive Urban aero bodywork and side-exit sport exhaust system.",
    "image": "assets/g63 URBAN FACE psd.PNG"
  },
  {
    "id": "mercedes-g63-biturbo-minimal",
    "title": "Mercedes-AMG G63 BiTurbo",
    "subtitle": "Gel\u00e4ndewagen V8 Iconic Spec",
    "category": "amg",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 192,
    "bestseller": true,
    "tags": [
      "Mercedes-AMG",
      "G63",
      "G-Wagon",
      "V8 BiTurbo",
      "Affalterbach"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "The immortal G-Class silhouette. Twin side-exit exhaust pipes, triple differential lock controls, and unmistakable boxy authority.",
    "image": "assets/Mercedes G63 (Minimalistic).png"
  },
  {
    "id": "mercedes-amg-gt-black-series",
    "title": "Mercedes-AMG GT Black Series",
    "subtitle": "Flat-Plane Crank Track Record Holder",
    "category": "amg",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 164,
    "bestseller": true,
    "tags": [
      "Mercedes-AMG",
      "Black Series",
      "Flat-Plane",
      "Record",
      "V8"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Flat-plane crank 720 HP twin-turbo V8 with dual-plane active adjustable carbon rear wing and N\u00fcrburgring pedigree.",
    "image": "assets/merc black series gt cartoon_.PNG"
  },
  {
    "id": "mercedes-e55-amg-w211-cherry",
    "title": "Mercedes-Benz E55 AMG (W211)",
    "subtitle": "5.4L Supercharged V8 Kompressor (Cherry Red)",
    "category": "amg",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 4.9,
    "reviewsCount": 98,
    "bestseller": false,
    "tags": [
      "Mercedes",
      "E55 AMG",
      "W211",
      "Kompressor",
      "V8"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "The supercharged M113K 5.4L V8 torque monster. Finished in rich Cherry Red with AMG twin-spoke monoblock alloys.",
    "image": "assets/cherry red e55 w211 cartoon_.PNG"
  },
  {
    "id": "mercedes-g63-urban-illustrated",
    "title": "Mercedes-AMG G63 Urban Edition (Illustrated)",
    "subtitle": "Widebody Carbon Styling Illustrated Spec",
    "category": "amg",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 4.9,
    "reviewsCount": 87,
    "bestseller": false,
    "tags": [
      "Mercedes-AMG",
      "G63",
      "Urban Automotive",
      "Illustrated"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Bespoke Urban Automotive wide carbon wheel arches, roof light pod, and high-contrast aggressive front fascia.",
    "image": "assets/g63 URBAN FACE cartoon_.PNG"
  },
  {
    "id": "audi-rs6-avant",
    "title": "Audi RS6 Avant",
    "subtitle": "The Apex High-Performance Estate",
    "category": "audi",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 168,
    "bestseller": true,
    "tags": [
      "Audi",
      "RS6 Avant",
      "C8",
      "V8 BiTurbo",
      "Quattro"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Widebody stance, 4.0L twin-turbocharged V8 power, and aggressive matrix LED lighting geometry in minimalist luxury studio spec.",
    "image": "assets/Audi RS6 (Minimalistic).png"
  },
  {
    "id": "audi-rs-q8",
    "title": "Audi RS Q8 Quattro",
    "subtitle": "Super-SUV Performance Spec",
    "category": "audi",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 4.9,
    "reviewsCount": 115,
    "bestseller": false,
    "tags": [
      "Audi",
      "RS Q8",
      "Quattro",
      "Super SUV",
      "V8"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "The apex N\u00fcrburgring-conquering super SUV. 591 HP twin-turbo 4.0L V8 with permanent Quattro all-wheel drive.",
    "image": "assets/Audi Rsq8 (Minimalistic).png"
  },
  {
    "id": "ferrari-296-gtb",
    "title": "Ferrari 296 GTB",
    "subtitle": "830 CV Hybrid V6 Berlinetta",
    "category": "exotic",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 156,
    "bestseller": true,
    "tags": [
      "Ferrari",
      "296 GTB",
      "Maranello",
      "Hybrid",
      "Supercar"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Mid-rear 120-degree turbo V6 engine paired with plug-in electric motor producing 830 CV of Maranello excellence.",
    "image": "assets/Ferrari 296 (Minimalistic).png"
  },
  {
    "id": "lamborghini-huracan-evo",
    "title": "Lamborghini Hurac\u00e1n EVO",
    "subtitle": "Naturally Aspirated 5.2L V10 Spec",
    "category": "exotic",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 175,
    "bestseller": true,
    "tags": [
      "Lamborghini",
      "Hurac\u00e1n",
      "V10",
      "Sant'Agata",
      "Supercar"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Predictive vehicle dynamics (LDVI), elevated twin exhaust ports, and screaming high-RPM induction in stark studio silhouette.",
    "image": "assets/Lamborghini Huracan (Minimalistic).png"
  },
  {
    "id": "lamborghini-urus-performante",
    "title": "Lamborghini Urus Performante",
    "subtitle": "666 CV Super SUV Benchmark",
    "category": "exotic",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 4.9,
    "reviewsCount": 128,
    "bestseller": false,
    "tags": [
      "Lamborghini",
      "Urus",
      "Performante",
      "Super SUV",
      "V8"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Carbon-fiber bonnet with air extractors, Akrapovi\u010d titanium exhaust, and Pikes Peak hillclimb pedigree.",
    "image": "assets/Lamborghini Urus (Minimalistic).png"
  },
  {
    "id": "mclaren-720s-minimal",
    "title": "McLaren 720S",
    "subtitle": "Super Series Carbon Monocage II Spec",
    "category": "exotic",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 147,
    "bestseller": true,
    "tags": [
      "McLaren",
      "720S",
      "Woking",
      "V8 Twin Turbo",
      "Supercar"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Signature eye-socket aerodynamic intakes, dihedral doors, and active rear wing aero telemetry from Woking.",
    "image": "assets/Mclaren 720S (Minimalistic).png"
  },
  {
    "id": "mclaren-720s-illustrated",
    "title": "McLaren 720S (Illustrated Edition)",
    "subtitle": "Twin-Turbo V8 British Aerodynamic Artwork",
    "category": "exotic",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 4.9,
    "reviewsCount": 78,
    "tags": [
      "McLaren",
      "720S",
      "Illustrated",
      "Supercar"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Bold vector lines accentuating the sculpted dihedral door air channels and futuristic alien fascia.",
    "image": "assets/mclaren 720s cartoon_.PNG"
  },
  {
    "id": "mclaren-765lt",
    "title": "McLaren 765LT",
    "subtitle": "Longtail Track Weapon (765 PS)",
    "category": "exotic",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 139,
    "bestseller": true,
    "tags": [
      "McLaren",
      "765LT",
      "Longtail",
      "Woking",
      "Supercar"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Quad-exit titanium exhaust system, active Longtail rear airbrake, and ultra-lightweight MonoCell II carbon chassis.",
    "image": "assets/mclaren 765lt cartoon_.PNG"
  },
  {
    "id": "mclaren-mp4-26-f1",
    "title": "McLaren MP4-26 Formula 1",
    "subtitle": "2011 Grand Prix Winner (Hamilton & Button)",
    "category": "exotic",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 4.9,
    "reviewsCount": 102,
    "bestseller": false,
    "tags": [
      "McLaren",
      "F1",
      "MP4-26",
      "Formula 1",
      "Vodafone"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "The innovative L-shaped sidepod Grand Prix winner driven by Lewis Hamilton and Jenson Button during the 2011 FIA F1 season.",
    "image": "assets/mp4 26 f1 cartoon_.PNG"
  },
  {
    "id": "nissan-skyline-gtr-r34",
    "title": "Nissan Skyline GT-R (R34)",
    "subtitle": "Bayside Blue RB26DETT JDM Legend",
    "category": "exotic",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 230,
    "bestseller": true,
    "tags": [
      "Nissan",
      "Skyline",
      "R34 GTR",
      "RB26",
      "JDM"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Godzilla in Bayside Blue. Multi-function telemetry display, ATTESA E-TS Pro all-wheel drive, and iconic twin round taillights.",
    "image": "assets/nissan skline gtr34 cartoon_.PNG"
  },
  {
    "id": "ford-escort-rs-cosworth",
    "title": "Ford Escort RS Cosworth",
    "subtitle": "Whale-Tail Turbo Rally Legend",
    "category": "exotic",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 133,
    "bestseller": true,
    "tags": [
      "Ford",
      "Escort Cosworth",
      "Whale Tail",
      "Rally",
      "Turbo"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Frank Stephenson's double-deck whale-tail spoiler, Cosworth YBT turbocharged engine, and Group A homologation pedigree.",
    "image": "assets/escort ford cartoon_.PNG"
  },
  {
    "id": "ford-focus-rs-mk3",
    "title": "Ford Focus RS MK3",
    "subtitle": "Drift Mode 2.3L EcoBoost AWD Spec",
    "category": "exotic",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 4.9,
    "reviewsCount": 105,
    "bestseller": false,
    "tags": [
      "Ford",
      "Focus RS",
      "MK3",
      "Nitrous Blue",
      "AWD"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Nitrous Blue rally-derived pocket rocket featuring twin-clutch all-wheel drive and Ken Block inspired drift dynamics.",
    "image": "assets/ford focus rs face_.PNG"
  },
  {
    "id": "land-rover-defender-110-urban",
    "title": "Land Rover Defender 110",
    "subtitle": "Urban Automotive Bespoke Spec",
    "category": "exotic",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 112,
    "bestseller": true,
    "tags": [
      "Land Rover",
      "Defender 110",
      "Urban",
      "V8",
      "4x4"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Aggressive Urban Automotive stance with satin black bonnet vents, 22-inch forged wheels, and quad sport exhaust.",
    "image": "assets/land rover urban defender 110.PNG"
  },
  {
    "id": "volkswagen-golf-gti-mk1-1983",
    "title": "Volkswagen Golf GTI MK1 (1983)",
    "subtitle": "The Original Hot Hatch Heritage Spec",
    "category": "cartoon-cars",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 142,
    "bestseller": true,
    "tags": [
      "Volkswagen",
      "Golf GTI",
      "MK1",
      "Classic",
      "Hot Hatch"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Tartan Clark upholstery, golf-ball gearknob, red grille outline, and lightweight high-revving 1983 chassis blueprint.",
    "image": "assets/1983 golf mk1 face_.PNG"
  },
  {
    "id": "volkswagen-golf-gti-mk2",
    "title": "Volkswagen Golf GTI MK2",
    "subtitle": "16V Hot Hatch Era Benchmark",
    "category": "cartoon-cars",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 4.9,
    "reviewsCount": 94,
    "bestseller": false,
    "tags": [
      "Volkswagen",
      "Golf GTI MK2",
      "16V",
      "Classic",
      "Heritage"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Big bumpers, quad round headlights, 16-valve DOHC responsiveness, and timeless Wolfsburg German design.",
    "image": "assets/golf mk2 cartoon_ 2.PNG"
  },
  {
    "id": "custom-vehicle-poster",
    "title": "Custom Your Car Poster",
    "subtitle": "Bespoke Personal Vehicle Spec Sheet (\u00a37.69 Sale)",
    "category": "custom-car",
    "basePrice": 7.69,
    "wasPrice": 9.99,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 218,
    "bestseller": true,
    "tags": [
      "Custom",
      "Your Car",
      "Bespoke",
      "Made To Order"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Upload a photo of your personal car or motorcycle. Our design studio builds a custom technical blueprint with your registration, horsepower, and factory paint code.",
    "image": "assets/m4 comp face_ copy.PNG"
  },
  {
    "id": "islamic-sacred-sanctuaries-set",
    "title": "The Sacred Sanctuaries Set",
    "subtitle": "Makkah, Madinah & Al-Aqsa (3-Piece Gallery Set)",
    "category": "islamic",
    "basePrice": 14.63,
    "wasPrice": 19.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 178,
    "bestseller": true,
    "tags": [
      "Makkah",
      "Madinah",
      "Al-Aqsa",
      "Islamic",
      "3-Piece Set"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "The three holiest sites in Islam rendered in cohesive gold-accented architectural blueprints. Includes all 3 matching vertical gallery prints.",
    "image": "assets/islamic-panel-2.jpg",
    "triptychImages": [
      "assets/islamic-panel-1.jpg",
      "assets/islamic-panel-2.jpg",
      "assets/islamic-panel-3.jpg"
    ]
  },
  {
    "id": "islamic-daily-remembrance-set",
    "title": "The Daily Remembrance Set",
    "subtitle": "Subhanallah, Alhamdulillah, Allahu Akbar (3-Piece Set)",
    "category": "islamic",
    "basePrice": 14.63,
    "wasPrice": 19.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 195,
    "bestseller": true,
    "tags": [
      "Dhikr",
      "Calligraphy",
      "Tasbih",
      "Minimalist",
      "3-Piece Set"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Daily tasbih rendered in elegant modern Thuluth script on obsidian black background. Includes all 3 matching vertical gallery prints.",
    "image": "assets/islamic-panel-2.jpg",
    "triptychImages": [
      "assets/islamic-panel-1.jpg",
      "assets/islamic-panel-2.jpg",
      "assets/islamic-panel-3.jpg"
    ]
  },
  {
    "id": "islamic-protection-set",
    "title": "The Protection Set (3 Quls)",
    "subtitle": "Surah Al-Ikhlas, Al-Falaq, An-Nas (3-Piece Gallery Set)",
    "category": "islamic",
    "basePrice": 14.63,
    "wasPrice": 19.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 184,
    "bestseller": true,
    "tags": [
      "3 Quls",
      "Protection",
      "Quran",
      "Calligraphy",
      "3-Piece Set"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "The three Quls of protection in gold foil lettering with English translations underneath. Includes all 3 matching vertical gallery prints.",
    "image": "assets/islamic-panel-2.jpg",
    "triptychImages": [
      "assets/islamic-panel-1.jpg",
      "assets/islamic-panel-2.jpg",
      "assets/islamic-panel-3.jpg"
    ]
  },
  {
    "id": "islamic-signature-set",
    "title": "The Signature Islamic Set",
    "subtitle": "Ayat al-Kursi, Shahada & Tawakkul (3-Piece Set)",
    "category": "islamic",
    "basePrice": 14.63,
    "wasPrice": 19.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 210,
    "bestseller": true,
    "tags": [
      "Ayat al-Kursi",
      "Shahada",
      "Tawakkul",
      "3-Piece Set"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Our studio's bestselling gallery set. The Throne Verse, Declaration of Faith, and Reliance on God in warm luxury marble tones. Includes all 3 prints.",
    "image": "assets/islamic-panel-2.jpg",
    "triptychImages": [
      "assets/islamic-panel-1.jpg",
      "assets/islamic-panel-2.jpg",
      "assets/islamic-panel-3.jpg"
    ]
  },
  {
    "id": "islamic-virtues-set",
    "title": "The Virtues Set (Sabr, Shukr, Tawakkul)",
    "subtitle": "Patience, Gratitude, Trust (3-Piece Gallery Set)",
    "category": "islamic",
    "basePrice": 14.63,
    "wasPrice": 19.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 166,
    "bestseller": true,
    "tags": [
      "Sabr",
      "Shukr",
      "Tawakkul",
      "Virtues",
      "3-Piece Set"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "The foundational Islamic character pillars rendered in organic desert sand and deep charcoal contrast. Includes all 3 matching prints.",
    "image": "assets/islamic-panel-2.jpg",
    "triptychImages": [
      "assets/islamic-panel-1.jpg",
      "assets/islamic-panel-2.jpg",
      "assets/islamic-panel-3.jpg"
    ]
  },
  {
    "id": "custom-album-music",
    "title": "Custom Music Album Poster",
    "subtitle": "Your Favorite Song, Waveform & Scannable Code (\u00a37.69)",
    "category": "custom-music",
    "basePrice": 7.69,
    "wasPrice": 9.99,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 162,
    "bestseller": true,
    "tags": [
      "Custom",
      "Album",
      "Scannable Code",
      "Waveform",
      "Music"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Personalize any song or album. We generate scannable streaming codes, actual song audio wavelengths, and custom timestamps.",
    "image": "assets/hero-room-shelf.jpg"
  },
  {
    "id": "custom-family-pet",
    "title": "Custom Family & Pet Portrait",
    "subtitle": "Bespoke High-Definition Art Print (\u00a37.69 Sale)",
    "category": "custom-design",
    "basePrice": 7.69,
    "wasPrice": 9.99,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 182,
    "bestseller": true,
    "tags": [
      "Custom",
      "Family",
      "Pet",
      "Portrait",
      "Upload"
    ],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Upload a photo of your family, dog, cat, or loved one. Our studio enhances the resolution, adjusts lighting, and prints on gallery-grade glossy stock.",
    "image": "assets/hero-room-shelf.jpg"
  },
  {
    "id": "custom-car-poster",
    "title": "Custom Your Car Spec Poster",
    "subtitle": "Personalized Studio Vehicle Print",
    "category": "custom",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 240,
    "bestseller": true,
    "tags": ["Custom", "Car", "Vehicle", "Bespoke", "Spec"],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Custom commission print of your exact car model, exterior color, registration plate, and factory options. Hand-rendered by our automotive design studio.",
    "image": "assets/m4 comp face_ copy.PNG"
  },
  {
    "id": "islamic-ayatul-kursi-set",
    "title": "Ayatul Kursi & Sacred Blueprint Set",
    "subtitle": "3-Piece Architectural Gallery Blueprint",
    "category": "islamic",
    "basePrice": 22.0,
    "wasPrice": 22.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 312,
    "bestseller": true,
    "tags": ["Islamic", "Ayatul Kursi", "Triptych", "Gold", "Blueprint"],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "The majestic Verse of the Throne paired with holy sanctuary blueprints. Includes all 3 matching vertical gallery prints.",
    "image": "assets/islamic-panel-2.jpg",
    "triptychImages": [
      "assets/islamic-panel-1.jpg",
      "assets/islamic-panel-2.jpg",
      "assets/islamic-panel-3.jpg"
    ]
  },
  {
    "id": "isl-01",
    "title": "Ayatul Kursi Blueprint Print",
    "subtitle": "Geometric Islamic Architectural Spec",
    "category": "islamic",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 184,
    "bestseller": true,
    "tags": ["Islamic", "Ayatul Kursi", "Calligraphy", "Blueprint"],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "High-contrast geometric technical Islamic calligraphy of Ayatul Kursi rendered on rich architectural background.",
    "image": "assets/islamic-panel-1.jpg"
  },
  {
    "id": "bmw-m3-g80",
    "title": "BMW M3 Competition (G80)",
    "subtitle": "High-Performance Bavarian Saloon",
    "category": "bmw",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 218,
    "bestseller": true,
    "tags": ["BMW", "M3", "G80", "Competition", "M Power"],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "503 HP S58 twin-turbo inline-six engineering diagram with precision aerodynamic profiles and factory telemetry stamps.",
    "image": "assets/Bmw M3 (Minimalistic).png"
  },
  {
    "id": "ferrari-pista",
    "title": "Ferrari 488 Pista",
    "subtitle": "Special Series V8 Track Masterpiece",
    "category": "ferrari",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 175,
    "bestseller": true,
    "tags": ["Ferrari", "488 Pista", "Maranello", "V8", "Supercar"],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Maranello's track-honed special series featuring the S-Duct aerodynamic nose, 710 HP twin-turbo V8, and Italian racing tri-color stripe.",
    "image": "assets/Ferrari 296 (Minimalistic).png"
  },
  {
    "id": "porsche-turbo-s",
    "title": "Porsche 911 Turbo S (992)",
    "subtitle": "All-Weather Supercar Benchmark",
    "category": "porsche",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 204,
    "bestseller": true,
    "tags": ["Porsche", "Turbo S", "992", "Stuttgart", "AWD"],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "640 HP all-wheel-drive icon with active aerodynamics, side air intakes, and technical chassis specification layout.",
    "image": "assets/Porsche GT 3RS (Minimalistic).png"
  },
  {
    "id": "football-anfield",
    "title": "Anfield Stadium — Liverpool FC",
    "subtitle": "Cathedral of European Football",
    "category": "football",
    "basePrice": 7.0,
    "wasPrice": 7.0,
    "orientation": "portrait",
    "rating": 5.0,
    "reviewsCount": 260,
    "bestseller": true,
    "tags": ["Football", "Liverpool", "Anfield", "Stadium", "Kop"],
    "paperSpec": "Premium 200gsm Heavyweight Glossy Photo Paper",
    "description": "Architectural elevation of the iconic Spion Kop and Main Stand at Anfield with matchday coordinates and historic club crest.",
    "image": "assets/hero-room-shelf.jpg"
  },
];

const ROOM_SCENES = [
  {
    id: "living-room",
    name: "Living Room",
    subtitle: "Beige Sofa & Plants",
    ambient: "warm",
    furnitureSvg: "assets/furniture-living-room.svg",
    description: "Warm textured plaster wall with soft diagonal Venetian blind shadows + low modern beige sofa and tall potted architectural plants",
    initialPos: { x: 50, y: 32 }
  },
  {
    id: "bedroom",
    name: "Bedroom Suite",
    subtitle: "Wood Slat Panelling",
    ambient: "soft",
    furnitureSvg: "assets/furniture-bedroom.svg",
    description: "Warm acoustic vertical wood slat panelling with rich oak grain + minimalist upholstered grey linen headboard",
    initialPos: { x: 50, y: 32 }
  },
  {
    id: "studio-office",
    name: "Gaming / Office",
    subtitle: "Obsidian + RGB LED",
    ambient: "cool",
    furnitureSvg: "assets/furniture-office.svg",
    description: "Deep obsidian matte wall with acoustic foam hex grid + dual-color ambient RGB LED backlighting glow",
    initialPos: { x: 50, y: 32 }
  },
  {
    id: "gallery-loft",
    name: "Gallery Wall",
    subtitle: "Cast Concrete Panel",
    ambient: "dramatic",
    furnitureSvg: "assets/furniture-gallery.svg",
    description: "Authentic architectural cast concrete panel wall with formwork seam lines, tie-rod holes, and overhead gallery spotlight cone",
    initialPos: { x: 50, y: 32 }
  }
];

// Architectural Wall Paint Colors for the Visualizer Wall Zone
const WALL_PAINT_COLORS = [
  { id: "warm-white", name: "Warm Gallery White", hex: "#EAE8E3", isLight: true },
  { id: "studio-sage", name: "Studio Sage", hex: "#CBD2C9", isLight: true },
  { id: "midnight-navy", name: "Midnight Navy", hex: "#1C2536", isLight: false },
  { id: "matte-obsidian", name: "Matte Obsidian", hex: "#1E1E22", isLight: false }
];

// Global Window Exports
if (typeof window !== "undefined") {
  window.EXACT_SINGLE_PRICES = EXACT_SINGLE_PRICES;
  window.EXACT_SET_PRICES = EXACT_SET_PRICES;
  window.EXACT_CUSTOM_CAR_PRICES = EXACT_CUSTOM_CAR_PRICES;
  window.SIZE_OPTIONS = SIZE_OPTIONS;
  window.FRAME_OPTIONS = FRAME_OPTIONS;
  window.DEFAULT_POSTERS = DEFAULT_POSTERS;
  window.ROOM_SCENES = ROOM_SCENES;
  window.WALL_PAINT_COLORS = WALL_PAINT_COLORS;
}

// Instant Asset Preloader (useTexture.preload equivalent)
function preloadCatalogAssets() {
  if (typeof window === "undefined") return;
  const list = (typeof DEFAULT_POSTERS !== "undefined" && Array.isArray(DEFAULT_POSTERS)) ? DEFAULT_POSTERS : [];
  list.forEach(p => {
    if (p && p.image) {
      const img = new Image();
      img.decoding = "sync";
      img.src = p.image;
    }
    if (p && p.triptychImages) {
      p.triptychImages.forEach(src => {
        const img = new Image();
        img.decoding = "sync";
        img.src = src;
      });
    }
  });
}
if (typeof window !== "undefined") {
  window.preloadCatalogAssets = preloadCatalogAssets;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", preloadCatalogAssets);
  } else {
    preloadCatalogAssets();
  }
}
