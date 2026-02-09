import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./Navbar.css";
import { useCart } from "../../context/CartContext";
import Logo from "../imoruzicon.png";

// ✅ i18n
import { useTranslation } from "react-i18next";

/* ✅ Seller access: local/session storage dan o‘qiymiz */
function readAuth() {
  try {
    const raw =
      localStorage.getItem("qrs_auth") || sessionStorage.getItem("qrs_auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { cartCount } = useCart();

  // ✅ i18n
  const { t, i18n } = useTranslation();

  // Language
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("UZ");

  // ✅ lang mapping
  const LANG_LABEL_TO_CODE = useMemo(
    () => ({ UZ: "uz", RU: "ru", EN: "en" }),
    []
  );
  const LANG_CODE_TO_LABEL = useMemo(
    () => ({ uz: "UZ", ru: "RU", en: "EN" }),
    []
  );

  const isCatalog = useMemo(
    () => location.pathname.startsWith("/catalog"),
    [location.pathname]
  );

  const isSellerPath = useMemo(
    () => location.pathname.startsWith("/seller"),
    [location.pathname]
  );

  const isAbout = useMemo(
    () => location.pathname.startsWith("/about"),
    [location.pathname]
  );

  /* ✅ Faqat seller login bo‘lsa seller panel ko‘rinadi */
  const isSellerAuthed = useMemo(() => {
    const auth = readAuth();
    return !!auth?.user?.isSeller || auth?.user?.role === "seller";
  }, [location.pathname]); // login/logoutdan keyin refresh bo‘lishi uchun

  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  // ✅ init lang from localStorage / i18n
  useEffect(() => {
    try {
      const saved = (localStorage.getItem("imor_lang") || "").toLowerCase();
      const fromI18n = String(i18n.language || "").toLowerCase();
      const code = saved || fromI18n || "uz";
      const safeCode = ["uz", "ru", "en"].includes(code) ? code : "uz";

      // set UI label
      setLang(LANG_CODE_TO_LABEL[safeCode] || "UZ");

      // sync i18n
      if (i18n.language !== safeCode) i18n.changeLanguage(safeCode);

      // html lang
      document.documentElement.lang = safeCode;
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep html lang in sync
  useEffect(() => {
    const code = String(i18n.language || "uz").toLowerCase();
    document.documentElement.lang = code;
  }, [i18n.language]);

  // outside click: lang close
  useEffect(() => {
    const onDoc = (e) => {
      const tEl = e.target;
      if (!tEl?.closest?.(".nav-lang")) setLangOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // ESC closes mobile menu + lang
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setLangOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!q.trim()) {
      navigate("/catalog");
      return;
    }
    navigate(`/catalog?q=${encodeURIComponent(q.trim())}`);
    setMenuOpen(false);
  };

  const onPickLang = (next) => {
    setLang(next);
    setLangOpen(false);

    // ✅ i18n ulash (localStorage + changeLanguage)
    try {
      const code = LANG_LABEL_TO_CODE[next] || "uz";
      i18n.changeLanguage(code);
      localStorage.setItem("imor_lang", code);
      document.documentElement.lang = code;
    } catch {}
  };

  const closeMobile = () => setMenuOpen(false);

  const onLogout = () => {
    try {
      localStorage.removeItem("qrs_auth");
      sessionStorage.removeItem("qrs_auth");
      sessionStorage.removeItem("qrs_redirect");
    } catch {}
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="nav-shell">
        {/* ===== ROW 1 ===== */}
        <div className="nav-row nav-row-top">
          {/* Logo */}
          <Link to="/" className="brand">
            <img
              src={Logo}
              alt="IMOR.UZ Logo"
              style={{ width: "30px", height: "30px" }}
            />
            <span className="brand-text">
              IMOR<span className="brand-accent">.UZ</span>
            </span>
          </Link>

          {/* Search (desktop) */}
          <form className="nav-search" onSubmit={onSubmit}>
            <span className="nav-search-icon">
              <ion-icon name="search-outline"></ion-icon>
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="nav-search-input"
              placeholder={t("nav.searchPlaceholder", "G‘isht, sement, armatura...")}
            />
            <button className="nav-search-btn" type="submit" aria-label="Search">
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </button>
          </form>

          {/* Right actions */}

          <div className="nav-right">
            {/* ✅ Language (mobile ham ko‘rinadi) */}
            <div className={langOpen ? "nav-lang open" : "nav-lang"}>
              <button
                type="button"
                className="nav-lang-btn"
                onClick={() => setLangOpen((p) => !p)}
                aria-label={t("nav.languageAria", "Til tanlash")}
              >
                <ion-icon name="language-outline"></ion-icon>
                <span className="nav-lang-code">{lang}</span>
                <ion-icon
                  className="nav-lang-chev"
                  name="chevron-down-outline"
                ></ion-icon>
              </button>

              <div className="nav-lang-menu" role="menu" aria-label="Languages">
                <button
                  type="button"
                  className="nav-lang-item"
                  onClick={() => onPickLang("UZ")}
                >
                  {t("lang.uz", "O‘zbekcha")} <small>UZ</small>
                </button>
                <button
                  type="button"
                  className="nav-lang-item"
                  onClick={() => onPickLang("RU")}
                >
                  {t("lang.ru", "Русский")} <small>RU</small>
                </button>
                <button
                  type="button"
                  className="nav-lang-item"
                  onClick={() => onPickLang("EN")}
                >
                  {t("lang.en", "English")} <small>EN</small>
                </button>
              </div>
            </div>

            {/* ✅ Login / Logout */}
            {!isSellerAuthed ? (
              <NavLink to="/login" className="nav-btn ghost">
                <ion-icon name="log-in-outline"></ion-icon>
                {t("nav.login", "Kirish")}
              </NavLink>
            ) : (
              <button type="button" className="nav-btn ghost" onClick={onLogout}>
                <ion-icon name="log-out-outline"></ion-icon>
                {t("nav.logout", "Chiqish")}
              </button>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="nav-cart"
              aria-label={t("nav.cartAria", "Korzina")}
            >
              <ion-icon name="cart-outline"></ion-icon>
              {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
            </Link>

            {/* Burger */}
            <button
              className="nav-burger"
              onClick={() => setMenuOpen((p) => !p)}
              type="button"
              aria-label={t("nav.menuAria", "Menu")}
            >
              <ion-icon name="menu-outline"></ion-icon>
            </button>
          </div>
        </div>

        {/* ===== ROW 2 (desktop sub-links) ===== */}
        <div className="nav-row nav-row-sub">
          <nav className="nav-links">
            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                isActive || isCatalog ? "nav-link active" : "nav-link"
              }
            >
              <ion-icon name="grid-outline"></ion-icon>
              {t("nav.catalog", "Katalog")}
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive || isAbout ? "nav-link active" : "nav-link"
              }
            >
              <ion-icon name="information-circle-outline"></ion-icon>
              {t("nav.about", "IMOR haqida")}
            </NavLink>

            {/* ✅ Seller link: faqat seller login bo‘lsa */}
            {isSellerAuthed && (
              <NavLink
                to="/seller/products"
                className={({ isActive }) =>
                  isActive || isSellerPath ? "nav-link active" : "nav-link"
                }
              >
                <ion-icon name="briefcase-outline"></ion-icon>
                {t("nav.sellerPanel", "Sotuvchi paneli")}
              </NavLink>
            )}
          </nav>
        </div>
      </div>

      {/* ✅ Mobile overlay: qolgan joyni bossang ham yopiladi */}
      <div
        className={menuOpen ? "nav-mobile open" : "nav-mobile"}
        onClick={closeMobile}
        role="presentation"
      >
        <div
          className="nav-mobile-inner"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Mobile menu"
        >
          {/* ✅ Close row */}
          <div className="nav-mobile-head">
            <div className="nav-mobile-title">{t("nav.menuTitle", "Menyu")}</div>
            <button
              type="button"
              className="nav-mobile-close"
              onClick={closeMobile}
              aria-label={t("nav.closeAria", "Yopish")}
            >
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>

          {/* ✅ Mobile search */}
          <form className="nav-search mobile" onSubmit={onSubmit}>
            <span className="nav-search-icon">
              <ion-icon name="search-outline"></ion-icon>
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="nav-search-input"
              placeholder={t("nav.searchPlaceholderMobile", "Qidiruv...")}
            />
            <button className="nav-search-btn" type="submit" aria-label="Search">
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </button>
          </form>

          <NavLink to="/catalog" className="nav-mobile-link" onClick={closeMobile}>
            <ion-icon name="grid-outline"></ion-icon>
            {t("nav.catalog", "Katalog")}
          </NavLink>

          <NavLink to="/about" className="nav-mobile-link" onClick={closeMobile}>
            <ion-icon name="information-circle-outline"></ion-icon>
            {t("nav.about", "IMOR haqida")}
          </NavLink>

          {/* ✅ Seller link mobile: faqat seller login bo‘lsa */}
          {isSellerAuthed && (
            <NavLink
              to="/seller/products"
              className="nav-mobile-link"
              onClick={closeMobile}
            >
              <ion-icon name="briefcase-outline"></ion-icon>
              {t("nav.sellerPanel", "Sotuvchi paneli")}
            </NavLink>
          )}

          {/* ✅ Login/Logout mobile */}
          {!isSellerAuthed ? (
            <NavLink to="/login" className="nav-mobile-link" onClick={closeMobile}>
              <ion-icon name="log-in-outline"></ion-icon>
              {t("nav.login", "Kirish")}
            </NavLink>
          ) : (
            <button
              type="button"
              className="nav-mobile-link nav-mobile-logout"
              onClick={() => {
                closeMobile();
                onLogout();
              }}
            >
              <ion-icon name="log-out-outline"></ion-icon>
              {t("nav.logout", "Chiqish")}
            </button>
          )}

          <NavLink to="/cart" className="nav-mobile-link" onClick={closeMobile}>
            <ion-icon name="cart-outline"></ion-icon>
            {t("nav.cart", "Korzina")}
            {cartCount > 0 && (
              <span style={{ marginLeft: 8, fontWeight: 900 }}>({cartCount})</span>
            )}
          </NavLink>

          {/* Mobile language quick switch (optional) */}
          <button
            type="button"
            className="nav-mobile-link nav-mobile-lang"
            onClick={() =>
              onPickLang(lang === "UZ" ? "RU" : lang === "RU" ? "EN" : "UZ")
            }
          >
            <ion-icon name="language-outline"></ion-icon>
            {t("nav.langQuick", "Til")}: {lang} ({t("nav.tapToSwitch", "bosib almashtir")})
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
