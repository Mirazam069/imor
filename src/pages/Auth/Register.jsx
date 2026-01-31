import "./Register.css";
import { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

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

export default function Register() {
  const navigate = useNavigate();
  const { register, user, loading } = useContext(AuthContext);

  // already logged in
  if (user && !loading) {
    // seller bo‘lsa seller sahifalarga yo‘naltiramiz, bo‘lmasa home
    navigate("/");
  }

  const [role, setRole] = useState("buyer"); // buyer | seller
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(true);

  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const normalizedPhone = useMemo(() => normalizePhoneUZ(phone), [phone]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const name = fullName.trim();
    const ph = normalizedPhone;

    if (!agree) return setErr("Davom etish uchun shartlarga rozilik bering.");
    if (!name || name.length < 2) return setErr("Ism juda qisqa.");
    if (!isValidPhoneUZ(ph)) return setErr("Telefon noto‘g‘ri. Masalan: +998 90 123 45 67");
    if (!password || password.length < 6) return setErr("Parol kamida 6 ta belgidan iborat bo‘lsin.");
    if (password !== confirm) return setErr("Parollar mos kelmadi.");

    try {
      setSaving(true);

      // AuthProvider register(data) bo‘lishi kerak
      const res = await register({
        name,
        phone: ph,
        password,
        role,
      });

      // res bo‘lmasa ham, AuthProvider user/token set qilgan bo‘lishi mumkin
      // seller bo‘lsa seller/products ga, bo‘lmasa homega
      if (role === "seller") navigate("/seller/products");
      else navigate("/");
      return res;
    } catch (e2) {
      const msg =
        e2?.response?.data?.detail ||
        e2?.response?.data?.message ||
        e2?.message ||
        "Ro‘yxatdan o‘tishda xatolik.";
      setErr(String(msg));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rg-wrap">
      <div className="rg-container">
        <div className="rg-card">
          <div className="rg-top">
            <div className="rg-badge">
              <span className="rg-dot" /> QRS • Register
            </div>
            <h1 className="rg-title">Ro‘yxatdan o‘tish</h1>
            <p className="rg-sub">Akkaunt yarating va e’lon joylashni boshlang.</p>
          </div>

          <form className="rg-form" onSubmit={onSubmit}>
            <div className="rg-role">
              <button
                type="button"
                className={`rg-roleBtn ${role === "buyer" ? "active" : ""}`}
                onClick={() => setRole("buyer")}
                disabled={saving}
              >
                Xaridor
              </button>
              <button
                type="button"
                className={`rg-roleBtn ${role === "seller" ? "active" : ""}`}
                onClick={() => setRole("seller")}
                disabled={saving}
              >
                Sotuvchi
              </button>
            </div>

            <label className="rg-field">
              <span className="rg-label">Ism familiya</span>
              <input
                className="rg-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masalan: Mirazam G‘iyosov"
                autoComplete="name"
              />
            </label>

            <label className="rg-field">
              <span className="rg-label">Telefon</span>
              <input
                className="rg-input"
                value={normalizedPhone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                inputMode="numeric"
                autoComplete="tel"
              />
              <span className="rg-hint">Faqat O‘zbekiston raqami.</span>
            </label>

            <div className="rg-row2">
              <label className="rg-field">
                <span className="rg-label">Parol</span>
                <input
                  className="rg-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••"
                  autoComplete="new-password"
                />
              </label>

              <label className="rg-field">
                <span className="rg-label">Parolni takrorlang</span>
                <input
                  className="rg-input"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  type="password"
                  placeholder="••••••"
                  autoComplete="new-password"
                />
              </label>
            </div>

            <label className="rg-check">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>
                Men <b>shartlar</b> va <b>maxfiylik siyosati</b>ga roziman.
              </span>
            </label>

            {err ? (
              <div className="rg-error" role="alert">
                <ion-icon name="alert-circle-outline" />
                <span>{err}</span>
              </div>
            ) : null}

            <button className="rg-btn" type="submit" disabled={saving}>
              {saving ? "Yaratilmoqda..." : "Akkaunt yaratish"}
            </button>

            <div className="rg-bottom">
              Akkauntingiz bormi? <Link to="/login">Kirish</Link>
            </div>
          </form>
        </div>

        <div className="rg-side">
          <div className="rg-sideCard">
            <div className="rg-sideDots">
              <span />
              <span />
              <span />
            </div>
            <h3>QRS’da nimalar qila olasiz?</h3>
            <ul>
              <li>Mahsulot qo‘shish va boshqarish</li>
              <li>Sotuvchi profilini yuritish</li>
              <li>Hudud bo‘yicha xaridor topish</li>
              <li>Telegram/telefon orqali tez aloqa</li>
            </ul>
            <div className="rg-tip">
              <b>Tip:</b> Sotuvchi sifatida ro‘yxatdan o‘tsangiz, darhol “Mahsulotlarim” sahifasiga o‘tasiz.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
