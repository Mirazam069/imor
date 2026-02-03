import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const SELLER_PHONE = "+998971566805";
const SELLER_PASSWORD = "12345wwwq";

function normalizePhone(p) {
  return String(p || "").replace(/[^\d+]/g, "");
}

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "+998",
    password: "",
    remember: true,
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "ok", text: "" });

  const showToast = (text, type = "ok") => {
    setToast({ open: true, type, text });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(
      () => setToast({ open: false, type: "ok", text: "" }),
      2400
    );
  };

  const onChange = (key) => (e) => {
    const v = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [key]: v }));
  };

  const validate = () => {
    const p = normalizePhone(form.phone);
    if (!p.trim() || p.trim().length < 7) return "Telefon raqam kiriting";
    if (!form.password.trim()) return "Parol kiriting";
    return "";
  };

  const onLogin = async () => {
    const err = validate();
    if (err) return showToast(err, "bad");

    setLoading(true);
    try {
      const p = normalizePhone(form.phone);

      const isSeller = p === SELLER_PHONE && form.password === SELLER_PASSWORD;

      if (!isSeller) {
        showToast("Telefon yoki parol noto‘g‘ri", "bad");
        return;
      }

      const payload = {
        token: `imor_seller_${Date.now()}`,
        user: {
          name: "IMOR Seller",
          phone: SELLER_PHONE,
          role: "seller",
          isSeller: true,
        },
        createdAt: new Date().toISOString(),
      };

      if (form.remember) {
        localStorage.setItem("qrs_auth", JSON.stringify(payload));
      } else {
        sessionStorage.setItem("qrs_auth", JSON.stringify(payload));
      }

      showToast("Kirish muvaffaqiyatli ✅", "ok");
      setTimeout(() => navigate("/seller/products"), 450);
    } catch {
      showToast("Xatolik: qayta urinib ko‘ring", "bad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lx-page">
      <div className="lx-wrap">
        {/* Header */}
        <header className="lx-head">
          <div className="lx-badge">
            <ion-icon name="log-in-outline"></ion-icon>
            <span>Kirish</span>
          </div>

          <h1 className="lx-title">Hisobingizga kiring</h1>
          <p className="lx-sub">Sotuvchi paneli faqat maxsus account orqali ko‘rinadi.</p>

          <div className="lx-links">
            <Link to="/" className="lx-link">
              <ion-icon name="home-outline"></ion-icon>
              <span>Bosh sahifa</span>
            </Link>
            <Link to="/catalog" className="lx-link">
              <ion-icon name="grid-outline"></ion-icon>
              <span>Katalog</span>
            </Link>
          </div>
        </header>

        {/* Center */}
        <main className="lx-center">
          <div className="lx-card">
            <div className="lx-cardTop">
              <div className="lx-cardTitle">
                <ion-icon name="shield-checkmark-outline"></ion-icon>
                <span>Login</span>
              </div>
              <div className="lx-chip">Seller access</div>
            </div>

            <div className="lx-cardBody">
              {/* Phone */}
              <label className="lx-field">
                <span className="lx-label">Telefon</span>
                <div className="lx-inputWrap">
                  <span className="lx-ic">
                    <ion-icon name="call-outline"></ion-icon>
                  </span>
                  <input
                    className="lx-input"
                    value={form.phone}
                    onChange={onChange("phone")}
                    placeholder="+998 97 156 68 05"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="lx-field">
                <span className="lx-label">Parol</span>
                <div className="lx-inputWrap">
                  <span className="lx-ic">
                    <ion-icon name="key-outline"></ion-icon>
                  </span>
                  <input
                    className="lx-input"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={onChange("password")}
                    placeholder="••••••"
                    autoComplete="current-password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onLogin();
                    }}
                  />
                  <button
                    type="button"
                    className="lx-eye"
                    onClick={() => setShowPass((p) => !p)}
                    aria-label="Show password"
                    title={showPass ? "Yashirish" : "Ko‘rsatish"}
                  >
                    <ion-icon name={showPass ? "eye-off-outline" : "eye-outline"}></ion-icon>
                  </button>
                </div>
              </label>

              {/* Row */}
              <div className="lx-row">
                <label className="lx-check">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={onChange("remember")}
                  />
                  <span>Eslab qolish</span>
                </label>

                <button
                  type="button"
                  className="lx-forgot"
                  onClick={() => showToast("Parol tiklash keyin qo‘shiladi", "ok")}
                >
                  Parolni unutdingizmi?
                </button>
              </div>

              {/* Primary button (BU endi 100% ishlaydi) */}
              <button
                type="button"
                className="lx-btnPrimary"
                onClick={onLogin}
                disabled={loading}
              >
                <ion-icon name={loading ? "time-outline" : "log-in-outline"}></ion-icon>
                <span>{loading ? "Kirilmoqda..." : "Kirish"}</span>
              </button>

              <div className="lx-note">
                <ion-icon name="information-circle-outline"></ion-icon>
                <span>Bu sahifa vaqtinchalik faqat admin uchun.</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast */}
      <div className={toast.open ? `lx-toast open ${toast.type}` : "lx-toast"}>
        <div className="lx-toastIc">
          <ion-icon name={toast.type === "ok" ? "checkmark-outline" : "warning-outline"}></ion-icon>
        </div>
        <div className="lx-toastText">{toast.text}</div>
      </div>
    </div>
  );
}

export default Login;
