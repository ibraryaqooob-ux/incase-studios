// INCASE STUDIOS — Interactive Room Visualizer & High-Res Mockup Engine
// 100% Front-Facing Architectural Wall Stage, Upper 82% Wall Zone, Lower 18% French Oak Hardwood Floor
// True 360° Horizontal Rotation Engine (6-Sided 3D CSS Prism) + Exploded Layers + 2D HUD Layer

class MockupStudio {
  constructor() {
    this.currentPoster = null;
    this.currentFrame = "plastic"; // 'unframed', 'plastic', 'aluminium'
    this.currentSize = "a3";       // 'a4' or 'a3'
    this.isTriptych = false;       // exclusively for Islamic prints
    this.currentRoom = "living-room";
    this.currentWallColor = "#F2F0EA"; // Gallery Off-White
    this.showGlare = true;
    this.showSideProps = true;     // Subtle architectural side props
    this.isProfileZoomActive = false;
    this.isInspectingSinglePanel = false; // Triptych single-frame inspection mode

    // True 360° Horizontal Rotation Engine
    this.rotY = 0;              // -180 to 180 degrees
    this.rotX = 0;              // subtle vertical tilt
    this.zoomLevel = 1.0;       // 0.7 to 2.0x interactive zoom

    // Wall positioning (clamped strictly to upper wall: top: 15% to 55%, left: 25% to 75%)
    this.pos = { x: 50, y: 38 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragMode = 'move';     // 'move' or 'rotate'
    this.startRotY = 0;
    this.isStrutOpen = false;
    this.isCustomWallMode = false;
    this.customWallScale = 1.0;

    this.initDOM();
  }

  initDOM() {
    this.modal = document.getElementById("roomStudioModal");
    this.wallElement = document.getElementById("studioWall");
    this.furnitureImg = document.getElementById("studioFurnitureImg");
    this.frameWrapper = document.getElementById("studioFrameWrapper");
    this.hudLayer = document.getElementById("studioHudLayer");
    this.scaleLabel = document.getElementById("studioScaleLabel");
    this.glareCheck = document.getElementById("studioGlareCheck");

    // 360 Rotation Slider
    const slider = document.getElementById("studio360Slider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        this.setRotation(parseFloat(e.target.value), false);
      });
    }

    if (this.glareCheck) {
      this.glareCheck.addEventListener("change", (e) => {
        this.toggleGlare(e.target.checked);
      });
    }

    if (this.wallElement) {
      this.wallElement.addEventListener("wheel", (e) => {
        if (e.target.closest(".studio-controls-bar-clean") || e.target.closest("button") || e.target.closest("input")) return;
        if (e.deltaY < -15) {
          this.zoomIn();
          e.preventDefault();
        } else if (e.deltaY > 15) {
          this.zoomOut();
          e.preventDefault();
        }
      }, { passive: false });
    }

    if (this.frameWrapper) {
      this.frameWrapper.addEventListener("mousedown", (e) => this.onDragStart(e));
      window.addEventListener("mousemove", (e) => this.onDragMove(e));
      window.addEventListener("mouseup", () => this.onDragEnd());

      this.frameWrapper.addEventListener("touchstart", (e) => this.onTouchStart(e), { passive: false });
      window.addEventListener("touchmove", (e) => this.onTouchMove(e), { passive: false });
      window.addEventListener("touchend", () => this.onDragEnd());
    }

    // Room selector buttons
    document.querySelectorAll("[data-studio-room]").forEach(btn => {
      btn.addEventListener("click", () => {
        const roomId = btn.getAttribute("data-studio-room");
        this.setRoom(roomId);
      });
    });

    // Wall Paint Color swatches
    document.querySelectorAll("[data-studio-wall-color]").forEach(btn => {
      btn.addEventListener("click", () => {
        const colorHex = btn.getAttribute("data-studio-wall-color");
        this.setWallColor(colorHex);
      });
    });

    // Custom Wall Color Picker Input
    const customColorInput = document.getElementById("studioCustomWallColor");
    if (customColorInput) {
      customColorInput.addEventListener("input", (e) => {
        this.setWallColor(e.target.value);
        const valEl = document.getElementById("studioCustomColorVal");
        if (valEl) valEl.textContent = `${e.target.value.toUpperCase()} • Custom Paint`;
      });
    }

    // 3D Side Profile Zoom Button in Visualizer
    const zoomBtn = document.getElementById("studioToggle3DProfileZoom");
    if (zoomBtn) {
      zoomBtn.addEventListener("click", () => this.toggleProfileZoom());
    }

    // Frame selector buttons
    document.querySelectorAll("[data-studio-frame]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setFrame(btn.getAttribute("data-studio-frame"));
      });
    });

    // Size selector buttons
    document.querySelectorAll("[data-studio-size]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setSize(btn.getAttribute("data-studio-size"));
      });
    });

    // Triptych toggle buttons
    document.querySelectorAll("[data-studio-format]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setTriptych(btn.getAttribute("data-studio-format") === "triptych");
      });
    });

    // Download HD mockup button
    const downloadBtn = document.getElementById("studioDownloadBtn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => this.exportMockupHD());
    }
  }

  loadPoster(poster, initialFrame = "plastic", initialSize = "a3", isTriptych = false) {
    if (typeof poster === "string") {
      const found = (typeof allPosters !== "undefined" ? allPosters : []).find(p => p.id === poster) ||
                    (typeof DEFAULT_POSTERS !== "undefined" ? DEFAULT_POSTERS : []).find(p => p.id === poster);
      poster = found || (typeof DEFAULT_POSTERS !== "undefined" ? DEFAULT_POSTERS[0] : null);
    }
    if (!poster && typeof DEFAULT_POSTERS !== "undefined") {
      poster = DEFAULT_POSTERS[0];
    }
    if (!this.frameWrapper) {
      this.frameWrapper = document.getElementById("studioFrameWrapper");
    }
    if (!this.wallElement) {
      this.wallElement = document.getElementById("studioWall");
    }
    if (!this.modal) {
      this.modal = document.getElementById("roomStudioModal");
    }

    this.currentPoster = poster;
    this.currentFrame = initialFrame;
    this.currentSize = initialSize;
    // Strict rule: Islamic prints are locked 3-piece sets only
    this.isTriptych = (poster && poster.category === "islamic") ? true : isTriptych;
    this.isProfileZoomActive = false;
    this.isInspectingSinglePanel = false;
    this.rotY = 0;
    this.rotX = 0;
    this.zoomLevel = 1.0;
    this.pos = { x: 50, y: 38 };
    this.isStrutOpen = false;
    this.isCustomWallMode = false;

    const zoomBtn = document.getElementById("studioProfileZoomBtnText");
    if (zoomBtn) {
      zoomBtn.textContent = "🔍 ZOOM & ROTATE SIDE PROFILE";
    }

    this.setWallColor(this.currentWallColor);
    this.setRoom(this.currentRoom || "living-room");
    this.updateStudioView();
  }

  // Toggle subtle architectural side scale props
  toggleSideProps() {
    this.showSideProps = !this.showSideProps;
    const propsEl = document.getElementById("studioSideProps");
    const btn = document.getElementById("studioTogglePropsBtn");
    if (propsEl) {
      propsEl.classList.toggle("props-hidden", !this.showSideProps);
    }
    if (btn) {
      btn.classList.toggle("text-emerald-400", this.showSideProps);
      btn.classList.toggle("text-zinc-500", !this.showSideProps);
    }
  }


  // Amazon-Style "View on Your Wall" Upload & Camera Mode
  handleWallPhotoUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const imgDataUrl = loadEvt.target.result;
      const customBg = document.getElementById("studioCustomWallBg");
      const controls = document.getElementById("studioYourWallControls");
      if (customBg) {
        customBg.style.backgroundImage = `url('${imgDataUrl}')`;
        customBg.classList.remove("hidden");
        customBg.style.opacity = "1";
      }
      if (controls) {
        controls.classList.remove("hidden");
      }
      if (this.furnitureImg) {
        this.furnitureImg.style.display = "none";
      }
      this.isCustomWallMode = true;
      this.updateStudioView();
      if (typeof showToast === 'function') {
        showToast("📷 Room Photo Loaded • Drag artwork freely to position on your wall");
      }
    };
    reader.readAsDataURL(file);
  }

  setCustomWallScale(val) {
    this.customWallScale = val / 100;
    const label = document.getElementById("studioCustomWallScaleVal");
    if (label) label.textContent = `${Math.round(val)}%`;
    this.updateStudioView();
  }

  resetToStudioWall() {
    this.isCustomWallMode = false;
    this.customWallScale = 1.0;
    const customBg = document.getElementById("studioCustomWallBg");
    const controls = document.getElementById("studioYourWallControls");
    const fileInput = document.getElementById("studioWallPhotoInput");
    const slider = document.getElementById("studioCustomWallScaleSlider");
    const label = document.getElementById("studioCustomWallScaleVal");

    if (customBg) {
      customBg.style.backgroundImage = "";
      customBg.classList.add("hidden");
    }
    if (controls) {
      controls.classList.add("hidden");
    }
    if (this.furnitureImg) {
      this.furnitureImg.style.display = "block";
    }
    if (fileInput) fileInput.value = "";
    if (slider) slider.value = "100";
    if (label) label.textContent = "100%";

    this.pos = { x: 50, y: 38 };
    this.updateStudioView();
    if (typeof showToast === 'function') {
      showToast("Returned to studio gallery wall");
    }
  }

  // Interactive Zoom Engine (0.7x to 2.0x)
  zoomIn() {
    this.setZoom(Math.min(2.0, Math.round((this.zoomLevel + 0.15) * 100) / 100));
  }

  zoomOut() {
    this.setZoom(Math.max(0.7, Math.round((this.zoomLevel - 0.15) * 100) / 100));
  }

  resetZoom() {
    this.setZoom(1.0);
  }

  setZoom(val) {
    this.zoomLevel = Math.max(0.7, Math.min(2.0, val));
    this.applyZoom();
    this.updateZoomControls();
  }

  applyZoom() {
    if (!this.frameWrapper) return;
    const isA4 = this.currentSize === "a4";
    const scaleRatio = isA4 ? 0.71 : 1.0;
    const baseW = 28.5 * (this.isTriptych ? 1.85 : 1.0) * scaleRatio;
    this.frameWrapper.style.width = `${baseW * this.zoomLevel}rem`;
  }

  updateZoomControls() {
    const label = document.getElementById("studioZoomPercent");
    if (label) {
      label.textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }
  }

  setRotation(angle, smooth = true) {
    while (angle > 180) angle -= 360;
    while (angle < -180) angle += 360;
    this.rotY = Math.round(angle);
    this.isProfileZoomActive = Math.abs(this.rotY) > 20;
    this.updatePrismTransform(smooth);
    this.updateRotationControls();
    this.updateHudLayer();
  }

  snapToAngle(angle) {
    this.rotY = angle;
    this.rotX = (Math.abs(angle) === 65) ? 4 : 0;
    this.isProfileZoomActive = Math.abs(angle) > 20;
    this.updatePrismTransform(true);
    this.updateRotationControls();
    this.updateHudLayer();
  }

  onHotspotClick(hotspotId) {
    if (hotspotId === 'glazing') {
      openHardwareCloseupModal(0);
    } else if (hotspotId === 'side') {
      this.snapToAngle(65);
      openHardwareCloseupModal(1);
    } else if (hotspotId === 'backboard') {
      this.snapToAngle(180);
      openHardwareCloseupModal(2);
    }
  }

  toggleProfileZoom(forceFrame) {
    if (forceFrame) {
      this.currentFrame = forceFrame;
    } else if (this.currentFrame === "unframed" || this.currentFrame === "none") {
      this.currentFrame = "plastic";
    }
    
    if (Math.abs(this.rotY) < 30) {
      this.snapToAngle(65);
    } else {
      this.snapToAngle(0);
    }
  }

  updatePrismTransform(smooth = true) {
    const stage = document.getElementById("studioPrismStage");
    if (!stage) return;

    stage.classList.toggle("no-transition", !smooth);

    let scale = 1.0;
    if (Math.abs(this.rotY) > 35 && Math.abs(this.rotY) < 145) scale = 1.18;

    stage.style.transform = `scale(${scale}) rotateX(${this.rotX}deg) rotateY(${this.rotY}deg)`;

    // 3-Piece Set single frame inspection glide
    if (this.isTriptych && this.frameWrapper) {
      const triptychGrid = this.frameWrapper.querySelector(".triptych-grid");
      if (triptychGrid) {
        this.isInspectingSinglePanel = Math.abs(this.rotY) > 5;
        triptychGrid.classList.toggle("inspecting-single", this.isInspectingSinglePanel);
      }
    }

    // Dimension lines hide on rotation to avoid visual clutter
    const dim = document.getElementById("studioDimensionBar");
    if (dim) {
      dim.classList.toggle("dimension-hidden", Math.abs(this.rotY) > 5);
    }
  }

  updateRotationControls() {
    const slider = document.getElementById("studio360Slider");
    if (slider) slider.value = this.rotY;

    const readout = document.getElementById("studioRotAngleReadout");
    const abs = Math.abs(this.rotY);
    if (readout) {
      let desc = "FRONT VIEW";
      if (abs >= 150) desc = "REAR E1 MDF BACK";
      else if (abs >= 45 && abs <= 135) desc = this.currentFrame === 'aluminium' ? '20MM BRUSHED METAL SIDE' : '12MM MATTE PVC SIDE';
      else if (abs > 10) desc = "3D PERSPECTIVE";
      readout.textContent = `ROTATION: ${this.rotY}° (${desc})`;
    }

    // Update clean view preset buttons active highlight
    const btnFront = document.getElementById("studioBtnFront");
    const btnSide = document.getElementById("studioBtnSide");
    const btnRear = document.getElementById("studioBtnRear");
    if (btnFront) {
      const active = abs < 25;
      btnFront.classList.toggle("bg-zinc-950", active);
      btnFront.classList.toggle("text-white", active);
      btnFront.classList.toggle("bg-zinc-100", !active);
      btnFront.classList.toggle("text-zinc-900", !active);
    }
    if (btnSide) {
      const active = abs >= 45 && abs <= 135;
      btnSide.classList.toggle("bg-zinc-950", active);
      btnSide.classList.toggle("text-white", active);
      btnSide.classList.toggle("bg-zinc-100", !active);
      btnSide.classList.toggle("text-zinc-900", !active);
    }
    if (btnRear) {
      const active = abs >= 150;
      btnRear.classList.toggle("bg-zinc-950", active);
      btnRear.classList.toggle("text-white", active);
      btnRear.classList.toggle("bg-zinc-100", !active);
      btnRear.classList.toggle("text-zinc-900", !active);
    }

    const zoomBtn = document.getElementById("studioProfileZoomBtnText");
    if (zoomBtn) {
      zoomBtn.textContent = (abs > 20) ? "↺ RESET TO FRONT VIEW" : "🔍 ZOOM & ROTATE SIDE PROFILE";
    }
  }

  updateHudLayer() {
    const hud = document.getElementById("studioHudLayer");
    const absRot = Math.abs(this.rotY);

    if (hud) {
      hud.innerHTML = "";
    }

    // Dynamic Angle-Reactive Hardware Spec Pill at top of Room Wall
    const pill = document.getElementById("studioConsumerPill");
    if (pill) {
      if (this.isTriptych && absRot > 5) {
        pill.innerHTML = `🌙 INSPECTING CENTER FRAME IN GALLERY SET • 360° UN-CROPPED ROTATION`;
      } else if (this.currentFrame === "unframed" || this.currentFrame === "none") {
        if (absRot >= 140) {
          pill.innerHTML = `UNFRAMED 200GSM GLOSSY STOCK • PROTECTIVE HARDBACK ENVELOPE GUARANTEE`;
        } else if (absRot >= 70 && absRot <= 110) {
          pill.innerHTML = `0.4MM RAZOR-THIN PAPER EDGE • ZERO BULK • SHIPPED FLAT`;
        } else {
          pill.innerHTML = `UNFRAMED 200GSM GLOSSY PRINT • SHIPPED IN RIGID HARDBACK ENVELOPE`;
        }
      } else if (absRot >= 135) {
        pill.innerHTML = `REAL E1 MDF BACKBOARD • ${this.currentSize === 'a4' ? '4 SILVER CLIPS • FOLD-OUT MDF KICKSTAND • WALL HANGERS' : '6 SILVER CLIPS • DUAL FLUSH HANGERS'}`;
      } else if (absRot >= 45 && absRot < 135) {
        const isAlum = this.currentFrame === 'aluminium';
        pill.innerHTML = isAlum
          ? `★ 20MM HEAVY-DUTY DEPTH • ANODIZED BRUSHED METAL PROFILE • 9MM SLIM FACE`
          : `12MM STANDARD SIDE DEPTH • LIGHTWEIGHT MATTE PVC • 9MM SLIM FACE`;
      } else if (absRot > 5) {
        pill.innerHTML = `3D PERSPECTIVE • 9MM SLIM ARCHITECTURAL BEZEL • 200GSM GLOSS`;
      } else {
        pill.innerHTML = `9MM SLIM ARCHITECTURAL BEZEL • SHATTERPROOF ACRYLIC • 200GSM GLOSS`;
      }
    }
  }

  setWallColor(colorHex) {
    this.currentWallColor = colorHex;
    if (this.wallElement) {
      this.wallElement.style.backgroundColor = colorHex;
    }

    const customColorInput = document.getElementById("studioCustomWallColor");
    if (customColorInput && colorHex.startsWith("#") && colorHex.length === 7) {
      customColorInput.value = colorHex;
    }

    const spotlight = document.querySelector(".gallery-spotlight-cone");
    const isDark = colorHex === "#26272B" || colorHex === "#111114" || colorHex === "#182232" || colorHex === "#1C2536" || colorHex === "#1E1E22";
    if (spotlight) {
      spotlight.style.opacity = isDark ? "0.6" : "0.35";
    }

    document.querySelectorAll("[data-studio-wall-color]").forEach(btn => {
      const active = btn.getAttribute("data-studio-wall-color").toLowerCase() === colorHex.toLowerCase();
      btn.classList.toggle("ring-2", active);
      btn.classList.toggle("ring-zinc-950", active);
      btn.classList.toggle("scale-110", active);
    });
  }

  setFrame(frameId) {
    this.currentFrame = frameId;
    this.updateStudioView();
  }

  setSize(sizeId) {
    this.currentSize = sizeId;
    this.updateStudioView();
  }

  setTriptych(isTriptych) {
    if (this.currentPoster && this.currentPoster.category === "islamic") {
      this.isTriptych = true; // Always locked for Islamic prints
      this.updateStudioView();
    }
  }

  setRoom(roomId) {
    this.currentRoom = roomId;
    if (this.wallElement) {
      this.wallElement.style.backgroundColor = this.currentWallColor;
    }

    if (!this.furnitureImg) {
      this.furnitureImg = document.getElementById("studioFurnitureImg");
    }
    const scenes = (typeof ROOM_SCENES !== 'undefined' ? ROOM_SCENES : []);
    const scene = scenes.find(r => r.id === roomId) || 
                  scenes.find(r => r.id === (roomId === 'office' ? 'studio-office' : roomId === 'gallery' ? 'gallery-loft' : roomId)) ||
                  scenes[0];
    if (this.furnitureImg && scene && scene.furnitureSvg) {
      this.furnitureImg.src = scene.furnitureSvg;
      if (!this.isCustomWallMode) {
        this.furnitureImg.style.display = "block";
      }
    }

    if (!this.isDragging) {
      this.pos = (scene && scene.initialPos) ? { ...scene.initialPos } : { x: 50, y: 38 };
    }

    document.querySelectorAll("[data-studio-room]").forEach(btn => {
      const bId = btn.getAttribute("data-studio-room");
      const active = (bId === roomId || (roomId === 'studio-office' && bId === 'office') || (roomId === 'gallery-loft' && bId === 'gallery'));
      btn.classList.toggle("bg-zinc-900", active);
      btn.classList.toggle("text-white", active);
      btn.classList.toggle("bg-zinc-100", !active);
      btn.classList.toggle("text-zinc-800", !active);
    });
  }

  toggleGlare(enabled) {
    this.showGlare = enabled;
    const sheen = document.querySelectorAll(".prism-glazing-sheen");
    sheen.forEach(s => s.style.display = enabled ? "block" : "none");
  }

  getFrameClass() {
    if (this.currentFrame === "unframed" || this.currentFrame === "none") return "frame-unframed";
    if (this.currentFrame === "plastic") return "frame-black-plastic";
    return "frame-black-aluminium";
  }

  getCurrentPricing() {
    if (this.currentPoster && this.currentPoster.category === "custom-car") {
      const customPrices = (typeof EXACT_CUSTOM_CAR_PRICES !== 'undefined' ? EXACT_CUSTOM_CAR_PRICES : {})[this.currentSize] || {};
      return customPrices[this.currentFrame] || { price: 7.69, wasPrice: 9.99 };
    }
    const table = this.isTriptych ? EXACT_SET_PRICES : EXACT_SINGLE_PRICES;
    const sizePrices = table[this.currentSize] || table["a4"];
    const rawPricing = sizePrices[this.currentFrame] || sizePrices["unframed"];

    if (table === EXACT_SINGLE_PRICES && rawPricing) {
      const base = Number(rawPricing.price);
      return {
        price: Math.round(base * 0.77 * 100) / 100,
        wasPrice: base,
        label: rawPricing.label
      };
    }
    return rawPricing;
  }

  renderPrismHtml(posterImg, posterTitle, frameType, size, isGlazingVisible = true, panelSliceIndex = null, includeStageId = true) {
    const isA4 = (size === "a4");
    const showA3Outline = (isA4 && !this.isCustomWallMode && window.innerWidth > 768 && includeStageId && panelSliceIndex === null);
    const stageIdAttr = includeStageId ? 'id="studioPrismStage"' : '';
    const stageTransformStyle = includeStageId
      ? `style="transform: scale(${Math.abs(this.rotY) > 35 && Math.abs(this.rotY) < 145 ? 1.15 : 1.0}) rotateX(${this.rotX}deg) rotateY(${this.rotY}deg);"`
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
          class="w-full h-full object-contain block pointer-events-none portrait-spec" 
          style="width: 100% !important; height: 100% !important; object-fit: contain !important; display: block !important; margin: 0 !important; padding: 0 !important; image-rendering: -webkit-optimize-contrast !important; image-rendering: high-quality !important;"
          decoding="sync"
          fetchpriority="high"
          onerror="handlePosterImageError(this, '${this.currentPoster ? this.currentPoster.id : ''}')"
        />
      `;

    // Dedicated 0.4mm 3D Paper Model for Unframed Print
    if (frameType === "unframed" || frameType === "none") {
      return `
        <div class="prism-3d-viewport w-full h-full portrait-spec relative" style="aspect-ratio: 210 / 297;">
          ${showA3Outline ? '<div class="a3-scale-dashed-outline"></div>' : ''}
          <div ${stageIdAttr} class="prism-3d-stage w-full h-full relative" ${stageTransformStyle}>
            
            <!-- Front Face (0deg): 200gsm Glossy Photographic Print Face -->
            <div class="prism-face-paper-front portrait-spec overflow-hidden absolute inset-0">
              ${frontArtHtml}
              <div class="prism-glazing-sheen" style="display: ${isGlazingVisible ? 'block' : 'none'};"></div>
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

    // 6-Sided 3D CSS Prism for Black Plastic & Black Aluminium Frames
    const depthClass = frameType === 'aluminium' ? 'prism-depth-aluminium' : 'prism-depth-plastic';

    return `
      <div class="prism-3d-viewport w-full h-full portrait-spec relative" style="aspect-ratio: 210 / 297;">
        ${showA3Outline ? '<div class="a3-scale-dashed-outline"></div>' : ''}
        <div ${stageIdAttr} class="prism-3d-stage w-full h-full relative ${depthClass}" ${stageTransformStyle}>
          
          <!-- 1. Front Face (0deg): 12px Substantial Black Frame + Artwork + Acrylic Glazing -->
          <div class="prism-face-front poster-frame-container ${frameType === 'aluminium' ? 'frame-black-aluminium' : 'frame-black-plastic'} portrait-spec overflow-hidden absolute inset-0" style="width: 100%; height: 100%; margin: 0; padding: 0; box-sizing: border-box;">
            ${frontArtHtml}
            <div class="prism-glazing-sheen" style="display: ${isGlazingVisible ? 'block' : 'none'};"></div>
          </div>

          <!-- 2. Rear Face (180deg): Clean Procedural E1 MDF Backboard with Brushed Silver Clips & Hardware -->
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

          <!-- 3. Extruded Side Profile Walls (12mm Plastic vs 18mm Aluminium) -->
          <div class="prism-wall-left ${frameType === 'aluminium' ? 'prism-wall-aluminium' : 'prism-wall-plastic'}"></div>
          <div class="prism-wall-right ${frameType === 'aluminium' ? 'prism-wall-aluminium' : 'prism-wall-plastic'}"></div>
          <div class="prism-wall-top ${frameType === 'aluminium' ? 'prism-wall-aluminium' : 'prism-wall-plastic'}"></div>
          <div class="prism-wall-bottom ${frameType === 'aluminium' ? 'prism-wall-aluminium' : 'prism-wall-plastic'}"></div>

        </div>
      </div>
    `;
  }

  updateStudioView() {
    if (!this.frameWrapper) {
      this.frameWrapper = document.getElementById("studioFrameWrapper");
    }
    if (!this.currentPoster) {
      if (typeof allPosters !== "undefined" && allPosters.length > 0) {
        this.currentPoster = allPosters[0];
      } else if (typeof DEFAULT_POSTERS !== "undefined" && DEFAULT_POSTERS.length > 0) {
        this.currentPoster = DEFAULT_POSTERS[0];
      }
    }
    if (!this.currentPoster || !this.frameWrapper) return;

    const sizeObj = SIZE_OPTIONS.find(s => s.id === this.currentSize) || SIZE_OPTIONS[1];
    
    // Strict A4 vs A3 Scale Perception: A4 is 0.71 scale of A3 (210/297 mm)
    const isA4 = this.currentSize === "a4";
    const scaleRatio = isA4 ? 0.71 : 1.0;
    const baseW = 28.5 * (this.isTriptych ? 1.85 : 1.0) * scaleRatio;
    const wallModeScale = this.isCustomWallMode ? this.customWallScale : 1.0;
    const targetWidthRem = baseW * this.zoomLevel * wallModeScale;

    // Smooth scaling transition with realistic drop shadows between A4 & A3
    this.frameWrapper.style.transition = "width 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s ease, filter 0.4s ease";
    this.frameWrapper.style.width = `${targetWidthRem}rem`;
    this.frameWrapper.style.maxWidth = "95%";
    this.frameWrapper.style.maxHeight = "90%";
    this.frameWrapper.style.aspectRatio = this.isTriptych ? "auto" : "210 / 297";
    this.frameWrapper.style.height = "auto";
    this.frameWrapper.style.left = `${this.pos.x}%`;
    this.frameWrapper.style.top = `${this.pos.y}%`;
    this.frameWrapper.style.transform = "translate(-50%, -50%)";

    const dropShadow = isA4 
      ? "drop-shadow(0 16px 24px rgba(0,0,0,0.22)) drop-shadow(0 4px 8px rgba(0,0,0,0.15))"
      : "drop-shadow(0 26px 40px rgba(0,0,0,0.32)) drop-shadow(0 8px 16px rgba(0,0,0,0.22))";
    this.frameWrapper.style.filter = dropShadow;

    if (this.scaleLabel) {
      const typeLabel = this.isTriptych ? "3-Piece Gallery Set" : "Single Portrait Print";
      this.scaleLabel.textContent = `${sizeObj.name} (${sizeObj.dimensions}) • ${typeLabel}`;
    }

    const posterImg = this.currentPoster.image || this.currentPoster.img || this.currentPoster.src ||
      (typeof generatePosterFallbackSvg === "function" ? generatePosterFallbackSvg(this.currentPoster) : "");

    if (this.isTriptych) {
      const panels = (this.currentPoster.triptychImages && this.currentPoster.triptychImages.length === 3)
        ? this.currentPoster.triptychImages
        : ["assets/islamic-panel-1.jpg", "assets/islamic-panel-2.jpg", "assets/islamic-panel-3.jpg"];
      this.frameWrapper.innerHTML = `
        <div class="w-full flex flex-col items-center">
          <div id="studioPrismStage" class="triptych-stage-wrapper prism-3d-stage" style="transform: rotateX(${this.rotX}deg) rotateY(${this.rotY}deg);">
            <div class="triptych-grid select-none studio-framed-wall-art" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; width: 100%; align-items: center;">
              <div class="triptych-panel triptych-outer-left" style="aspect-ratio: 210 / 297; width: 100%;">
                ${this.renderPrismHtml(panels[0], "Gallery Panel 1", this.currentFrame, this.currentSize, this.showGlare, null, false)}
              </div>
              <div class="triptych-panel triptych-center" style="aspect-ratio: 210 / 297; width: 100%;">
                ${this.renderPrismHtml(panels[1], "Gallery Panel 2", this.currentFrame, this.currentSize, this.showGlare, null, false)}
              </div>
              <div class="triptych-panel triptych-outer-right" style="aspect-ratio: 210 / 297; width: 100%;">
                ${this.renderPrismHtml(panels[2], "Gallery Panel 3", this.currentFrame, this.currentSize, this.showGlare, null, false)}
              </div>
            </div>
          </div>
          <!-- Architectural Dimension Lines -->
          <div id="studioDimensionBar" class="studio-dimension-bar ${Math.abs(this.rotY) > 5 ? 'dimension-hidden' : ''}">
            <div class="studio-dimension-line"></div>
            <span class="studio-dimension-text">${isA4 ? '3 × (21 × 29.7 CM) • A4 GALLERY SET' : '3 × (29.7 × 42 CM) • A3 STATEMENT SET'}</span>
            <div class="studio-dimension-line"></div>
          </div>
        </div>
      `;
    } else {
      this.frameWrapper.innerHTML = `
        <div class="w-full flex flex-col items-center select-none">
          <div class="w-full relative studio-framed-wall-art" style="aspect-ratio: 210 / 297; height: auto;">
            ${this.renderPrismHtml(posterImg, this.currentPoster.title, this.currentFrame, this.currentSize, this.showGlare)}
          </div>
          <!-- Architectural Dimension Lines -->
          <div id="studioDimensionBar" class="studio-dimension-bar ${Math.abs(this.rotY) > 5 ? 'dimension-hidden' : ''}">
            <div class="studio-dimension-line"></div>
            <span class="studio-dimension-text">${isA4 ? '21 × 29.7 CM • A4 FORMAT' : '29.7 × 42 CM • A3 LARGE SPEC'}</span>
            <div class="studio-dimension-line"></div>
          </div>
        </div>
      `;
    }

    this.updatePrismTransform(false);
    this.updateRotationControls();
    this.updateHudLayer();
    this.updateSidebarControls();
    this.updateZoomControls();
  }

  updateSidebarControls() {
    // 0. Artwork Title
    const titleEl = document.getElementById("studioPosterTitle");
    if (titleEl) {
      titleEl.textContent = this.currentPoster ? this.currentPoster.title : "Framed Artwork";
    }

    // 1. Calculate prices for A4 and A3 across all 3 frames
    let pricesA4 = { unframed: 7.00, plastic: 19.20, aluminium: 22.70 };
    let pricesA3 = { unframed: 10.99, plastic: 22.45, aluminium: 25.95 };

    if (this.currentPoster && this.currentPoster.category === "custom-car") {
      const customPrices = (typeof EXACT_CUSTOM_CAR_PRICES !== 'undefined' ? EXACT_CUSTOM_CAR_PRICES : {});
      if (customPrices.a4) {
        pricesA4 = {
          unframed: customPrices.a4.unframed?.price || 7.69,
          plastic: customPrices.a4.plastic?.price || 13.85,
          aluminium: customPrices.a4.aluminium?.price || 19.99
        };
      }
      if (customPrices.a3) {
        pricesA3 = {
          unframed: customPrices.a3.unframed?.price || 11.54,
          plastic: customPrices.a3.plastic?.price || 21.55,
          aluminium: customPrices.a3.aluminium?.price || 29.99
        };
      }
    } else {
      const table = this.isTriptych ? EXACT_SET_PRICES : EXACT_SINGLE_PRICES;
      if (table.a4) {
        const u = table.a4.unframed?.price || 7.00;
        const p = table.a4.plastic?.price || 19.20;
        const a = table.a4.aluminium?.price || 22.70;
        const isSingle = (table === EXACT_SINGLE_PRICES);
        pricesA4 = {
          unframed: isSingle ? Math.round(u * 0.77 * 100) / 100 : u,
          plastic: isSingle ? Math.round(p * 0.77 * 100) / 100 : p,
          aluminium: isSingle ? Math.round(a * 0.77 * 100) / 100 : a
        };
      }
      if (table.a3) {
        const u = table.a3.unframed?.price || 10.99;
        const p = table.a3.plastic?.price || 22.45;
        const a = table.a3.aluminium?.price || 25.95;
        const isSingle = (table === EXACT_SINGLE_PRICES);
        pricesA3 = {
          unframed: isSingle ? Math.round(u * 0.77 * 100) / 100 : u,
          plastic: isSingle ? Math.round(p * 0.77 * 100) / 100 : p,
          aluminium: isSingle ? Math.round(a * 0.77 * 100) / 100 : a
        };
      }
    }

    const currentPrices = (this.currentSize === "a4") ? pricesA4 : pricesA3;

    // 2. Update card price subtext "(£5.39 A4 / £9.24 A3)"
    const cardPriceU = document.getElementById("studioCardPriceUnframed");
    const cardPriceP = document.getElementById("studioCardPricePlastic");
    const cardPriceA = document.getElementById("studioCardPriceAlum");
    if (cardPriceU) cardPriceU.textContent = `(£${pricesA4.unframed.toFixed(2)} A4 / £${pricesA3.unframed.toFixed(2)} A3)`;
    if (cardPriceP) cardPriceP.textContent = `(£${pricesA4.plastic.toFixed(2)} A4 / £${pricesA3.plastic.toFixed(2)} A3)`;
    if (cardPriceA) cardPriceA.textContent = `(£${pricesA4.aluminium.toFixed(2)} A4 / £${pricesA3.aluminium.toFixed(2)} A3)`;

    // 3. Update live frame prices
    const elU = document.getElementById("studioPriceUnframed");
    const elP = document.getElementById("studioPricePlastic");
    const elA = document.getElementById("studioPriceAlum");
    if (elU) elU.textContent = `£${currentPrices.unframed.toFixed(2)}`;
    if (elP) elP.textContent = `£${currentPrices.plastic.toFixed(2)}`;
    if (elA) elA.textContent = `£${currentPrices.aluminium.toFixed(2)}`;

    // 4. Size Cards Active States
    document.querySelectorAll("[data-studio-size]").forEach(btn => {
      const s = btn.getAttribute("data-studio-size");
      const isSelected = (s === this.currentSize);
      btn.classList.toggle("bg-zinc-950", isSelected);
      btn.classList.toggle("border-zinc-950", isSelected);
      btn.classList.toggle("text-white", isSelected);
      btn.classList.toggle("shadow-sm", isSelected);
      btn.classList.toggle("bg-white", !isSelected);
      btn.classList.toggle("border-zinc-300", !isSelected);
      btn.classList.toggle("text-zinc-950", !isSelected);

      const spans = btn.querySelectorAll("span");
      if (spans.length >= 3) {
        spans[0].classList.toggle("text-white", isSelected);
        spans[0].classList.toggle("text-zinc-950", !isSelected);
        spans[1].classList.toggle("text-zinc-300", isSelected);
        spans[1].classList.toggle("text-zinc-500", !isSelected);
        spans[2].classList.toggle("text-zinc-300", isSelected);
        spans[2].classList.toggle("text-zinc-600", !isSelected);
      }
    });

    // 5. Frame Cards Active States
    document.querySelectorAll("[data-studio-frame]").forEach(btn => {
      const f = btn.getAttribute("data-studio-frame");
      const isSelected = (f === this.currentFrame);
      if (f === 'aluminium') {
        btn.classList.toggle("border-emerald-600", isSelected);
        btn.classList.toggle("ring-2", isSelected);
        btn.classList.toggle("ring-emerald-600/30", isSelected);
        btn.classList.toggle("bg-emerald-50/30", isSelected);
        btn.classList.toggle("border-zinc-300", !isSelected);
        btn.classList.toggle("ring-0", !isSelected);
        btn.classList.toggle("bg-white", !isSelected);
      } else {
        btn.classList.toggle("border-zinc-950", isSelected);
        btn.classList.toggle("ring-1", isSelected);
        btn.classList.toggle("ring-zinc-950", isSelected);
        btn.classList.toggle("bg-zinc-50", isSelected);
        btn.classList.toggle("border-zinc-300", !isSelected);
        btn.classList.toggle("ring-0", !isSelected);
        btn.classList.toggle("bg-white", !isSelected);
      }
    });

    // 6. 3-Piece Triptych Toggle container in visualizer sidebar
    const triptychContainer = document.getElementById("studioTriptychContainer");
    if (triptychContainer) {
      if (this.currentPoster && this.currentPoster.category === "islamic") {
        triptychContainer.style.display = "block";
        document.querySelectorAll("[data-studio-format]").forEach(btn => {
          const isTrip = btn.getAttribute("data-studio-format") === "triptych";
          const active = this.isTriptych === isTrip;
          btn.classList.toggle("bg-white", active);
          btn.classList.toggle("text-zinc-950", active);
          btn.classList.toggle("bg-zinc-800", !active);
          btn.classList.toggle("text-white", !active);
        });
      } else {
        triptychContainer.style.display = "none";
      }
    }

    // 7. Dynamic Live Total Price in Visualizer Sidebar & Mobile Sticky Bottom Bar
    const activePricing = this.getCurrentPricing();
    const activePrice = activePricing.price;
    const activeWasPrice = activePricing.wasPrice || (activePrice / 0.77);

    const studioPriceEl = document.getElementById("studioLivePrice");
    if (studioPriceEl) {
      studioPriceEl.textContent = `£${activePrice.toFixed(2)}`;
    }
    const studioStickyPrice = document.getElementById("studioStickyPrice");
    const studioStickyWasPrice = document.getElementById("studioStickyWasPrice");
    if (studioStickyPrice) {
      studioStickyPrice.textContent = `£${activePrice.toFixed(2)}`;
    }
    if (studioStickyWasPrice) {
      studioStickyWasPrice.textContent = `£${activeWasPrice.toFixed(2)}`;
    }
  }

  // Strict Drag Boundaries Clamping: top: 15% to 55%, left: 25% to 75%
  onDragStart(e) {
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest(".prism-hotspot-pin")) return;
    this.isDragging = true;
    this.dragStart = { x: e.clientX, y: e.clientY };
    this.dragMode = (Math.abs(this.rotY) > 10 || e.shiftKey) ? 'rotate' : 'move';
    this.startRotY = this.rotY;
    e.preventDefault();
  }

  onTouchStart(e) {
    if (e.touches.length === 1) {
      const target = e.target;
      if (target.closest("button") || target.closest("input") || target.closest(".prism-hotspot-pin")) return;
      this.isDragging = true;
      this.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      this.dragMode = (Math.abs(this.rotY) > 10) ? 'rotate' : 'move';
      this.startRotY = this.rotY;
    }
  }

  onDragMove(e) {
    if (!this.isDragging) return;
    if (this.dragMode === 'rotate') {
      const dx = e.clientX - this.dragStart.x;
      this.setRotation(this.startRotY + (dx * 0.75), false);
    } else {
      const wallRect = this.wallElement.getBoundingClientRect();
      const dx = ((e.clientX - this.dragStart.x) / wallRect.width) * 100;
      const dy = ((e.clientY - this.dragStart.y) / wallRect.height) * 100;

      // Clamped strictly inside top: 15% to 55%, left: 25% to 75% (or 6% to 94% on Custom Wall)
      const minX = this.isCustomWallMode ? 6 : 25;
      const maxX = this.isCustomWallMode ? 94 : 75;
      const minY = this.isCustomWallMode ? 6 : 15;
      const maxY = this.isCustomWallMode ? 92 : 55;

      this.pos.x = Math.max(minX, Math.min(maxX, this.pos.x + dx));
      this.pos.y = Math.max(minY, Math.min(maxY, this.pos.y + dy));

      this.dragStart = { x: e.clientX, y: e.clientY };

      if (this.frameWrapper) {
        this.frameWrapper.style.left = `${this.pos.x}%`;
        this.frameWrapper.style.top = `${this.pos.y}%`;
      }
    }
  }

  onTouchMove(e) {
    if (!this.isDragging || e.touches.length !== 1) return;
    if (this.dragMode === 'rotate') {
      const dx = e.touches[0].clientX - this.dragStart.x;
      this.setRotation(this.startRotY + (dx * 0.75), false);
    } else {
      const wallRect = this.wallElement.getBoundingClientRect();
      const dx = ((e.touches[0].clientX - this.dragStart.x) / wallRect.width) * 100;
      const dy = ((e.touches[0].clientY - this.dragStart.y) / wallRect.height) * 100;

      const minX = this.isCustomWallMode ? 6 : 25;
      const maxX = this.isCustomWallMode ? 94 : 75;
      const minY = this.isCustomWallMode ? 6 : 15;
      const maxY = this.isCustomWallMode ? 92 : 55;

      this.pos.x = Math.max(minX, Math.min(maxX, this.pos.x + dx));
      this.pos.y = Math.max(minY, Math.min(maxY, this.pos.y + dy));

      this.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      if (this.frameWrapper) {
        this.frameWrapper.style.left = `${this.pos.x}%`;
        this.frameWrapper.style.top = `${this.pos.y}%`;
      }
    }
    e.preventDefault();
  }

  onDragEnd() {
    this.isDragging = false;
  }

  // Export 1920x1280 photorealistic room mockup
  async exportMockupHD() {
    if (!this.currentPoster) return;

    const downloadBtn = document.getElementById("studioDownloadBtn");
    const origHTML = downloadBtn ? downloadBtn.innerHTML : "";
    if (downloadBtn) {
      downloadBtn.innerHTML = `
        <span class="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin inline-block"></span>
        <span>Rendering HD...</span>
      `;
      downloadBtn.disabled = true;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1280;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }

      // 1. Draw Architectural Wall Surface (with dynamic paint color)
      ctx.fillStyle = this.currentWallColor || "#EAE8E3";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor Zone (Lower 18% of canvas: from y=1049 to 1280)
      const floorH = canvas.height * 0.18;
      const floorY = canvas.height * 0.82;

      // Draw Distinct Room Environment Elements on Wall
      if (this.currentRoom === "living-room") {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.045)";
        ctx.rotate(-0.58);
        for (let x = -1200; x < canvas.width * 2; x += 110) {
          ctx.fillRect(x, -600, 48, canvas.height * 2.8);
        }
        ctx.restore();
      } else if (this.currentRoom === "bedroom") {
        ctx.save();
        for (let x = 0; x < canvas.width; x += 36) {
          ctx.fillStyle = "#3a281a";
          ctx.fillRect(x, 0, 22, floorY);
          ctx.fillStyle = "#140d08";
          ctx.fillRect(x + 22, 0, 14, floorY);
        }
        ctx.restore();
      } else if (this.currentRoom === "studio-office") {
        ctx.save();
        const cyanGlow = ctx.createRadialGradient(canvas.width * 0.28, floorY - 60, 40, canvas.width * 0.28, floorY - 60, 520);
        cyanGlow.addColorStop(0, "rgba(6, 182, 212, 0.45)");
        cyanGlow.addColorStop(1, "rgba(6, 182, 212, 0)");
        ctx.fillStyle = cyanGlow;
        ctx.fillRect(0, 0, canvas.width, floorY);

        const amberGlow = ctx.createRadialGradient(canvas.width * 0.72, floorY - 60, 40, canvas.width * 0.72, floorY - 60, 520);
        amberGlow.addColorStop(0, "rgba(245, 158, 11, 0.42)");
        amberGlow.addColorStop(1, "rgba(245, 158, 11, 0)");
        ctx.fillStyle = amberGlow;
        ctx.fillRect(0, 0, canvas.width, floorY);
        ctx.restore();
      } else if (this.currentRoom === "gallery-loft") {
        ctx.save();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.38)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, floorY);
        ctx.moveTo(0, floorY / 2);
        ctx.lineTo(canvas.width, floorY / 2);
        ctx.stroke();

        const tieRods = [
          [canvas.width * 0.25, floorY * 0.25],
          [canvas.width * 0.75, floorY * 0.25],
          [canvas.width * 0.25, floorY * 0.75],
          [canvas.width * 0.75, floorY * 0.75]
        ];
        tieRods.forEach(([tx, ty]) => {
          ctx.beginPath();
          ctx.arc(tx, ty, 8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(40, 42, 46, 0.8)";
          ctx.fill();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
        ctx.restore();
      }

      // French Hardwood Oak Floor Zone (Bottom 18%)
      const floorGrad = ctx.createLinearGradient(0, floorY, 0, canvas.height);
      floorGrad.addColorStop(0, "#3d3228");
      floorGrad.addColorStop(0.35, "#2e241c");
      floorGrad.addColorStop(0.7, "#201812");
      floorGrad.addColorStop(1, "#140f0b");
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, floorY, canvas.width, floorH);

      // Floor plank lines
      ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
      ctx.lineWidth = 2;
      for (let px = 0; px < canvas.width; px += 160) {
        ctx.beginPath();
        ctx.moveTo(px, floorY);
        ctx.lineTo(px, canvas.height);
        ctx.stroke();
      }

      // Architectural Skirting Board Line (8px height)
      const baseGrad = ctx.createLinearGradient(0, floorY - 8, 0, floorY);
      baseGrad.addColorStop(0, "#edeae5");
      baseGrad.addColorStop(0.4, "#cdc7bd");
      baseGrad.addColorStop(0.9, "#8f887b");
      baseGrad.addColorStop(1, "#524d43");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, floorY - 8, canvas.width, 8);

      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(0, floorY - 1, canvas.width, 2);

      // 2. Realistic Overhead Gallery Spotlight Cone
      const spotGrad = ctx.createRadialGradient(canvas.width / 2, 0, 80, canvas.width / 2, 0, canvas.height * 0.85);
      const isDark = this.currentWallColor === "#1C2536" || this.currentWallColor === "#1E1E22" || this.currentWallColor === "#15171C";
      spotGrad.addColorStop(0, isDark ? "rgba(255, 255, 255, 0.42)" : "rgba(255, 255, 255, 0.28)");
      spotGrad.addColorStop(0.35, "rgba(255, 255, 255, 0.08)");
      spotGrad.addColorStop(0.7, "rgba(0, 0, 0, 0.12)");
      spotGrad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Draw Front-Facing Furniture Graphic strictly inside bottom 28%
      const scene = (typeof ROOM_SCENES !== 'undefined' ? ROOM_SCENES : []).find(r => r.id === this.currentRoom) || (ROOM_SCENES && ROOM_SCENES[0]);
      if (scene && scene.furnitureSvg) {
        const furnImg = new Image();
        furnImg.src = scene.furnitureSvg;
        await new Promise((resolve) => {
          if (furnImg.complete) return resolve();
          furnImg.onload = () => resolve();
          furnImg.onerror = () => resolve();
        });
        if (furnImg.complete && furnImg.naturalWidth > 0) {
          const furnH = canvas.height * 0.28;
          const furnW = furnH * (1200 / 320);
          const furnX = (canvas.width - furnW) / 2;
          const furnY = canvas.height - furnH;
          ctx.drawImage(furnImg, furnX, furnY, furnW, furnH);
        }
      }

      // 4. Calculate Artwork Dimensions (Portrait 210/297)
      const sizeObj = SIZE_OPTIONS.find(s => s.id === this.currentSize) || SIZE_OPTIONS[1];
      const baseW = 520 * sizeObj.wallScale * (this.zoomLevel || 1.0);
      const baseH = (baseW * 297) / 210;

      // Both frames share the exact same slim 9mm (8px at canvas scale) front bezel
      let frameBorder = 0;
      let frameColor = "#09090b";
      if (this.currentFrame === "plastic") {
        frameBorder = 8;
        frameColor = "#141416";
      } else if (this.currentFrame === "aluminium") {
        frameBorder = 8;
        frameColor = "#09090b";
      }

      // Render Single Frame helper
      const renderSingleFrame = async (imgUrl, fx, fy, fw, fh) => {
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
        ctx.shadowBlur = 45;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 22;
        ctx.fillStyle = "#000000";
        ctx.fillRect(fx, fy, fw, fh);
        ctx.restore();

        // Frame Bezel (9mm Slim Face on Both)
        if (frameBorder > 0) {
          ctx.fillStyle = frameColor;
          ctx.fillRect(fx, fy, fw, fh);
          if (this.currentFrame === "aluminium") {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(fx + 1, fy + 1, fw - 2, fh - 2);
          }
        }

        // Full Bleed Single Artwork Image
        const ax = fx + frameBorder;
        const ay = fy + frameBorder;
        const aw = fw - (frameBorder * 2);
        const ah = fh - (frameBorder * 2);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imgUrl;

        await new Promise((resolve) => {
          if (img.complete) return resolve();
          img.onload = () => resolve();
          img.onerror = () => {
            ctx.fillStyle = "#fbfbfc";
            ctx.fillRect(ax, ay, aw, ah);
            resolve();
          };
        });

        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, ax, ay, aw, ah);
        }
      };

      const centerY = (this.pos.y / 100) * canvas.height;
      const centerX = (this.pos.x / 100) * canvas.width;

      if (this.isTriptych && this.currentPoster.triptychImages) {
        const panelW = baseW * 0.72;
        const panelH = (panelW * 297) / 210;
        const gap = 24;
        const totalW = (panelW * 3) + (gap * 2);
        let startX = centerX - (totalW / 2);
        const startY = centerY - (panelH / 2);

        for (let i = 0; i < 3; i++) {
          const px = startX + i * (panelW + gap);
          await renderSingleFrame(this.currentPoster.triptychImages[i], px, startY, panelW, panelH);
        }
      } else {
        const frameX = centerX - baseW / 2;
        const frameY = centerY - baseH / 2;
        await renderSingleFrame(this.currentPoster.image, frameX, frameY, baseW, baseH);
      }

      // 5. Official INCASE STUDIOS Studio Watermark
      ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
      ctx.fillRect(36, canvas.height - 76, 430, 48);

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 13px 'Inter', sans-serif";
      ctx.letterSpacing = "0.08em";
      ctx.fillText("INCASE STUDIOS • PRECISION PRINT", 50, canvas.height - 48);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "600 10px 'Inter', sans-serif";
      const frameTitle = FRAME_OPTIONS.find(f => f.id === this.currentFrame)?.shortName || "Sleek Black Frame";
      ctx.fillText(`${sizeObj.name} (${sizeObj.dimensions}) • ${frameTitle} • 200gsm Glossy`, 50, canvas.height - 34);

      // Download trigger
      const link = document.createElement("a");
      link.download = `INCASE-STUDIOS-${this.currentPoster.id}-${this.currentSize}-${this.currentFrame}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      if (typeof showToast === 'function') showToast("HD Room Mockup generated and saved!");
    } catch (err) {
      console.error("Mockup export failed:", err);
      if (typeof showToast === 'function') showToast("Could not export HD mockup.");
    } finally {
      if (downloadBtn) {
        downloadBtn.innerHTML = origHTML;
        downloadBtn.disabled = false;
      }
    }
  }
}

// Global Hardware Closeup Modal Helpers
function openHardwareCloseupModal(tabIndex = 0) {
  const modal = document.getElementById("hardwareCloseupModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  switchHardwareTab(tabIndex);
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

function closeHardwareCloseupModal() {
  const modal = document.getElementById("hardwareCloseupModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function switchHardwareTab(index) {
  for (let i = 0; i < 3; i++) {
    const btn = document.getElementById(`hwTabBtn${i}`);
    const pane = document.getElementById(`hwTabPane${i}`);
    if (btn) {
      const active = i === index;
      btn.classList.toggle("border-emerald-400", active);
      btn.classList.toggle("text-white", active);
      btn.classList.toggle("border-transparent", !active);
      btn.classList.toggle("text-zinc-400", !active);
    }
    if (pane) {
      pane.classList.toggle("hidden", i !== index);
    }
  }
}

// Global Top-Down Architectural Breakdown Modal Helpers
function openTopDownBreakdownModal() {
  const modal = document.getElementById("topDownBreakdownModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

function closeTopDownBreakdownModal() {
  const modal = document.getElementById("topDownBreakdownModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Global visualizer singleton instance
window.mockupStudio = new MockupStudio();
window.roomStudio = window.mockupStudio;
window.openHardwareCloseupModal = openHardwareCloseupModal;
window.closeHardwareCloseupModal = closeHardwareCloseupModal;
window.switchHardwareTab = switchHardwareTab;
window.openTopDownBreakdownModal = openTopDownBreakdownModal;
window.closeTopDownBreakdownModal = closeTopDownBreakdownModal;
