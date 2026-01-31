// src/api/products.api.js
import { http } from "./http";

/* =========================
   Helpers
========================= */
function safeStr(v) {
  return String(v ?? "").trim();
}
function safeNum(v, fb = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
}
function safeBool(v) {
  return Boolean(v);
}

function normalizeTelegram(tg) {
  const s = safeStr(tg);
  if (!s) return "";
  return s
    .replace("https://t.me/", "")
    .replace("http://t.me/", "")
    .replace("t.me/", "")
    .replace("@", "")
    .trim();
}

function normalizePhone(p) {
  return safeStr(p);
}

/** DB row -> UI object */
function fromDb(row) {
  if (!row) return null;

  const img = row.image_url ?? "";

  return {
    id: row.id,
    title: row.title ?? "",
    price: safeNum(row.price, 0),

    catalogKey: row.catalog_key ?? row.category ?? "",
    category: row.category ?? "",

    unit: row.unit ?? "dona",

    // ✅ ikkalasini ham beramiz (sizning UI turli joyda har xil ishlatyapti)
    image: img,
    image_url: img,

    desc: row.description ?? "",

    createdAt: row.created_at ?? null,

    sellerId: row.seller_id ?? "s_1",
    sellerName: row.seller_name ?? "IMOR Seller",
    status: row.status ?? "active",

    region: row.region ?? "",
    minQty: safeNum(row.min_qty, 1),
    delivery: safeBool(row.delivery),
    phone: row.phone ?? "",
    telegram: row.telegram ?? "",
  };
}

/** UI payload -> DB payload */
function toDbPayload(payload = {}) {
  const p = payload || {};

  const title = safeStr(p.title);
  const catalogKey = safeStr(p.catalogKey || p.category || "");
  const region = safeStr(p.region);
  const unit = safeStr(p.unit || "dona");
  const price = safeNum(p.price, 0);
  const minQty = safeNum(p.minQty, 1);
  const delivery = safeBool(p.delivery);
  const phone = normalizePhone(p.phone);
  const telegram = normalizeTelegram(p.telegram);
  const desc = safeStr(p.desc || p.description || "");
  const image = safeStr(p.image || p.image_url || "");

  const sellerId = safeStr(p.sellerId || p.seller_id || "s_1");
  const sellerName = safeStr(p.sellerName || p.seller_name || "IMOR Seller");
  const status = safeStr(p.status || "active");

  return {
    title,
    price,
    category: catalogKey,
    unit,

    image_url: image || null,
    description: desc || null,

    seller_id: sellerId,
    seller_name: sellerName,
    status,

    region: region || null,
    catalog_key: catalogKey || null,
    min_qty: minQty,
    delivery,
    phone: phone || null,
    telegram: telegram || null,
  };
}

/* =========================
   Client-side filtering/pagination
========================= */
function applyFilters(items, filters = {}) {
  const f = filters || {};
  let out = Array.isArray(items) ? [...items] : [];

  if (f.q) {
    const q = safeStr(f.q).toLowerCase();
    out = out.filter((p) => {
      const hay = `${p.title || ""} ${p.desc || ""} ${p.catalogKey || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }

  if (f.sellerId) out = out.filter((p) => safeStr(p.sellerId) === safeStr(f.sellerId));
  if (f.status) out = out.filter((p) => safeStr(p.status) === safeStr(f.status));
  if (f.region) out = out.filter((p) => safeStr(p.region) === safeStr(f.region));
  if (f.catalogKey) out = out.filter((p) => safeStr(p.catalogKey) === safeStr(f.catalogKey));

  const min = f.minPrice !== undefined && f.minPrice !== "" ? safeNum(f.minPrice, null) : null;
  const max = f.maxPrice !== undefined && f.maxPrice !== "" ? safeNum(f.maxPrice, null) : null;
  if (min != null) out = out.filter((p) => safeNum(p.price, 0) >= min);
  if (max != null) out = out.filter((p) => safeNum(p.price, 0) <= max);

  if (typeof f.delivery === "boolean") out = out.filter((p) => Boolean(p.delivery) === f.delivery);

  if (f.sort === "price_asc") out.sort((a, b) => safeNum(a.price) - safeNum(b.price));
  else if (f.sort === "price_desc") out.sort((a, b) => safeNum(b.price) - safeNum(a.price));
  else out.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

  const page = safeNum(f.page, 1);
  const limit = safeNum(f.limit, 12);
  const p = page > 0 ? page : 1;
  const l = limit > 0 ? limit : 12;

  const total = out.length;
  const start = (p - 1) * l;
  const paged = out.slice(start, start + l);

  return { items: paged, total, page: p, limit: l };
}

/* =========================
   API calls
========================= */

export async function getProducts(filters = {}) {
  const { data } = await http.get("/products");
  const uiItems = Array.isArray(data) ? data.map(fromDb).filter(Boolean) : [];
  return applyFilters(uiItems, filters);
}

export async function getProductById(id) {
  const pid = safeNum(id, null);
  if (!pid) return null;

  const { data } = await http.get(`/products/${pid}`);
  return fromDb(data);
}

export async function createProduct(payload) {
  const dbPayload = toDbPayload(payload);

  if (!dbPayload.title || dbPayload.title.length < 2) {
    throw new Error("Mahsulot nomi (title) noto‘g‘ri.");
  }
  if (!dbPayload.category) {
    throw new Error("Katalog tanlanmagan (category/catalogKey bo‘sh).");
  }

  const { data } = await http.post("/products", dbPayload);
  return fromDb(data);
}

export async function updateProduct(id, payload) {
  const pid = safeNum(id, null);
  if (!pid) throw new Error("Update uchun id noto‘g‘ri.");

  const dbPayload = toDbPayload(payload);

  if (!dbPayload.title || dbPayload.title.length < 2) {
    throw new Error("Mahsulot nomi (title) noto‘g‘ri.");
  }
  if (!dbPayload.category) {
    throw new Error("Katalog tanlanmagan (category/catalogKey bo‘sh).");
  }

  const { data } = await http.put(`/products/${pid}`, dbPayload);
  return fromDb(data);
}

export async function deleteProduct(id) {
  const pid = safeNum(id, null);
  if (!pid) throw new Error("Delete uchun id noto‘g‘ri.");

  const { data } = await http.delete(`/products/${pid}`);
  return data;
}

export async function getSellerProducts(sellerId, filters = {}) {
  return getProducts({ ...filters, sellerId });
}
