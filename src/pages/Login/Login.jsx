import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

function safeGetRedirect() {
  try {
    const r = sessionStorage.getItem("qrs_redirect");
    return r && r.startsWith("/") ? r : "/catalog";
  } catch {
    return "/catalog";
  }
}

function Login() {
  const navigate = useNavigate();

  const demoUsers = useMemo(
    () => [
      { phone: "+998901112233", password: "123456", role: "buyer", name: "Demo Buyer" },
      { phone: "+998909998877", password: "123456", role: "seller", name: "Demo Seller" },
      { phone: "+998901234567", password: "123456", role: "admin", name: "Demo Admin" },
    ],
    []
  );

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

  const normalizePhone = (p) => String(p || "").replace(/[^\d+]/g, "");

  const validate = () => {
    const p = normalizePhone(form.phone);
    if (!p.trim() || p.trim().length < 7) return "Telefon raqam kiriting";
    if (!form.password.trim()) return "Parol kiriting";
    return "";
  };

  const loginDemo = async () => {
    const err = validate();
    if (err) {
      showToast(err, "bad");
      return;
    }

    setLoading(true);
    try {
      // Demo auth: phone+password match
      const p = normalizePhone(form.phone);
      const user = demoUsers.find((u) => u.phone === p && u.password === form.password);

      if (!user) {
        showToast("Telefon yoki parol noto‘g‘ri", "bad");
        return;
      }

      const token = `demo_${user.role}_${Date.now()}`;
      const payload = {
        token,
        user: {
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
        createdAt: new Date().toISOString(),
      };

      if (form.remember) {
        localStorage.setItem("qrs_auth", JSON.stringify(payload));
      } else {
        sessionStorage.setItem("qrs_auth", JSON.stringify(payload));
      }

      showToast("Kirish muvaffaqiyatli ✅", "ok");

      const redirectTo = safeGetRedirect();
      setTimeout(() => navigate(redirectTo), 550);
    } catch {
      showToast("Xatolik: qayta urinib ko‘ring", "bad");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type) => {
    const u =
      type === "seller"
        ? demoUsers[1]
        : type === "admin"
        ? demoUsers[2]
        : demoUsers[0];

    setForm((p) => ({
      ...p,
      phone: u.phone,
      password: u.password,
    }));
    showToast(`Demo ${u.role} tanlandi`, "ok");
  };

  return (
    <div className="login">
      <div className="login-wrap">
        {/* Header */}
        <div className="login-head">
          <div>
            <div className="login-badge">
              <ion-icon name="log-in-outline"></ion-icon>
              <span>Kirish</span>
            </div>

            <h1 className="login-title">Hisobingizga kiring</h1>
            <p className="login-sub">
              Hozircha demo rejim: login backend ulanmaguncha localStorage/sessionStorage orqali
              ishlaydi.
            </p>
          </div>

          <div className="login-actions">
            <Link to="/" className="btn ghost">
              <ion-icon name="home-outline"></ion-icon>
              Bosh sahifa
            </Link>
            <Link to="/catalog" className="btn ghost">
              <ion-icon name="grid-outline"></ion-icon>
              Katalog
            </Link>
          </div>
        </div>

        <div className="login-grid">
          {/* LEFT: FORM */}
          <div className="login-card">
            <div className="login-card-top">
              <div className="login-card-title">
                <ion-icon name="shield-checkmark-outline"></ion-icon>
                <span>Login</span>
              </div>

              <div className="login-card-note">Demo • MVP</div>
            </div>

            <div className="login-card-body">
              <label className="field">
                <span className="label">Telefon</span>
                <div className="withIcon">
                  <span className="ic">
                    <ion-icon name="call-outline"></ion-icon>
                  </span>
                  <input
                    className="input"
                    value={form.phone}
                    onChange={onChange("phone")}
                    placeholder="+998 90 123 45 67"
                  />
                </div>
              </label>

              <label className="field">
                <span className="label">Parol</span>
                <div className="withIcon">
                  <span className="ic">
                    <ion-icon name="key-outline"></ion-icon>
                  </span>
                  <input
                    className="input"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={onChange("password")}
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    className="eye"
                    onClick={() => setShowPass((p) => !p)}
                    aria-label="Show password"
                    title={showPass ? "Yashirish" : "Ko‘rsatish"}
                  >
                    <ion-icon name={showPass ? "eye-off-outline" : "eye-outline"}></ion-icon>
                  </button>
                </div>
              </label>

              <div className="login-row">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={onChange("remember")}
                  />
                  <span>Eslab qolish</span>
                </label>

                <button
                  type="button"
                  className="linkBtn"
                  onClick={() => showToast("Parol tiklash keyin qo‘shiladi", "ok")}
                >
                  Parolni unutdingizmi?
                </button>
              </div>

              <button className="btn primary full" type="button" onClick={loginDemo} disabled={loading}>
                <ion-icon name={loading ? "time-outline" : "log-in-outline"}></ion-icon>
                {loading ? "Kirilmoqda..." : "Kirish"}
              </button>

              <div className="or">
                <span />
                <div>Demo bilan to‘ldirish</div>
                <span />
              </div>

              <div className="demoRow">
                <button type="button" className="demoBtn" onClick={() => fillDemo("buyer")}>
                  <ion-icon name="person-outline"></ion-icon>
                  Buyer
                </button>
                <button type="button" className="demoBtn" onClick={() => fillDemo("seller")}>
                  <ion-icon name="storefront-outline"></ion-icon>
                  Seller
                </button>
                <button type="button" className="demoBtn" onClick={() => fillDemo("admin")}>
                  <ion-icon name="settings-outline"></ion-icon>
                  Admin
                </button>
              </div>

              <div className="hint">
                <ion-icon name="information-circle-outline"></ion-icon>
                <span>
                  Demo parol: <b>123456</b>. Keyin `auth.api.js` bilan real backend ulanadi.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: QUICK CARD */}
          <aside className="login-side">
            <div className="qs-card">
              <div className="qs-top">
                <span className="qs-dot red" />
                <span className="qs-dot yellow" />
                <span className="qs-dot green" />
              </div>

              <div className="qs-body">
                <h3 className="qs-title">Kirishdan keyin</h3>

                <div className="qs-search">
                  <ion-icon name="flash-outline"></ion-icon>
                  <div className="qs-placeholder">Sotuvchi bo‘lsangiz — e’lon joylaysiz</div>
                </div>

                <div className="qs-chips">
                  <span className="qs-chip">E’lonlar</span>
                  <span className="qs-chip">Profil</span>
                  <span className="qs-chip">Statistika</span>
                  <span className="qs-chip">Sozlamalar</span>
                </div>

                <div className="qs-grid">
                  <div className="qs-item">
                    <div className="qs-k">Tezlik</div>
                    <div className="qs-v">1 daqiqada</div>
                  </div>

                  <div className="qs-item">
                    <div className="qs-k">Aloqa</div>
                    <div className="qs-v">24/7</div>
                  </div>

                  <div className="qs-item">
                    <div className="qs-k">Filtr</div>
                    <div className="qs-v">hudud/narx</div>
                  </div>

                  <div className="qs-item">
                    <div className="qs-k">Maqsad</div>
                    <div className="qs-v">MVP</div>
                  </div>
                </div>

                <div className="qs-note">
                  <ion-icon name="bulb-outline"></ion-icon>
                  <span>Backend ulanmaguncha demo auth bilan UI’ni tugatamiz.</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Toast */}
      <div className={toast.open ? `toastX open ${toast.type}` : "toastX"}>
        <div className="toastX-ic">
          <ion-icon name={toast.type === "ok" ? "checkmark-outline" : "warning-outline"}></ion-icon>
        </div>
        <div className="toastX-text">{toast.text}</div>
      </div>
    </div>
  );
}

export default Login;
