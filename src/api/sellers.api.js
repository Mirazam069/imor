import { http } from "./http";
import { getSellerProducts as getSellerProductsFromProducts } from "./products.api";

/**
 * QRS Sellers API
 * - Backend bo‘lsa: http orqali real request
 * - Backend bo‘lmasa: demo fallback (localStorage)
 *
 * Seller model (demo):
 * {
 *   id: "s_1",
 *   name: "QRS Seller",
 *   phone: "+998 90 123 45 67",
 *   telegram: "qrs_seller",
 *   region: "Toshkent",
 *   address: "Toshkent, Chilonzor",
 *   about: "Biz qurilish materiallarini ulgurji va chakana sotamiz...",
 *   avatar: "",
 *   createdAt: "2026-01-20",
 *   updatedAt: "2026-01-20"
 * }
 */

const DEMO_SELLERS_KEY = "qrs_demo_sellers_v1";

function nowISO() {
  return new Date().toISOString().slice(0, 10);
}

function safeJsonParse(v, fb) {
  try {
    return JSON.parse(v);
  } catch {
    return fb;
  }
}

function readDemoSellers() {
  const raw = localStorage.getItem(DEMO_SELLERS_KEY);
  const items = raw ? safeJsonParse(raw, []) : [];
  return Array.isArray(items) ? items : [];
}

function writeDemoSellers(items) {
  localStorage.setItem(DEMO_SELLERS_KEY, JSON.stringify(items));
}

function normalizeTelegram(tg) {
  const s = String(tg || "").trim();
  if (!s) return "";
  return s.replace("https://t.me/", "").replace("@", "").trim();
}

function normalizePhone(p) {
  return String(p || "").trim();
}

function ensureSeed() {
  const cur = readDemoSellers();
  if (cur.length) return cur;

  const seeded = [
    {
      id: "s_1",
      name: "QRS Seller",
      phone: "+998 90 123 45 67",
      telegram: "qrs_seller",
      region: "Toshkent",
      address: "Toshkent, Chilonzor",
      about:
        "QRS — qurilish materiallari marketplace. Bizda g‘isht, sement, armatura va elektro mahsulotlar bor.",
      avatar: "",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    },
  ];

  writeDemoSellers(seeded);
  return seeded;
}

function normalizeSellerPayload(payload = {}) {
  const s = payload || {};
  return {
    name: String(s.name || "").trim(),
    phone: normalizePhone(s.phone),
    telegram: normalizeTelegram(s.telegram),
    region: String(s.region || "").trim(),
    address: String(s.address || "").trim(),
    about: String(s.about || "").trim(),
    avatar: String(s.avatar || "").trim(),
  };
}

/* =========================
   API (real + fallback)
========================= */

// 1) Get seller list (optional)
export async function getSellers(filters = {}) {
  try {
    // Real:
    // const { data } = await http.get("/sellers", { params: filters });
    // return data;

    // Demo:
    const all = ensureSeed();
    return { items: all, total: all.length, filters };
  } catch {
    const all = ensureSeed();
    return { items: all, total: all.length, filters };
  }
}

// 2) Get seller by id
export async function getSellerById(sellerId) {
  try {
    // Real:
    // const { data } = await http.get(`/sellers/${sellerId}`);
    // return data;

    const all = ensureSeed();
    return all.find((x) => String(x.id) === String(sellerId)) || null;
  } catch {
    const all = ensureSeed();
    return all.find((x) => String(x.id) === String(sellerId)) || null;
  }
}

// 3) Update seller profile
export async function updateSeller(sellerId, payload) {
  const normalized = normalizeSellerPayload(payload);

  try {
    // Real:
    // const { data } = await http.put(`/sellers/${sellerId}`, normalized);
    // return data;

    const all = ensureSeed();
    const idx = all.findIndex((x) => String(x.id) === String(sellerId));
    if (idx === -1) return null;

    const updated = {
      ...all[idx],
      ...normalized,
      id: all[idx].id,
      updatedAt: nowISO(),
    };

    const next = [...all];
    next[idx] = updated;
    writeDemoSellers(next);
    return updated;
  } catch {
    const all = ensureSeed();
    const idx = all.findIndex((x) => String(x.id) === String(sellerId));
    if (idx === -1) return null;

    const updated = {
      ...all[idx],
      ...normalized,
      id: all[idx].id,
      updatedAt: nowISO(),
    };

    const next = [...all];
    next[idx] = updated;
    writeDemoSellers(next);
    return updated;
  }
}

// 4) Get seller products (proxy to products.api)
export async function getSellerProducts(sellerId, filters = {}) {
  try {
    // Real variant (agar backend bo‘lsa):
    // const { data } = await http.get(`/sellers/${sellerId}/products`, { params: filters });
    // return data;

    // Demo:
    return await getSellerProductsFromProducts(sellerId, filters);
  } catch {
    return await getSellerProductsFromProducts(sellerId, filters);
  }
}

/* =========================
   Optional helpers
========================= */
export function seedDemoSeller(extraSeller = null) {
  const all = ensureSeed();
  if (!extraSeller) return { ok: true, total: all.length };

  const s = normalizeSellerPayload(extraSeller);
  const created = {
    id: `s_${Math.random().toString(16).slice(2)}_${Date.now()}`,
    ...s,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };

  const next = [created, ...all];
  writeDemoSellers(next);
  return { ok: true, total: next.length, created };
}

export function clearDemoSellers() {
  localStorage.removeItem(DEMO_SELLERS_KEY);
  return { ok: true };
}
