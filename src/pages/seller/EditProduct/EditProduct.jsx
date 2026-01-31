import "./EditProduct.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATALOG_TREE } from "../../Catalog/catalogData";
import { getProductById, updateProduct } from "../../../api/products.api";
import ImageUploader from "../../../components/common/ImageUploader";

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

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams(); // product id (p_...)

  const options = useMemo(() => buildFlatLeafOptions(CATALOG_TREE), []);
  const [loading, setLoading] = useState(true);
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

  // ✅ Real image url/base64
  const [image, setImage] = useState("");

  // preview
  const selected = useMemo(() => options.find((o) => o.key === catalogKey) || null, [options, catalogKey]);
  const shownTitle = title.trim() || selected?.title || "Mahsulot";
  const normalizedPhone = useMemo(() => normalizePhoneUZ(phone), [phone]);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const p = await getProductById(id);
      if (!p) {
        setErr("Mahsulot topilmadi.");
        setLoading(false);
        showToast("err", "Xatolik", "Mahsulot topilmadi.");
        return;
      }

      setTitle(p.title || "");
      setCatalogKey(p.catalogKey || options?.[0]?.key || "");
      setRegion(p.region || "Toshkent");
      setUnit(p.unit || "dona");
      setPrice(String(p.price || ""));
      setMinQty(String(p.minQty || 1));
      setDelivery(Boolean(p.delivery));
      setPhone(p.phone || "+998 ");
      setTelegram(p.telegram ? `@${String(p.telegram).replace("@", "")}` : "@");
      setDesc(p.desc || "");
      setImage(p.image || "");
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.message ||
        "Yuklashda xatolik.";
      setErr(String(msg));
      showToast("err", "Xatolik", String(msg));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

    try {
      setSaving(true);

      const payload = {
        title: t,
        catalogKey,
        region,
        unit,
        price: p,
        minQty: mq,
        delivery,
        phone: ph,
        telegram: tg,
        desc: desc.trim(),
        image: image || selected?.img || "",
        sellerId: "s_1",
        sellerName: "QRS Seller",
        status: "active",
      };

      const updated = await updateProduct(id, payload);
      if (!updated) {
        setErr("Yangilash muvaffaqiyatsiz: mahsulot topilmadi.");
        showToast("err", "Xatolik", "Yangilash muvaffaqiyatsiz: mahsulot topilmadi.");
        return;
      }

      showToast("ok", "Tayyor!", "Mahsulot muvaffaqiyatli yangilandi.");
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

  if (loading) {
    return (
      <div className="ep-wrap">
        <div className="ep-container">
          <div className="ep-loading">Yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ep-wrap">
      {/* ✅ Toast */}
      {toast.open ? (
        <div className="ep-toastWrap">
          <div className={`ep-toast ${toast.type}`}>
            <div className="ep-toastTop">
              <div className="ep-toastTitle">{toast.title}</div>
              <button className="ep-toastBtn" type="button" onClick={() => setToast((t) => ({ ...t, open: false }))}>
                Yopish
              </button>
            </div>
            <div className="ep-toastMsg">{toast.msg}</div>
          </div>
        </div>
      ) : null}

      <div className="ep-container">
        <div className="ep-head">
          <button className="ep-back" type="button" onClick={() => navigate(-1)}>
            ← Orqaga
          </button>

          <div className="ep-headText">
            <div className="ep-badge">
              <span className="ep-dot" /> Seller • Edit Product
            </div>
            <h1 className="ep-title">Mahsulotni tahrirlash</h1>
            <p className="ep-sub">ID: {id}</p>
          </div>
        </div>

        <div className="ep-grid">
          {/* FORM */}
          <div className="ep-card">
            <form className="ep-form" onSubmit={onSubmit}>
              <div className="ep-fields">
                <label className="ep-field">
                  <span className="ep-label">Katalog (tur)</span>
                  <select className="ep-input" value={catalogKey} onChange={(e) => setCatalogKey(e.target.value)}>
                    {options.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.path}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="ep-field">
                  <span className="ep-label">Mahsulot nomi</span>
                  <input className="ep-input" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>

                <div className="ep-row2">
                  <label className="ep-field">
                    <span className="ep-label">Hudud</span>
                    <select className="ep-input" value={region} onChange={(e) => setRegion(e.target.value)}>
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

                  <label className="ep-field">
                    <span className="ep-label">O‘lchov birligi</span>
                    <select className="ep-input" value={unit} onChange={(e) => setUnit(e.target.value)}>
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

                <div className="ep-row2">
                  <label className="ep-field">
                    <span className="ep-label">Narx (so‘m)</span>
                    <input
                      className="ep-input"
                      value={price}
                      onChange={(e) => setPrice(onlyDigits(e.target.value))}
                      inputMode="numeric"
                    />
                    <span className="ep-hint">{price ? `${formatUZS(price)} so‘m` : "—"}</span>
                  </label>

                  <label className="ep-field">
                    <span className="ep-label">Minimal miqdor</span>
                    <input
                      className="ep-input"
                      value={minQty}
                      onChange={(e) => setMinQty(onlyDigits(e.target.value))}
                      inputMode="numeric"
                    />
                  </label>
                </div>

                <label className="ep-toggle">
                  <input type="checkbox" checked={delivery} onChange={(e) => setDelivery(e.target.checked)} />
                  <span>Yetkazib berish bor</span>
                </label>

                <div className="ep-row2">
                  <label className="ep-field">
                    <span className="ep-label">Telefon</span>
                    <input
                      className="ep-input"
                      value={normalizedPhone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => setPhone(normalizePhoneUZ(phone))}
                      inputMode="numeric"
                      autoComplete="tel"
                    />
                  </label>

                  <label className="ep-field">
                    <span className="ep-label">Telegram (ixtiyoriy)</span>
                    <input
                      className="ep-input"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="@username"
                    />
                    <span className="ep-hint">Masalan: @weber_uz</span>
                  </label>
                </div>

                {/* ✅ IMAGE UPLOADER */}
                <ImageUploader label="Mahsulot rasmi" value={image} onChange={setImage} />

                <label className="ep-field">
                  <span className="ep-label">Tavsif</span>
                  <textarea className="ep-textarea" value={desc} onChange={(e) => setDesc(e.target.value)} />
                  <span className="ep-hint">Kamida 10 ta belgi.</span>
                </label>
              </div>

              {err ? (
                <div className="ep-error" role="alert">
                  <ion-icon name="alert-circle-outline" />
                  <span>{err}</span>
                </div>
              ) : null}

              <div className="ep-actions">
                <button className="ep-btn ghost" type="button" onClick={() => navigate(-1)} disabled={saving}>
                  Bekor qilish
                </button>
                <button className="ep-btn" type="submit" disabled={saving}>
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>

          {/* PREVIEW */}
          <div className="ep-side">
            <div className="ep-preview">
              <div className="ep-previewTop">
                <div className="ep-wdots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="ep-previewTitle">Preview</div>
              </div>

              <div className="ep-previewMedia">
                {image || selected?.img ? (
                  <img src={image || selected?.img} alt="preview" />
                ) : (
                  <div className="ep-noimg">
                    <ion-icon name="cube-outline" />
                    <span>Rasm yo‘q</span>
                  </div>
                )}
              </div>

              <div className="ep-previewBody">
                <div className="ep-chip">{selected?.path || "Katalog"}</div>
                <div className="ep-previewName">{shownTitle}</div>

                <div className="ep-previewPrice">
                  {price ? `${formatUZS(price)} so‘m` : "Narx yo‘q"}{" "}
                  <span className="ep-previewUnit">{unit ? `/ ${unit}` : ""}</span>
                </div>

                <div className="ep-previewMeta">
                  <span className="ep-metaItem">
                    <b>Hudud:</b> {region}
                  </span>
                  <span className="ep-metaItem">
                    <b>Min:</b> {minQty || 1}
                  </span>
                  <span className="ep-metaItem">
                    <b>Delivery:</b> {delivery ? "Bor" : "Yo‘q"}
                  </span>
                </div>

                <div className="ep-previewDesc">{desc?.trim() ? desc.trim() : "Tavsif yo‘q."}</div>
              </div>
            </div>

            <div className="ep-mini">
              <h3>Tip</h3>
              <ul>
                <li>Narxni raqam bilan kiriting</li>
                <li>Telefonni to‘g‘ri formatda saqlang</li>
                <li>Tavsifni aniq va qisqa yozing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
