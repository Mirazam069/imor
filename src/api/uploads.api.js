import { http } from "./http";

const MAX_MB = 4;
const MAX_BYTES = MAX_MB * 1024 * 1024;

export async function uploadImage(file) {
  if (!file) throw new Error("Fayl tanlanmadi.");
  if (!file.type?.startsWith("image/")) {
    throw new Error("Faqat rasm fayl yuklang (jpg/png/webp).");
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`Rasm juda katta. ${MAX_MB}MB dan kichik rasm tanlang.`);
  }

  const form = new FormData();
  form.append("file", file);

  const res = await http.post("/upload", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!res?.data?.url) throw new Error("Serverdan rasm URL qaytmadi.");

  return res.data; // { ok: true, url: "/uploads/xxx.jpg" }
}

export async function removeImage() {
  // hozircha backend delete endpoint yo‘q — faqat frontend tozalaydi
  return { ok: true };
}
