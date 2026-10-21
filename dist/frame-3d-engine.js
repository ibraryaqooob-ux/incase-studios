/**
 * INCASE STUDIOS — Standalone 3D Frame & Wall Color Engine
 * Controls: 3D Frame Rendering (Plastic 12mm, Aluminium 18mm, Unframed Paper),
 * Rotational Kinematics, Touch/Mouse Gestures, Pinch-to-Zoom, and Real-Time Wall Color Sync.
 */

// Global 3D State
let modalRotY = 0;
let modalRotX = 0;
let modalZoom = 1.0;
let selectedSize = "a4";          // 'a4' or 'a3'
let selectedFrame = "plastic";    // 'unframed', 'plastic', 'aluminium'
let isModalRoomMode = false;
let isModalStageExpanded = false;
let modalGesturesInitialized = false;
let lastProductModalOpenTime = 0;
let currentCustomizingPoster = null;

const LIVE_ROOM_ROT_Y = 0;
const LIVE_ROOM_ROT_X = 0;

/**
 * Open Product Configurator Modal
 */
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

  const modal = document.getElementById("productModal");
  if (!modal) return;

  const titleEl = document.getElementById("modalPosterTitle");
  if (titleEl) titleEl.textContent = poster.title;

  modalRotY = 0;
  modalRotX = 0;
  modalZoom = 1.0;
  isModalStageExpanded = false;

  const stagePane = document.querySelector(".modal-preview-stage-pane");
  const stageCol = document.querySelector(".modal-stage-column");
  if (stagePane) stagePane.classList.remove("stage-expanded");
  if (stageCol) stageCol.classList.remove("stage-expanded");
  modal.classList.remove("stage-expanded");

  const expandBtn = document.getElementById("modalExpandStageBtn");
  if (expandBtn) {
    expandBtn.innerHTML = `<i data-lucide="maximize-2" class="w-3.5 h-3.5 text-zinc-300 pointer-events-none"></i><span id="modalExpandBtnText" class="pointer-events-none uppercase tracking-wider text-zinc-200">Tap to Expand</span>`;
  }

  // Synchronize wall tint across all layers
  const activeDot = document.querySelector(".wall-swatch-dot.active");
  const curWall = activeDot ? activeDot.getAttribute("data-wall-color") : "#F2F0EA";
  setModalWallColor(curWall);

  updateModalPreview();
  if (typeof updateModalPrice === "function") updateModalPrice();

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  modal.style.setProperty("display", "flex", "important");

  if (typeof lucide !== "undefined" && lucide.createIcons) lucide.createIcons();
  setTimeout(() => initModalStageGestures(), 100);
}

/**
 * Close Product Configurator Modal
 */
function closeProductModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modal.style.setProperty("display", "none", "important");
  }
}

/**
 * Generate 3D Prism Frame HTML (Front Artwork, 12mm/18mm Extrusions, MDF Backing)
 */
function renderModalPrismHtml(posterImg, posterTitle, frameType, size, panelSliceIndex = null, includeStageId = true) {
  const stageIdAttr = includeStageId ? 'id="modalPrismStage"' : '';
  const currentRotX = isModalRoomMode ? LIVE_ROOM_ROT_X : modalRotX;
  const currentRotY = isModalRoomMode ? LIVE_ROOM_ROT_Y : modalRotY;
  const stageTransformStyle = includeStageId
    ? `style="transform: scale(${modalZoom}) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg);"`
    : 'style="width: 100%; height: 100%; transform-style: preserve-3d;"';

  const frontArtHtml = `
    <img 
      src="${posterImg}" 
      alt="${posterTitle}" 
      class="w-full h-full object-cover block pointer-events-none portrait-spec" 
      style="width: 100% !important; height: 100% !important; object-fit: cover !important; object-position: center !important; display: block !important; margin: 0 !important; padding: 0 !important;" 
      onerror="this.style.opacity='0.5';" 
    />
  `;

  // Dedicated 0.4mm 3D Paper Model for Unframed Prints
  if (frameType === "unframed" || frameType === "none") {
    return `
      <div class="prism-3d-viewport portrait-spec relative select-none" style="aspect-ratio: 1 / 1.414;">
        <div ${stageIdAttr} class="prism-3d-stage w-full h-full relative" ${stageTransformStyle}>
          <div class="prism-face-paper-front portrait-spec overflow-hidden absolute inset-0" style="aspect-ratio: 1 / 1.414; width: 100%; height: 100%;">
            ${frontArtHtml}
            <div class="prism-glazing-sheen"></div>
          </div>
          <div class="prism-face-paper-back select-none flex items-center justify-center bg-[#fafafa]">
            <div class="w-12 h-px bg-zinc-300"></div>
          </div>
        </div>
      </div>
    `;
  }

  const depthClass = frameType === 'aluminium' ? 'prism-depth-aluminium' : 'prism-depth-plastic';

  return `
    <div class="prism-3d-viewport portrait-spec relative" style="aspect-ratio: 1 / 1.414;">
      <div ${stageIdAttr} class="prism-3d-stage w-full h-full relative ${depthClass}" ${stageTransformStyle}>
        
        <!-- Front Face (0deg): Frame + Artwork + Acrylic Glazing -->
        <div class="prism-face-front poster-frame-container ${frameType === 'aluminium' ? 'frame-black-aluminium' : 'frame-black-plastic'} portrait-spec overflow-hidden absolute inset-0" style="aspect-ratio: 1 / 1.414; width: 100%; height: 100%; margin: 0; padding: 0; box-sizing: border-box;">
          ${frontArtHtml}
          <div class="prism-glazing-sheen"></div>
        </div>

        <!-- Rear Face (180deg): Procedural E1 MDF Backboard with Silver Clips -->
        <div class="prism-face-back rounded-xs absolute inset-0 real-mdf-back" style="width: 100%; height: 100%; overflow: hidden; box-sizing: border-box; background: #111111;">
          <div class="procedural-backboard-wrapper">
            <div class="mdf-board-surface">
              <div class="mdf-wood-grain"></div>
              ${size === 'a4' ? `
                <div class="a4-mdf-strut-assembly" title="A4 Integrated Folding Strut">
                  <div class="strut-metal-hinge"></div>
                  <div class="strut-mdf-body"></div>
                </div>
              ` : ''}
              <div class="mdf-silver-clip clip-pos-top"></div>
              <div class="mdf-silver-clip clip-pos-bottom"></div>
              <div class="mdf-silver-clip clip-pos-left"></div>
              <div class="mdf-silver-clip clip-pos-right"></div>
            </div>
          </div>
        </div>

        <!-- 3D Extruded Mitered Side Enclosures -->
        <div class="prism-wall-left ${frameType === 'aluminium' ? 'prism-wall-aluminium' : 'prism-wall-plastic'}"></div>
        <div class="prism-wall-right ${frameType === 'aluminium' ? 'prism-wall-aluminium' : 'prism-wall-plastic'}"></div>
        <div class="prism-wall-top ${frameType === 'aluminium' ? 'prism-wall-aluminium' : 'prism-wall-plastic'}"></div>
        <div class="prism-wall-bottom ${frameType === 'aluminium' ? 'prism-wall-aluminium' : 'prism-wall-plastic'}"></div>

      </div>
    </div>
  `;
}

/**
 * Update 3D Canvas Preview HTML
 */
function updateModalPreview() {
  if (!currentCustomizingPoster) return;
  const previewContainer = document.getElementById("modalPreviewContainer");
  if (!previewContainer) return;

  previewContainer.innerHTML = `
    <div class="modal-prism-wrapper flex flex-col items-center justify-center w-full h-full" style="max-height: 100%; max-width: 100%; object-fit: contain;">
      ${renderModalPrismHtml(currentCustomizingPoster.image, currentCustomizingPoster.title, selectedFrame, selectedSize, null, true)}
    </div>
  `;

  updateModalPrismTransform(false);
  updateModalRotationControls();
}

/**
 * Rotational Kinematics & Transform Updates
 */
function updateModalPrismTransform(smooth = true) {
  const stage = document.getElementById("modalPrismStage");
  if (!stage) return;
  stage.classList.toggle("no-transition", !smooth);

  if (isModalRoomMode) {
    modalRotY = LIVE_ROOM_ROT_Y;
    modalRotX = LIVE_ROOM_ROT_X;
  }

  stage.style.transform = `scale(${modalZoom}) rotateX(${modalRotX}deg) rotateY(${modalRotY}deg)`;
}

function setModalRotation(angle, smooth = true) {
  modalRotY = ((angle % 360) + 360) % 360;
  if (modalRotY > 180) modalRotY -= 360;
  updateModalPrismTransform(smooth);
  updateModalRotationControls();
}

function snapModalAngle(angle) {
  modalRotX = 0;
  setModalRotation(angle, true);
}

function updateModalRotationControls() {
  const normalized = Math.round(modalRotY);
  const isFront = Math.abs(normalized) <= 15;
  const isAngle = Math.abs(normalized - 45) <= 15 || Math.abs(normalized - (-45)) <= 15;
  const isSide = Math.abs(normalized - 65) <= 15 || Math.abs(normalized - (-65)) <= 15;
  const isRear = Math.abs(Math.abs(normalized) - 180) <= 25;

  const btnFront = document.getElementById("modalBtnFront");
  const btnAngle = document.getElementById("modalBtnAngle");
  const btnSide = document.getElementById("modalBtnSide");
  const btnRear = document.getElementById("modalBtnRear");

  if (btnFront) btnFront.classList.toggle("active", isFront);
  if (btnAngle) btnAngle.classList.toggle("active", isAngle && !isFront);
  if (btnSide) btnSide.classList.toggle("active", isSide && !isAngle && !isFront);
  if (btnRear) btnRear.classList.toggle("active", isRear);
}

/**
 * Zoom Controls
 */
function setModalZoom(val) {
  modalZoom = Math.max(0.95, Math.min(1.28, Math.round(val * 100) / 100));
  updateModalPrismTransform(true);
}

function zoomModalIn() {
  setModalZoom(modalZoom + 0.08);
}

function zoomModalOut() {
  setModalZoom(modalZoom - 0.08);
}

function toggleModalDoubleTapZoom() {
  if (modalZoom > 1.05) {
    setModalZoom(1.0);
  } else {
    setModalZoom(1.20);
  }
}

/**
 * Synchronous Wall Color Selection & Invalidation
 */
function setModalWallColor(colorHex) {
  if (!colorHex) return;

  // 1. Set globally on root and modal
  document.documentElement.style.setProperty("--stage-bg", colorHex);
  const modal = document.getElementById("productModal");
  if (modal) modal.style.setProperty("--stage-bg", colorHex);

  // 2. Set synchronously on all stage containers with !important
  const stageCol = document.querySelector(".modal-stage-column");
  const stagePane = document.querySelector(".modal-preview-stage-pane");
  const previewContainer = document.getElementById("modalPreviewContainer");
  const thumbZone = document.querySelector(".stage-bottom-thumb-zone");

  const stageElements = [stageCol, stagePane, previewContainer, thumbZone].filter(Boolean);
  stageElements.forEach(el => {
    el.style.setProperty("--stage-bg", colorHex);
    el.style.setProperty("background-color", colorHex, "important");
  });

  // 3. Highlight active swatch dot
  document.querySelectorAll("[data-wall-color]").forEach(dot => {
    const isCur = dot.getAttribute("data-wall-color").toLowerCase() === colorHex.toLowerCase();
    dot.classList.toggle("active", isCur);
  });
  
  // 4. Update custom color input
  const customInput = document.getElementById("modalCustomColorPicker");
  if (customInput && customInput.value.toLowerCase() !== colorHex.toLowerCase()) {
    customInput.value = colorHex;
  }

  // 5. Force synchronous WebKit layout reflow & secondary RAF flush
  stageElements.forEach(el => void el.offsetHeight);
  requestAnimationFrame(() => {
    stageElements.forEach(el => {
      el.style.setProperty("background-color", colorHex, "important");
      void el.offsetHeight;
    });
  });
}

/**
 * Touch & Mouse Drag Gestures
 */
function initModalStageGestures() {
  if (modalGesturesInitialized) return;
  const stagePane = document.querySelector(".modal-preview-stage-pane");
  if (!stagePane) return;
  modalGesturesInitialized = true;

  // Bind custom color picker events
  const customColorInput = document.getElementById("modalCustomColorPicker");
  if (customColorInput && !customColorInput.hasAttribute("data-bound-color")) {
    customColorInput.setAttribute("data-bound-color", "true");
    ["input", "change", "blur"].forEach(evt => {
      customColorInput.addEventListener(evt, (e) => setModalWallColor(e.target.value));
    });
  }

  let startX = 0;
  let startAngle = 0;
  let isPointerDown = false;
  let dragMode = "none";
  let gestureDecided = false;

  // Mouse Drag (Desktop)
  stagePane.addEventListener("mousedown", (e) => {
    if (isModalRoomMode) return;
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("#modalWallColorSidePanel")) return;
    isPointerDown = true;
    startX = e.clientX;
    startAngle = modalRotY;
    dragMode = "rotate";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isPointerDown || isModalRoomMode) return;
    const dx = e.clientX - startX;
    if (dragMode === "rotate") {
      setModalRotation(startAngle + dx * 0.85, false);
    }
  });

  window.addEventListener("mouseup", () => {
    isPointerDown = false;
    dragMode = "none";
  });

  // Touch Drag (Mobile)
  stagePane.addEventListener("touchstart", (e) => {
    if (isModalRoomMode || e.touches.length !== 1) return;
    const target = e.target;
    if (target.closest("button") || target.closest("input") || target.closest("#modalWallColorSidePanel")) return;

    isPointerDown = true;
    startX = e.touches[0].clientX;
    startAngle = modalRotY;
    dragMode = "none";
    gestureDecided = false;
  }, { passive: true });

  stagePane.addEventListener("touchmove", (e) => {
    if (!isPointerDown || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - startX;

    if (!gestureDecided && Math.abs(dx) > 8) {
      dragMode = "rotate";
      gestureDecided = true;
    }

    if (dragMode === "rotate") {
      if (e.cancelable) e.preventDefault();
      setModalRotation(startAngle + dx * 0.85, false);
    }
  }, { passive: false });

  stagePane.addEventListener("touchend", () => {
    isPointerDown = false;
    dragMode = "none";
  }, { passive: true });
}

/**
 * Format & Sizing Toggles
 */
function selectModalSize(size) {
  if (!size) return;
  selectedSize = size;
  updateModalPreview();
  if (typeof updateModalPrice === "function") updateModalPrice();
}

function selectModalFrame(frame) {
  if (!frame) return;
  selectedFrame = frame;
  updateModalPreview();
  if (typeof updateModalPrice === "function") updateModalPrice();
}

// Global Window Exports
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.selectModalSize = selectModalSize;
window.selectModalFrame = selectModalFrame;
window.setModalWallColor = setModalWallColor;
window.snapModalAngle = snapModalAngle;
window.setModalRotation = setModalRotation;
window.setModalZoom = setModalZoom;
window.zoomModalIn = zoomModalIn;
window.zoomModalOut = zoomModalOut;
