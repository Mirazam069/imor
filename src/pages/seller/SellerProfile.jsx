import "./SellerProfile.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSellerById, getSellerProducts, updateSeller } from "../../api/sellers.api";

function onlyDigits(s) {
  return String(s || "").replace(/\D/g, "");
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

function isValidPhoneUZ(phone) {
  const d = onlyDigits(phone);
  if (d.startsWith("998")) return d.length === 12;
  return d.length === 9;
}

function formatUZS(n) {
  const s = String(Math.round(Number(n || 0)));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function SellerProfile() {
  const navigate = useNavigate();
  const { sellerId } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);

  const [edit, setEdit] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [telegram, setTelegram] = useState("@");
  const [region, setRegion] = useState("Toshkent");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");

  const normalizedPhone = useMemo(() => normalizePhoneUZ(phone), [phone]);

  const tgLink = useMemo(() => {
    const tg = String(telegram || "").replace("https://t.me/", "").replace("@", "").trim();
    return tg ? `https://t.me/${tg}` : "";
  }, [telegram]);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const s = await getSellerById(sellerId);
      if (!s) {
        setSeller(null);
        setProducts([]);
        setErr("Sotuvchi topilmadi.");
        setLoading(false);
        return;
      }

      setSeller(s);

      // fill form
      setName(s.name || "");
      setPhone(s.phone || "+998 ");
      setTelegram(s.telegram ? `@${String(s.telegram).replace("@", "")}` : "@");
      setRegion(s.region || "Toshkent");
      setAddress(s.address || "");
      setAbout(s.about || "");

      // products
      const res = await getSellerProducts(sellerId, { limit: 6 });
      const items = res?.items || res || [];
      setProducts(Array.isArray(items) ? items : []);
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.message ||
        "Yuklashda xatolik.";
      setErr(String(msg));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerId]);

  async function onSave() {
    setErr("");
    const n = name.trim();
    const ph = normalizedPhone;
    const tg = String(telegram || "").replace("https://t.me/", "").replace("@", "").trim();

    if (!n || n.length < 2) return setErr("Ism juda qisqa.");
    if (!isValidPhoneUZ(ph)) return setErr("Telefon noto‘g‘ri. Masalan: +998 90 123 45 67");
    if (!region.trim()) return setErr("Hududni tanlang.");
    if (!address.trim() || address.trim().length < 5) return setErr("Manzilni to‘liqroq yozing.");
    if (!about.trim() || about.trim().length < 10) return setErr("About kamida 10 ta belgidan iborat bo‘lsin.");

    try {
      setSaving(true);
      const updated = await updateSeller(sellerId, {
        name: n,
        phone: ph,
        telegram: tg,
        region: region.trim(),
        address: address.trim(),
        about: about.trim(),
      });

      if (!updated) {
        setErr("Saqlash muvaffaqiyatsiz. Sotuvchi topilmadi.");
        return;
      }

      setSeller(updated);
      setEdit(false);
    } catch (e2) {
      const msg =
        e2?.response?.data?.detail ||
        e2?.response?.data?.message ||
        e2?.message ||
        "Saqlashda xatolik.";
      setErr(String(msg));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="sp-wrap">
        <div className="sp-container">
          <div className="sp-loading">Yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="sp-wrap">
        <div className="sp-container">
          <button className="sp-back" onClick={() => navigate(-1)} type="button">
            ← Orqaga
          </button>

          <div className="sp-empty">
            <h1>Sotuvchi topilmadi</h1>
            <p>Seller ID: {sellerId}</p>
            <Link className="sp-btn" to="/catalog">
              Katalogga qaytish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sp-wrap">
      <div className="sp-container">
        <div className="sp-head">
          <button className="sp-back" onClick={() => navigate(-1)} type="button">
            ← Orqaga
          </button>

          <div className="sp-headText">
            <div className="sp-badge">
              <span className="sp-dot" /> Sotuvchi profili
            </div>
            <h1 className="sp-title">{seller.name}</h1>
            <div className="sp-meta">
              <span className="sp-pill">
                <ion-icon name="location-outline"></ion-icon>
                {seller.region || "Hudud yo‘q"}
              </span>
              <span className="sp-pill ghost">
                <ion-icon name="pricetags-outline"></ion-icon>
                ID: {seller.id}
              </span>
              <span className="sp-pill ghost">
                <ion-icon name="time-outline"></ion-icon>
                Yangilandi: {seller.updatedAt || "—"}
              </span>
            </div>
          </div>

          <div className="sp-headActions">
            <Link className="sp-btn ghost" to="/seller/products" title="Mahsulotlarim">
              <ion-icon name="cube-outline"></ion-icon>
              Mahsulotlarim
            </Link>

            {!edit ? (
              <button className="sp-btn" type="button" onClick={() => setEdit(true)}>
                <ion-icon name="create-outline"></ion-icon>
                Tahrirlash
              </button>
            ) : (
              <>
                <button className="sp-btn ghost" type="button" onClick={() => setEdit(false)} disabled={saving}>
                  Bekor
                </button>
                <button className="sp-btn" type="button" onClick={onSave} disabled={saving}>
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="sp-grid">
          {/* LEFT */}
          <div className="sp-card">
            <div className="sp-cardTop">
              <div className="sp-avatar">{(seller.name || "S").slice(0, 1).toUpperCase()}</div>

              <div className="sp-info">
                {!edit ? (
                  <>
                    <div className="sp-name">{seller.name}</div>
                    <div className="sp-sub">{seller.address}</div>
                  </>
                ) : (
                  <>
                    <label className="sp-field">
                      <span className="sp-label">Sotuvchi nomi</span>
                      <input className="sp-input" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>

                    <label className="sp-field">
                      <span className="sp-label">Manzil</span>
                      <input className="sp-input" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="sp-sep" />

            <div className="sp-rows">
              {!edit ? (
                <>
                  <div className="sp-row">
                    <span className="sp-k">Telefon</span>
                    <span className="sp-v">{seller.phone || "—"}</span>
                  </div>
                  <div className="sp-row">
                    <span className="sp-k">Telegram</span>
                    <span className="sp-v">{seller.telegram ? `@${String(seller.telegram).replace("@", "")}` : "—"}</span>
                  </div>
                  <div className="sp-row">
                    <span className="sp-k">Hudud</span>
                    <span className="sp-v">{seller.region || "—"}</span>
                  </div>
                </>
              ) : (
                <>
                  <label className="sp-field">
                    <span className="sp-label">Telefon</span>
                    <input
                      className="sp-input"
                      value={normalizedPhone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="numeric"
                    />
                  </label>

                  <label className="sp-field">
                    <span className="sp-label">Telegram (ixtiyoriy)</span>
                    <input className="sp-input" value={telegram} onChange={(e) => setTelegram(e.target.value)} />
                  </label>

                  <label className="sp-field">
                    <span className="sp-label">Hudud</span>
                    <select className="sp-input" value={region} onChange={(e) => setRegion(e.target.value)}>
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
                </>
              )}
            </div>

            <div className="sp-sep" />

            <div className="sp-about">
              <h3>About</h3>
              {!edit ? (
                <p>{seller.about || "—"}</p>
              ) : (
                <textarea className="sp-textarea" value={about} onChange={(e) => setAbout(e.target.value)} />
              )}
            </div>

            {err ? (
              <div className="sp-error" role="alert">
                <ion-icon name="alert-circle-outline" />
                <span>{err}</span>
              </div>
            ) : null}

            <div className="sp-actions">
              <a className="sp-btn" href={`tel:${seller.phone || ""}`}>
                <ion-icon name="call-outline" />
                Qo‘ng‘iroq
              </a>

              {tgLink ? (
                <a className="sp-btn ghost" href={tgLink} target="_blank" rel="noreferrer">
                  <ion-icon name="paper-plane-outline" />
                  Telegram
                </a>
              ) : (
                <button className="sp-btn ghost" type="button" disabled>
                  <ion-icon name="paper-plane-outline" />
                  Telegram yo‘q
                </button>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="sp-right">
            <div className="sp-mini">
              <div className="sp-miniTop">
                <h3>Mahsulotlar</h3>
                <Link to="/seller/products" className="sp-miniLink">
                  Hammasi →
                </Link>
              </div>

              {products?.length ? (
                <div className="sp-prodGrid">
                  {products.map((p) => (
                    <Link key={p.id} to={`/product/${p.catalogKey || p.id}`} className="sp-prodCard">
                      <div className="sp-prodTop">
                        <div className="sp-prodIcon">
                          <ion-icon name="cube-outline"></ion-icon>
                        </div>
                        <div className="sp-prodTitle">{p.title || "Mahsulot"}</div>
                      </div>

                      <div className="sp-prodMeta">
                        <span className="sp-prodPrice">
                          {p.price ? `${formatUZS(p.price)} so‘m` : "Narx yo‘q"}
                          {p.unit ? <span className="sp-prodUnit"> / {p.unit}</span> : null}
                        </span>
                        <span className="sp-prodRegion">{p.region || "—"}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="sp-emptyMini">
                  <ion-icon name="information-circle-outline"></ion-icon>
                  <span>Hozircha mahsulot yo‘q. “Mahsulotlarim”dan qo‘shing.</span>
                </div>
              )}

              <div className="sp-tip">
                <b>Tip:</b> Profilingizni to‘liq to‘ldirsangiz, xaridorlar ko‘proq ishonadi.
              </div>
            </div>

            <div className="sp-mini white">
              <h3>Xavfsizlik</h3>
              <ul>
                <li>Telefon orqali narxni tasdiqlang</li>
                <li>Yetkazib berish shartlarini aniqlang</li>
                <li>Kelishuvni yozma qiling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
