// INCASE STUDIOS — Official Application Logic
// Refined Luxury Architectural Grey, Single Clean Poster Images, Glitch-Free Studio Hover

let allPosters = (typeof DEFAULT_POSTERS !== "undefined" && Array.isArray(DEFAULT_POSTERS)) ? [...DEFAULT_POSTERS] : [];
let activeCategory = "all";
let searchQuery = "";
let sortBy = "bestseller";

let currentCustomizingPoster = null;
let selectedSize = "a4";          // 'a4' or 'a3'
let selectedFrame = "plastic";    // 'unframed', 'plastic', 'aluminium'
let isTriptychMode = false;       // exclusively for Islamic prints
let isModalProfileZoomActive = false; // 3D Side-Profile Zoom
let cart = [];

// Hero Showcase 4 Curated Shelf Pairs (Verified Catalog URLs, Zero Transparency)
const HERO_POSTERS_DATA = [
  {
    id: "porsche-gt3rs",
    leftId: "porsche-gt3rs",
    leftTitle: "Porsche 911 GT3 RS (992)",
    leftImage: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1000&auto=format&fit=crop",
    rightId: "bmw-m3-g80",
    rightTitle: "BMW M3 Competition (G80)",
    rightImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000&auto=format&fit=crop",
    caption: "Porsche GT3 RS (A3) & BMW M3 Comp (A4)"
  },
  {
    id: "ferrari-pista",
    leftId: "ferrari-pista",
    leftTitle: "Ferrari 488 Pista",
    leftImage: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop",
    rightId: "bmw-m2-g87",
    rightTitle: "BMW M2 Coupe (G87)",
    rightImage: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop",
    caption: "Ferrari 488 Pista (A3) & BMW M2 Coupe (A4)"
  },
  {
    id: "custom-car-poster",
    leftId: "custom-car-poster",
    leftTitle: "Custom Your Car Poster",
    leftImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop",
    rightId: "audi-rs-q8",
    rightTitle: "Audi RS Q8 Quattro",
    rightImage: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1000&auto=format&fit=crop",
    caption: "Custom Your Car Spec Poster — From £7.69"
  },
  {
    id: "isl-01",
    leftId: "isl-01",
    leftTitle: "Ayatul Kursi & Throne Verses",
    leftImage: "assets/islamic-panel-2.jpg",
    rightId: "isl-03",
    rightTitle: "The Holy Kaaba & Makkah Blueprint",
    rightImage: "assets/islamic-panel-3.jpg",
    caption: "Islamic 3-Piece Gallery Sets — From £14.63"
  }
];
let currentHeroIndex = 0;

function switchHeroPoster(idx, shouldScroll = false) {
  currentHeroIndex = idx;
  const item = HERO_POSTERS_DATA[idx];
  if (!item) return;

  const updateImgSafe = (elId, src, alt, posterId) => {
    const el = document.getElementById(elId);
    if (!el) return;
    el.style.opacity = "1";
    el.onerror = function() {
      handlePosterImageError(this, posterId);
    };
    el.src = src;
    el.alt = alt;
  };

  // Update Left (A3) and Right (A4) Shelf Frames at 100% full opacity
  updateImgSafe("heroMainPosterImg", item.leftImage, item.leftTitle, item.leftId);
  updateImgSafe("heroMainPosterImgMobile", item.leftImage, item.leftTitle, item.leftId);
  updateImgSafe("heroAngledPosterImg", item.rightImage, item.rightTitle, item.rightId);
  updateImgSafe("heroAngledPosterImgMobile", item.rightImage, item.rightTitle, item.rightId);

  // Update Live Shelf Captions
  const capMobile = document.getElementById("heroShelfCaptionMobile");
  if (capMobile) capMobile.textContent = `On Shelf: ${item.caption}`;
  const capDesktop = document.getElementById("heroShelfCaptionDesktop");
  if (capDesktop) capDesktop.textContent = `On Shelf: ${item.caption}`;

  for (let i = 0; i < HERO_POSTERS_DATA.length; i++) {
    const isActive = (i === idx);
    const tab = document.getElementById(`heroTab${i}`);
    if (tab) {
      tab.classList.toggle("active", isActive);
      tab.classList.toggle("bg-zinc-950", isActive);
      tab.classList.toggle("text-white", isActive);
      tab.classList.toggle("font-black", isActive);
      tab.classList.toggle("bg-white", !isActive);
      tab.classList.toggle("text-zinc-800", !isActive);
      tab.classList.toggle("font-bold", !isActive);
    }
    const tabMobile = document.getElementById(`heroTabMobile${i}`);
    if (tabMobile) {
      tabMobile.classList.toggle("active", isActive);
      tabMobile.classList.toggle("bg-zinc-950", isActive);
      tabMobile.classList.toggle("text-white", isActive);
      tabMobile.classList.toggle("font-black", isActive);
      tabMobile.classList.toggle("bg-white", !isActive);
      tabMobile.classList.toggle("text-zinc-800", !isActive);
      tabMobile.classList.toggle("font-bold", !isActive);
    }
  }

  // Map hero tab index to catalog category filter
  const categoryMap = {
    0: "porsche",
    1: "exotic",
    2: "custom-car",
    3: "islamic"
  };
  const targetCategory = categoryMap[idx] || "all";
  activeCategory = targetCategory;

  document.querySelectorAll("[data-category-tab]").forEach(t => {
    const isSelected = t.getAttribute("data-category-tab") === targetCategory;
    t.classList.toggle("category-tab-active", isSelected);
  });

  renderCatalog();

  if (shouldScroll) {
    const catSec = document.getElementById("catalogSection");
    if (catSec) {
      catSec.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
window.switchHeroPoster = switchHeroPoster;

function openHeroPosterModal(side) {
  const item = HERO_POSTERS_DATA[currentHeroIndex] || HERO_POSTERS_DATA[0];
  const targetId = (side === "right" && item.rightId) ? item.rightId : (item.leftId || item.id);
  selectedSize = (side === "right") ? "a4" : "a3";
  const savedAngle = (typeof modalRotY === "number" && !isNaN(modalRotY)) ? modalRotY : 0;
  openProductModal(targetId);
  if (typeof setModalRotation === "function") {
    setModalRotation(savedAngle, false);
  }
}

// Fallback generator: creates an authentic, high-res dark architectural poster SVG for any product
function generatePosterFallbackSvg(poster) {
  if (!poster) return "";
  const title = (poster.title || "STUDIO SPEC").replace(/&/g, "&amp;");
  const subtitle = (poster.subtitle || "INCASE STUDIOS ARCHIVAL SPEC").replace(/&/g, "&amp;");
  const category = (poster.category || "PRINTS").toUpperCase();
  const year = "2026";
  
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1132" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#16161a" />
      <stop offset="50%" stop-color="#0c0c0e" />
      <stop offset="100%" stop-color="#060608" />
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="45%" r="45%">
      <stop offset="0%" stop-color="#2a2a34" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#0c0c0e" stop-opacity="0" />
    </radialGradient>
  </defs>
  
  <rect width="800" height="1132" fill="url(#bgGrad)" />
  <rect width="800" height="1132" fill="url(#centerGlow)" />
  
  <rect x="40" y="40" width="720" height="1052" fill="none" stroke="#27272a" stroke-width="1.5" />
  <rect x="48" y="48" width="704" height="1036" fill="none" stroke="#1f1f23" stroke-width="0.75" />
  
  <text x="64" y="90" font-family="'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="3" fill="#a1a1aa">INCASE STUDIOS // ARCHIVAL TELEMETRY</text>
  <text x="736" y="90" font-family="'Courier New', monospace" font-size="11" font-weight="700" letter-spacing="2" fill="#71717a" text-anchor="end">SPEC • ${year}</text>
  <line x1="64" y1="106" x2="736" y2="106" stroke="#27272a" stroke-width="1" />
  
  <rect x="64" y="130" width="140" height="24" fill="#27272a" />
  <text x="134" y="146" font-family="'Helvetica Neue', Arial, sans-serif" font-size="9" font-weight="900" letter-spacing="2" fill="#ffffff" text-anchor="middle">${category}</text>
  
  <g transform="translate(400, 520)">
    <circle cx="0" cy="0" r="180" fill="none" stroke="#222228" stroke-width="1.5" stroke-dasharray="4,6" />
    <circle cx="0" cy="0" r="140" fill="none" stroke="#2d2d36" stroke-width="1" />
    <circle cx="0" cy="0" r="90" fill="none" stroke="#3f3f4e" stroke-width="1.5" />
    <line x1="-210" y1="0" x2="210" y2="0" stroke="#27272a" stroke-width="1" stroke-dasharray="2,4" />
    <line x1="0" y1="-210" x2="0" y2="210" stroke="#27272a" stroke-width="1" stroke-dasharray="2,4" />
    <text x="0" y="24" font-family="'Helvetica Neue', Arial, sans-serif" font-size="78" font-weight="900" letter-spacing="-2" fill="#ffffff" opacity="0.12" text-anchor="middle">★ ★ ★</text>
  </g>
  
  <text x="64" y="820" font-family="'Helvetica Neue', Arial, sans-serif" font-size="34" font-weight="900" letter-spacing="-0.5" fill="#ffffff">${title.toUpperCase()}</text>
  <text x="64" y="855" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" font-weight="600" letter-spacing="0.5" fill="#a1a1aa">${subtitle}</text>
  
  <line x1="64" y1="890" x2="736" y2="890" stroke="#27272a" stroke-width="1" />
  
  <g transform="translate(64, 920)" font-family="'Courier New', monospace" font-size="10" fill="#71717a">
    <text x="0" y="16"><tspan fill="#d4d4d8" font-weight="700">PRINT SPEC:</tspan> 200GSM GLOSSY PHOTO PAPER</text>
    <text x="0" y="38"><tspan fill="#d4d4d8" font-weight="700">FRAME PROFILE:</tspan> 9MM SLIM FACE • 17MM DEPTH</text>
    <text x="0" y="60"><tspan fill="#d4d4d8" font-weight="700">ORIGIN:</tspan> PRINTED &amp; PACKED IN MANCHESTER, UK</text>
    <text x="672" y="38" text-anchor="end" fill="#52525b" font-weight="700">INCASE STUDIOS EST. 2026</text>
  </g>
</svg>
  `.trim();
  
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function handlePosterImageError(imgEl, posterId) {
  if (!imgEl) return;
  imgEl.onerror = null;
  const poster = (typeof allPosters !== "undefined" ? allPosters : []).find(p => p.id === posterId) ||
                 (typeof DEFAULT_POSTERS !== "undefined" ? DEFAULT_POSTERS : []).find(p => p.id === posterId) ||
                 currentCustomizingPoster;
  if (poster) {
    imgEl.src = generatePosterFallbackSvg(poster);
  } else {
    imgEl.src = generatePosterFallbackSvg({ 
      title: "Archival Print", 
      subtitle: "200gsm Heavyweight Gloss", 
      category: "Spec" 
    });
  }
}

// Initialize application on DOM ready or immediately if already loaded
function initApp() {
  // 1. Guarantee posters are populated synchronously from DEFAULT_POSTERS immediately
  if ((!allPosters || allPosters.length === 0) && typeof DEFAULT_POSTERS !== "undefined" && Array.isArray(DEFAULT_POSTERS)) {
    allPosters = [...DEFAULT_POSTERS];
  }

  // 2. Guarantee all modals start strictly closed, overflow is restored to auto, and no url hash auto-opens modals
  closeProductModal();
  closeRoomStudioModal();
  closeCartDrawer();
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname);
  }

  initLucideIcons();
  loadCart();

  // 3. Render marquee and catalog IMMEDIATELY and synchronously so screen is NEVER blank
  renderMarqueeCarousel();
  renderCatalog();
  setupEventListeners();
  initScrollReveal();
  initHeroParallax();
  initStudioPackingVideo();
  loadMacroPhotos();
  attachProductCardListeners(document);

  // 4. Non-blocking asynchronous sync from IndexedDB (with timeout protection)
  loadCatalogAsync();

  // Check URL query parameters for payment results
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("payment") === "success") {
    showToast("Payment successful! Your order has been placed.", "success");
    cart = [];
    saveCart();
  } else if (urlParams.get("payment") === "cancelled") {
    showToast("Checkout was cancelled. Your bag items are saved.", "info");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

async function loadCatalogAsync() {
  try {
    if (typeof getAllCustomPosters === "function") {
      const customPosters = await getAllCustomPosters();
      if (customPosters && customPosters.length > 0) {
        allPosters = [...(typeof DEFAULT_POSTERS !== "undefined" ? DEFAULT_POSTERS : []), ...customPosters];
        renderMarqueeCarousel();
        renderCatalog();
      }
    }
    updateCatalogStats();
  } catch (err) {
    console.warn("Async catalog load fallback:", err);
  }
}

async function loadCatalog() {
  await loadCatalogAsync();
}

function updateCatalogStats() {
  const customCount = allPosters.filter(p => p.isCustom).length;
  const countEl = document.getElementById("catalogCustomCount");
  if (countEl) {
    countEl.textContent = customCount > 0 ? `(${customCount})` : "";
  }
}

// ==========================================
// --- STOREFRONT TOP INFINITE MARQUEE ---
// Pure CSS GPU-Accelerated Infinite Loop (40s linear)
// ==========================================
function renderMarqueeCarousel() {
  const track = document.getElementById("marqueeTrack");
  const container = document.getElementById("marqueeContainer") || document.querySelector(".marquee-container");
  if (!track || !container) return;

  const postersSource = (allPosters && allPosters.length > 0)
    ? allPosters
    : (typeof DEFAULT_POSTERS !== "undefined" && Array.isArray(DEFAULT_POSTERS) ? DEFAULT_POSTERS : []);
  if (!postersSource || postersSource.length === 0) return;

  // 1. Dynamic selection of 20 top bestsellers across all flagship pillars (excluding any broken items)
  const preferredFeaturedIds = [
    "porsche-gt3rs", "bmw-m3-g80", "audi-rs-q8", "amg-g63", 
    "ferrari-pista", "lambo-revuelto", "custom-car-poster", 
    "isl-01", "isl-02", "isl-03", 
    "cinema-interstellar", "cinema-dark-knight", "cinema-pulp-fiction", 
    "music-blonde", "music-igor", "football-anfield", 
    "porsche-turbo-s", "bmw-m2-g87", "audi-rs6-avant", "cartoon-mcqueen"
  ];

  let displayItems = preferredFeaturedIds
    .map(id => postersSource.find(p => p.id === id))
    .filter(Boolean);

  if (displayItems.length < 20) {
    const additional = postersSource.filter(p => !preferredFeaturedIds.includes(p.id) && p.id !== "football-ronaldo");
    displayItems = [...displayItems, ...additional].slice(0, 20);
  }

  // 2. Concatenate displayItems array 4 times (80 continuous items total) for an expansive, dense endless loop
  const fullTrackList = [
    ...displayItems, 
    ...displayItems, 
    ...displayItems, 
    ...displayItems
  ];

  track.innerHTML = fullTrackList.map((poster, idx) => {
    const rawP = typeof poster.basePrice === "number" ? poster.basePrice : 7.00;
    const isIslamic = poster.category === "islamic";
    const isCustom = (poster.category === "custom-car" || poster.category === "custom-music");
    const baseP = isIslamic ? 14.63 : (isCustom ? 7.69 : Math.round(rawP * 0.77 * 100) / 100);
    return `
      <div 
        class="marquee-item flex flex-col cursor-pointer flex-shrink-0 group"
        data-poster-id="${poster.id}"
        onclick="openProductModal('${poster.id}')"
        title="View ${poster.title}"
      >
        <!-- Studio Framed Preview Stage on Deep Dark Gallery Wall with Sleek 4px Black Border & Realistic Drop Shadow -->
        <div class="product-card-stage p-1 sm:p-1.5 bg-transparent border-0 flex items-center justify-center">
          <div class="poster-frame-container frame-black-aluminium portrait-spec w-full relative overflow-hidden" style="border: 4px solid #111111 !important;">
            <img 
              src="${poster.image}" 
              alt="${poster.title}" 
              class="w-full h-full object-cover block portrait-spec" 
              loading="${idx < 10 ? 'eager' : 'lazy'}"
              onerror="handlePosterImageError(this, '${poster.id}')"
            />
          </div>
        </div>
        <div class="mt-2 text-center">
          <span class="block text-[10px] font-black uppercase tracking-tight text-zinc-100 group-hover:text-white truncate max-w-[100px] mx-auto transition-colors">${poster.title}</span>
          <span class="text-[9px] font-extrabold text-zinc-400 group-hover:text-zinc-300 transition-colors">From £${baseP.toFixed(2)}</span>
        </div>
      </div>
    `;
  }).join("");

  attachProductCardListeners(track);
  initMarqueeInteractions(container);
}
window.renderMarqueeCarousel = renderMarqueeCarousel;

function initMarqueeInteractions(container) {
  if (!container || container._hasMarqueeListeners) return;
  container._hasMarqueeListeners = true;

  // Pause on hover or touch so customer can comfortably tap any poster
  container.addEventListener("mouseenter", () => {
    container.classList.add("marquee-paused");
  });
  container.addEventListener("mouseleave", () => {
    container.classList.remove("marquee-paused");
  });
  container.addEventListener("touchstart", () => {
    container.classList.add("marquee-paused");
  }, { passive: true });
  container.addEventListener("touchend", () => {
    setTimeout(() => {
      container.classList.remove("marquee-paused");
    }, 600);
  }, { passive: true });
  container.addEventListener("touchcancel", () => {
    container.classList.remove("marquee-paused");
  }, { passive: true });
}

function initHeroParallax() {
  initHero3DInteraction();
}

// ==========================================
// --- HERO 3D PRISMS CONTINUOUS AUTO-SPIN ---
// Un-interruptible buttery-smooth 360-degree rotation
// ==========================================
function initHero3DInteraction() {
  // Ensure rotating stages are clean and continuous CSS keyframe animation runs un-interrupted
  const stages = document.querySelectorAll('.hero-prism-wrapper .prism-3d-stage');
  stages.forEach(stage => {
    stage.style.removeProperty('animation');
    stage.style.removeProperty('transform');
    stage.classList.remove('hero-spin-disabled');
  });
  const wrappers = document.querySelectorAll('.hero-prism-wrapper');
  wrappers.forEach(wrapper => {
    wrapper.classList.remove('hero-spin-disabled');
    wrapper._justDragged = false;
  });
}
window.initHero3DInteraction = initHero3DInteraction;

// Dynamic Speaker Icons for Glassmorphic Unmute Button
const SPEAKER_MUTED_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none flex-shrink-0"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>`;
const SPEAKER_ACTIVE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none flex-shrink-0"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

function syncVideoMuteUI(isMuted) {
  const muteBtn = document.getElementById("videoMuteToggleBtn");
  const muteIconContainer = document.getElementById("videoMuteIconContainer");
  const muteText = document.getElementById("videoMuteText");

  if (isMuted) {
    if (muteText) muteText.textContent = "UNMUTE";
    if (muteIconContainer) muteIconContainer.innerHTML = SPEAKER_MUTED_SVG;
    if (muteBtn) {
      muteBtn.setAttribute("title", "Unmute video");
      muteBtn.setAttribute("aria-label", "Unmute video");
      muteBtn.classList.remove("video-unmuted");
    }
  } else {
    if (muteText) muteText.textContent = "MUTE";
    if (muteIconContainer) muteIconContainer.innerHTML = SPEAKER_ACTIVE_SVG;
    if (muteBtn) {
      muteBtn.setAttribute("title", "Mute video");
      muteBtn.setAttribute("aria-label", "Mute video");
      muteBtn.classList.add("video-unmuted");
    }
  }
}

window.handleVideoMuteToggle = function(e) {
  if (e) {
    if (typeof e.preventDefault === "function") e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();
  }
  const video = document.getElementById("studioPackingVideo");
  if (!video) return;

  const targetMuted = !video.muted;
  video.muted = targetMuted;
  video.defaultMuted = targetMuted;

  if (!targetMuted) {
    video.volume = 1.0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }

  syncVideoMuteUI(targetMuted);
};

// ==========================================
// --- STUDIO PACKING VIDEO CONTROLLER ---
// ==========================================
async function initStudioPackingVideo() {
  const video = document.getElementById("studioPackingVideo");
  const videoGlow = document.getElementById("studioPackingVideoGlow");
  const uploadInput = document.getElementById("studioVideoFileInput");
  const muteBtn = document.getElementById("videoMuteToggleBtn");
  const videoStatusText = document.getElementById("videoStatusText");
  const resetBtn = document.getElementById("resetStudioVideoBtn");

  if (!video) return;

  // Enforce autoplay bypass attributes programmatically for iOS Safari & Chrome
  [video, videoGlow].forEach(v => {
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    if ('webkitPlaysInline' in v) {
      v.webkitPlaysInline = true;
    }
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
  });

  // Keep background glow video layer tightly synced with main video
  if (video && videoGlow) {
    video.addEventListener("play", () => {
      videoGlow.play().catch(() => {});
    });
    video.addEventListener("pause", () => {
      videoGlow.pause();
    });
    video.addEventListener("seeking", () => {
      videoGlow.currentTime = video.currentTime;
    });
    video.addEventListener("timeupdate", () => {
      if (Math.abs(videoGlow.currentTime - video.currentTime) > 0.3) {
        videoGlow.currentTime = video.currentTime;
      }
    });
  }

  // 1. Check IndexedDB for custom uploaded video
  try {
    const saved = typeof getStudioPackingVideo === "function" ? await getStudioPackingVideo() : null;
    if (saved && saved.blob) {
      const videoUrl = URL.createObjectURL(saved.blob);
      video.src = videoUrl;
      if (videoGlow) videoGlow.src = videoUrl;
      if (videoStatusText) videoStatusText.textContent = `Custom: ${saved.name || 'Order Packing'}`;
      if (resetBtn) resetBtn.classList.remove("hidden");
    } else {
      if (videoStatusText) videoStatusText.textContent = "Manchester Studio (assets/packing-video.mp4)";
    }
  } catch (err) {
    console.warn("Could not check IndexedDB for packing video:", err);
  }

  // Handle Video Loading Error Fallback
  video.addEventListener("error", () => {
    if (!video.src || !video.src.includes("mixkit")) {
      loadDefaultStudioVideo(video);
    }
  });

  // 2. Mute/Unmute Toggle Listeners & Event Deduplication
  if (muteBtn) {
    let lastTouch = 0;
    const onTrigger = (e) => {
      if (e.type === "touchstart") {
        lastTouch = Date.now();
      } else if (e.type === "click" && Date.now() - lastTouch < 450) {
        if (e.preventDefault) e.preventDefault();
        return;
      }
      window.handleVideoMuteToggle(e);
    };
    muteBtn.addEventListener("touchstart", onTrigger, { passive: false });
    muteBtn.addEventListener("click", onTrigger);
  }

  // Native volumechange listener to keep UI in 100% lockstep
  video.addEventListener("volumechange", () => {
    syncVideoMuteUI(video.muted);
  });

  syncVideoMuteUI(video.muted);

  // 3. Attempt immediate muted playback for both layers
  video.play().catch(() => {
    video.muted = true;
    video.play().catch(() => {});
  });
  if (videoGlow) {
    videoGlow.play().catch(() => {});
  }

  // 4. Smooth Autoplay on Scroll (IntersectionObserver)
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            video.muted = true;
            video.play().catch(() => {});
          });
          if (videoGlow) {
            videoGlow.play().catch(() => {});
          }
        } else {
          video.pause();
          if (videoGlow) videoGlow.pause();
        }
      });
    }, { threshold: 0.15 });
    observer.observe(video);
  }

  // 5. Video File Uploader Handler
  if (uploadInput) {
    uploadInput.addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|mov|webm)$/i)) {
        showToast("Please select a valid .MP4 or .MOV video file", "error");
        return;
      }

      showToast("Saving packing video to local database...", "info");

      try {
        if (typeof saveStudioPackingVideo === "function") {
          await saveStudioPackingVideo(file);
        }
        const newUrl = URL.createObjectURL(file);
        video.src = newUrl;
        if (videoGlow) videoGlow.src = newUrl;
        video.play().catch(() => {});
        if (videoGlow) videoGlow.play().catch(() => {});
        if (videoStatusText) videoStatusText.textContent = `Custom: ${file.name}`;
        if (resetBtn) resetBtn.classList.remove("hidden");
        showToast("Packing video updated & persisted in IndexedDB!", "success");
      } catch (err) {
        console.error("Failed to save packing video:", err);
        showToast("Error saving video to IndexedDB", "error");
      }
    });
  }

  // 6. Reset Video Handler
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      try {
        if (typeof deleteStudioPackingVideo === "function") {
          await deleteStudioPackingVideo();
        }
        resetBtn.classList.add("hidden");
        const defaultSources = `
          <source src="assets/packing-video.mp4" type="video/mp4">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-artist-framing-a-picture-in-a-wooden-frame-41818-large.mp4" type="video/mp4">
        `;
        video.removeAttribute("src");
        video.innerHTML = defaultSources;
        video.load();
        video.play().catch(() => {});

        if (videoGlow) {
          videoGlow.removeAttribute("src");
          videoGlow.innerHTML = defaultSources;
          videoGlow.load();
          videoGlow.play().catch(() => {});
        }

        if (videoStatusText) videoStatusText.textContent = "Manchester Studio (assets/packing-video.mp4)";
        showToast("Reset to default studio packing video", "info");
      } catch (err) {
        console.error("Error resetting video:", err);
      }
    });
  }
}

function loadDefaultStudioVideo(video) {
  if (!video) return;
  const fallbackSrc = "https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-artist-framing-a-picture-in-a-wooden-frame-41818-large.mp4";
  video.poster = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop";
  video.src = fallbackSrc;
  video.muted = true;
  video.defaultMuted = true;
  video.play().catch(() => {});

  const videoGlow = document.getElementById("studioPackingVideoGlow");
  if (videoGlow) {
    videoGlow.src = fallbackSrc;
    videoGlow.muted = true;
    videoGlow.defaultMuted = true;
    videoGlow.play().catch(() => {});
  }
}

// =========================================================================
// --- CLASSIC VERTICAL E-COMMERCE PRODUCT CATALOG GRID ---
// =========================================================================
function renderCatalog() {
  const grid = document.getElementById("posterGrid");
  if (!grid) return;

  const postersSource = (allPosters && allPosters.length > 0)
    ? allPosters
    : (typeof DEFAULT_POSTERS !== "undefined" && Array.isArray(DEFAULT_POSTERS) ? DEFAULT_POSTERS : []);
  if (!postersSource || postersSource.length === 0) return;

  let filtered = postersSource.filter(poster => {
    const matchesCat = activeCategory === "all" || poster.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      poster.title.toLowerCase().includes(query) ||
      (poster.subtitle && poster.subtitle.toLowerCase().includes(query)) ||
      (poster.description && poster.description.toLowerCase().includes(query)) ||
      (poster.tags && poster.tags.some(t => t.toLowerCase().includes(query)));
    return matchesCat && matchesSearch;
  });

  if (sortBy === "price-low") {
    filtered.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
  } else if (sortBy === "bestseller") {
    filtered.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === "newest") {
    filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  const resultsCount = document.getElementById("resultsCount");
  if (resultsCount) {
    resultsCount.textContent = `Showing ${filtered.length} print${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center bg-zinc-900/50 border border-zinc-800 rounded-xs">
        <p class="text-sm font-black uppercase tracking-wider text-zinc-300">No prints match your current filter</p>
        <p class="text-xs text-zinc-500 mt-1">Try clearing your search or selecting "All Prints" above.</p>
        <button 
          type="button" 
          onclick="selectCategoryFromNav('all')" 
          class="mt-4 px-5 py-2.5 bg-white text-zinc-950 text-xs font-black uppercase tracking-wider hover:bg-zinc-200 transition cursor-pointer"
        >
          Show All Prints
        </button>
      </div>
    `;
    initLucideIcons();
    return;
  }

  grid.innerHTML = filtered.map((poster, index) => {
    const isIslamic = poster.category === "islamic";
    const isCustom = (poster.category === "custom-car" || poster.category === "custom-music");
    const categoryLabel = getCategoryBadge(poster.category);
    const panels = (poster.triptychImages && poster.triptychImages.length === 3)
      ? poster.triptychImages
      : ["assets/islamic-panel-1.jpg", "assets/islamic-panel-2.jpg", "assets/islamic-panel-3.jpg"];

    const rawBase = typeof poster.basePrice === "number" ? poster.basePrice : 7.00;
    let baseP, wasPrice;
    if (isIslamic) {
      baseP = 14.63;
      wasPrice = 19.00;
    } else if (isCustom) {
      baseP = 7.69;
      wasPrice = 9.99;
    } else {
      wasPrice = rawBase;
      baseP = Math.round(rawBase * 0.77 * 100) / 100;
    }

    return `
      <div 
        class="product-card group flex flex-col justify-between cursor-pointer transition-all duration-200"
        data-poster-id="${poster.id}"
        onclick="openProductModal('${poster.id}')"
      >
        <div>
          <!-- Studio Framed Preview Stage (Transparent Studio Grey) -->
          <div class="product-card-stage relative px-2 py-3 sm:px-4 sm:py-5 flex items-center justify-center">
            ${poster.bestseller ? `
              <span class="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 px-2 py-0.5 bg-zinc-950 text-white border border-zinc-800 text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider shadow-sm">
                ★ BESTSELLER
              </span>
            ` : ''}
            ${isIslamic ? `
              <span class="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 px-2 py-0.5 bg-emerald-800 text-white text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider shadow-sm">
                3-PIECE SET
              </span>
            ` : `
              <span class="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 px-1.5 py-0.5 bg-zinc-950 text-zinc-100 text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider border border-zinc-800 shadow-sm">
                A4 / A3
              </span>
            `}

            ${isIslamic ? `
              <!-- 3-Piece Islamic Triptych Grid: 3 Strictly Identical 1:1.414 Portrait Frames -->
              <div class="w-full max-w-[270px] mx-auto" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; align-items: center;">
                ${panels.map((panelSrc, idx) => `
                  <div class="poster-frame-container frame-black-plastic portrait-spec w-full overflow-hidden" style="aspect-ratio: 210 / 297; width: 100%; border: 4px solid #111111 !important;">
                    <img 
                      src="${panelSrc}" 
                      alt="${poster.title} Panel ${idx + 1}" 
                      class="w-full h-full object-cover block portrait-spec"
                      style="width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important;"
                      loading="${index < 6 ? 'eager' : 'lazy'}"
                      onerror="this.onerror=null; this.src='assets/islamic-panel-${idx + 1}.jpg';"
                    />
                  </div>
                `).join("")}
              </div>
            ` : `
              <!-- Single Framed Print (Locked 1:1.414 Portrait Aspect Ratio) -->
              <div class="w-[82%] sm:w-[76%] max-w-[210px] mx-auto transition-transform duration-300 group-hover:scale-[1.02]">
                <div class="poster-frame-container frame-black-plastic portrait-spec w-full overflow-hidden" style="aspect-ratio: 210 / 297; width: 100%; border: 4px solid #111111 !important;">
                  <img 
                    src="${poster.image}" 
                    alt="${poster.title}" 
                    class="w-full h-full object-cover block portrait-spec" 
                    style="width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important;"
                    loading="${index < 8 ? 'eager' : 'lazy'}"
                    onerror="handlePosterImageError(this, '${poster.id}')"
                  />
                </div>
              </div>
            `}
          </div>

          <!-- Card Metadata -->
          <div class="px-2 pt-2.5 pb-1 sm:px-3 sm:pt-3">
            <div class="flex items-center justify-between gap-1 text-[9.5px] font-bold uppercase tracking-wider text-zinc-500">
              <span class="truncate">${categoryLabel}</span>
              <span class="text-amber-500 flex-shrink-0">★ ${poster.rating || '5.0'}</span>
            </div>

            <h3 class="text-xs sm:text-sm font-black uppercase tracking-tight text-zinc-950 mt-1 line-clamp-1">
              ${poster.title}
            </h3>

            <p class="text-[10.5px] text-zinc-600 mt-0.5 line-clamp-1">
              ${poster.subtitle || '200gsm Glossy Photo Print • Unframed or Framed'}
            </p>
          </div>
        </div>

        <!-- Card Price & Action Footer -->
        <div class="px-2 pb-2 sm:px-3 sm:pb-3 pt-1 flex flex-col gap-2">
          <div class="flex items-baseline justify-between border-t border-[#d4d4d0] pt-2">
            <div class="flex items-baseline gap-1.5">
              <span class="text-[10px] font-bold uppercase text-zinc-500">From</span>
              <span class="text-sm sm:text-base font-black text-zinc-950">£${baseP.toFixed(2)}</span>
              ${wasPrice > baseP ? `<span class="text-[10px] text-zinc-400 line-through font-semibold">£${wasPrice.toFixed(2)}</span>` : ''}
            </div>
            ${wasPrice > baseP ? `<span class="px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-black uppercase tracking-wider">23% OFF</span>` : ''}
          </div>

          <button 
            type="button"
            data-poster-id="${poster.id}"
            onclick="event.stopPropagation(); openProductModal('${poster.id}')"
            class="w-full py-2.5 px-3 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-[10px] sm:text-[11px] uppercase tracking-wider rounded-xs transition text-center cursor-pointer shadow-sm"
          >
            Select Size &amp; Frame
          </button>
        </div>
      </div>
    `;
  }).join("");

  attachProductCardListeners(grid);
  initLucideIcons();
}

// Dedicated click and touchstart event listener attachment for all product cards and buttons
let isGlobalCardListenerAttached = false;

function attachProductCardListeners(container = document) {
  if (!container) return;

  // 1. All Product Cards & Marquee Items (EXCLUDING buttons so buttons don't get card click listeners)
  const cards = container.querySelectorAll('.product-card, .group[onclick*="openProductModal"], .marquee-item, [data-poster-id]:not(button)');
  cards.forEach(card => {
    if (card._hasCardTouchListener) return;
    card._hasCardTouchListener = true;

    const match = card.getAttribute('onclick')?.match(/openProductModal\(['"]([^'"]+)['"]\)/);
    const posterId = card.getAttribute('data-poster-id') || (match ? match[1] : null);
    if (!posterId) return;

    card.setAttribute('data-poster-id', posterId);

    let touchStartData = null;

    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartData = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now()
        };
      }
    };

    const onTouchEnd = (e) => {
      if (!touchStartData || !e.changedTouches || !e.changedTouches[0]) return;
      if (e.target.closest('button')) return;

      const touch = e.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - touchStartData.x);
      const deltaY = Math.abs(touch.clientY - touchStartData.y);
      const deltaTime = Date.now() - touchStartData.time;
      touchStartData = null;

      // Generous stationary tap tolerance (< 24px delta, < 500ms duration)
      if (deltaX < 24 && deltaY < 24 && deltaTime < 500) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        openProductModal(posterId);
      }
    };

    const onCardClick = (e) => {
      if (e.target.closest('button')) return;
      if (typeof e.preventDefault === 'function') e.preventDefault();
      openProductModal(posterId);
    };

    card.addEventListener('touchstart', onTouchStart, { passive: true });
    card.addEventListener('touchend', onTouchEnd, { passive: false });
    card.addEventListener('click', onCardClick);
  });

  // 2. All "Select Size & Frame" and Hero CTA Buttons
  const buttons = container.querySelectorAll('button[onclick*="openProductModal"], .hero-cta-btn[onclick*="openProductModal"], button[data-poster-id]');
  buttons.forEach(btn => {
    if (btn._hasBtnTouchListener) return;
    btn._hasBtnTouchListener = true;

    const match = btn.getAttribute('onclick')?.match(/openProductModal\(['"]([^'"]+)['"]\)/);
    const posterId = btn.getAttribute('data-poster-id') || (match ? match[1] : null);
    if (!posterId) return;

    btn.setAttribute('data-poster-id', posterId);

    let btnTouchData = null;
    const onBtnTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        btnTouchData = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now()
        };
      }
    };

    const onBtnTouchEnd = (e) => {
      if (!btnTouchData || !e.changedTouches || !e.changedTouches[0]) return;
      const touch = e.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - btnTouchData.x);
      const deltaY = Math.abs(touch.clientY - btnTouchData.y);
      const deltaTime = Date.now() - btnTouchData.time;
      btnTouchData = null;

      if (deltaX < 24 && deltaY < 24 && deltaTime < 500) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
        openProductModal(posterId);
      }
    };

    const onBtnClick = (e) => {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      openProductModal(posterId);
    };

    btn.addEventListener('touchstart', onBtnTouchStart, { passive: true });
    btn.addEventListener('touchend', onBtnTouchEnd, { passive: false });
    btn.addEventListener('click', onBtnClick);
  });

  // 3. Hero Showcase 3D Frames Interaction (Auto-spin kill on touch + manual drag)
  initHero3DInteraction();

  // 4. Pause marquee on touch/hover so taps don't slide under fingers
  const track = document.getElementById("marqueeTrack");
  if (track && !track._hasMarqueeTouchListener) {
    track._hasMarqueeTouchListener = true;
    track.addEventListener('touchstart', () => track.classList.add('is-touching'), { passive: true });
    track.addEventListener('touchend', () => setTimeout(() => track.classList.remove('is-touching'), 250), { passive: true });
    track.addEventListener('touchcancel', () => track.classList.remove('is-touching'), { passive: true });
  }

  // 5. Global Delegated Click & Touch Fallback (Guaranteeing 100% reliability everywhere)
  if (!isGlobalCardListenerAttached) {
    isGlobalCardListenerAttached = true;

    // Capture-phase click listener catches all card & button clicks immediately
    document.addEventListener('click', (e) => {
      // If clicked a button inside a card or hero CTA button
      const btn = e.target.closest('button[onclick*="openProductModal"], .hero-cta-btn[onclick*="openProductModal"], button[data-poster-id]');
      if (btn) {
        const match = btn.getAttribute('onclick')?.match(/openProductModal\(['"]([^'"]+)['"]\)/);
        const posterId = btn.getAttribute('data-poster-id') || (match ? match[1] : null);
        if (posterId) {
          e.preventDefault();
          e.stopPropagation();
          openProductModal(posterId);
          return;
        }
      }

      // If clicked a card or marquee item
      const card = e.target.closest('.product-card, .group[onclick*="openProductModal"], .marquee-item, [data-poster-id]');
      if (card && !e.target.closest('button')) {
        const match = card.getAttribute('onclick')?.match(/openProductModal\(['"]([^'"]+)['"]\)/);
        const posterId = card.getAttribute('data-poster-id') || (match ? match[1] : null);
        if (posterId) {
          e.preventDefault();
          openProductModal(posterId);
          return;
        }
      }
    }, true);

    // Global Delegated Touch (Stationary Tap Fallback)
    let globalTouchStart = null;
    document.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        globalTouchStart = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
          target: e.target
        };
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!globalTouchStart || !e.changedTouches || !e.changedTouches[0]) return;
      const touch = e.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - globalTouchStart.x);
      const deltaY = Math.abs(touch.clientY - globalTouchStart.y);
      const deltaTime = Date.now() - globalTouchStart.time;
      const target = globalTouchStart.target;
      globalTouchStart = null;

      if (deltaX < 24 && deltaY < 24 && deltaTime < 500 && target) {
        const btn = target.closest('button[onclick*="openProductModal"], .hero-cta-btn[onclick*="openProductModal"], button[data-poster-id]');
        if (btn) {
          const match = btn.getAttribute('onclick')?.match(/openProductModal\(['"]([^'"]+)['"]\)/);
          const posterId = btn.getAttribute('data-poster-id') || (match ? match[1] : null);
          if (posterId) {
            if (typeof e.preventDefault === 'function') e.preventDefault();
            openProductModal(posterId);
            return;
          }
        }

        const card = target.closest('.product-card, .group[onclick*="openProductModal"], .marquee-item, [data-poster-id]');
        if (card && !target.closest('button')) {
          const match = card.getAttribute('onclick')?.match(/openProductModal\(['"]([^'"]+)['"]\)/);
          const posterId = card.getAttribute('data-poster-id') || (match ? match[1] : null);
          if (posterId) {
            if (typeof e.preventDefault === 'function') e.preventDefault();
            openProductModal(posterId);
            return;
          }
        }
      }
    }, { passive: false });
  }
}
window.attachProductCardListeners = attachProductCardListeners;

function getCategoryBadge(cat) {
  switch (cat) {
    case "bmw": return "BMW M-Series";
    case "audi": return "Audi RS";
    case "porsche": return "Porsche";
    case "amg": return "Mercedes-AMG";
    case "exotic": return "Supercars & Exotics";
    case "custom-car": return "Custom Your Car";
    case "football": return "Football & Stadiums";
    case "cartoon-cars": return "Through The Years";
    case "islamic": return "Islamic Prints";
    case "cinema": return "Movie & Cinema";
    case "music": return "Music Album";
    case "custom-music": return "Custom Music Poster";
    case "custom-design": return "Custom Design";
    case "travel": return "Travel & Architecture";
    case "animals": return "Wildlife & Animals";
    default: return "Studio Print";
  }
}

// ==========================================
// --- SMOOTH SCROLL REVEAL ANIMATIONS ---
// ==========================================
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal-card:not(.revealed), .reveal-item:not(.revealed)");
  if (!items.length) return;

  if (!window.IntersectionObserver) {
    items.forEach(el => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  items.forEach(el => observer.observe(el));
}

// ==========================================
// ==========================================
// --- BODY SCROLL LOCKING ENGINE (IOS SAFE) ---
// ==========================================
let savedBodyScrollY = 0;
let isBodyScrollLocked = false;

function lockBodyScroll() {
  if (isBodyScrollLocked) return;
  savedBodyScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
  document.documentElement.classList.add("modal-open");
  document.body.classList.add("modal-open");
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  isBodyScrollLocked = true;
}

function unlockBodyScroll() {
  document.documentElement.classList.remove("modal-open");
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";
  if (isBodyScrollLocked) {
    isBodyScrollLocked = false;
    window.scrollTo({ top: savedBodyScrollY, behavior: "instant" });
  }
}

function handleNavbarHomeClick(event) {
  if (event) {
    event.preventDefault();
  }
  closeProductModal();
  closeRoomStudioModal();
  closeCartDrawer();
  closeImportModal();
  closeMacroPhotosModal();

  const searchInput = document.getElementById("catalogSearchInput");
  if (searchInput && searchInput.value) {
    searchInput.value = "";
    filterPosters("all", "");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Global Escape Key to Close Modals on Desktop
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.keyCode === 27) {
    closeYourWallFullscreenModal();
    closeProductModal();
    closeRoomStudioModal();
    closeCartDrawer();
    closeImportModal();
    closeMacroPhotosModal();
  }
});

// ==========================================
// --- PRODUCT CUSTOMIZER MODAL ---
// ==========================================
let lastProductModalOpenTime = 0;
function openProductModal(posterId) {
  const now = Date.now();
  if (now - lastProductModalOpenTime < 200 && currentCustomizingPoster && currentCustomizingPoster.id === posterId) {
    return;
  }
  lastProductModalOpenTime = now;

  let poster = (typeof allPosters !== "undefined" ? allPosters : []).find(p => p.id === posterId);
  if (!poster && typeof DEFAULT_POSTERS !== "undefined") {
    poster = DEFAULT_POSTERS.find(p => p.id === posterId) || DEFAULT_POSTERS[0];
  }
  if (!poster) return;
  currentCustomizingPoster = poster;
  isModalProfileZoomActive = false; // Reset zoom so modal opens with clean front-view

  const modal = document.getElementById("productModal");
  if (!modal) return;

  document.getElementById("modalPosterTitle").textContent = poster.title;
  document.getElementById("modalPosterSubtitle").textContent = poster.subtitle || "Premium 200gsm Heavyweight Glossy Photo Paper";
  document.getElementById("modalPosterCategory").textContent = getCategoryBadge(poster.category);
  document.getElementById("modalPosterDesc").textContent = poster.description || "";

  // 3-Piece Triptych selector exclusively for Islamic collection
  const triptychSelector = document.getElementById("modalTriptychToggleContainer");
  if (triptychSelector) {
    if (poster.category === "islamic") {
      triptychSelector.style.display = "block";
      isTriptychMode = true; // STRICT: lock to 3-piece set for Islamic prints
    } else {
      triptychSelector.style.display = "none";
      isTriptychMode = false;
    }
  }

  modalRotY = 0;
  modalRotX = 0;
  isModalProfileZoomActive = false;
  isModalRoomMode = false;
  applyModalRoomModeState();

  // Reset gesture hint cue state for fresh interaction
  hasUserInteractedWithModalStage = false;
  const gestureHint = document.getElementById("modalStageGestureHint");
  if (gestureHint) {
    gestureHint.classList.remove("gesture-hint-dismissed");
    gestureHint.style.display = isModalRoomMode ? "none" : "inline-flex";
  }

  // Default: stage is in clean normal view at the top of solid page flow
  isModalStageExpanded = false;
  const stagePane = document.querySelector(".modal-preview-stage-pane");
  const stageCol = document.querySelector(".modal-stage-column");
  const modalEl = document.getElementById("productModal");
  if (modalEl) {
    modalEl.classList.remove("stage-expanded");
  }
  if (stagePane) {
    stagePane.classList.remove("stage-expanded");
  }
  if (stageCol) {
    stageCol.classList.remove("stage-expanded");
  }
  const expandBtn = document.getElementById("modalExpandStageBtn");
  if (expandBtn) {
    expandBtn.innerHTML = `<i data-lucide="maximize-2" class="w-3.5 h-3.5 text-zinc-300 pointer-events-none"></i><span id="modalExpandBtnText" class="pointer-events-none uppercase tracking-wider text-zinc-200">Tap to Expand</span>`;
    expandBtn.setAttribute("title", "Expand preview area (Full Screen)");
    expandBtn.style.display = isModalRoomMode ? "none" : "";
    expandBtn.classList.toggle("hidden", isModalRoomMode);
  }
  const bodyContainer = document.querySelector(".modal-body-container");
  if (bodyContainer) {
    bodyContainer.scrollTop = 0;
  }
  const optionsPane = document.querySelector(".modal-options-pane");
  if (optionsPane) {
    optionsPane.scrollTop = 0;
  }
  initExpandButtonListener();
  const activeDot = document.querySelector(".wall-swatch-dot.active");
  const curWall = activeDot ? activeDot.getAttribute("data-wall-color") : "#F2F0EA";
  setModalWallColor(curWall);

  updateModalPreview();
  updateModalPrice();

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  modal.style.setProperty("display", "flex", "important");
  lockBodyScroll();
  window.history.replaceState(null, '', window.location.pathname);
  initLucideIcons();
  setTimeout(() => initModalStageGestures(), 100);
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.style.setProperty("display", "none", "important");
    unlockBodyScroll();
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    window.history.replaceState(null, '', window.location.pathname);
    resetModalStudioWall();
  }
}

function setTriptychMode(isTriptych) {
  if (currentCustomizingPoster && currentCustomizingPoster.category === "islamic") {
    isTriptychMode = isTriptych;
    updateModalPreview();
    updateModalPrice();
  }
}

// 360-Degree Modal Rotation Engine & Wall Backdrop Engine (Live Room is 100% Flat & Flush to Wall)
const LIVE_ROOM_ROT_Y = 0;
const LIVE_ROOM_ROT_X = 0;
let modalRotY = 0;
let modalRotX = 0;
let modalZoom = 1.0;
let isModalStageExpanded = false;
let isModalRoomMode = false;
let currentModalRoomScene = "living-room";
let isModalWallMode = false;
let modalWallScale = 1.0;
let modalPosterPos = { x: 0, y: 0 };
let modalGesturesInitialized = false;
let hasUserInteractedWithModalStage = false;

function dismissModalGestureHint() {
  if (hasUserInteractedWithModalStage) return;
  hasUserInteractedWithModalStage = true;
  const hint = document.getElementById("modalStageGestureHint");
  if (hint) {
    hint.classList.add("gesture-hint-dismissed");
  }
}

function setModalRotation(angle, smooth = true) {
  if (isModalRoomMode) {
    modalRotY = LIVE_ROOM_ROT_Y;
    modalRotX = LIVE_ROOM_ROT_X;
    return; // STRICT: lock gallery angle on live room!
  }
  dismissModalGestureHint();
  while (angle > 180) angle -= 360;
  while (angle < -180) angle += 360;
  modalRotY = Math.round(angle);
  isModalProfileZoomActive = Math.abs(modalRotY) > 20;
  updateModalPrismTransform(smooth);
  updateModalRotationControls();
}

function rotateModalStep(deg) {
  if (isModalRoomMode) return;
  setModalRotation(modalRotY + deg, true);
}

function snapModalAngle(angle) {
  dismissModalGestureHint();
  if (isModalRoomMode) {
    modalRotY = LIVE_ROOM_ROT_Y;
    modalRotX = LIVE_ROOM_ROT_X;
    updateModalPrismTransform(true);
    return; // STRICT: lock gallery angle on live room!
  }
  modalRotY = angle;
  modalRotX = (Math.abs(angle) === 65 || Math.abs(angle) === 45) ? 4 : 0;
  isModalProfileZoomActive = Math.abs(angle) > 20;
  updateModalPrismTransform(true);
  updateModalRotationControls();
}

let modalZoomIndicatorTimer = null;
function showModalZoomIndicator(zoom) {
  const indicator = document.getElementById("modalZoomIndicator");
  const val = document.getElementById("modalZoomVal");
  if (!indicator || !val) return;
  val.textContent = `${Math.round(zoom * 100)}%`;
  indicator.classList.remove("hidden");
  indicator.classList.add("flex");
  if (modalZoomIndicatorTimer) clearTimeout(modalZoomIndicatorTimer);
  modalZoomIndicatorTimer = setTimeout(() => {
    indicator.classList.add("hidden");
    indicator.classList.remove("flex");
  }, 1200);
}

function toggleModalDoubleTapZoom() {
  if (isModalRoomMode) return; // Scale locked in Live Room mode for accurate comparison
  const isMobile = window.innerWidth < 768;
  const maxTarget = (isMobile && selectedSize === 'a3') ? 1.05 : (isMobile ? 1.08 : 1.25);
  const target = (modalZoom > 1.02) ? 1.0 : maxTarget;
  setModalZoom(target);
  showModalZoomIndicator(target);
}

function setModalZoom(val) {
  if (isModalRoomMode) {
    modalZoom = 1.0;
    updateModalPrismTransform(true);
    return;
  }
  const isMobile = window.innerWidth < 1024;
  // Strictly clamp zoom so it NEVER clips into bottom camera dock or wall swatches
  const maxZoom = isMobile
    ? (selectedSize === 'a3' ? 1.06 : 1.14)
    : (selectedSize === 'a3' ? 1.15 : 1.25);
  modalZoom = Math.max(0.95, Math.min(maxZoom, Math.round(val * 100) / 100));
  
  const stagePane = document.querySelector(".modal-preview-stage-pane");
  if (stagePane) {
    stagePane.classList.toggle("stage-zoomed-active", modalZoom > 1.02);
  }

  const slider = document.getElementById("modalZoomSlider");
  if (slider) slider.value = Math.round(modalZoom * 100);
  const label = document.getElementById("modalZoomVal");
  if (label) label.textContent = `${Math.round(modalZoom * 100)}%`;
  updateModalPrismTransform(true);
}

function zoomModalIn() {
  const isMobile = window.innerWidth < 768;
  const step = (isMobile && selectedSize === 'a3') ? 0.03 : 0.08;
  setModalZoom(modalZoom + step);
}

function zoomModalOut() {
  const isMobile = window.innerWidth < 768;
  const step = (isMobile && selectedSize === 'a3') ? 0.03 : 0.08;
  setModalZoom(modalZoom - step);
}

let lastExpandTapTime = 0;

function toggleModalStageExpand(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  const now = Date.now();
  if (now - lastExpandTapTime < 250) return;
  lastExpandTapTime = now;

  isModalStageExpanded = !isModalStageExpanded;
  const modal = document.getElementById("productModal");
  const stagePane = document.querySelector(".modal-preview-stage-pane");
  const stageCol = document.querySelector(".modal-stage-column");
  const expandBtn = document.getElementById("modalExpandStageBtn");

  if (modal) modal.classList.toggle("stage-expanded", isModalStageExpanded);
  if (stagePane) stagePane.classList.toggle("stage-expanded", isModalStageExpanded);
  if (stageCol) stageCol.classList.toggle("stage-expanded", isModalStageExpanded);

  if (expandBtn) {
    if (isModalRoomMode) {
      expandBtn.style.display = "none";
      expandBtn.classList.add("hidden");
    } else {
      expandBtn.style.display = "";
      expandBtn.classList.remove("hidden");
      const expandText = isModalStageExpanded ? "Tap to Collapse" : "Tap to Expand";
      const expandIcon = isModalStageExpanded ? "minimize-2" : "maximize-2";
      expandBtn.innerHTML = `<i data-lucide="${expandIcon}" class="w-3.5 h-3.5 text-zinc-300 pointer-events-none"></i><span id="modalExpandBtnText" class="pointer-events-none uppercase tracking-wider text-zinc-200">${expandText}</span>`;
      expandBtn.setAttribute("title", isModalStageExpanded ? "Collapse to normal view" : "Expand preview area (Full Screen)");
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    }
  }

  const dockContainer = document.getElementById("modalAngleDockContainer");
  if (dockContainer) {
    dockContainer.style.display = (isModalRoomMode || isModalStageExpanded) ? "none" : "flex";
  }

  // Smoothly refit 3D transforms as stage height animates
  updateModalPreview();
  setTimeout(() => updateModalPrismTransform(true), 60);
  setTimeout(() => updateModalPrismTransform(true), 180);
  setTimeout(() => updateModalPrismTransform(true), 320);
}

function initExpandButtonListener() {
  const expandBtn = document.getElementById("modalExpandStageBtn");
  if (!expandBtn) return;

  const onExpandTrigger = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    toggleModalStageExpand(e);
  };

  expandBtn.onclick = onExpandTrigger;
  expandBtn.ontouchstart = onExpandTrigger;
  expandBtn.removeEventListener("click", onExpandTrigger);
  expandBtn.addEventListener("click", onExpandTrigger);
  expandBtn.removeEventListener("touchstart", onExpandTrigger);
  expandBtn.addEventListener("touchstart", onExpandTrigger, { passive: false });
}

function toggleModalRoomView() {
  isModalRoomMode = !isModalRoomMode;
  applyModalRoomModeState();
}

function setModalRoomScene(sceneId) {
  currentModalRoomScene = sceneId;
  isModalRoomMode = true;
  applyModalRoomModeState();
}

function toggleModalRoomDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById("modalRoomDropdownMenu");
  if (!menu) return;
  menu.classList.toggle("hidden");
}

function selectModalRoomPreset(sceneId, label) {
  currentModalRoomScene = sceneId;
  const labelEl = document.getElementById("modalCurrentRoomLabel");
  if (labelEl) {
    labelEl.innerHTML = label;
  }
  const menu = document.getElementById("modalRoomDropdownMenu");
  if (menu) menu.classList.add("hidden");
  isModalRoomMode = true;
  applyModalRoomModeState();
}

document.addEventListener("click", (e) => {
  const container = document.getElementById("modalRoomDropdownContainer");
  const menu = document.getElementById("modalRoomDropdownMenu");
  if (menu && !menu.classList.contains("hidden") && container && !container.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

function applyModalRoomModeState() {
  const modal = document.getElementById("productModal");
  const stagePane = document.querySelector(".modal-preview-stage-pane");
  const stageCol = document.querySelector(".modal-stage-column");
  const furnZone = document.getElementById("modalFurnitureZone");
  const furnImg = document.getElementById("modalFurnitureImg");
  const roomDropdown = document.getElementById("modalRoomDropdownContainer");
  const roomToggleBtn = document.getElementById("modalRoomToggleBtn");
  const expandBtn = document.getElementById("modalExpandStageBtn");
  const dockContainer = document.getElementById("modalAngleDockContainer");
  const gestureHint = document.getElementById("modalStageGestureHint");
  
  // In Live Room mode, lock scale to 1.0 so A4 vs A3 comparison is 100% accurate
  if (isModalRoomMode) {
    modalZoom = 1.0;
    if (stagePane) stagePane.classList.remove("stage-zoomed-active");
  }

  if (modal) {
    modal.classList.toggle("modal-room-hanging-mode", isModalRoomMode);
  }
  if (stagePane) {
    stagePane.classList.toggle("modal-room-hanging-mode", isModalRoomMode);
  }
  if (stageCol) {
    stageCol.classList.toggle("modal-room-hanging-mode", isModalRoomMode);
  }

  // 1. Live Room Furniture Zone (Sofa / Bed / Desk props)
  if (furnZone) {
    furnZone.classList.toggle("active", isModalRoomMode);
    furnZone.classList.toggle("hidden", !isModalRoomMode);
    furnZone.style.setProperty("display", isModalRoomMode ? "flex" : "none", "important");
    furnZone.style.visibility = isModalRoomMode ? "visible" : "hidden";
    furnZone.style.opacity = isModalRoomMode ? "1" : "0";
  }

  // 2. Room Scene Preset Dropdown (Living, Bedroom, Studio, Gallery)
  if (roomDropdown) {
    roomDropdown.classList.toggle("hidden", !isModalRoomMode);
    roomDropdown.classList.toggle("flex", isModalRoomMode);
    roomDropdown.style.setProperty("display", isModalRoomMode ? "flex" : "none", "important");
    roomDropdown.style.visibility = isModalRoomMode ? "visible" : "hidden";
  }

  // 3. Toggle button state and label ("Studio View" vs "Live Room")
  if (roomToggleBtn) {
    roomToggleBtn.classList.toggle("active", isModalRoomMode);
    const textEl = document.getElementById("modalRoomToggleBtnText");
    if (textEl) {
      textEl.textContent = isModalRoomMode ? "Studio View" : "Live Room";
    }
  }

  // 4. Completely hide Expand/Collapse Button in Live Room mode; restore normally in Studio View
  if (expandBtn) {
    expandBtn.style.setProperty("display", isModalRoomMode ? "none" : "", "important");
    expandBtn.classList.toggle("hidden", isModalRoomMode);
  }

  if (dockContainer) {
    dockContainer.style.display = (isModalRoomMode || isModalStageExpanded) ? "none" : "flex";
  }

  if (gestureHint) {
    gestureHint.style.display = isModalRoomMode ? "none" : "inline-flex";
  }

  if (isModalRoomMode) {
    const scene = (typeof ROOM_SCENES !== 'undefined' ? ROOM_SCENES : []).find(r => r.id === currentModalRoomScene) || (typeof ROOM_SCENES !== 'undefined' ? ROOM_SCENES[0] : null);
    if (furnImg && scene) {
      furnImg.src = scene.furnitureSvg;
      furnImg.style.display = "block";
      furnImg.style.visibility = "visible";
      furnImg.style.opacity = "1";
    }
    const labelEl = document.getElementById("modalCurrentRoomLabel");
    if (labelEl && scene) {
      const icon = scene.id === 'bedroom' ? '🛏️' : (scene.id === 'studio-office' ? '💼' : (scene.id === 'gallery-loft' ? '🖼️' : '🛋️'));
      labelEl.innerHTML = `${icon} ${scene.name.split(' ')[0]}`;
    }
    modalRotY = LIVE_ROOM_ROT_Y;
    modalRotX = LIVE_ROOM_ROT_X;
  } else {
    modalRotY = 0;
    modalRotX = 0;
  }

  updateModalPrismTransform(true);
}

function toggleModalExploded() {
  if (typeof openTopDownBreakdownModal === 'function') {
    openTopDownBreakdownModal();
  }
}

function handleModalSliderRotate(val) {
  setModalRotation(parseFloat(val), false);
}

// =====================================================================
// SECTIONS DROPDOWN (TOP-LEFT OF HEADER NEXT TO LOGO)
// =====================================================================
function toggleSectionsDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById("sectionsDropdownMenu");
  const btn = document.getElementById("sectionsDropdownBtn");
  if (!menu) return;
  const isHidden = menu.classList.contains("hidden");
  if (isHidden) {
    menu.classList.remove("hidden");
    menu.classList.add("flex");
    if (btn) btn.setAttribute("aria-expanded", "true");
  } else {
    menu.classList.add("hidden");
    menu.classList.remove("flex");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }
}

function closeSectionsDropdown() {
  const menu = document.getElementById("sectionsDropdownMenu");
  const btn = document.getElementById("sectionsDropdownBtn");
  if (menu) {
    menu.classList.add("hidden");
    menu.classList.remove("flex");
  }
  if (btn) btn.setAttribute("aria-expanded", "false");
}

document.addEventListener("click", (e) => {
  const wrapper = document.getElementById("sectionsDropdownWrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    closeSectionsDropdown();
  }
});

// =====================================================================
// LIVE AR WALL ENGINE (REMOVED AS REQUESTED)
// =====================================================================
function openLiveARWallModal() {}
function openYourWallFullscreenModal() {}

async function startLiveCameraAR() {
  const video = document.getElementById("yourWallCameraVideo");
  const reticle = document.getElementById("yourWallARPlacementReticle");
  const btnCamera = document.getElementById("yourWallModeCameraBtn");
  const snapBtn = document.getElementById("yourWallSnapPhotoBtn");
  const hint = document.getElementById("yourWallModeHint");

  // Check WebXR immersive-ar capability if available
  if (navigator.xr && typeof navigator.xr.isSessionSupported === "function") {
    navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
      if (supported && btnCamera) {
        btnCamera.textContent = "WEBXR LIVE AR • 3D WALL ANCHOR";
      }
    }).catch(() => {});
  }

  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      yourWallCameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      if (video) {
        video.srcObject = yourWallCameraStream;
        video.classList.remove("hidden");
        video.play().catch(() => {});
      }
    }
  } catch (err) {
    console.warn("Live AR Camera stream fallback:", err);
  }

  isYourWallARActive = true;
  isYourWallPlaced = false;

  if (reticle) {
    reticle.classList.remove("hidden");
    reticle.style.display = "flex";
  }
  if (snapBtn) {
    snapBtn.classList.remove("hidden");
    snapBtn.style.display = "inline-flex";
  }
  if (hint) {
    hint.textContent = "Aim at your physical wall & tap Anchor 3D Frame";
  }
  initLucideIcons();
}

function stopLiveCameraAR() {
  if (yourWallCameraStream) {
    yourWallCameraStream.getTracks().forEach(t => t.stop());
    yourWallCameraStream = null;
  }
  const video = document.getElementById("yourWallCameraVideo");
  if (video) {
    video.srcObject = null;
  }
  isYourWallARActive = false;
}

function resetARWallAnchor() {
  isYourWallPlaced = false;
  const reticle = document.getElementById("yourWallARPlacementReticle");
  if (reticle) {
    reticle.classList.remove("hidden");
    reticle.style.display = "flex";
  }
  const hint = document.getElementById("yourWallModeHint");
  if (hint) {
    hint.textContent = "Aim at your physical wall & tap Anchor 3D Frame";
  }
}

function placeArtworkOnWall() {
  isYourWallPlaced = true;
  const reticle = document.getElementById("yourWallARPlacementReticle");
  if (reticle) {
    reticle.classList.add("hidden");
    reticle.style.display = "none";
  }
  yourWallPos = { x: 0, y: 0 };
  updateYourWallTransform();
  const hint = document.getElementById("yourWallModeHint");
  if (hint) {
    hint.textContent = "3D Frame Anchored • Drag on wall or tilt phone for 3D depth";
  }
  showToast("3D Frame anchored to wall plane", "success");
}

function initARDeviceOrientation() {
  if (yourWallGyroInit) return;
  yourWallGyroInit = true;

  window.addEventListener("deviceorientation", (e) => {
    if (!isYourWallARActive || !isYourWallPlaced) return;
    const gamma = e.gamma || 0; // Left/Right tilt (-90 to 90)
    const beta = e.beta || 0;   // Front/Back tilt (-180 to 180)
    yourWallGyroY = Math.max(-22, Math.min(22, gamma * 0.35));
    yourWallGyroX = Math.max(-15, Math.min(15, (beta - 70) * 0.25));
    updateYourWallTransform();
  }, { passive: true });
}

function captureYourWallPhoto() {
  const video = document.getElementById("yourWallCameraVideo");
  const canvas = document.getElementById("yourWallARCaptureCanvas");
  if (!canvas) return;

  canvas.width = (video && video.videoWidth) ? video.videoWidth : 1280;
  canvas.height = (video && video.videoHeight) ? video.videoHeight : 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (video && video.readyState >= 2) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#121216";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (currentCustomizingPoster) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const aspect = 210 / 297;
      const posterHeight = canvas.height * 0.42 * (yourWallScale / 0.65);
      const posterWidth = posterHeight * aspect;
      const x = (canvas.width - posterWidth) / 2 + yourWallPos.x * (canvas.width / window.innerWidth);
      const y = (canvas.height - posterHeight) / 2 + yourWallPos.y * (canvas.height / window.innerHeight);

      ctx.shadowColor = "rgba(0,0,0,0.65)";
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 16;
      ctx.fillStyle = "#0c0c0e";
      const border = selectedFrame !== 'unframed' ? 12 : 0;
      ctx.fillRect(x - border, y - border, posterWidth + border * 2, posterHeight + border * 2);
      ctx.shadowColor = "transparent";

      ctx.drawImage(img, x, y, posterWidth, posterHeight);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `incase-studios-ar-${currentCustomizingPoster.id || "poster"}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("AR Wall snapshot saved!", "success");
    };
    img.src = currentCustomizingPoster.image || currentCustomizingPoster.imageUrl;
  }
}

function closeYourWallFullscreenModal() {
  stopLiveCameraAR();
  const modal = document.getElementById("yourWallFullscreenModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.setProperty("display", "none", "important");
  }
}

function renderYourWallArtwork() {
  const container = document.getElementById("yourWallFrameInner");
  if (!container || !currentCustomizingPoster) return;

  // Render true 3D CSS Prism Frame (or 3-piece Islamic triptych!) in Live AR
  if (currentCustomizingPoster.category === "islamic") {
    const panels = (currentCustomizingPoster.triptychImages && currentCustomizingPoster.triptychImages.length === 3)
      ? currentCustomizingPoster.triptychImages
      : ["assets/islamic-panel-1.jpg", "assets/islamic-panel-2.jpg", "assets/islamic-panel-3.jpg"];
    container.innerHTML = `
      <div class="triptych-grid" style="width: min(82vw, 390px); display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; align-items: center;">
        ${panels.map((panelSrc, sliceIdx) => `
          <div class="triptych-panel" style="aspect-ratio: 210 / 297; width: 100%;">
            ${renderModalPrismHtml(panelSrc, `${currentCustomizingPoster.title} Panel ${sliceIdx + 1}`, selectedFrame, selectedSize, null, false)}
          </div>
        `).join("")}
      </div>
    `;
  } else {
    const imgUrl = currentCustomizingPoster.image || currentCustomizingPoster.imageUrl;
    container.innerHTML = `
      <div style="width: 220px; aspect-ratio: 210 / 297;">
        ${renderModalPrismHtml(imgUrl, currentCustomizingPoster.title, selectedFrame, selectedSize, null, false)}
      </div>
    `;
  }
}

function updateYourWallTransform() {
  const frame = document.getElementById("yourWallDraggableFrame");
  if (!frame) return;
  const sizeMultiplier = (selectedSize === "a4") ? 0.82 : 1.16;
  const effectiveScale = yourWallScale * sizeMultiplier;
  const totalRotY = yourWallAngle + yourWallGyroY;
  frame.style.transform = `translate3d(${yourWallPos.x}px, ${yourWallPos.y}px, 0px) scale(${effectiveScale}) rotateX(${yourWallGyroX}deg) rotateY(${totalRotY}deg)`;
}

function setYourWallScale(val) {
  yourWallScale = Math.max(0.2, Math.min(1.3, val / 100));
  updateYourWallControlsUI();
  updateYourWallTransform();
}

function adjustYourWallScale(delta) {
  yourWallScale = Math.max(0.2, Math.min(1.3, Math.round((yourWallScale + delta) * 100) / 100));
  updateYourWallControlsUI();
  updateYourWallTransform();
}

function setYourWallAngle(angle) {
  yourWallAngle = angle;
  updateYourWallControlsUI();
  updateYourWallTransform();
}

function setYourWallSize(size) {
  selectedSize = size;
  updateModalPrice();
  updateModalPreview();
  renderYourWallArtwork();
  updateYourWallControlsUI();
  updateYourWallTransform();
}

function updateYourWallControlsUI() {
  const slider = document.getElementById("yourWallScaleSlider");
  const label = document.getElementById("yourWallScaleVal");
  if (slider) slider.value = Math.round(yourWallScale * 100);
  if (label) label.textContent = `${Math.round(yourWallScale * 100)}%`;

  const btnFront = document.getElementById("yourWallAngleFrontBtn");
  const btnAngle = document.getElementById("yourWallAnglePerspectiveBtn");
  if (btnFront) {
    btnFront.classList.toggle("bg-white", yourWallAngle === 0);
    btnFront.classList.toggle("text-black", yourWallAngle === 0);
    btnFront.classList.toggle("text-zinc-400", yourWallAngle !== 0);
  }
  if (btnAngle) {
    btnAngle.classList.toggle("bg-white", yourWallAngle !== 0);
    btnAngle.classList.toggle("text-black", yourWallAngle !== 0);
    btnAngle.classList.toggle("text-zinc-400", yourWallAngle === 0);
  }

  const btnA4 = document.getElementById("yourWallSizeA4Btn");
  const btnA3 = document.getElementById("yourWallSizeA3Btn");
  if (btnA4) {
    btnA4.classList.toggle("bg-white", selectedSize === 'a4');
    btnA4.classList.toggle("text-black", selectedSize === 'a4');
    btnA4.classList.toggle("text-zinc-400", selectedSize !== 'a4');
  }
  if (btnA3) {
    btnA3.classList.toggle("bg-white", selectedSize === 'a3');
    btnA3.classList.toggle("text-black", selectedSize === 'a3');
    btnA3.classList.toggle("text-zinc-400", selectedSize !== 'a3');
  }
  
  const addBtnLabel = document.getElementById("yourWallAddBtnLabel");
  const priceEl = document.getElementById("modalTotalPrice");
  if (addBtnLabel && priceEl) {
    addBtnLabel.textContent = `ADD TO BAG • ${priceEl.textContent}`;
  }
}

function initYourWallGestures() {
  if (yourWallGesturesInit) return;
  const viewport = document.getElementById("yourWallCanvasViewport");
  const frame = document.getElementById("yourWallDraggableFrame");
  if (!viewport || !frame) return;
  yourWallGesturesInit = true;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;
  let isPinching = false;
  let startPinchDist = 0;
  let startPinchScale = 0.65;

  viewport.addEventListener("touchstart", (e) => {
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("header")) return;
    if (e.touches.length === 2) {
      isPinching = true;
      isDragging = false;
      startPinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      startPinchScale = yourWallScale;
      return;
    }
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      initialX = yourWallPos.x;
      initialY = yourWallPos.y;
    }
  }, { passive: false });

  viewport.addEventListener("touchmove", (e) => {
    if (isPinching && e.touches.length === 2) {
      if (e.cancelable) e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (startPinchDist > 0) {
        const factor = dist / startPinchDist;
        setYourWallScale(startPinchScale * factor * 100);
      }
      return;
    }
    if (isDragging && e.touches.length === 1) {
      if (e.cancelable) e.preventDefault();
      yourWallPos.x = initialX + (e.touches[0].clientX - startX);
      yourWallPos.y = initialY + (e.touches[0].clientY - startY);
      updateYourWallTransform();
    }
  }, { passive: false });

  viewport.addEventListener("touchend", () => {
    isDragging = false;
    isPinching = false;
  }, { passive: true });

  frame.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = yourWallPos.x;
    initialY = yourWallPos.y;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    yourWallPos.x = initialX + (e.clientX - startX);
    yourWallPos.y = initialY + (e.clientY - startY);
    updateYourWallTransform();
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

function resetModalStudioWall() {
  closeYourWallFullscreenModal();
}

function setModalWallColor(colorHex) {
  if (!colorHex) return;

  // 1. Set globally on :root and modal
  document.documentElement.style.setProperty("--stage-bg", colorHex);
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.style.setProperty("--stage-bg", colorHex);
  }

  // 2. Keep previewContainer and thumbZone strictly 100% transparent (no split-screen rendering!)
  const stageCol = document.querySelector(".modal-stage-column");
  const stagePane = document.querySelector(".modal-preview-stage-pane");
  const previewContainer = document.getElementById("modalPreviewContainer");
  const thumbZone = document.querySelector(".stage-bottom-thumb-zone");

  if (previewContainer) {
    previewContainer.style.setProperty("background", "transparent", "important");
    previewContainer.style.setProperty("background-color", "transparent", "important");
  }
  if (thumbZone) {
    thumbZone.style.setProperty("background", "transparent", "important");
    thumbZone.style.setProperty("background-color", "transparent", "important");
  }

  // 3. Set synchronously on stageCol and stagePane with hardware compositor invalidation
  const primaryStageEls = [stageCol, stagePane].filter(Boolean);
  primaryStageEls.forEach(el => {
    el.style.setProperty("--stage-bg", colorHex);
    el.style.setProperty("background-color", colorHex, "important");
    // Trigger immediate hardware repaint across WebKit compositing tiles
    el.style.transform = 'translateZ(0.0001px)';
    void el.offsetHeight;
  });

  requestAnimationFrame(() => {
    primaryStageEls.forEach(el => {
      el.style.transform = '';
      void el.offsetHeight;
    });
  });

  // 4. Highlight active swatch dot
  document.querySelectorAll("[data-wall-color]").forEach(dot => {
    const isCur = dot.getAttribute("data-wall-color").toLowerCase() === colorHex.toLowerCase();
    dot.classList.toggle("active", isCur);
  });
  
  // 5. Update custom color input value
  const customInput = document.getElementById("modalCustomColorPicker");
  if (customInput && customInput.value.toLowerCase() !== colorHex.toLowerCase()) {
    customInput.value = colorHex;
  }
}

function initModalStageGestures() {
  if (modalGesturesInitialized) return;
  const stagePane = document.querySelector(".modal-preview-stage-pane");
  if (!stagePane) return;
  modalGesturesInitialized = true;

  // Bind custom color picker events to eliminate iOS Safari occlusion lag
  const customColorInput = document.getElementById("modalCustomColorPicker");
  if (customColorInput && !customColorInput.hasAttribute("data-bound-color")) {
    customColorInput.setAttribute("data-bound-color", "true");
    ["input", "change", "blur"].forEach(evt => {
      customColorInput.addEventListener(evt, (e) => {
        setModalWallColor(e.target.value);
      });
    });
  }

  let startX = 0;
  let startY = 0;
  let startAngle = 0;
  let isPointerDown = false;
  let dragMode = "none"; // "none", "rotate", "move", "scroll", "pinch"
  let gestureDecided = false;

  // Pinch-to-zoom tracking
  let isPinching = false;
  let startPinchDist = 0;
  let startPinchZoom = 1.0;

  // Double-tap tracking
  let lastTapTime = 0;

  // Desktop Mouse Dragging (3D Rotation)
  stagePane.addEventListener("mousedown", (e) => {
    if (isModalRoomMode) return;
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("label") || e.target.closest(".side-profile-pointer-badge") || e.target.closest("#modalWallColorSidePanel")) return;
    dismissModalGestureHint();
    isPointerDown = true;
    startX = e.clientX;
    startY = e.clientY;
    startAngle = modalRotY;
    dragMode = "rotate";
  });

  // Desktop Mouse Wheel Zoom
  stagePane.addEventListener("wheel", (e) => {
    if (isModalRoomMode) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    const target = Math.max(0.95, Math.min(1.28, Math.round((modalZoom + delta) * 100) / 100));
    setModalZoom(target);
    showModalZoomIndicator(target);
  }, { passive: false });

  // Desktop Double Click to Zoom In / Out
  stagePane.addEventListener("dblclick", (e) => {
    if (isModalRoomMode) return;
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("label")) return;
    toggleModalDoubleTapZoom();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isPointerDown) return;
    if (isModalRoomMode) return;
    const dx = e.clientX - startX;
    if (dragMode === "rotate") {
      setModalRotation(startAngle + dx * 0.75, false);
    }
  });

  window.addEventListener("mouseup", () => {
    if (isPointerDown) {
      isPointerDown = false;
      dragMode = "none";
    }
  });

  // Touch Drag, Pinch-to-Zoom & Double-Tap on Mobile
  stagePane.addEventListener("touchstart", (e) => {
    if (isModalRoomMode) return;
    const target = e.target;
    if (target.closest("button") || target.closest(".stage-architect-btn") || target.closest("#modalExpandStageBtn") || target.closest("input") || target.closest("label") || target.closest(".side-profile-pointer-badge") || target.closest("#modalWallColorSidePanel")) return;
    dismissModalGestureHint();

    if (e.touches.length === 2) {
      isPinching = true;
      dragMode = "pinch";
      gestureDecided = true;
      startPinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      startPinchZoom = modalZoom;
      if (stagePane) stagePane.classList.add("stage-zoomed-active");
      if (e.cancelable) e.preventDefault();
      return;
    }

    if (e.touches.length === 1) {
      isPointerDown = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startAngle = modalRotY;
      gestureDecided = false;
      dragMode = "none";
    }
  }, { passive: false });

  stagePane.addEventListener("touchmove", (e) => {
    if (isModalRoomMode) return;
    if (isPinching && e.touches.length === 2) {
      if (isModalRoomMode) return;
      if (e.cancelable) e.preventDefault();
      const curDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (startPinchDist > 0) {
        const factor = curDist / startPinchDist;
        // Clamp pinch zoom between 0.95 and 1.28 so the poster is NEVER cut in half
        const newZoom = Math.max(0.95, Math.min(1.28, startPinchZoom * factor));
        setModalZoom(newZoom);
        showModalZoomIndicator(newZoom);
      }
      return;
    }

    if (!isPointerDown || e.touches.length !== 1) return;

    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;

    // Detect gesture intent: horizontal rotation vs vertical page scroll
    if (!gestureDecided) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        dragMode = "rotate";
        gestureDecided = true;
      } else if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
        dragMode = "scroll";
        gestureDecided = true;
      }
    }

    if (dragMode === "rotate") {
      if (e.cancelable) e.preventDefault();
      setModalRotation(startAngle + dx * 0.85, false);
    }
    // If dragMode === "scroll", native smooth scrolling occurs naturally!
  }, { passive: false });

  stagePane.addEventListener("touchend", (e) => {
    if (isPinching && e.touches.length < 2) {
      isPinching = false;
    }

    if (isPointerDown) {
      const wasRotating = (dragMode === "rotate" || dragMode === "move");
      const hadGesture = gestureDecided && wasRotating;
      isPointerDown = false;
      dragMode = "none";
      gestureDecided = false;

      // Double-Tap detection on quick clean tap without drag
      if (!hadGesture && e.changedTouches && e.changedTouches.length === 1) {
        const dx = Math.abs(e.changedTouches[0].clientX - startX);
        const dy = Math.abs(e.changedTouches[0].clientY - startY);
        if (dx < 12 && dy < 12) {
          const now = Date.now();
          if (now - lastTapTime < 320) {
            if (!isModalRoomMode) {
              toggleModalDoubleTapZoom();
            }
            lastTapTime = 0;
          } else {
            lastTapTime = now;
          }
        }
      }
    }
  }, { passive: true });
}

function updateModalPrismTransform(smooth = true) {
  const stage = document.getElementById("modalPrismStage");
  if (!stage) return;
  stage.classList.toggle("no-transition", !smooth);
  const isMobile = window.innerWidth < 1024;
  const baseScale = 1.0;

  if (isModalRoomMode) {
    modalRotY = LIVE_ROOM_ROT_Y;
    modalRotX = LIVE_ROOM_ROT_X;
  }

  const roomScale = 1.0;
  const wallScale = isModalWallMode ? modalWallScale : 1.0;
  
  const isFrontView = Math.abs(modalRotY) < 15;
  const frontViewScale = isFrontView ? 1.0 : 0.96;

  // Mathematically exact ISO 216 scaling: A3 linear scale = A4 * sqrt(2) => Area is precisely 2.0x
  const ISO_A3_TO_A4_RATIO = Math.SQRT2; // 1.41421356

  // In Live Room mode: A4 is refined and modest (0.72), A3 is statement (0.72 * 1.4142 = 1.018), strictly under 30% wall width
  const a4LiveScale = 0.72;
  const a3LiveScale = a4LiveScale * ISO_A3_TO_A4_RATIO;

  // In Studio mode: A4 is compact and refined (0.74 on mobile, 0.76 on desktop).
  // A3 mathematically doubles the surface area (2x area) via linear sqrt(2) multiplier:
  // 0.74 * 1.41421356 = 1.0465. This creates an authentic, obvious visual contrast between sizes.
  const a4StudioScale = isMobile ? 0.74 : 0.76;
  const a3StudioScale = a4StudioScale * ISO_A3_TO_A4_RATIO;

  // In Islamic 3-piece Set: calibrated so all 3 panels fit comfortably side-by-side with exact 1.4142 ratio
  const a4IslamicScale = isMobile ? 0.62 : 0.68;
  const a3IslamicScale = a4IslamicScale * ISO_A3_TO_A4_RATIO;

  // Calibrated size scales
  const isIslamicSet = isTriptychMode && currentCustomizingPoster && currentCustomizingPoster.category === "islamic";
  const sizeScale = isIslamicSet
    ? ((selectedSize === "a4") ? a4IslamicScale : a3IslamicScale)
    : (isModalRoomMode
        ? ((selectedSize === "a4") ? a4LiveScale : a3LiveScale)
        : ((selectedSize === "a4") ? a4StudioScale : a3StudioScale));

  // In expanded mode: apply a uniform scale multiplier (+6%) in Studio mode so the true 2x area ratio is strictly preserved.
  // In Live Room mode, keep multiplier at 1.0 to preserve tasteful room proportions relative to furniture.
  const expandedMultiplier = (isModalStageExpanded && !isModalRoomMode) ? 1.06 : 1.0;

  const scale = baseScale * modalZoom * roomScale * wallScale * sizeScale * frontViewScale * expandedMultiplier;

  // Safe positional clamping on mobile so user drags or offsets NEVER push poster behind buttons or controls
  let posX = modalPosterPos.x;
  let posY = modalPosterPos.y;
  if (isMobile) {
    posX = Math.max(-12, Math.min(12, posX));
    posY = Math.max(-8, Math.min(8, posY));
    if (isModalStageExpanded && !isModalRoomMode) {
      // In expanded Studio mode, slightly shift down (posY: 6px for A3, 2px for A4)
      // to guarantee at least 24px clear space below the top navigation bar
      posY += (selectedSize === 'a3' ? 6 : 2);
    }
  }
  if (isModalRoomMode) {
    // 100% Flush and parallel to wall.
    // In compact view, apply a clean negative Y-offset (-14px) to position comfortably on the upper wall above sofa
    // In expanded view, position with negative Y-offset (-22px) leaving generous wall gap above furniture
    posX = 0;
    posY = isModalStageExpanded ? -22 : -14;
  }

  const triptychWrapper = document.getElementById("modalTriptychStageWrapper");
  if (isIslamicSet && triptychWrapper) {
    triptychWrapper.classList.toggle("no-transition", !smooth);
    
    // Smart Focus Triptych Isolation:
    // When facing straight-on (within ±10°), all 3 panels display side-by-side.
    // The moment rotation exceeds ±10°, smoothly isolate the center panel and fade out the two outer panels.
    const isAngled = Math.abs(modalRotY) > 10;
    triptychWrapper.classList.toggle("triptych-focus-center", isAngled);
    
    // Position and scale the overall triptych gallery set
    triptychWrapper.style.transform = `translate3d(${posX}px, ${posY}px, 0) scale(${scale})`;
    
    // Center panel rotates as a fully interactive 3D prism with extruded sides & MDF backboard
    stage.style.transform = `rotateX(${modalRotX}deg) rotateY(${modalRotY}deg)`;
  } else {
    // Standard Single 3D Poster Stage Transform
    stage.style.transform = `translate3d(${posX}px, ${posY}px, 0) scale(${scale}) rotateX(${modalRotX}deg) rotateY(${modalRotY}deg)`;
  }

  // Update physical scale dimension badge text above the frame
  const sizeBadge = document.getElementById("modalSizeDimensionBadge");
  if (sizeBadge) {
    if (isIslamicSet) {
      const isAngled = Math.abs(modalRotY) > 10;
      if (isAngled) {
        sizeBadge.innerHTML = (selectedSize === 'a4')
          ? '📐 3D FOCUS: CENTER PANEL (A4 21 × 29.7 CM) • ROTATE TO INSPECT 3D PROFILE'
          : '📐 3D FOCUS: CENTER PANEL (A3 29.7 × 42 CM) • ROTATE TO INSPECT 3D PROFILE';
      } else {
        sizeBadge.innerHTML = (selectedSize === 'a4')
          ? '📐 3-PIECE SET • EACH PANEL A4 (21 × 29.7 CM)'
          : '📐 3-PIECE SET • EACH PANEL A3 (29.7 × 42.0 CM • 2× AREA)';
      }
    } else if (isModalRoomMode) {
      sizeBadge.innerHTML = (selectedSize === 'a4')
        ? '📐 A4 COMPACT • 21 × 29.7 CM • Same height as 10.9" iPad'
        : '📐 A3 STATEMENT • 29.7 × 42.0 CM • 2× Size • 1/3 Sofa Width Statement';
    } else {
      sizeBadge.innerHTML = (selectedSize === 'a4')
        ? '📐 A4 COMPACT • 21 × 29.7 CM'
        : '📐 A3 STATEMENT • 29.7 × 42.0 CM (2× AREA)';
    }
  }

  // Trigger dynamic glass glimmer reflection across museum acrylic
  triggerGlassGlimmerSweep();
}

function triggerGlassGlimmerSweep() {
  const sheens = document.querySelectorAll(".prism-glazing-sheen");
  if (!sheens.length) return;
  sheens.forEach(sheen => {
    sheen.classList.remove("sheen-sweep-active");
    void sheen.offsetWidth;
    sheen.classList.add("sheen-sweep-active");
  });
}

function updateModalRotationControls() {
  const slider = document.getElementById("modal360Slider");
  if (slider) slider.value = modalRotY;

  const readout = document.getElementById("modalRotAngleReadout");
  if (readout) {
    let desc = "FRONT";
    const abs = Math.abs(modalRotY);
    if (abs >= 150) desc = "REAR MDF";
    else if (abs >= 45 && abs <= 135) desc = selectedFrame === 'aluminium' ? '18MM METAL SIDE' : '12MM MATTE SIDE';
    else if (abs > 10) desc = "3D VIEW";
    readout.textContent = `${modalRotY}° ${desc}`;
  }

  // Clean button active states
  const btnFront = document.getElementById("modalBtnFront");
  const btnAngle = document.getElementById("modalBtnAngle");
  const btnSide = document.getElementById("modalBtnSide");
  const btnRear = document.getElementById("modalBtnRear");
  if (btnFront) btnFront.classList.toggle("active", Math.abs(modalRotY) < 20);
  if (btnAngle) btnAngle.classList.toggle("active", Math.abs(modalRotY) >= 20 && Math.abs(modalRotY) < 55);
  if (btnSide) btnSide.classList.toggle("active", Math.abs(modalRotY) >= 55 && Math.abs(modalRotY) <= 135);
  if (btnRear) btnRear.classList.toggle("active", Math.abs(modalRotY) >= 150);

  const zoomBtnText = document.getElementById("modalProfileZoomBtnText");
  if (zoomBtnText) {
    zoomBtnText.innerHTML = (Math.abs(modalRotY) > 20) ? "↺ RESET TO FRONT VIEW" : "🔍 CLICK TO ZOOM &amp; ROTATE SIDE PROFILE";
  }
}

function toggleModalProfileZoom(forceFrame) {
  if (forceFrame) {
    selectedFrame = forceFrame;
  } else if (selectedFrame === "unframed" || selectedFrame === "none") {
    selectedFrame = "plastic";
  }
  
  if (Math.abs(modalRotY) < 30) {
    snapModalAngle(65);
  } else {
    snapModalAngle(0);
  }
  updateModalPreview();
  updateModalPrice();
}

function setModalFrameFromZoom(frameId) {
  selectedFrame = frameId;
  snapModalAngle(65);
  updateModalPreview();
  updateModalPrice();
}

function renderModalPrismHtml(posterImg, posterTitle, frameType, size, panelSliceIndex = null, includeStageId = true) {
  const isA4 = (size === "a4");
  const isMobile = window.innerWidth < 768;
  const isIslamicTriptych = isTriptychMode && currentCustomizingPoster && currentCustomizingPoster.category === "islamic";
  const showA3Outline = isA4 && !isMobile && includeStageId && panelSliceIndex === null && !isIslamicTriptych;
  const initBaseScale = (!isMobile && Math.abs(modalRotY) > 35 && Math.abs(modalRotY) < 145) ? 1.12 : 1.0;

  const stageIdAttr = includeStageId ? 'id="modalPrismStage"' : '';
  const currentRotX = isModalRoomMode ? LIVE_ROOM_ROT_X : modalRotX;
  const currentRotY = isModalRoomMode ? LIVE_ROOM_ROT_Y : modalRotY;
  const stageTransformStyle = includeStageId
    ? (isIslamicTriptych
        ? `style="width: 100%; height: 100%; transform-style: preserve-3d; transform: rotateX(${currentRotX}deg) rotateY(${currentRotY}deg);"`
        : `style="transform: scale(${initBaseScale}) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg);"`)
    : 'style="width: 100%; height: 100%; transform-style: preserve-3d;"';

  const frontArtHtml = (panelSliceIndex !== null)
    ? `
      <div class="triptych-slice-viewport">
        <img 
          src="${posterImg}" 
          alt="${posterTitle}" 
          class="triptych-slice-img triptych-slice-${panelSliceIndex}" 
          onerror="this.onerror=null; this.src='assets/islamic-triptych-panorama.jpg';" 
        />
      </div>
    `
    : `
      <img 
        src="${posterImg}" 
        alt="${posterTitle}" 
        class="w-full h-full object-cover block pointer-events-none portrait-spec" 
        style="width: 100% !important; height: 100% !important; object-fit: cover !important; object-position: center !important; display: block !important; margin: 0 !important; padding: 0 !important;" 
        onerror="handlePosterImageError(this, '${currentCustomizingPoster ? currentCustomizingPoster.id : ''}')" 
      />
    `;

  // Dedicated 0.4mm 3D Paper Model for Unframed Prints
  if (frameType === "unframed" || frameType === "none") {
    return `
      <div class="prism-3d-viewport portrait-spec relative select-none" style="aspect-ratio: 1 / 1.414;">
        ${showA3Outline ? '<div class="a3-scale-dashed-outline"></div>' : ''}

        <div ${stageIdAttr} class="prism-3d-stage w-full h-full relative" ${stageTransformStyle}>
          
          <!-- Front Face (0deg): 200gsm Glossy Photographic Print Face -->
          <div class="prism-face-paper-front portrait-spec overflow-hidden absolute inset-0" style="aspect-ratio: 1 / 1.414; width: 100%; height: 100%;">
            ${frontArtHtml}
            <div class="prism-glazing-sheen"></div>
          </div>

          <!-- Rear Face (180deg): Clean Unbranded White Photo Backing -->
          <div class="prism-face-paper-back select-none flex items-center justify-center bg-[#fafafa]">
            <div class="w-12 h-px bg-zinc-300"></div>
          </div>

          <!-- 1px Razor-Thin Paper Edges -->
          <div class="prism-paper-edge-left"></div>
          <div class="prism-paper-edge-right"></div>

        </div>
      </div>
    `;
  }

  const depthClass = frameType === 'aluminium' ? 'prism-depth-aluminium' : 'prism-depth-plastic';

  return `
    <div class="prism-3d-viewport portrait-spec relative" style="aspect-ratio: 1 / 1.414;">
      ${showA3Outline ? '<div class="a3-scale-dashed-outline"></div>' : ''}

      <div ${stageIdAttr} class="prism-3d-stage w-full h-full relative ${depthClass}" ${stageTransformStyle}>
        
        <!-- Front Face (0deg): Black Frame + Artwork + Acrylic Glazing -->
        <div class="prism-face-front poster-frame-container ${frameType === 'aluminium' ? 'frame-black-aluminium' : 'frame-black-plastic'} portrait-spec overflow-hidden absolute inset-0" style="aspect-ratio: 1 / 1.414; width: 100%; height: 100%; margin: 0; padding: 0; box-sizing: border-box;">
          ${frontArtHtml}
          <div class="prism-glazing-sheen"></div>
        </div>

        <!-- Rear Face (180deg): Clean Procedural E1 MDF Backboard with Brushed Silver Clips & Hardware -->
        <div class="prism-face-back rounded-xs absolute inset-0 real-mdf-back" style="width: 100%; height: 100%; overflow: hidden; box-sizing: border-box; background: #111111;">
          <div class="procedural-backboard-wrapper">
            <div class="mdf-board-surface">
              <div class="mdf-wood-grain"></div>

              ${size === 'a4' ? `
                <div class="a4-mdf-strut-assembly" title="A4 Integrated Folding Strut">
                  <div class="strut-metal-hinge"></div>
                  <div class="strut-mdf-body"></div>
                </div>
                <div class="mdf-silver-clip clip-pos-top" title="Silver Retention Clip"></div>
                <div class="mdf-silver-clip clip-pos-bottom" title="Silver Retention Clip"></div>
                <div class="mdf-silver-clip clip-pos-left" style="top: 50%; transform: translateY(-50%);" title="Silver Retention Clip"></div>
                <div class="mdf-silver-clip clip-pos-right" style="top: 50%; transform: translateY(-50%);" title="Silver Retention Clip"></div>
              ` : `
                <div class="mdf-silver-clip clip-pos-top" title="Silver Retention Clip"></div>
                <div class="mdf-silver-clip clip-pos-bottom" title="Silver Retention Clip"></div>
                <div class="mdf-silver-clip clip-pos-left" style="top: 28%; transform: translateY(-50%);" title="Silver Retention Clip"></div>
                <div class="mdf-silver-clip clip-pos-left" style="top: 72%; transform: translateY(-50%);" title="Silver Retention Clip"></div>
                <div class="mdf-silver-clip clip-pos-right" style="top: 28%; transform: translateY(-50%);" title="Silver Retention Clip"></div>
                <div class="mdf-silver-clip clip-pos-right" style="top: 72%; transform: translateY(-50%);" title="Silver Retention Clip"></div>
              `}
            </div>
          </div>
        </div>

        <!-- 3. Extruded Side Walls (12mm Plastic vs 18mm Aluminium) -->
        <div class="prism-wall-left ${frameType === 'aluminium' ? 'prism-wall-aluminium' : 'prism-wall-plastic'}"></div>
        <div class="prism-wall-right ${frameType === 'aluminium' ? 'prism-wall-aluminium' : 'prism-wall-plastic'}"></div>
        <div class="prism-wall-top ${frameType === 'aluminium' ? 'prism-wall-aluminium' : 'prism-wall-plastic'}"></div>
        <div class="prism-wall-bottom ${frameType === 'aluminium' ? 'prism-wall-aluminium' : 'prism-wall-plastic'}"></div>

      </div>
    </div>
  `;
}

function updateModalPreview() {
  if (!currentCustomizingPoster) return;

  const previewContainer = document.getElementById("modalPreviewContainer");
  if (!previewContainer) return;

  // If Islamic print in 3-Piece Mode: show 3 strictly identical 1:1.414 portrait frames with Smart Focus center isolation on rotation
  if (isTriptychMode && currentCustomizingPoster.category === "islamic") {
    const panels = (currentCustomizingPoster.triptychImages && currentCustomizingPoster.triptychImages.length === 3)
      ? currentCustomizingPoster.triptychImages
      : ["assets/islamic-panel-1.jpg", "assets/islamic-panel-2.jpg", "assets/islamic-panel-3.jpg"];
    previewContainer.innerHTML = `
      <div class="modal-prism-wrapper flex flex-col items-center justify-center w-full h-full px-2" style="max-height: 100%; max-width: 100%;">
        <div id="modalTriptychStageWrapper" class="triptych-stage-wrapper relative flex items-center justify-center w-full h-full" style="transform-style: preserve-3d;">
          <div class="triptych-grid" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(6px, 1.8vw, 12px); width: 100%; align-items: center; justify-items: center; transform-style: preserve-3d;">
            <div id="triptychOuterLeft" class="triptych-panel triptych-outer-left" style="aspect-ratio: 1 / 1.414; width: 100%; max-height: 100%;">
              ${renderModalPrismHtml(panels[0], `${currentCustomizingPoster.title} — Left Panel`, selectedFrame, selectedSize, null, false)}
            </div>
            <div id="triptychCenter" class="triptych-panel triptych-center" style="aspect-ratio: 1 / 1.414; width: 100%; max-height: 100%; transform-style: preserve-3d;">
              ${renderModalPrismHtml(panels[1], `${currentCustomizingPoster.title} — Center Panel`, selectedFrame, selectedSize, null, true)}
            </div>
            <div id="triptychOuterRight" class="triptych-panel triptych-outer-right" style="aspect-ratio: 1 / 1.414; width: 100%; max-height: 100%;">
              ${renderModalPrismHtml(panels[2], `${currentCustomizingPoster.title} — Right Panel`, selectedFrame, selectedSize, null, false)}
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // Single Portrait 3D Prism inside the sleek Black Frame border
    previewContainer.innerHTML = `
      <div class="modal-prism-wrapper flex flex-col items-center justify-center w-full h-full" style="max-height: 100%; max-width: 100%;">
        ${renderModalPrismHtml(currentCustomizingPoster.image, currentCustomizingPoster.title, selectedFrame, selectedSize, null, true)}
      </div>
    `;
  }

  const gestureHint = document.getElementById("modalStageGestureHint");
  if (gestureHint) {
    gestureHint.style.display = isModalRoomMode ? "none" : "inline-flex";
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  updateModalPrismTransform(false);
  updateModalRotationControls();

  // Size buttons (A4 vs A3) with sleek dimension badges
  document.querySelectorAll("[data-size-btn]").forEach(btn => {
    const isSelected = btn.getAttribute("data-size-btn") === selectedSize;
    btn.classList.toggle("is-selected-option", isSelected);
    const badge = btn.querySelector(".size-pill-badge");
    if (isSelected) {
      btn.classList.add("border-zinc-950", "bg-zinc-950", "text-white");
      btn.classList.remove("border-zinc-300", "bg-white", "text-zinc-900");
      if (badge) {
        badge.className = "size-pill-badge px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold tracking-tight bg-zinc-800 text-zinc-100 border border-zinc-700/60";
      }
    } else {
      btn.classList.remove("border-zinc-950", "bg-zinc-950", "text-white");
      btn.classList.add("border-zinc-300", "bg-white", "text-zinc-900");
      if (badge) {
        badge.className = "size-pill-badge px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold tracking-tight bg-zinc-100 text-zinc-800 border border-zinc-200";
      }
    }
  });

  // Frame buttons (Unframed, Black Plastic, Black Aluminium)
  document.querySelectorAll("[data-frame-btn]").forEach(btn => {
    const isSelected = btn.getAttribute("data-frame-btn") === selectedFrame;
    btn.classList.toggle("is-selected-option", isSelected);
    if (isSelected) {
      btn.classList.add("border-zinc-950", "ring-1", "ring-zinc-950", "bg-zinc-50");
      btn.classList.remove("border-zinc-300", "bg-white");
    } else {
      btn.classList.remove("border-zinc-950", "ring-1", "ring-zinc-950", "bg-zinc-50");
      btn.classList.add("border-zinc-300", "bg-white");
    }
  });

  // Immersive Corner Quick-Switch Pills (A4/A3 & Unframed/Plastic/Aluminium)
  document.querySelectorAll("[data-corner-size]").forEach(pill => {
    pill.classList.toggle("active", pill.getAttribute("data-corner-size") === selectedSize);
  });
  document.querySelectorAll("[data-corner-frame]").forEach(pill => {
    pill.classList.toggle("active", pill.getAttribute("data-corner-frame") === selectedFrame);
  });

  updateOptionPricesInUI();
}

function selectModalSize(size) {
  if (!size) return;
  selectedSize = size;
  const isMobile = window.innerWidth < 1024;
  if (isMobile && size === 'a3' && modalZoom > 1.05) {
    modalZoom = 1.0;
  }
  updateModalPreview();
  updateModalPrice();
}

function selectModalFrame(frame) {
  if (!frame) return;
  selectedFrame = frame;
  // Retain existing camera viewing angle (modalRotY) so customer can directly compare frame profiles
  updateModalPreview();
  updateModalPrice();
}
window.selectModalSize = selectModalSize;
window.selectModalFrame = selectModalFrame;

function getFrameClass(frameId) {
  if (frameId === "unframed" || frameId === "none") return "frame-unframed";
  if (frameId === "plastic") return "frame-black-plastic";
  return "frame-black-aluminium";
}

function getPricingTable() {
  if (currentCustomizingPoster && (currentCustomizingPoster.category === "custom-car" || currentCustomizingPoster.category === "custom-music")) {
    return EXACT_CUSTOM_CAR_PRICES;
  }
  return isTriptychMode ? EXACT_SET_PRICES : EXACT_SINGLE_PRICES;
}

function updateOptionPricesInUI() {
  const currentPrices = getPricingTable()[selectedSize];
  if (!currentPrices) return;

  const isSingle = (getPricingTable() === EXACT_SINGLE_PRICES);

  const getOptPrice = (entry) => {
    if (!entry) return { price: 0, wasPrice: 0 };
    if (isSingle) {
      const base = Number(entry.price);
      return {
        price: Math.round(base * 0.77 * 100) / 100,
        wasPrice: base
      };
    }
    return {
      price: Number(entry.price),
      wasPrice: Number(entry.wasPrice || entry.price)
    };
  };

  const unframed = getOptPrice(currentPrices.unframed);
  const plastic = getOptPrice(currentPrices.plastic);
  const alum = getOptPrice(currentPrices.aluminium);

  const unframedPriceEl = document.getElementById("optPriceUnframed");
  const unframedWasEl = document.getElementById("optWasUnframed");
  if (unframedPriceEl) unframedPriceEl.textContent = `£${unframed.price.toFixed(2)}`;
  if (unframedWasEl) {
    unframedWasEl.textContent = `£${unframed.wasPrice.toFixed(2)}`;
    unframedWasEl.style.display = (unframed.wasPrice > unframed.price) ? "inline" : "none";
  }

  const plasticPriceEl = document.getElementById("optPricePlastic");
  const plasticWasEl = document.getElementById("optWasPlastic");
  if (plasticPriceEl) plasticPriceEl.textContent = `£${plastic.price.toFixed(2)}`;
  if (plasticWasEl) {
    plasticWasEl.textContent = `£${plastic.wasPrice.toFixed(2)}`;
    plasticWasEl.style.display = (plastic.wasPrice > plastic.price) ? "inline" : "none";
  }

  const alumPriceEl = document.getElementById("optPriceAlum");
  const alumWasEl = document.getElementById("optWasAlum");
  if (alumPriceEl) alumPriceEl.textContent = `£${alum.price.toFixed(2)}`;
  if (alumWasEl) {
    alumWasEl.textContent = `£${alum.wasPrice.toFixed(2)}`;
    alumWasEl.style.display = (alum.wasPrice > alum.price) ? "inline" : "none";
  }
}

function getSelectedPricing() {
  const table = getPricingTable();
  const sizePrices = table[selectedSize] || table["a4"];
  const rawPricing = sizePrices[selectedFrame] || sizePrices["unframed"];
  
  if (table === EXACT_SINGLE_PRICES && rawPricing) {
    const base = Number(rawPricing.price);
    const discounted = Math.round(base * 0.77 * 100) / 100;
    return {
      price: discounted,
      wasPrice: base,
      label: rawPricing.label
    };
  }
  
  return rawPricing;
}

function updateModalPrice() {
  const pricing = getSelectedPricing();
  const priceEl = document.getElementById("modalTotalPrice");
  const wasPriceEl = document.getElementById("modalWasPrice");
  const stickyPrice = document.getElementById("modalStickyPrice");
  const stickyWasPrice = document.getElementById("modalStickyWasPrice");

  if (priceEl) priceEl.textContent = `£${pricing.price.toFixed(2)}`;
  if (wasPriceEl) {
    wasPriceEl.textContent = `£${pricing.wasPrice.toFixed(2)}`;
    wasPriceEl.style.display = (pricing.wasPrice > pricing.price) ? "inline" : "none";
  }
  if (stickyPrice) stickyPrice.textContent = `£${pricing.price.toFixed(2)}`;
  if (stickyWasPrice) {
    stickyWasPrice.textContent = `£${pricing.wasPrice.toFixed(2)}`;
    stickyWasPrice.style.display = (pricing.wasPrice > pricing.price) ? "inline" : "none";
  }
}

// Quick Room Preview from catalog card
function quickRoomPreview(posterId) {
  let poster = (typeof allPosters !== "undefined" ? allPosters : []).find(p => p.id === posterId);
  if (!poster && typeof DEFAULT_POSTERS !== "undefined") {
    poster = DEFAULT_POSTERS.find(p => p.id === posterId) || DEFAULT_POSTERS[0];
  }
  if (!poster) return;

  closeProductModal();
  const isIslamic = poster.category === "islamic";
  openRoomStudioModal(poster, selectedFrame, selectedSize, isIslamic ? true : isTriptychMode);
}

function openRoomStudioModal(poster, frame = "plastic", size = "a3", isTriptych = false) {
  const modal = document.getElementById("roomStudioModal");
  if (!modal) return;

  if (typeof poster === 'string') {
    const found = (typeof allPosters !== 'undefined' ? allPosters : []).find(p => p.id === poster) ||
                  (typeof DEFAULT_POSTERS !== 'undefined' ? DEFAULT_POSTERS : []).find(p => p.id === poster);
    poster = found || (typeof DEFAULT_POSTERS !== 'undefined' ? DEFAULT_POSTERS[0] : null);
  }
  if (!poster && typeof DEFAULT_POSTERS !== 'undefined') {
    poster = DEFAULT_POSTERS[0];
  }

  if (window.mockupStudio) {
    window.mockupStudio.loadPoster(poster, frame, size, isTriptych);
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  modal.style.setProperty("display", "flex", "important");
  lockBodyScroll();
  window.history.replaceState(null, '', window.location.pathname);
  initLucideIcons();
}

function closeRoomStudioModal() {
  const modal = document.getElementById("roomStudioModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.style.setProperty("display", "none", "important");
    unlockBodyScroll();
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    window.history.replaceState(null, '', window.location.pathname);
  }
}

function addFromVisualizerToCart() {
  if (!mockupStudio || !mockupStudio.currentPoster) return;

  const poster = mockupStudio.currentPoster;
  const sizeObj = SIZE_OPTIONS.find(s => s.id === mockupStudio.currentSize) || SIZE_OPTIONS[1];
  const frameObj = FRAME_OPTIONS.find(f => f.id === mockupStudio.currentFrame) || FRAME_OPTIONS[1];
  const pricing = mockupStudio.getCurrentPricing();
  const isTrip = mockupStudio.isTriptych;

  const itemTitle = isTrip 
    ? `${poster.title} (3-Piece Gallery Set)` 
    : poster.title;

  const cartItem = {
    cartId: "item-" + Date.now(),
    posterId: poster.id,
    title: itemTitle,
    image: poster.image,
    sizeName: sizeObj.name,
    sizeDimensions: sizeObj.dimensions,
    sizeId: mockupStudio.currentSize,
    frameName: frameObj.name,
    frameShort: frameObj.shortName,
    frameId: mockupStudio.currentFrame,
    isTriptych: isTrip,
    price: pricing.price,
    wasPrice: pricing.wasPrice,
    quantity: 1
  };

  cart.push(cartItem);
  saveCart();
  closeRoomStudioModal();
  openCartDrawer();
  showToast(`Added ${itemTitle} (${sizeObj.name}) to bag`, "success");
}

function addToCartFromModal() {
  if (!currentCustomizingPoster) return;

  const sizeObj = SIZE_OPTIONS.find(s => s.id === selectedSize) || SIZE_OPTIONS[0];
  const frameObj = FRAME_OPTIONS.find(f => f.id === selectedFrame) || FRAME_OPTIONS[0];
  const pricing = getSelectedPricing();

  const itemTitle = isTriptychMode 
    ? `${currentCustomizingPoster.title} (3-Piece Gallery Set)` 
    : currentCustomizingPoster.title;

  const cartItem = {
    cartId: "item-" + Date.now(),
    posterId: currentCustomizingPoster.id,
    title: itemTitle,
    image: currentCustomizingPoster.image,
    sizeName: sizeObj.name,
    sizeDimensions: sizeObj.dimensions,
    sizeId: selectedSize,
    frameName: frameObj.name,
    frameShort: frameObj.shortName,
    frameId: selectedFrame,
    isTriptych: isTriptychMode,
    price: pricing.price,
    wasPrice: pricing.wasPrice,
    quantity: 1
  };

  cart.push(cartItem);
  saveCart();
  closeProductModal();
  openCartDrawer();
  showToast(`Added ${itemTitle} (${sizeObj.name}) to bag`, "success");
}

// ==========================================
// --- CART & BAG MANAGEMENT ---
// ==========================================
function loadCart() {
  try {
    const saved = localStorage.getItem("incaseCart");
    if (saved) {
      cart = JSON.parse(saved);
      updateCartBadge();
    }
  } catch (e) {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem("incaseCart", JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function updateCartBadge() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cartBadge");
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? "flex" : "none";
  }
}

function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer && overlay) {
    renderCartDrawer();
    overlay.classList.remove("hidden");
    drawer.classList.remove("translate-x-full");
    lockBodyScroll();
  }
  initLucideIcons();
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer && overlay) {
    drawer.classList.add("translate-x-full");
    overlay.classList.add("hidden");
    unlockBodyScroll();
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }
}

function renderCartDrawer() {
  const container = document.getElementById("cartItemsContainer");
  const subtotalEl = document.getElementById("cartSubtotal");
  const shippingEl = document.getElementById("cartShipping");
  const totalEl = document.getElementById("cartTotal");
  const freeShipBar = document.getElementById("freeShippingBar");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center">
        <div class="w-12 h-12 bg-zinc-200 text-zinc-500 flex items-center justify-center mx-auto mb-3">
          <i data-lucide="shopping-bag" class="w-6 h-6"></i>
        </div>
        <p class="font-extrabold text-zinc-950 text-sm uppercase tracking-wide">Your Bag is Empty</p>
        <p class="text-xs text-zinc-500 mt-1">Add A4 or A3 prints in sleek black frames.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = "£0.00";
    if (shippingEl) shippingEl.textContent = "£0.00";
    if (totalEl) totalEl.textContent = "£0.00";
    if (freeShipBar) freeShipBar.style.width = "0%";
    initLucideIcons();
    return;
  }

  let subtotal = 0;

  container.innerHTML = cart.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="flex gap-3.5 p-3.5 bg-zinc-50 border border-zinc-200 relative">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-22 object-cover bg-zinc-200 border border-zinc-300 flex-shrink-0 portrait-spec" />
        
        <div class="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2">
              <h4 class="font-extrabold text-zinc-950 text-xs uppercase tracking-tight truncate">${item.title}</h4>
              <button onclick="removeFromCart(${index})" class="text-zinc-400 hover:text-red-600 transition">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
            <p class="text-[11px] font-bold text-zinc-800 mt-0.5">${item.sizeName} (${item.sizeDimensions})</p>
            <p class="text-[10px] text-zinc-500 font-semibold">${item.frameShort} ${item.isTriptych ? '• 3-Piece Set' : ''}</p>
          </div>

          <div class="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200">
            <div class="flex items-center border border-zinc-300 bg-white">
              <button onclick="changeCartQty(${index}, -1)" class="px-2 py-0.5 text-zinc-600 hover:bg-zinc-100 font-bold">-</button>
              <span class="px-2 py-0.5 text-xs font-bold text-zinc-900">${item.quantity}</span>
              <button onclick="changeCartQty(${index}, 1)" class="px-2 py-0.5 text-zinc-600 hover:bg-zinc-100 font-bold">+</button>
            </div>
            <span class="font-extrabold text-sm text-zinc-950">£${itemTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");

  const isFreeDelivery = subtotal >= 20.00;
  const shipping = isFreeDelivery || subtotal === 0 ? 0 : 2.99;
  const total = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = `£${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = isFreeDelivery ? "FREE" : `£${shipping.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `£${total.toFixed(2)}`;

  if (freeShipBar) {
    const pct = Math.min(100, Math.round((subtotal / 20) * 100));
    freeShipBar.style.width = `${pct}%`;
  }

  const freeShipText = document.getElementById("freeShippingText");
  if (freeShipText) {
    if (isFreeDelivery) {
      freeShipText.textContent = "🎉 You've unlocked FREE UK Delivery!";
    } else {
      const remaining = (20 - subtotal).toFixed(2);
      freeShipText.textContent = `Add £${remaining} more for FREE UK Delivery`;
    }
  }

  initLucideIcons();
}

function changeCartQty(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  showToast("Removed from bag", "info");
}

// Stripe Checkout Handler
async function initiateStripeCheckout() {
  if (cart.length === 0) {
    showToast("Your bag is empty", "error");
    return;
  }

  const checkoutBtn = document.getElementById("checkoutActionBtn");
  const origHtml = checkoutBtn ? checkoutBtn.innerHTML : "";
  if (checkoutBtn) {
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg> Connecting to Stripe...
    `;
  }

  try {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currency: "gbp",
        items: cart.map(item => ({
          title: `${item.title} - ${item.sizeName} (${item.frameShort})`,
          price: Math.round(item.price * 100),
          quantity: item.quantity,
          image: item.image
        })),
        success_url: window.location.origin + "/?payment=success",
        cancel_url: window.location.origin + "/?payment=cancelled"
      })
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      openPaymentConfigModal();
    }
  } catch (err) {
    openPaymentConfigModal();
  } finally {
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = origHtml;
    }
  }
}

function openPaymentConfigModal() {
  const modal = document.getElementById("stripeConfigModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closePaymentConfigModal() {
  const modal = document.getElementById("stripeConfigModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

function completeDirectOrder() {
  const order = {
    id: "INC-" + Math.floor(100000 + Math.random() * 900000),
    items: [...cart],
    total: document.getElementById("cartTotal").textContent,
    date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  };

  cart = [];
  saveCart();
  closeCartDrawer();
  closePaymentConfigModal();

  const orderIdEl = document.getElementById("confirmOrderId");
  if (orderIdEl) orderIdEl.textContent = order.id;

  const confirmModal = document.getElementById("orderConfirmedModal");
  if (confirmModal) {
    confirmModal.classList.remove("hidden");
    confirmModal.classList.add("flex");
  }
}

// Bulk Upload Handlers (maps each file directly as the single full-bleed <img> inside the frame)
let stagedUploads = [];

function openImportModal() {
  stagedUploads = [];
  renderStagedUploads();
  const modal = document.getElementById("bulkImportModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
  initLucideIcons();
}

function closeImportModal() {
  const modal = document.getElementById("bulkImportModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "auto";
  }
}

function handleFilesSelected(files) {
  const defaultCategory = document.getElementById("batchCategorySelect")?.value || "porsche";

  Array.from(files).forEach(file => {
    if (!file.type.startsWith("image/")) return;

    let rawName = file.name.substring(0, file.name.lastIndexOf("."));
    let cleanedTitle = rawName.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
    cleanedTitle = cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1);

    const reader = new FileReader();
    reader.onload = (e) => {
      const isIslamic = defaultCategory === "islamic";
      const isCustomCar = defaultCategory === "custom-car";

      stagedUploads.push({
        tempId: "tmp-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
        title: cleanedTitle,
        subtitle: isIslamic ? "Exclusive 3-Piece Gallery Set (3 Vertical Prints)" : "Premium 200gsm Heavyweight Glossy Photo Paper",
        category: defaultCategory,
        basePrice: isIslamic ? 14.63 : (isCustomCar ? 7.69 : 7.00),
        wasPrice: isIslamic ? 19.00 : (isCustomCar ? 9.99 : 7.00),
        image: e.target.result, // Base64 data string: persists in IndexedDB without broken images
        triptychImages: isIslamic ? [e.target.result, e.target.result, e.target.result] : null,
        orientation: "portrait",
        rating: 5.0,
        reviewsCount: 1,
        bestseller: false,
        paperSpec: "Premium 200gsm Heavyweight Glossy Photo Paper",
        tags: [defaultCategory, "A4", "A3", "Glossy"]
      });
      renderStagedUploads();
    };
    reader.readAsDataURL(file);
  });
}

function updateStagedCategory(idx, newCategory) {
  if (!stagedUploads[idx]) return;
  const item = stagedUploads[idx];
  item.category = newCategory;
  if (newCategory === "islamic") {
    item.basePrice = 14.63;
    item.wasPrice = 19.00;
    item.subtitle = "Exclusive 3-Piece Gallery Set (3 Vertical Prints)";
    item.triptychImages = [item.image, item.image, item.image];
  } else if (newCategory === "custom-car") {
    item.basePrice = 7.69;
    item.wasPrice = 9.99;
    item.triptychImages = null;
  } else {
    item.basePrice = 7.00;
    item.wasPrice = 7.00;
    item.triptychImages = null;
  }
  renderStagedUploads();
}

function renderStagedUploads() {
  const container = document.getElementById("stagedUploadsList");
  const countBadge = document.getElementById("stagedCountBadge");
  const saveBtn = document.getElementById("saveStagedBtn");

  if (!container) return;

  if (countBadge) countBadge.textContent = `${stagedUploads.length} design${stagedUploads.length === 1 ? '' : 's'} ready`;
  if (saveBtn) saveBtn.disabled = stagedUploads.length === 0;

  if (stagedUploads.length === 0) {
    container.innerHTML = `
      <div class="py-10 text-center text-zinc-400">
        <i data-lucide="cloud-upload" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
        <p class="text-xs font-bold uppercase tracking-wider text-zinc-600">Select or drop poster files</p>
        <p class="text-[11px] text-zinc-400 mt-1">Supports PNG, JPG, WebP. Direct storefront category import.</p>
      </div>
    `;
    initLucideIcons();
    return;
  }

  container.innerHTML = stagedUploads.map((item, idx) => `
    <div class="p-3 bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <img src="${item.image}" class="w-12 h-16 object-cover bg-zinc-200 border portrait-spec flex-shrink-0" />
      
      <div class="flex-1 w-full space-y-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label class="text-[9.5px] uppercase font-bold text-zinc-500 block mb-0.5">Custom Title</label>
            <input 
              type="text" 
              value="${item.title}" 
              oninput="stagedUploads[${idx}].title = this.value"
              placeholder="Custom Poster Title"
              class="w-full px-2.5 py-1 bg-white border border-zinc-300 text-xs font-bold text-zinc-900"
            />
          </div>

          <div>
            <label class="text-[9.5px] uppercase font-bold text-zinc-500 block mb-0.5">Custom Subtitle</label>
            <input 
              type="text" 
              value="${item.subtitle || ''}" 
              oninput="stagedUploads[${idx}].subtitle = this.value"
              placeholder="e.g. Twin-Turbo Spec or Wall Art"
              class="w-full px-2.5 py-1 bg-white border border-zinc-300 text-xs text-zinc-800"
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex-1">
            <label class="text-[9.5px] uppercase font-bold text-zinc-500 block mb-0.5">Target Storefront Category</label>
            <select 
              onchange="updateStagedCategory(${idx}, this.value)"
              class="w-full px-2 py-1 bg-white border border-zinc-300 text-xs font-bold text-zinc-800"
            >
              <option value="porsche" ${item.category === 'porsche' ? 'selected' : ''}>Porsche</option>
              <option value="bmw" ${item.category === 'bmw' ? 'selected' : ''}>BMW M-Series</option>
              <option value="audi" ${item.category === 'audi' ? 'selected' : ''}>Audi RS</option>
              <option value="amg" ${item.category === 'amg' ? 'selected' : ''}>Mercedes-AMG</option>
              <option value="exotic" ${item.category === 'exotic' ? 'selected' : ''}>Ferrari & Lamborghini</option>
              <option value="custom-car" ${item.category === 'custom-car' ? 'selected' : ''}>Custom Your Car</option>
              <option value="football" ${item.category === 'football' ? 'selected' : ''}>Football & Stadiums</option>
              <option value="cartoon-cars" ${item.category === 'cartoon-cars' ? 'selected' : ''}>Through The Years & Cartoon Cars</option>
              <option value="islamic" ${item.category === 'islamic' ? 'selected' : ''}>Islamic Print Sets (3-Piece)</option>
            </select>
          </div>
          
          <button onclick="removeStagedUpload(${idx})" class="mt-4 p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition" title="Remove">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");

  initLucideIcons();
}

function removeStagedUpload(idx) {
  stagedUploads.splice(idx, 1);
  renderStagedUploads();
}

async function saveStagedPostersToCatalog() {
  if (stagedUploads.length === 0) return;

  const btn = document.getElementById("saveStagedBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Saving to Database...";
  }

  try {
    const targetCategory = stagedUploads[0].category;
    const count = await bulkSaveCustomPosters(stagedUploads);
    showToast(`Added ${count} print${count === 1 ? '' : 's'} directly to ${getCategoryBadge(targetCategory)}!`, "success");
    closeImportModal();
    await loadCatalog();

    // Switch active category to target category so user sees uploaded artwork immediately
    activeCategory = targetCategory;
    document.querySelectorAll("[data-category-tab]").forEach(btn => {
      const isCat = btn.getAttribute("data-category-tab") === targetCategory;
      btn.classList.toggle("category-tab-active", isCat);
      btn.classList.toggle("bg-zinc-950", isCat);
      btn.classList.toggle("text-white", isCat);
      btn.classList.toggle("bg-zinc-900", !isCat);
      btn.classList.toggle("text-zinc-300", !isCat);
    });

    renderCatalog();

    const catalogEl = document.getElementById("catalogSection");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  } catch (err) {
    console.error("Bulk save error:", err);
    showToast("Failed to save designs", "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Save to Catalog";
    }
  }
}

let toastDismissTimer = null;
function showToast(message, type = "info") {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");

  if (!toast || !msgEl) return;

  if (toastDismissTimer) {
    clearTimeout(toastDismissTimer);
    toastDismissTimer = null;
  }

  msgEl.textContent = message;

  let iconName = "check-circle";
  let bgClass = "bg-zinc-950";
  if (type === "error") {
    iconName = "alert-circle";
    bgClass = "bg-red-700";
  } else if (type === "success") {
    iconName = "check";
    bgClass = "bg-zinc-950 border border-emerald-500/60";
  }

  toast.className = `fixed bottom-5 right-5 z-50 px-4 py-2.5 text-white shadow-2xl flex items-center gap-2.5 transition-all duration-200 transform translate-y-0 opacity-100 ${bgClass}`;
  toast.classList.remove("hidden", "pointer-events-none");

  if (iconEl) {
    iconEl.setAttribute("data-lucide", iconName);
    initLucideIcons();
  }

  toastDismissTimer = setTimeout(() => {
    toast.classList.add("translate-y-8", "opacity-0");
    setTimeout(() => {
      toast.classList.add("hidden", "pointer-events-none");
    }, 300);
  }, 3000);
}

function setupEventListeners() {
  // Category tabs (Syncs both compact mobile chip bar and desktop tabs)
  document.querySelectorAll("[data-category-tab]").forEach(tab => {
    const handleCategoryClick = (e) => {
      e.preventDefault();
      const cat = tab.getAttribute("data-category-tab");
      filterAndScrollToCategory(cat);
    };
    tab.addEventListener("click", handleCategoryClick);
  });

  // Search input
  const searchInput = document.getElementById("catalogSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById("catalogSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sortBy = e.target.value;
      renderCatalog();
    });
  }

  // Format toggle in modal (Single vs 3-Piece Set for Islamic prints)
  document.querySelectorAll("[data-format-toggle]").forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-format-toggle");
      setTriptychMode(mode === "triptych");
    });
  });

  // Size buttons in modal (A4 vs A3)
  document.querySelectorAll("[data-size-btn]").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedSize = btn.getAttribute("data-size-btn");
      updateModalPreview();
      updateModalPrice();
    });
  });

  // Frame buttons in modal (Unframed, Black Plastic, Black Aluminium)
  document.querySelectorAll("[data-frame-btn]").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedFrame = btn.getAttribute("data-frame-btn");
      showFrameSelectionNotice(selectedFrame);
      updateModalPreview();
      updateModalPrice();
    });
  });

  // Dedicated iOS Safari & Mobile Chrome Touch & Click Handlers for Modal Close & Home Buttons
  const attachSafeClose = (btnId, closeFn) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeFn();
    };
    btn.addEventListener('click', handler);
    btn.addEventListener('touchstart', handler, { passive: false });
  };

  attachSafeClose('productModalCloseBtn', closeProductModal);
  attachSafeClose('productModalBackBtn', closeProductModal);
  attachSafeClose('productModalFloatingCloseBtn', closeProductModal);
  attachSafeClose('studioModalCloseBtn', closeRoomStudioModal);
  attachSafeClose('studioModalBackBtn', closeRoomStudioModal);
  attachSafeClose('studioModalFloatingCloseBtn', closeRoomStudioModal);
  attachSafeClose('cartDrawerCloseBtn', closeCartDrawer);
  attachSafeClose('cartOverlay', closeCartDrawer);
  initExpandButtonListener();

  // Tap Outside to Close: Tapping overlay background closes modal immediately
  const productModalEl = document.getElementById('productModal');
  if (productModalEl) {
    productModalEl.addEventListener('click', (e) => {
      if (e.target === productModalEl || e.target.id === 'modalCustomWallBg') {
        closeProductModal();
      }
    });
  }

  const roomStudioModalEl = document.getElementById('roomStudioModal');
  if (roomStudioModalEl) {
    roomStudioModalEl.addEventListener('click', (e) => {
      if (e.target === roomStudioModalEl || e.target.id === 'studioBackdrop' || e.target.id === 'studioCustomWallBg') {
        closeRoomStudioModal();
      }
    });
  }

  // Global Anchor Link Router: Smooth scrolling without breaking routing or trapping modals
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        closeProductModal();
        closeRoomStudioModal();
        closeCartDrawer();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', window.location.pathname);
      }
    });
  });

  // Mobile Modal Touch Guard: Prevents iOS Safari from rubber-banding / scrolling background page
  ['productModal', 'roomStudioModal'].forEach(id => {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      modalEl.addEventListener('touchmove', (e) => {
        // Allow vertical scrolling ONLY inside the dedicated options pane or studio panel
        if (!e.target.closest('.modal-options-pane') && !e.target.closest('.studio-panel-45')) {
          if (e.cancelable) e.preventDefault();
        }
      }, { passive: false });
    }
  });

  // Bulk Upload File Input
  const fileInput = document.getElementById("bulkFileInput");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      handleFilesSelected(e.target.files);
    });
  }

  const dropZone = document.getElementById("bulkDropZone");
  if (dropZone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-over");
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFilesSelected(files);
    });
  }

  // Initialize Rockstar Sticky Pillars Scroll Observer
  initPillarScrollObserver();

  // Sticky header collapse on scroll
  window.addEventListener("scroll", () => {
    const globalHeader = document.querySelector(".app-global-header");
    if (globalHeader) {
      if (window.scrollY > 40) {
        globalHeader.classList.add("scrolled");
      } else {
        globalHeader.classList.remove("scrolled");
      }
    }
  }, { passive: true });

  // Attach robust click and touchstart listeners across all product cards and buttons
  attachProductCardListeners(document);
}

// Category bar horizontal scroll & multi-row grid toggle
function scrollCategories(direction) {
  const track = document.getElementById("categoryScrollTrack");
  if (!track) return;
  const scrollAmount = direction * 220;
  track.scrollBy({ left: scrollAmount, behavior: "smooth" });
}

function toggleCategoryGrid() {
  const track = document.getElementById("categoryScrollTrack");
  const btn = document.getElementById("toggleCategoryGridBtn");
  const leftArrow = document.getElementById("categoryScrollLeftBtn");
  const rightArrow = document.getElementById("categoryScrollRightBtn");
  if (!track) return;
  const isGrid = track.classList.toggle("grid-mode");

  if (leftArrow) {
    if (isGrid) {
      leftArrow.classList.add("hidden");
      leftArrow.classList.remove("sm:flex");
    } else {
      leftArrow.classList.remove("hidden");
      leftArrow.classList.add("sm:flex");
    }
  }
  if (rightArrow) {
    if (isGrid) {
      rightArrow.classList.add("hidden");
      rightArrow.classList.remove("sm:flex");
    } else {
      rightArrow.classList.remove("hidden");
      rightArrow.classList.add("sm:flex");
    }
  }

  if (btn) {
    btn.innerHTML = isGrid 
      ? '<i data-lucide="layout-list" class="w-3.5 h-3.5 text-emerald-400"></i><span class="hidden sm:inline">SINGLE ROW</span><span class="sm:hidden">ROW</span>' 
      : '<i data-lucide="layout-grid" class="w-3.5 h-3.5 text-emerald-400"></i><span class="hidden sm:inline">VIEW ALL CATEGORIES</span><span class="sm:hidden">ALL</span>';
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }
}

// ==========================================
// --- ROCKSTAR STICKY PILLARS NAVIGATION ---
// ==========================================
function scrollToPillar(pillarId) {
  const el = document.getElementById(pillarId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Update active state on left indicator bar
  document.querySelectorAll("[data-pillar-nav]").forEach(btn => {
    const isActive = btn.getAttribute("data-pillar-nav") === pillarId;
    btn.classList.toggle("active", isActive);
  });
}

function filterAndScrollToCategory(catId) {
  if (!catId) catId = "all";
  activeCategory = catId;

  // Sync active category tab pill styling
  document.querySelectorAll("[data-category-tab]").forEach(t => {
    const isSelected = t.getAttribute("data-category-tab") === catId;
    t.classList.toggle("category-tab-active", isSelected);
  });

  renderCatalog();

  const catSec = document.getElementById("catalogSection");
  if (catSec) {
    catSec.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
window.filterAndScrollToCategory = filterAndScrollToCategory;

function initPillarScrollObserver() {
  const pillarCards = document.querySelectorAll(".sticky-pillar-card");
  if (!pillarCards.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
        const pillarId = entry.target.id;
        document.querySelectorAll("[data-pillar-nav]").forEach(btn => {
          const isActive = btn.getAttribute("data-pillar-nav") === pillarId;
          btn.classList.toggle("active", isActive);
        });
      }
    });
  }, {
    threshold: [0.35, 0.6]
  });

  pillarCards.forEach(card => observer.observe(card));
}

// Make functions globally available
window.toggleSectionsDropdown = toggleSectionsDropdown;
window.closeSectionsDropdown = closeSectionsDropdown;
window.scrollToPillar = scrollToPillar;
window.filterAndScrollToCategory = filterAndScrollToCategory;
window.toggleModalProfileZoom = toggleModalProfileZoom;
window.setModalFrameFromZoom = setModalFrameFromZoom;
window.snapModalAngle = snapModalAngle;
window.toggleModalExploded = toggleModalExploded;
window.scrollCategories = scrollCategories;
window.toggleCategoryGrid = toggleCategoryGrid;
window.handleModalWallPhotoUpload = typeof handleModalWallPhotoUpload !== 'undefined' ? handleModalWallPhotoUpload : () => {};
window.setModalWallPosterScale = typeof setModalWallPosterScale !== 'undefined' ? setModalWallPosterScale : () => {};
window.resetModalStudioWall = typeof resetModalStudioWall !== 'undefined' ? resetModalStudioWall : () => {};
window.setModalWallColor = setModalWallColor;
window.handlePosterImageError = handlePosterImageError;
window.openMacroPhotosModal = openMacroPhotosModal;
window.closeMacroPhotosModal = closeMacroPhotosModal;
window.handleMacroPhotoUpload = handleMacroPhotoUpload;
window.resetMacroPhotosToDefault = resetMacroPhotosToDefault;
window.handleNavbarHomeClick = handleNavbarHomeClick;
window.lockBodyScroll = lockBodyScroll;
window.unlockBodyScroll = unlockBodyScroll;

// ==========================================
// --- REAL MACRO FRAME PHOTOS ENGINE ---
// ==========================================
const DEFAULT_MACRO_PHOTOS = [
  "assets/frame-real-plastic-corner.jpg",
  "assets/frame-real-aluminium-corner.jpg",
  "assets/frame-real-a4-back-kickstand.jpg",
  "assets/frame-real-a3-back.jpg"
];

function loadMacroPhotos() {
  let stored = null;
  try {
    stored = JSON.parse(localStorage.getItem("incase_macro_photos"));
  } catch (e) {
    stored = null;
  }
  const photos = (stored && Array.isArray(stored) && stored.length === 4) ? stored : DEFAULT_MACRO_PHOTOS;

  for (let i = 0; i < 4; i++) {
    const imgEl = document.getElementById(`macroPhotoImg${i}`);
    if (imgEl) {
      imgEl.src = photos[i] || DEFAULT_MACRO_PHOTOS[i];
    }
  }
}

function handleMacroPhotoUpload(slotIndex, event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    let stored = [];
    try {
      stored = JSON.parse(localStorage.getItem("incase_macro_photos")) || [...DEFAULT_MACRO_PHOTOS];
    } catch (err) {
      stored = [...DEFAULT_MACRO_PHOTOS];
    }
    stored[slotIndex] = dataUrl;
    try {
      localStorage.setItem("incase_macro_photos", JSON.stringify(stored));
    } catch (err) {
      console.warn("Storage quota exceeded", err);
    }
    loadMacroPhotos();
    showToast(`Macro photo slot 0${slotIndex + 1} updated!`, "success");
  };
  reader.readAsDataURL(file);
}

function resetMacroPhotosToDefault() {
  try {
    localStorage.removeItem("incase_macro_photos");
  } catch (e) {}
  loadMacroPhotos();
  showToast("Macro photos reset to real workshop defaults", "info");
}

function openMacroPhotosModal() {
  const modal = document.getElementById("macroPhotosModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    loadMacroPhotos();
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeMacroPhotosModal() {
  const modal = document.getElementById("macroPhotosModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

/* ==========================================================================
   Rockstar Navbar Explore Dropdown Menu & Pillar Navigation
   ========================================================================== */
function toggleNavbarExploreMenu(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const menu = document.getElementById("navbarExploreMenu");
  const chevron = document.getElementById("navbarExploreChevron");
  if (!menu) return;
  const isHidden = menu.classList.contains("hidden") || menu.style.display === "none";
  if (isHidden) {
    menu.classList.remove("hidden");
    menu.style.display = "block";
    if (chevron) chevron.style.transform = "rotate(180deg)";
  } else {
    menu.classList.add("hidden");
    menu.style.display = "none";
    if (chevron) chevron.style.transform = "rotate(0deg)";
  }
}

function closeNavbarExploreMenu() {
  const menu = document.getElementById("navbarExploreMenu");
  const chevron = document.getElementById("navbarExploreChevron");
  if (menu) {
    menu.classList.add("hidden");
    menu.style.display = "none";
  }
  if (chevron) chevron.style.transform = "rotate(0deg)";
}

function selectCategoryFromNav(catId) {
  activeCategory = catId;
  document.querySelectorAll("[data-category-tab]").forEach(tab => {
    const isCat = tab.getAttribute("data-category-tab") === catId;
    tab.classList.toggle("category-tab-active", isCat);
  });
  renderCatalog();
  const catalogEl = document.getElementById("catalogSection");
  if (catalogEl) {
    catalogEl.scrollIntoView({ behavior: "smooth" });
  }
}

// Global click dismiss for Explore Menu
document.addEventListener("click", (e) => {
  if (!e.target.closest("#navbarExploreBtn") && !e.target.closest("#navbarExploreMenu")) {
    closeNavbarExploreMenu();
  }
});

/* ==========================================================================
   Frame Selection Feedback & Quality Compare Modal
   ========================================================================== */
let modalFrameNoticeTimer = null;
function showFrameSelectionNotice() {
  // Floating status pills inside the 3D preview canvas have been removed so they never overlap view buttons.
}

function openFrameCompareModal() {
  const modal = document.getElementById("frameCompareModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  }
}

function closeFrameCompareModal() {
  const modal = document.getElementById("frameCompareModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  const productModal = document.getElementById("productModal");
  if (!productModal || productModal.classList.contains("hidden")) {
    document.body.style.overflow = "";
  }
}

function selectFrameFromCompareModal(frameId) {
  selectedFrame = frameId;
  closeFrameCompareModal();
  showFrameSelectionNotice(frameId);
  updateModalPreview();
  updateModalPrice();
}

window.showFrameSelectionNotice = showFrameSelectionNotice;
window.openFrameCompareModal = openFrameCompareModal;
window.closeFrameCompareModal = closeFrameCompareModal;
window.selectFrameFromCompareModal = selectFrameFromCompareModal;
window.toggleModalStageExpand = toggleModalStageExpand;
window.initExpandButtonListener = initExpandButtonListener;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.openHeroPosterModal = openHeroPosterModal;
window.attachProductCardListeners = attachProductCardListeners;
window.renderCatalog = renderCatalog;
window.selectModalSize = selectModalSize;
window.selectModalFrame = selectModalFrame;
window.updateModalPreview = updateModalPreview;

if (document.readyState === "complete" || document.readyState === "interactive") {
  initExpandButtonListener();
  attachProductCardListeners(document);
} else {
  document.addEventListener("DOMContentLoaded", () => {
    initExpandButtonListener();
    attachProductCardListeners(document);
  });
}



