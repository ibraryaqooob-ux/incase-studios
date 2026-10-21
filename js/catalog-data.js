// INCASE STUDIOS — Official Catalog & Poster Data
// Precision Print & Spec Studio — Manchester, UK
// A4 & A3 Formats, Single Prints for Standard, 3-Piece Sets for Islamic Prints Only

const EXACT_SINGLE_PRICES = {
  "a4": {
    "unframed": { price: 5.39, wasPrice: 7.00, label: "Unframed (Hardback Envelope)" },
    "plastic": { price: 11.55, wasPrice: 15.00, label: "Black Plastic Frame" },
    "aluminium": { price: 17.48, wasPrice: 22.70, label: "Black Aluminium Frame" }
  },
  "a3": {
    "unframed": { price: 9.24, wasPrice: 12.00, label: "Unframed (Hardback Envelope)" },
    "plastic": { price: 19.25, wasPrice: 25.00, label: "Black Plastic Frame" },
    "aluminium": { price: 26.72, wasPrice: 34.70, label: "Black Aluminium Frame" }
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
  // ==========================================
  // --- PORSCHE ---
  // ==========================================
  {
    id: "porsche-gt3rs",
    title: "Porsche 911 GT3 RS (992)",
    subtitle: "Weissach Package Performance Spec",
    category: "porsche",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 184,
    bestseller: true,
    tags: ["Porsche", "GT3 RS", "992", "Weissach", "Track Weapon"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Weissach engineering captured in high-contrast technical line art. Features the DRS wing aerodynamics, naturally aspirated 4.0L flat-six telemetry, and Stuttgart manufacturing stamp.",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "porsche-turbo-s",
    title: "Porsche 911 Turbo S (992)",
    subtitle: "Supercar Benchmark Edition",
    category: "porsche",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 4.9,
    reviewsCount: 112,
    bestseller: false,
    tags: ["Porsche", "Turbo S", "992", "Stuttgart"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "The definition of devastating all-weather acceleration. 640 HP twin-turbo flat-six, active aerodynamics, and full factory performance matrix.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
  },

  // ==========================================
  // --- BMW M-SERIES ---
  // ==========================================
  {
    id: "bmw-m3-g80",
    title: "BMW M3 Competition (G80)",
    subtitle: "Bavarian M Power Performance Spec",
    category: "bmw",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 156,
    bestseller: true,
    tags: ["BMW M3", "G80", "Competition", "M Power", "S58"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "The definitive sports saloon. High-revving S58 twin-turbo 3.0-litre inline-six, carbon bucket specifications, and Munich M GmbH data grid.",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "bmw-m2-g87",
    title: "BMW M2 Coupe (G87)",
    subtitle: "Compact Rear-Wheel Drive Track Weapon",
    category: "bmw",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 4.9,
    reviewsCount: 94,
    bestseller: true,
    tags: ["BMW M2", "G87", "M Power", "Drift Spec"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Widebody muscular stance and short wheelbase precision. 453 HP twin-turbo S58 motor delivered in pure rear-wheel drive agility.",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop"
  },

  // ==========================================
  // --- AUDI RS ---
  // ==========================================
  {
    id: "audi-rs-q8",
    title: "Audi RS Q8 Quattro",
    subtitle: "Super-SUV Performance Spec",
    category: "audi",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 128,
    bestseller: true,
    tags: ["Audi RS", "RS Q8", "Quattro", "Twin Turbo V8"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "The apex Nürburgring-conquering super SUV. 591 HP twin-turbo 4.0L V8 with Quattro permanent all-wheel drive, ceramic braking telemetry, and aggressive honeycomb intake styling.",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "audi-rs6-avant",
    title: "Audi RS6 Avant (C8)",
    subtitle: "The Apex High-Performance Estate",
    category: "audi",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 4.9,
    reviewsCount: 98,
    bestseller: false,
    tags: ["Audi RS6", "C8", "Avant", "Estate", "V8 BiTurbo"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Wide-arch muscular engineering combined with supreme family haulage capability. 591 HP and 800 Nm of twin-turbo torque.",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1200&auto=format&fit=crop"
  },

  // ==========================================
  // --- MERCEDES-AMG ---
  // ==========================================
  {
    id: "amg-g63",
    title: "Mercedes-AMG G63 BiTurbo",
    subtitle: "Geländewagen V8 Iconic Spec",
    category: "amg",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 164,
    bestseller: true,
    tags: ["Mercedes-AMG", "G63", "G-Wagon", "V8 BiTurbo", "Affalterbach"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Handcrafted 4.0L V8 BiTurbo power meets the unmistakable silhouette of the G-Class. Side-exit exhaust acoustics, triple locking differentials, and Affalterbach engineering.",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "amg-gt-black",
    title: "Mercedes-AMG GT Black Series",
    subtitle: "Flat-Plane Crank Track Record Holder",
    category: "amg",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 4.9,
    reviewsCount: 88,
    bestseller: false,
    tags: ["Mercedes-AMG", "Black Series", "GT", "Nurburgring"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "720 HP flat-plane crank V8 engine with dual-tier carbon wing, active front splitter, and lightweight coilover suspension.",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop"
  },

  // ==========================================
  // --- FERRARI & LAMBORGHINI ---
  // ==========================================
  {
    id: "lambo-urus",
    title: "Lamborghini Urus Performante",
    subtitle: "Sant'Agata Bolognese Super SUV Spec",
    category: "exotic",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 147,
    bestseller: true,
    tags: ["Lamborghini", "Urus", "Performante", "Italian Supercar"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Rally-bred composite carbon bodywork, titanium Akrapovič exhaust, and 657 HP twin-turbo V8 thrust.",
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "lambo-revuelto",
    title: "Lamborghini Revuelto V12",
    subtitle: "1,001 HP Hybrid Supercar Apex",
    category: "exotic",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 139,
    bestseller: true,
    tags: ["Lamborghini", "Revuelto", "V12 Hybrid", "1000HP"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Naturally aspirated 6.5-litre V12 screaming to 9,500 RPM coupled to 3 electric motors delivering four-figure horsepower.",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "ferrari-pista",
    title: "Ferrari 488 Pista",
    subtitle: "Maranello Special Series Track Weapon",
    category: "exotic",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 4.9,
    reviewsCount: 115,
    bestseller: false,
    tags: ["Ferrari", "488 Pista", "Maranello", "Rosso Corsa"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "S-Duct aerodynamic wizardry derived directly from Formula 1. 710 HP twin-turbo V8 revving with incandescent Ferrari fury.",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop"
  },

  // ==========================================
  // --- CUSTOM YOUR CAR POSTER (£7.69 sale / £9.99 RRP) ---
  // ==========================================
  {
    id: "custom-car-poster",
    title: "Custom Your Car Poster",
    subtitle: "Bespoke Personal Vehicle Spec Sheet (£7.69 Sale)",
    category: "custom-car",
    basePrice: 7.69,
    wasPrice: 9.99,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 342,
    bestseller: true,
    tags: ["Custom Car", "Bespoke Spec", "Your Vehicle", "Registration Plate", "Gift"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Turn your personal pride and joy into a museum-grade technical spec sheet poster. Send us a photo of your car, your registration plate, and optional modifications. Hand-illustrated and framed in our Manchester studio.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
  },

  // ==========================================
  // --- FOOTBALL & STADIUMS ---
  // ==========================================
  {
    id: "football-ronaldo",
    title: "Cristiano Ronaldo Legend Spec",
    subtitle: "The All-Time Record Scorer No. 7 Spec",
    category: "football",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 284,
    bestseller: true,
    tags: ["Cristiano Ronaldo", "CR7", "Manchester United", "Real Madrid", "Ballon d'Or"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "900+ official goals, 5 Ballon d'Or trophies, 5 Champions League titles. Complete career record telemetry and signature celebration typography.",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "football-palmer",
    title: "Cole Palmer Cold Spec",
    subtitle: "Stamford Bridge Phenom & Playmaker",
    category: "football",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 4.9,
    reviewsCount: 162,
    bestseller: true,
    tags: ["Cole Palmer", "Chelsea FC", "Cold Palmer", "Premier League"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Ice in the veins. Breakthrough season stats, signature shivering celebration, and Stamford Bridge midfield mastery.",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "football-rooney",
    title: "Wayne Rooney 10 Legend Spec",
    subtitle: "253 Manchester United Goals & Bicycle Kick",
    category: "football",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 145,
    bestseller: false,
    tags: ["Wayne Rooney", "Manchester United", "Old Trafford", "Premier League Legend"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "The ultimate English street footballer. All-time leading Manchester United goalscorer, 5 Premier League crowns, and the immortal 2011 Manchester derby bicycle kick.",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "football-anfield",
    title: "Anfield Stadium Blueprint Spec",
    subtitle: "Liverpool Football Club • The Kop Heritage",
    category: "football",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 178,
    bestseller: true,
    tags: ["Anfield", "Liverpool FC", "The Kop", "Stadium Blueprint", "LFC"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Detailed architectural blueprint elevations and structural specifications of Anfield Stadium, home to Liverpool FC since 1892. Features The Spion Kop and Shankly Gates.",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=1200&auto=format&fit=crop"
  },

  // ==========================================
  // --- THROUGH THE YEARS & CARTOON CARS ---
  // ==========================================
  {
    id: "cartoon-mcqueen",
    title: "Lightning McQueen #95 Spec",
    subtitle: "Piston Cup Racing Legend • Rust-Eze Racing",
    category: "cartoon-cars",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 219,
    bestseller: true,
    tags: ["Lightning McQueen", "Cars", "Piston Cup", "Route 66", "Rust-Eze"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Ka-Chow! 7-time Piston Cup Champion specification sheet. Full race-trim V8 telemetry, Lightyear racing slicks, and Radiator Springs Route 66 heritage.",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "through-micra-k11",
    title: "Nissan Micra K11 Through The Years",
    subtitle: "Japanese Cult Runabout (1992-2002)",
    category: "cartoon-cars",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 4.9,
    reviewsCount: 132,
    bestseller: true,
    tags: ["Nissan Micra", "K11", "JDM Cult", "Through The Years"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "The indestructible 90s Japanese runabout turned modern modified cult icon. CG10DE & CG13DE 16-valve engine specs, featherweight chassis stats, and Yokohama design timeline.",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop"
  },

  // ==========================================
  // --- MOVIE & CINEMA POSTERS ---
  // ==========================================
  {
    id: "cinema-interstellar",
    title: "Interstellar — Gargantua Edition",
    subtitle: "Endurance Mission Telemetry & Gravitational Wave Spec",
    category: "cinema",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 198,
    bestseller: true,
    tags: ["Interstellar", "Christopher Nolan", "Gargantua", "Cinema", "Sci-Fi"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "The cosmos rendered in architectural precision. High-density black accretion disk telemetry, Endurance spacecraft orbital vectors, and Hans Zimmer score timestamps printed on 200gsm gloss stock.",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "cinema-dark-knight",
    title: "The Dark Knight — Tumbler Spec",
    subtitle: "Wayne Enterprises Applied Sciences Technical Blueprint",
    category: "cinema",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 4.9,
    reviewsCount: 167,
    bestseller: true,
    tags: ["Batman", "The Dark Knight", "Tumbler", "Gotham", "Cinema"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Wayne Enterprises tactical military bridging vehicle specifications. 5.7L V8 engine telemetry, vectoring flaps, and Gotham City armor plating blueprint.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "cinema-pulp-fiction",
    title: "Pulp Fiction — 1994 Classic",
    subtitle: "Quentin Tarantino Cult Cinema Edition",
    category: "cinema",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 4.9,
    reviewsCount: 142,
    bestseller: false,
    tags: ["Pulp Fiction", "Tarantino", "Mia Wallace", "90s Cinema"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "The iconic 1994 neo-noir classic captured in minimalist typographic layout. Jack Rabbit Slim's dialogue, chapter breaks, and 200gsm high-gloss finish.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop"
  },

  // ==========================================
  // --- MUSIC ALBUM POSTERS ---
  // ==========================================
  {
    id: "music-blonde",
    title: "Frank Ocean — Blonde Spec",
    subtitle: "Boys Don't Cry Studio Tracklist & Frequency Spec",
    category: "music",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 312,
    bestseller: true,
    tags: ["Frank Ocean", "Blonde", "R&B", "Album Art", "Vinyl Spec"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Nikes to Futura Free. Complete 17-track running times, producer credits, and waveform master mastering data printed on 200gsm glossy studio paper.",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "music-igor",
    title: "Tyler, The Creator — IGOR Spec",
    subtitle: "Grammy Winning Alternative Hip-Hop Blueprint",
    category: "music",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 4.9,
    reviewsCount: 188,
    bestseller: false,
    tags: ["Tyler The Creator", "IGOR", "EARFQUAKE", "Album Art"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Vibrant high-contrast studio typography featuring synth frequencies, arrangement notes, and Igor's theme telemetry.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "music-utopia",
    title: "Travis Scott — UTOPIA Spec",
    subtitle: "Circus Maximus Audio Spectrum & Tracklist",
    category: "music",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 4.8,
    reviewsCount: 154,
    bestseller: false,
    tags: ["Travis Scott", "UTOPIA", "Cactus Jack", "Hip Hop"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Raw sonic architectural blueprint. 19 tracks, sonic spectrogram visualizer, and dark industrial aesthetic.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop"
  },

  // ==========================================
  // --- BESPOKE CUSTOM MUSIC & CUSTOM DESIGN ---
  // ==========================================
  {
    id: "custom-music-poster",
    title: "Custom Music Album Poster",
    subtitle: "Your Favorite Song, Waveform & Scannable Code (£7.69)",
    category: "custom-music",
    basePrice: 7.69,
    wasPrice: 9.99,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 276,
    bestseller: true,
    tags: ["Custom Song", "Album Poster", "Spotify Code", "Waveform", "Gift"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Immortalize your favorite song or special memory into an official studio album print. Send us the artist, song title, custom photo, and we generate the scannable music code and soundwave.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "custom-design-poster",
    title: "Generic Custom Bespoke Print",
    subtitle: "High-Res Direct Upload: Art, Pets, Family & Photography",
    category: "custom-design",
    basePrice: 5.39,
    wasPrice: 7.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 189,
    bestseller: true,
    tags: ["Custom Print", "Direct Upload", "Pet Portrait", "Personal Art"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Have any digital photograph, artwork, family memory, or pet photo professionally printed on 200gsm glossy photographic stock and mounted into sleek black frames in our Manchester studio.",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop"
  },

  // ==========================================
  // --- ISLAMIC PRINTS (Exclusive 3-Piece Set Support) ---
  // ==========================================
  {
    id: "isl-01",
    title: "Ayatul Kursi & Throne Verses",
    subtitle: "3-Piece Gallery Set (3 Vertical Prints)",
    category: "islamic",
    basePrice: 14.63,
    wasPrice: 19.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 215,
    bestseller: true,
    tags: ["Ayatul Kursi", "Calligraphy", "Islamic Art", "Triptych", "Quran"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Intricate modern Thuluth script calligraphy depicting the Verse of the Throne. Features balanced geometric borders. Exclusive 3-piece vertical portrait gallery set.",
    image: "assets/islamic-panel-2.jpg",
    triptychImages: [
      "assets/islamic-panel-1.jpg",
      "assets/islamic-panel-2.jpg",
      "assets/islamic-panel-3.jpg"
    ]
  },
  {
    id: "isl-02",
    title: "Sabr, Shukr & Tawakkul",
    subtitle: "Patience, Gratitude & Trust (3-Piece Gallery Set)",
    category: "islamic",
    basePrice: 14.63,
    wasPrice: 19.00,
    orientation: "portrait",
    rating: 4.9,
    reviewsCount: 148,
    bestseller: true,
    tags: ["Sabr", "Shukr", "Tawakkul", "Minimalist Islamic", "Set of 3"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "The three foundational pillars rendered in minimalist high-contrast typography and organic desert sand textures. Exclusive 3-piece vertical portrait gallery set.",
    image: "assets/islamic-panel-2.jpg",
    triptychImages: [
      "assets/islamic-panel-1.jpg",
      "assets/islamic-panel-2.jpg",
      "assets/islamic-panel-3.jpg"
    ]
  },
  {
    id: "isl-03",
    title: "The Holy Kaaba & Makkah Blueprint",
    subtitle: "Architectural Blueprint Triptych (3 Vertical Prints)",
    category: "islamic",
    basePrice: 14.63,
    wasPrice: 19.00,
    orientation: "portrait",
    rating: 5.0,
    reviewsCount: 122,
    bestseller: false,
    tags: ["Makkah", "Kaaba", "Architecture", "Gold Foil Texture"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Architectural blueprint and geometric compass coordinates of the Holy Sanctuary in Makkah. Exclusive 3-piece vertical portrait gallery set.",
    image: "assets/islamic-panel-2.jpg",
    triptychImages: [
      "assets/islamic-panel-1.jpg",
      "assets/islamic-panel-2.jpg",
      "assets/islamic-panel-3.jpg"
    ]
  },
  {
    id: "isl-04",
    title: "Subhanallah, Alhamdulillah, Allahu Akbar",
    subtitle: "Sacred Remembrance Triptych Series (3-Piece Set)",
    category: "islamic",
    basePrice: 14.63,
    wasPrice: 19.00,
    orientation: "portrait",
    rating: 4.9,
    reviewsCount: 104,
    bestseller: false,
    tags: ["Tasbih", "Calligraphy", "Minimalist", "3-Piece Set"],
    paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
    description: "Deep obsidian black backdrop with lustrous silver and platinum calligraphy accents. Exclusive 3-piece vertical portrait gallery set.",
    image: "assets/islamic-panel-2.jpg",
    triptychImages: [
      "assets/islamic-panel-1.jpg",
      "assets/islamic-panel-2.jpg",
      "assets/islamic-panel-3.jpg"
    ]
  }
];

// Photorealistic 100% Front-Facing Architectural Studio Wall Stages (Upper 70% Wall, Lower 30% Furniture Zone)
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


