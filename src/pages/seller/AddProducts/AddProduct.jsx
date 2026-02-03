import "./AddProduct.css";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATALOG_TREE } from "../../Catalog/catalogData";
import { createProduct } from "../../../api/products.api";
import ImageUploader from "../../../components/common/ImageUploader";
import { API_URL } from "../../../config/env"; // ✅ mavjud

function resolveImageUrl(url) {
  if (!url) return "";
  // ✅ legacy /uploads/... bo‘lsa API_URL bilan yig‘amiz (Renderda ham ishlaydi)
  if (String(url).startsWith("/uploads/")) return `${API_URL}${url}`;
  return url;
}

function onlyDigits(s) {
  return String(s || "").replace(/\D/g, "");
}

function formatUZS(n) {
  const s = String(Math.round(Number(n || 0)));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function normalizePhoneUZ(input) {
  let d = onlyDigits(input);
  if (d.startsWith("998")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  d = d.slice(0, 9);

  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 5);
  const p3 = d.slice(5, 7);
  const p4 = d.slice(7, 9);

  let out = "+998";
  if (p1) out += ` ${p1}`;
  if (p2) out += ` ${p2}`;
  if (p3) out += ` ${p3}`;
  if (p4) out += ` ${p4}`;
  return out.trim();
}

function isValidPhoneUZ(p) {
  const d = onlyDigits(p);
  if (d.startsWith("998")) return d.length === 12;
  return d.length === 9;
}

function buildFlatLeafOptions(tree, out = [], parentTitles = []) {
  for (const n of tree) {
    const nextParents = [...parentTitles, n.title];
    if (n.children?.length) {
      buildFlatLeafOptions(n.children, out, nextParents);
    } else {
      out.push({
        key: n.key,
        title: n.title,
        path: nextParents.join(" / "),
        img: n.img || "",
      });
    }
  }
  return out;
}

function normalizeTelegram(input) {
  const raw = String(input || "").trim();
  if (!raw) return "";
  return raw
    .replace("https://t.me/", "")
    .replace("http://t.me/", "")
    .replace("t.me/", "")
    .replace("@", "")
    .trim();
}

export default function AddProduct() {
  const navigate = useNavigate();

  // ✅ UI uchun placeholder (public/ ichida bo‘lsin)
  const DEFAULT_PLACEHOLDER = "/products/no-photo.jpg";

  const options = useMemo(() => buildFlatLeafOptions(CATALOG_TREE), []);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Toast
  const [toast, setToast] = useState({ open: false, type: "ok", title: "", msg: "" });
  const toastTimerRef = useRef(null);

  function showToast(type, title, msg) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ open: true, type, title, msg });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, open: false }));
    }, 2600);
  }

  // Form state
  const [title, setTitle] = useState("");
  const [catalogKey, setCatalogKey] = useState(options?.[0]?.key || "");
  const [region, setRegion] = useState("Toshkent");
  const [unit, setUnit] = useState("dona");
  const [price, setPrice] = useState("");
  const [minQty, setMinQty] = useState("1");
  const [delivery, setDelivery] = useState(true);
  const [phone, setPhone] = useState("+998 ");
  const [telegram, setTelegram] = useState("@");
  const [desc, setDesc] = useState("");

  // ✅ RASM (faqat sotuvchi yuklagani DB’ga ketadi)
  // Bu yerda image — ideal holatda R2 absolute URL bo‘ladi:
  // https://pub-xxxx.r2.dev/xxxx.jpg
  const [image, setImage] = useState("");

  // preview
  const selected = useMemo(
    () => options.find((o) => o.key === catalogKey) || null,
    [options, catalogKey]
  );

  const shownTitle = title.trim() || selected?.title || "Mahsulot";
  const normalizedPhone = useMemo(() => normalizePhoneUZ(phone), [phone]);

  // ✅ Preview’da: agar sotuvchi rasm qo‘ysa — o‘sha.
  // Aks holda UI’da category rasm yoki placeholder ko‘rsatamiz (LEKIN DB’ga yozilmaydi).
  const previewImage = image || selected?.img || DEFAULT_PLACEHOLDER;

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const t = shownTitle.trim();
    const p = Number(onlyDigits(price));
    const mq = Number(onlyDigits(minQty || "1"));
    const ph = normalizedPhone;
    const tg = normalizeTelegram(telegram);

    if (!catalogKey) return setErr("Katalogdan mahsulot turini tanlang.");
    if (!t || t.length < 2) return setErr("Mahsulot nomi juda qisqa.");
    if (!p || p <= 0) return setErr("Narxni to‘g‘ri kiriting.");
    if (!mq || mq <= 0) return setErr("Minimal miqdor 1 dan katta bo‘lsin.");
    if (!isValidPhoneUZ(ph)) return setErr("Telefon raqam noto‘g‘ri. Masalan: +998 90 123 45 67");
    if (!desc.trim() || desc.trim().length < 10) return setErr("Tavsif kamida 10 ta belgidan iborat bo‘lsin.");

    // ✅ MUHIM: rasm majburiy (faqat sotuvchi panelidan qo‘shilgan rasm chiqishi uchun)
    if (!String(image || "").trim()) {
      return setErr("Mahsulot rasmi majburiy. Iltimos rasm yuklang.");
    }

    try {
      setSaving(true);

      const payload = {
        title: t,
        price: p,
        category: catalogKey,
        unit,

        // ✅ FAQAT sotuvchi yuklagan URL DB’ga saqlanadi (R2 absolute bo‘lishi kerak)
        // ❌ selected?.img / placeholder DB’ga yozilmaydi
        image_url: String(image).trim(),

        description: desc.trim(),

        seller_id: "s_1",
        seller_name: "IMOR Seller",
        status: "active",
        region,
        catalog_key: catalogKey,
        min_qty: mq,
        delivery: Boolean(delivery),
        phone: ph,
        telegram: tg,
      };

      const created = await createProduct(payload);

      if (!created) {
        setErr("Mahsulot qo‘shilmadi. Qayta urinib ko‘ring.");
        showToast("err", "Xatolik", "Mahsulot qo‘shilmadi. Qayta urinib ko‘ring.");
        return;
      }

      showToast("ok", "Tayyor!", "Mahsulot muvaffaqiyatli qo‘shildi.");
      setTimeout(() => navigate("/seller/products"), 650);
    } catch (e2) {
      const msg =
        e2?.response?.data?.detail ||
        e2?.response?.data?.message ||
        e2?.message ||
        "Saqlashda xatolik.";
      setErr(String(msg));
      showToast("err", "Xatolik", String(msg));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ap-wrap">
      {/* ✅ Toast */}
      {toast.open ? (
        <div className="ap-toastWrap">
          <div className={`ap-toast ${toast.type}`}>
            <div className="ap-toastTop">
              <div className="ap-toastTitle">{toast.title}</div>
              <button
                className="ap-toastBtn"
                type="button"
                onClick={() => setToast((t) => ({ ...t, open: false }))}
              >
                Yopish
              </button>
            </div>
            <div className="ap-toastMsg">{toast.msg}</div>
          </div>
        </div>
      ) : null}

      <div className="ap-container">
        <div className="ap-head">
          <button className="ap-back" type="button" onClick={() => navigate(-1)}>
            ← Orqaga
          </button>

          <div className="ap-headText">
            <h1 className="ap-title">Mahsulot qo‘shish</h1>
            <p className="ap-sub">Yangi mahsulot e’lonini joylang</p>
          </div>
        </div>

        <div className="ap-grid">
          {/* FORM */}
          <div className="ap-card">
            <form className="ap-form" onSubmit={onSubmit}>
              <div className="ap-fields">
                <label className="ap-field">
                  <span className="ap-label">Katalog (tur)</span>
                  <select
                    className="ap-input"
                    value={catalogKey}
                    onChange={(e) => setCatalogKey(e.target.value)}
                  >
                    {options.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.path}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="ap-field">
                  <span className="ap-label">Mahsulot nomi</span>
                  <input
                    className="ap-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Armatura A500 12mm"
                  />
                </label>

                <div className="ap-row2">
                  <label className="ap-field">
                    <span className="ap-label">Hudud</span>
                    <select
                      className="ap-input"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="Toshkent">Toshkent</option>
                      <option value="Samarqand">Samarqand</option>
                      <option value="Andijon">Andijon</option>
                      <option value="Farg‘ona">Farg‘ona</option>
                      <option value="Namangan">Namangan</option>
                      <option value="Buxoro">Buxoro</option>
                      <option value="Navoiy">Navoiy</option>
                      <option value="Qashqadaryo">Qashqadaryo</option>
                      <option value="Surxondaryo">Surxondaryo</option>
                      <option value="Xorazm">Xorazm</option>
                      <option value="Qoraqalpog‘iston">Qoraqalpog‘iston</option>
                    </select>
                  </label>

                  <label className="ap-field">
                    <span className="ap-label">O‘lchov birligi</span>
                    <select className="ap-input" value={unit} onChange={(e) => setUnit(e.target.value)}>
                      <option value="dona">dona</option>
                      <option value="kg">kg</option>
                      <option value="qop">qop</option>
                      <option value="metr">metr</option>
                      <option value="m2">m²</option>
                      <option value="m3">m³</option>
                      <option value="tonna">tonna</option>
                    </select>
                  </label>
                </div>

                <div className="ap-row2">
                  <label className="ap-field">
                    <span className="ap-label">Narx (so‘m)</span>
                    <input
                      className="ap-input"
                      value={price}
                      onChange={(e) => setPrice(onlyDigits(e.target.value))}
                      inputMode="numeric"
                      placeholder="Masalan: 10500"
                    />
                    <span className="ap-hint">{price ? `${formatUZS(price)} so‘m` : "—"}</span>
                  </label>

                  <label className="ap-field">
                    <span className="ap-label">Minimal miqdor</span>
                    <input
                      className="ap-input"
                      value={minQty}
                      onChange={(e) => setMinQty(onlyDigits(e.target.value))}
                      inputMode="numeric"
                      placeholder="1"
                    />
                  </label>
                </div>

                <label className="ap-toggle">
                  <input
                    type="checkbox"
                    checked={delivery}
                    onChange={(e) => setDelivery(e.target.checked)}
                  />
                  <span>Yetkazib berish bor</span>
                </label>

                <div className="ap-row2">
                  <label className="ap-field">
                    <span className="ap-label">Telefon</span>
                    <input
                      className="ap-input"
                      value={normalizedPhone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => setPhone(normalizePhoneUZ(phone))}
                      inputMode="numeric"
                      autoComplete="tel"
                    />
                  </label>

                  <label className="ap-field">
                    <span className="ap-label">Telegram (ixtiyoriy)</span>
                    <input
                      className="ap-input"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="@username"
                    />
                    <span className="ap-hint">Masalan: @weber_uz</span>
                  </label>
                </div>

                {/* ✅ IMAGE UPLOADER (R2) */}
                <ImageUploader label="Mahsulot rasmi" value={image} onChange={setImage} />

                <label className="ap-field">
                  <span className="ap-label">Tavsif</span>
                  <textarea
                    className="ap-textarea"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Mahsulot haqida qisqacha yozing..."
                  />
                  <span className="ap-hint">Kamida 10 ta belgi.</span>
                </label>
              </div>

              {err ? (
                <div className="ap-error" role="alert">
                  <ion-icon name="alert-circle-outline" />
                  <span>{err}</span>
                </div>
              ) : null}

              <div className="ap-actions">
                <button className="ap-btn ghost" type="button" onClick={() => navigate(-1)} disabled={saving}>
                  Bekor qilish
                </button>
                <button className="ap-btn" type="submit" disabled={saving}>
                  {saving ? "Joylanmoqda..." : "Mahsulotni joylash"}
                </button>
              </div>
            </form>
          </div>

          {/* PREVIEW */}
          <div className="ap-side">
            <div className="ap-preview">
              <div className="ap-previewTop">
                <div className="ap-wdots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="ap-previewTitle">Preview</div>
              </div>

              <div className="ap-previewMedia">
                {previewImage ? (
                  <img
                    className="ap-previewImg"
                    src={resolveImageUrl(previewImage)}
                    alt="preview"
                  />
                ) : (
                  <div className="ap-noimg">
                    <ion-icon name="cube-outline" />
                    <span>Rasm yo‘q</span>
                  </div>
                )}
              </div>

              <div className="ap-previewBody">
                <div className="ap-chip">{selected?.path || "Katalog"}</div>
                <div className="ap-previewName">{shownTitle}</div>

                <div className="ap-previewPrice">
                  {price ? `${formatUZS(price)} so‘m` : "Narx yo‘q"}{" "}
                  <span className="ap-previewUnit">{unit ? `/ ${unit}` : ""}</span>
                </div>

                <div className="ap-previewMeta">
                  <span className="ap-metaItem">
                    <b>Hudud:</b> {region}
                  </span>
                  <span className="ap-metaItem">
                    <b>Min:</b> {minQty || 1}
                  </span>
                  <span className="ap-metaItem">
                    <b>Delivery:</b> {delivery ? "Bor" : "Yo‘q"}
                  </span>
                </div>

                <div className="ap-previewDesc">
                  {desc?.trim() ? desc.trim() : "Tavsif yo‘q."}
                </div>

                {/* ✅ mini indicator: DB’ga faqat image ketadi */}
                <div className="ap-hint" style={{ marginTop: 10 }}>
                  {image
                    ? "✅ Rasm yuklandi (DB’ga R2 URL saqlanadi)"
                    : "⚠️ Rasm yuklanmagan (submit qilolmaysiz)"}
                </div>
              </div>
            </div>

            <div className="ap-mini">
              <h3>Tip</h3>
              <ul>
                <li>Rasm qo‘ysang e’lon ko‘proq ishonchli ko‘rinadi</li>
                <li>Narxni aniq va raqam bilan yoz</li>
                <li>Tavsifni qisqa va foydali qil</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
