// src/config/env.js

// ✅ Vite env faqat VITE_ prefiks bilan o‘qiydi
const RAW = import.meta.env.VITE_API_URL;

// ✅ normalize: bo‘sh joy / oxiridagi slash ni olib tashlaymiz
export const API_URL = String(RAW || "").trim().replace(/\/+$/, "");

// (ixtiyoriy) debug: env bo‘sh bo‘lsa ogohlantir
if (!API_URL) {
  console.warn(
    "[env] VITE_API_URL topilmadi. Frontend .env ga VITE_API_URL yozing va dev serverni restart qiling."
  );
}

/**
 * Backend’dan keladigan relative path’larni (masalan: "/uploads/x.jpg")
 * production’da to‘g‘ri URLga aylantiradi.
 */
export function resolveBackendUrl(url) {
  const u = String(url || "").trim();
  if (!u) return "";

  // already absolute
  if (/^https?:\/\//i.test(u)) return u;

  // relative from backend
  if (u.startsWith("/")) return `${API_URL}${u}`;

  // fallback
  return `${API_URL}/${u}`;
}
