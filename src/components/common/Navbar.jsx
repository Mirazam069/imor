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

  const isCatalog = useMemo(
    () => location.pathname.startsWith("/catalog"),
    [location.pathname]
  );

  // ✅ NEW: Seller panel active holati
  const isSeller = useMemo(
    () => location.pathname.startsWith("/seller"),
    [location.pathname]
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!q.trim()) {
      navigate("/catalog");
      return;
    }
    navigate(`/catalog?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="nav">
      <div className="nav-shell">
        {/* ===== ROW 1 (2-rasmdagidek: logo + big search + right actions) ===== */}
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

          {/* Search */}
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

          {/* Right actions (2-rasmdagidek o‘ng tomonda) */}
          <div className="nav-right">
            <Link to="/post-ad" className="nav-btn primary">
              <ion-icon name="add-circle-outline"></ion-icon> E'lon joylash
            </Link>

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

        {/* ===== ROW 2 (2-rasmdagidek: sub nav links) ===== */}
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

      {/* Mobile */}
      <div className={menuOpen ? "nav-mobile open" : "nav-mobile"}>
        <div className="nav-mobile-inner">
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

          <NavLink to="/catalog" className="nav-mobile-link">
            <ion-icon name="grid-outline"></ion-icon>
            Katalog
          </NavLink>

          <NavLink to="/seller/products" className="nav-mobile-link">
            <ion-icon name="briefcase-outline"></ion-icon>
            Sotuvchi paneli
          </NavLink>

          <NavLink to="/post-ad" className="nav-mobile-link primary">
            <ion-icon name="add-circle-outline"></ion-icon>
            E’lon joylash
          </NavLink>

          <NavLink to="/login" className="nav-mobile-link">
            <ion-icon name="log-in-outline"></ion-icon>
            Kirish
          </NavLink>

          <NavLink to="/cart" className="nav-mobile-link">
            <ion-icon name="cart-outline"></ion-icon>
            Korzina
            {cartCount > 0 && (
              <span style={{ marginLeft: 8, fontWeight: 900 }}>
                ({cartCount})
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
