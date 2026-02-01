import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./Navbar.css";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { cartCount } = useCart();

  // Language
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("UZ");

  const isCatalog = useMemo(
    () => location.pathname.startsWith("/catalog"),
    [location.pathname]
  );

  const isSeller = useMemo(
    () => location.pathname.startsWith("/seller"),
    [location.pathname]
  );

  const isAbout = useMemo(
    () => location.pathname.startsWith("/about"),
    [location.pathname]
  );

  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  // outside click: lang close
  useEffect(() => {
    const onDoc = (e) => {
      const t = e.target;
      if (!t?.closest?.(".nav-lang")) setLangOpen(false);
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
    // keyin i18n ulash mumkin (localStorage/context)
  };

  const closeMobile = () => setMenuOpen(false);

  return (
    <header className="nav">
      <div className="nav-shell">
        {/* ===== ROW 1 ===== */}
        <div className="nav-row nav-row-top">
          {/* Logo */}
          <Link to="/" className="brand">
            <span className="brand-mark">
              <ion-icon name="cube-outline"></ion-icon>
            </span>
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
              placeholder="G‘isht, sement, armatura..."
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
                aria-label="Til tanlash"
              >
                <ion-icon name="language-outline"></ion-icon>
                <span className="nav-lang-code">{lang}</span>
                <ion-icon className="nav-lang-chev" name="chevron-down-outline"></ion-icon>
              </button>

              <div className="nav-lang-menu" role="menu" aria-label="Languages">
                <button
                  type="button"
                  className="nav-lang-item"
                  onClick={() => onPickLang("UZ")}
                >
                  O‘zbekcha <small>UZ</small>
                </button>
                <button
                  type="button"
                  className="nav-lang-item"
                  onClick={() => onPickLang("RU")}
                >
                  Русский <small>RU</small>
                </button>
                <button
                  type="button"
                  className="nav-lang-item"
                  onClick={() => onPickLang("EN")}
                >
                  English <small>EN</small>
                </button>
              </div>
            </div>

            {/* Desktop login (mobileda css yashiradi) */}
            <NavLink to="/login" className="nav-btn ghost">
              <ion-icon name="log-in-outline"></ion-icon>
              Kirish
            </NavLink>

            {/* Cart */}
            <Link to="/cart" className="nav-cart" aria-label="Korzina">
              <ion-icon name="cart-outline"></ion-icon>
              {cartCount > 0 && (
                <span className="nav-cart-badge">{cartCount}</span>
              )}
            </Link>

            {/* Burger */}
            <button
              className="nav-burger"
              onClick={() => setMenuOpen((p) => !p)}
              type="button"
              aria-label="Menu"
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
              Katalog
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive || isAbout ? "nav-link active" : "nav-link"
              }
            >
              <ion-icon name="information-circle-outline"></ion-icon>
              IMOR haqida
            </NavLink>

            <NavLink
              to="/seller/products"
              className={({ isActive }) =>
                isActive || isSeller ? "nav-link active" : "nav-link"
              }
            >
              <ion-icon name="briefcase-outline"></ion-icon>
              Sotuvchi paneli
            </NavLink>
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
          {/* ✅ Close row (≤430px da X chiqadi) */}
          <div className="nav-mobile-head">
            <div className="nav-mobile-title">Menyu</div>
            <button
              type="button"
              className="nav-mobile-close"
              onClick={closeMobile}
              aria-label="Yopish"
            >
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>

          {/* ✅ Mobile search (ezilmaydi, button kabi) */}
          <form className="nav-search mobile" onSubmit={onSubmit}>
            <span className="nav-search-icon">
              <ion-icon name="search-outline"></ion-icon>
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="nav-search-input"
              placeholder="Qidiruv..."
            />
            <button className="nav-search-btn" type="submit" aria-label="Search">
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </button>
          </form>

          <NavLink to="/catalog" className="nav-mobile-link" onClick={closeMobile}>
            <ion-icon name="grid-outline"></ion-icon>
            Katalog
          </NavLink>

          <NavLink to="/about" className="nav-mobile-link" onClick={closeMobile}>
            <ion-icon name="information-circle-outline"></ion-icon>
            IMOR haqida
          </NavLink>

          <NavLink to="/seller/products" className="nav-mobile-link" onClick={closeMobile}>
            <ion-icon name="briefcase-outline"></ion-icon>
            Sotuvchi paneli
          </NavLink>

          {/* ❌ E’lon joylash olib tashlandi (mobileda ham yo‘q) */}

          <NavLink to="/login" className="nav-mobile-link" onClick={closeMobile}>
            <ion-icon name="log-in-outline"></ion-icon>
            Kirish
          </NavLink>

          <NavLink to="/cart" className="nav-mobile-link" onClick={closeMobile}>
            <ion-icon name="cart-outline"></ion-icon>
            Korzina
            {cartCount > 0 && (
              <span style={{ marginLeft: 8, fontWeight: 900 }}>
                ({cartCount})
              </span>
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
            Til: {lang} (bosib almashtir)
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
