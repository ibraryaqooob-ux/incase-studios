// IndexedDB wrapper to store up to hundreds of user posters, custom images, and store data
// Supports fast offline persistence, bulk uploads, JSON export/import

const DB_NAME = "PosterBusinessDB";
const DB_VERSION = 1;
const STORE_POSTERS = "custom_posters";
const STORE_ORDERS = "orders";
const STORE_SETTINGS = "settings";

let dbInstance = null;

function openDB() {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve) => {
    let finished = false;
    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        console.warn("IndexedDB open timed out, falling back gracefully");
        resolve(null);
      }
    }, 1000);

    try {
      if (typeof indexedDB === "undefined") {
        clearTimeout(timer);
        return resolve(null);
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_POSTERS)) {
          const posterStore = db.createObjectStore(STORE_POSTERS, { keyPath: "id" });
          posterStore.createIndex("category", "category", { unique: false });
          posterStore.createIndex("createdAt", "createdAt", { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_ORDERS)) {
          db.createObjectStore(STORE_ORDERS, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS, { keyPath: "key" });
        }
      };

      request.onsuccess = (event) => {
        if (!finished) {
          finished = true;
          clearTimeout(timer);
          dbInstance = event.target.result;
          resolve(dbInstance);
        }
      };

      request.onerror = (event) => {
        if (!finished) {
          finished = true;
          clearTimeout(timer);
          console.warn("IndexedDB open error:", event.target.error);
          resolve(null);
        }
      };
    } catch (err) {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        console.warn("IndexedDB access error:", err);
        resolve(null);
      }
    }
  });
}

// Get all custom uploaded posters
async function getAllCustomPosters() {
  try {
    const db = await openDB();
    if (!db) return [];
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_POSTERS, "readonly");
        const store = tx.objectStore(STORE_POSTERS);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      } catch (err) {
        resolve([]);
      }
    });
  } catch (err) {
    return [];
  }
}

// Add or update a poster
async function saveCustomPoster(poster) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_POSTERS, "readwrite");
    const store = tx.objectStore(STORE_POSTERS);
    if (!poster.id) {
      poster.id = "custom-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6);
    }
    if (!poster.createdAt) {
      poster.createdAt = Date.now();
    }
    poster.isCustom = true;
    const request = store.put(poster);
    request.onsuccess = () => resolve(poster);
    request.onerror = () => reject(request.error);
  });
}

// Bulk save posters (great for importing 50-200 posters at once!)
async function bulkSaveCustomPosters(posters) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_POSTERS, "readwrite");
    const store = tx.objectStore(STORE_POSTERS);
    let count = 0;
    posters.forEach((p) => {
      if (!p.id) {
        p.id = "custom-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6);
      }
      p.createdAt = p.createdAt || Date.now();
      p.isCustom = true;
      store.put(p);
      count++;
    });

    tx.oncomplete = () => resolve(count);
    tx.onerror = () => reject(tx.error);
  });
}

// Delete poster by ID
async function deleteCustomPoster(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_POSTERS, "readwrite");
    const store = tx.objectStore(STORE_POSTERS);
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

// Export all custom catalog items as JSON
async function exportCustomCatalog() {
  const posters = await getAllCustomPosters();
  const blob = new Blob([JSON.stringify(posters, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `poster-catalog-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Save order into history
async function saveOrder(order) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ORDERS, "readwrite");
    const store = tx.objectStore(STORE_ORDERS);
    const request = store.put(order);
    request.onsuccess = () => resolve(order);
    request.onerror = () => reject(request.error);
  });
}

async function getAllOrders() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ORDERS, "readonly");
    const store = tx.objectStore(STORE_ORDERS);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// ==========================================
// --- STUDIO PACKING VIDEO PERSISTENCE ---
// ==========================================
async function saveStudioPackingVideo(fileBlob) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SETTINGS, "readwrite");
    const store = tx.objectStore(STORE_SETTINGS);
    const item = {
      key: "studio_packing_video",
      blob: fileBlob,
      name: fileBlob.name || "packing-video.mp4",
      type: fileBlob.type || "video/mp4",
      size: fileBlob.size || 0,
      updatedAt: Date.now()
    };
    const req = store.put(item);
    req.onsuccess = () => resolve(item);
    req.onerror = () => reject(req.error);
  });
}

async function getStudioPackingVideo() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SETTINGS, "readonly");
    const store = tx.objectStore(STORE_SETTINGS);
    const req = store.get("studio_packing_video");
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function deleteStudioPackingVideo() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SETTINGS, "readwrite");
    const store = tx.objectStore(STORE_SETTINGS);
    const req = store.delete("studio_packing_video");
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

