import "./PostAd.css";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatUZS(n) {
  const num = Number(n || 0);
  if (!Number.isFinite(num)) return "0";
  const s = String(Math.round(num));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function makeId() {
  return `ad_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function PostAd() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const categories = useMemo(
    () => [
      { key: "brick", label: "G‘isht" },
      { key: "cement", label: "Sement" },
      { key: "rebar", label: "Armatura" },
      { key: "sand", label: "Qum" },
      { key: "gravel", label: "Shag‘al" },
      { key: "paint", label: "Bo‘yoq" },
      { key: "roof", label: "Tom yopma" },
      { key: "doors", label: "Eshik/Deraza" },
      { key: "tiles", label: "Plitka" },
      { key: "pipes", label: "Truba" },
      { key: "tools", label: "Asboblar" },
      { key: "electric", label: "Elektr" },
      { key: "other", label: "Boshqa" },
    ],
    []
  );

  const regions = useMemo(
    () => [
      "Toshkent",
      "Toshkent vil.",
      "Andijon",
      "Buxoro",
      "Farg‘ona",
      "Jizzax",
      "Xorazm",
      "Namangan",
      "Navoiy",
      "Qashqadaryo",
      "Samarqand",
      "Sirdaryo",
      "Surxondaryo",
      "Qoraqalpog‘iston",
    ],
    []
  );

  const units = useMemo(() => ["dona", "qop", "kg", "metr", "m²", "m³", "tonna"], []);

  const [form, setForm] = useState({
    title: "",
    category: "brick",
    region: "Toshkent",
    district: "",
    price: "",
    unit: "dona",
    phone: "",
    delivery: true,
    description: "",
  });

  const [images, setImages] = useState([]); // {id, file, url}
  const [submitting, setSubmitting] = useState(false);

  const onChange = (key) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [key]: value }));
  };

  const openPicker = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // limit 6 images (demo)
    setImages((prev) => {
      const left = Math.max(0, 6 - prev.length);
      const slice = files.slice(0, left);
      const next = slice.map((file) => ({
        id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      }));
      return [...prev, ...next];
    });

    // reset input so user can pick same file again
    e.target.value = "";
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((x) => x.id !== id);
    });
  };

  const validate = () => {
    const title = form.title.trim();
    if (title.length < 3) return "E’lon nomi kamida 3 ta belgidan iborat bo‘lsin.";
    if (!form.phone.trim()) return "Telefon raqam kiriting.";
    if (!form.price || Number(form.price) <= 0) return "Narxni to‘g‘ri kiriting.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    setSubmitting(true);
    try {
      // Demo: localStoragega saqlaymiz (backend keyin)
      const payload = {
        id: makeId(),
        createdAt: new Date().toISOString(),
        title: form.title.trim(),
        category: form.category,
        region: form.region,
        district: form.district.trim(),
        price: Number(form.price),
        unit: form.unit,
        phone: form.phone.trim(),
        delivery: !!form.delivery,
        description: form.description.trim(),
        // Demo: faqat file nomlari (real upload keyin)
        images: images.map((x) => ({ name: x.file?.name || "image" })),
      };

      const key = "qrs_ads_demo";
      const old = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([payload, ...old]));

      alert("E’lon saqlandi (demo). Katalogga o‘tamiz ✅");
      navigate(`/catalog?category=${encodeURIComponent(form.category)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="postAd">
      <div className="postAd-wrap">
        {/* Header */}
        <div className="postAd-head">
          <div>
            <div className="postAd-badge">
              <ion-icon name="add-circle-outline"></ion-icon>
              E’lon joylash
            </div>
            <h1 className="postAd-title">1 daqiqada e’lon joylang</h1>
            <p className="postAd-sub">
              Rasm + narx + telefon. Qolganini platforma tartiblaydi (hozircha demo).
            </p>
          </div>

          <div className="postAd-mini">
            <div className="mini-top">
              <span className="mini-dot red" />
              <span className="mini-dot yellow" />
              <span className="mini-dot green" />
            </div>
            <div className="mini-body">
              <div className="mini-title">Maslahat</div>
              <div className="mini-text">
                Sarlavhani aniq yozing: <b>“M500 sement, 50kg, Toshkent”</b>. Narxni real
                kiriting — xaridorlar tezroq bog‘lanadi.
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="postAd-grid">
          {/* Left: form */}
          <form className="card" onSubmit={onSubmit}>
            <div className="card-title">
              <ion-icon name="create-outline"></ion-icon>
              E’lon ma’lumotlari
            </div>

            <div className="fields">
              <div className="field">
                <label>E’lon nomi</label>
                <div className="input">
                  <ion-icon name="pricetag-outline"></ion-icon>
                  <input
                    value={form.title}
                    onChange={onChange("title")}
                    placeholder="Masalan: M500 sement (50kg)"
                  />
                </div>
                <div className="hint">3–60 belgi tavsiya qilinadi.</div>
              </div>

              <div className="row">
                <div className="field">
                  <label>Kategoriya</label>
                  <div className="input">
                    <ion-icon name="grid-outline"></ion-icon>
                    <select value={form.category} onChange={onChange("category")}>
                      {categories.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Hudud</label>
                  <div className="input">
                    <ion-icon name="location-outline"></ion-icon>
                    <select value={form.region} onChange={onChange("region")}>
                      {regions.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <label>Tuman (ixtiyoriy)</label>
                <div className="input">
                  <ion-icon name="map-outline"></ion-icon>
                  <input
                    value={form.district}
                    onChange={onChange("district")}
                    placeholder="Masalan: Chilonzor"
                  />
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label>Narx</label>
                  <div className="input">
                    <ion-icon name="cash-outline"></ion-icon>
                    <input
                      value={form.price}
                      onChange={onChange("price")}
                      placeholder="Masalan: 79000"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="hint">Ko‘rinishi: {formatUZS(form.price)} so‘m</div>
                </div>

                <div className="field">
                  <label>Birlik</label>
                  <div className="input">
                    <ion-icon name="cube-outline"></ion-icon>
                    <select value={form.unit} onChange={onChange("unit")}>
                      {units.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <label>Telefon</label>
                <div className="input">
                  <ion-icon name="call-outline"></ion-icon>
                  <input
                    value={form.phone}
                    onChange={onChange("phone")}
                    placeholder="+998 90 123 45 67"
                  />
                </div>
                <div className="hint">Xaridorlar shu raqamga bog‘lanadi.</div>
              </div>

              <div className="field">
                <label>Tavsif (ixtiyoriy)</label>
                <div className="textarea">
                  <textarea
                    value={form.description}
                    onChange={onChange("description")}
                    placeholder="Mahsulot holati, yetkazish, chegirma, minimal buyurtma..."
                    rows={5}
                  />
                </div>
              </div>

              <label className="check">
                <input type="checkbox" checked={form.delivery} onChange={onChange("delivery")} />
                <span>Yetkazib berish bor</span>
              </label>
            </div>

            <div className="actions">
              <button className="btnX ghost" type="button" onClick={() => navigate("/catalog")}>
                <ion-icon name="arrow-back-outline"></ion-icon>
                Katalogga qaytish
              </button>

              <button className="btnX primary" type="submit" disabled={submitting}>
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                {submitting ? "Saqlanmoqda..." : "E’lonni saqlash"}
              </button>
            </div>
          </form>

          {/* Right: images */}
          <div className="card">
            <div className="card-title">
              <ion-icon name="images-outline"></ion-icon>
              Rasmlar (demo)
            </div>

            <div className="uploadBox">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onFiles}
                style={{ display: "none" }}
              />

              <div className="uploadTop">
                <div className="uploadText">
                  <div className="uploadH">Rasm qo‘shing</div>
                  <div className="uploadP">6 tagacha rasm. Hozircha faqat preview.</div>
                </div>

                <button className="btnX primary" type="button" onClick={openPicker}>
                  <ion-icon name="add-outline"></ion-icon>
                  Tanlash
                </button>
              </div>

              {images.length === 0 ? (
                <div className="uploadEmpty">
                  <div className="uploadIcon">
                    <ion-icon name="image-outline"></ion-icon>
                  </div>
                  <div className="uploadEmptyT">Hali rasm tanlanmadi</div>
                  <div className="uploadEmptyS">Mahsulot rasmlari e’lonni ishonchli qiladi.</div>
                </div>
              ) : (
                <div className="gallery">
                  {images.map((img) => (
                    <div key={img.id} className="shot">
                      <img src={img.url} alt="preview" />
                      <button
                        type="button"
                        className="shotDel"
                        onClick={() => removeImage(img.id)}
                        title="O‘chirish"
                      >
                        <ion-icon name="close-outline"></ion-icon>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="uploadNote">
                <ion-icon name="information-circle-outline"></ion-icon>
                <span>
                  Backend ulanganida rasm serverga yuklanadi. Hozircha demo rejim.
                </span>
              </div>
            </div>

            <div className="cardFooter">
              <div className="miniLine">
                <span className="pill">
                  <ion-icon name="shield-checkmark-outline"></ion-icon>
                  Tekshirilgan sotuvchi — keyin
                </span>
                <span className="pill">
                  <ion-icon name="flash-outline"></ion-icon>
                  Tez bog‘lanish
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="postAd-bottom">
          <div className="bottomCard">
            <div className="bottomIc">
              <ion-icon name="bulb-outline"></ion-icon>
            </div>
            <div>
              <div className="bottomT">Eng yaxshi natija uchun</div>
              <div className="bottomS">
                Narxni va hududni aniq kiriting, kamida 2 ta rasm qo‘ying, tavsifda
                yetkazish shartlarini yozing.
              </div>
            </div>
          </div>

          <div className="bottomCard">
            <div className="bottomIc">
              <ion-icon name="chatbubbles-outline"></ion-icon>
            </div>
            <div>
              <div className="bottomT">Aloqa</div>
              <div className="bottomS">
                Xaridorlar siz bilan telefon orqali bog‘lanadi. Keyin chat ham qo‘shamiz.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostAd;
