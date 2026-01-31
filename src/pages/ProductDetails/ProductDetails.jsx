import "./ProductDetails.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CATALOG_TREE } from "../Catalog/catalogData";
import { getProductById } from "../../api/products.api"; // ⚠️ yo'l: senga mos bo'lsa shunday qolsin
import { API_URL } from "../../config/env";

/* Demo narxlar (key bo‘yicha) — Catalog’dagi bilan bir xil */
const PRICE_MAP = {
  brick_red: { price: 1200, unit: "dona" },
  brick_white: { price: 1500, unit: "dona" },
  brick_gazoblok: { price: 18000, unit: "dona" },
  brick_penoblok: { price: 16000, unit: "dona" },
  brick_shamot: { price: 4500, unit: "dona" },
  brick_clinker: { price: 6500, unit: "dona" },

  cement_m400: { price: 69000, unit: "qop" },
  cement_m500: { price: 79000, unit: "qop" },
  cement_bulk: { price: 6500, unit: "kg" },

  rebar_a3: { price: 9800, unit: "kg" },
  rebar_a500: { price: 10500, unit: "kg" },
  wire: { price: 12000, unit: "kg" },

  hand_tools: { price: 35000, unit: "dona" },
  power_tools: { price: 990000, unit: "dona" },

  electric_other: { price: 25000, unit: "dona" },
  security: { price: 450000, unit: "dona" },
  sockets: { price: 18000, unit: "dona" },
  lighting: { price: 120000, unit: "dona" },
  cables: { price: 9000, unit: "metr" },
  modules: { price: 78000, unit: "dona" },
  boxes: { price: 6000, unit: "dona" },
  all_mount: { price: 15000, unit: "dona" },
};

function formatUZS(n) {
  const s = String(Math.round(Number(n || 0)));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/* ===== Helpers ===== */
function findNodeByKey(tree, key) {
  for (const n of tree) {
    if (n.key === key) return n;
    if (n.children?.length) {
      const found = findNodeByKey(n.children, key);
      if (found) return found;
    }
  }
  return null;
}

function resolveImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("/uploads/")) return `${API_URL}${url}`;
  return url;
}

function findPathTitles(tree, key, out = []) {
  for (const n of tree) {
    const next = [...out, { key: n.key, title: n.title }];
    if (n.key === key) return next;
    if (n.children?.length) {
      const found = findPathTitles(n.children, key, next);
      if (found) return found;
    }
  }
  return null;
}

function guessCategoryFromPath(pathTitles) {
  if (!pathTitles?.length) return "Kategoriya";
  if (pathTitles.length >= 2) return pathTitles[pathTitles.length - 2].title;
  return pathTitles[0].title;
}

function buildDemoSellerByCategory(categoryTitle) {
  const base = {
    phone: "+998901234567",
    telegram: "qrs_seller",
    address: "Toshkent, Chilonzor",
    updatedAt: "2026-01-20",
  };

  if (/sement|бетон|цемент/i.test(categoryTitle)) return { ...base, name: "QRS Cement Pro" };
  if (/g'isht|g‘isht|brick|gazoblok|penoblok/i.test(categoryTitle)) return { ...base, name: "QRS Brick House" };
  if (/armatura|rebar|sim/i.test(categoryTitle)) return { ...base, name: "QRS Metal Market" };
  if (/elektr|yorit|kabel|rozetka/i.test(categoryTitle)) return { ...base, name: "QRS Electric Shop" };
  return { ...base, name: "QRS Seller" };
}

/* ===== Component ===== */
export default function ProductDetails() {
  const { id } = useParams(); // catalogKey yoki productId(p_...)
  const navigate = useNavigate();
  const location = useLocation();

  const productFromState = location?.state?.product || null;

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [productFromApi, setProductFromApi] = useState(null);

  // 1) Avval state => 2) API (getProductById) => 3) Catalog node
  useEffect(() => {
    let alive = true;

    async function load() {
      setErr("");
      setProductFromApi(null);

      // state bo'lsa, API shart emas
      if (productFromState) return;

      // productId bo'lish ehtimoli yuqori: p_...
      // Lekin baribir har doim APIdan urinib ko'ramiz (demo/local bo'lsa ham)
      setLoading(true);
      try {
        const p = await getProductById(id);
        if (!alive) return;
        if (p) setProductFromApi(p);
      } catch (e) {
        // API bo'lmasa ham page ishlasin (catalog fallback)
        if (!alive) return;
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const product = useMemo(() => {
    return productFromState || productFromApi || null;
  }, [productFromState, productFromApi]);

  // catalogKey ni aniqlash:
  // - agar product bor bo'lsa: product.catalogKey
  // - bo'lmasa: id (catalogKey deb olamiz)
  const catalogKey = useMemo(() => {
    if (product?.catalogKey) return product.catalogKey;
    return id; // fallback: id o'zi catalogKey bo'lishi mumkin
  }, [product, id]);

  const node = useMemo(() => {
    return findNodeByKey(CATALOG_TREE, catalogKey) || null;
  }, [catalogKey]);

  const pathTitles = useMemo(() => {
    return findPathTitles(CATALOG_TREE, catalogKey) || null;
  }, [catalogKey]);

  const categoryTitle = useMemo(() => guessCategoryFromPath(pathTitles), [pathTitles]);

  const priceMeta = useMemo(() => {
    const demo = PRICE_MAP[catalogKey] || { price: 0, unit: "" };
    return demo;
  }, [catalogKey]);

  // Ko'rsatadigan title/image/price
  const title = useMemo(() => {
    return product?.title || node?.title || "Mahsulot";
  }, [product, node]);

  const image = useMemo(() => {
    return product?.image || product?.img || node?.img || "";
  }, [product, node]);

  const shownPrice = useMemo(() => {
    // avval product.price, bo'lmasa demo
    const p = Number(product?.price || 0);
    return p > 0 ? p : Number(priceMeta.price || 0);
  }, [product, priceMeta]);

  const shownUnit = useMemo(() => {
    return product?.unit || priceMeta.unit || "";
  }, [product, priceMeta]);

  // Seller info
  const sellerId = product?.sellerId || "s_1";
  const sellerName = product?.sellerName || "QRS Seller";
  const sellerRegion = product?.region || "Toshkent";

  const seller = useMemo(() => {
    // Agar product ichida seller fields bo'lsa, ularni ustun qo'yamiz
    const demo = buildDemoSellerByCategory(categoryTitle);

    return {
      name: product?.sellerName || demo.name,
      phone: product?.phone || demo.phone,
      telegram: product?.telegram || demo.telegram,
      address: product?.address || demo.address,
      updatedAt: product?.updatedAt || demo.updatedAt,
    };
  }, [categoryTitle, product]);

  const tgLink = seller.telegram ? `https://t.me/${String(seller.telegram).replace("@", "")}` : null;

  // Loading (API urinyapti, lekin fallback bor)
  if (loading && !productFromState && !productFromApi && !node) {
    return (
      <div className="pd-wrap">
        <div className="pd-container">
          <button className="pd-back" onClick={() => navigate(-1)} type="button">
            ← Orqaga
          </button>
          <div className="pd-card" style={{ marginTop: 14, fontWeight: 900 }}>
            Yuklanmoqda...
          </div>
        </div>
      </div>
    );
  }

  // Hech narsa topilmadi: na API, na catalog
  if (!product && !node) {
    return (
      <div className="pd-wrap">
        <div className="pd-container">
          <button className="pd-back" onClick={() => navigate(-1)} type="button">
            ← Orqaga
          </button>

          <div className="pd-empty" style={{ marginTop: 14 }}>
            <h1>Mahsulot topilmadi</h1>
            <p>ID: {id}</p>
            <button className="pd-btn" onClick={() => navigate("/catalog")} type="button">
              Katalogga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasImage = !!image;

  return (
    <div className="pd-wrap">
      <div className="pd-container">
        <button className="pd-back" onClick={() => navigate(-1)} type="button">
          ← Orqaga
        </button>

        {/* Breadcrumb */}
        <div className="pd-crumb">
          <span className="pd-crumbItem" role="button" onClick={() => navigate("/")} tabIndex={0}>
            Bosh sahifa
          </span>
          <span className="pd-crumbSep">/</span>
          <span className="pd-crumbItem" role="button" onClick={() => navigate("/catalog")} tabIndex={0}>
            Katalog
          </span>
          <span className="pd-crumbSep">/</span>
          <span className="pd-crumbStrong">{categoryTitle}</span>
        </div>

        {err ? (
          <div className="pd-card" style={{ marginTop: 14 }}>
            <b>Xato:</b> {err}
          </div>
        ) : null}

        <div className="pd-grid">
          {/* LEFT */}
          <div className="pd-left">
            <div className="pd-cover">
              {hasImage ? (
               <img src={resolveImageUrl(image)} alt={title} />
              ) : (
                <div className="pd-noimg">
                  <ion-icon name="image-outline" />
                  <span>Rasm yo‘q</span>
                </div>
              )}

              <div className="pd-chip">{categoryTitle}</div>
            </div>

            <div className="pd-card">
              <div className="pd-titleRow">
                <h1 className="pd-title">{title}</h1>
                <span className="pd-updated">Yangilandi: {seller.updatedAt || "—"}</span>
              </div>

              <div className="pd-priceRow">
                <div className="pd-price">
                  {shownPrice ? `${formatUZS(shownPrice)} so‘m` : "Narx yo‘q"}
                  {shownUnit ? <span className="pd-unit"> / {shownUnit}</span> : null}
                </div>

                <div className="pd-meta">
                  <div className="pd-metaItem">
                    <span className="pd-label">Mahsulot ID</span>
                    <span className="pd-value">{product?.id || id}</span>
                  </div>
                  <div className="pd-metaItem">
                    <span className="pd-label">Kategoriya</span>
                    <span className="pd-value">{categoryTitle}</span>
                  </div>
                  <div className="pd-metaItem">
                    <span className="pd-label">Holat</span>
                    <span className="pd-value">Sotuvda</span>
                  </div>
                </div>
              </div>

              <div className="pd-desc">
                <h3>Tavsif</h3>
                <p>
                  {product?.desc?.trim()
                    ? product.desc.trim()
                    : `${title} — QRS katalogidagi mahsulot. Hozircha sahifa demo ma’lumot bilan ishlayapti. Keyin sotuvchi real tavsif va shartlarni qo‘shadi.`}
                </p>
              </div>

              {/* Path (katalog yo‘li) */}
              {pathTitles?.length ? (
                <div className="pd-path">
                  <h3>Katalog yo‘li</h3>
                  <div className="pd-pathLine">
                    {pathTitles.map((p, idx) => (
                      <span key={p.key} className="pd-pathItem">
                        {p.title}
                        {idx !== pathTitles.length - 1 ? <span className="pd-pathSep"> → </span> : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* RIGHT */}
          <div className="pd-right">
            <div className="pd-sellerCard">
              <div className="pd-sellerTop">
                <div className="pd-avatar">{seller.name?.slice(0, 1)?.toUpperCase() || "S"}</div>
                <div>
                  <div className="pd-sellerName">{seller.name}</div>
                  <div className="pd-sellerAddr">{seller.address}</div>
                </div>
              </div>

              <div className="pd-sellerInfo">
                <div className="pd-infoRow">
                  <span className="pd-infoKey">Telefon</span>
                  <span className="pd-infoVal">{seller.phone}</span>
                </div>

                {seller.telegram ? (
                  <div className="pd-infoRow">
                    <span className="pd-infoKey">Telegram</span>
                    <span className="pd-infoVal">@{String(seller.telegram).replace("@", "")}</span>
                  </div>
                ) : null}
              </div>

              <div className="pd-actions">
                <a className="pd-btn" href={`tel:${seller.phone}`}>
                  Qo‘ng‘iroq qilish
                </a>

                {tgLink ? (
                  <a className="pd-btn ghost" href={tgLink} target="_blank" rel="noreferrer">
                    Telegramdan yozish
                  </a>
                ) : (
                  <button className="pd-btn ghost" disabled type="button">
                    Telegram yo‘q
                  </button>
                )}
              </div>

              <div className="pd-tip">
                <b>Tip:</b> Narxni kelishishdan oldin “yetkazib berish bormi?” deb so‘rang.
              </div>
            </div>

            <div className="pd-mini">
              <h3>Xavfsizlik</h3>
              <ul>
                <li>Oldindan katta pul tashlamang</li>
                <li>Manzilni tekshirib oling</li>
                <li>Chek/rasmiy kelishuv bo‘lsa yaxshi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pd-bottom">
          <div className="pd-bottomInner">
            <div className="pd-bottomLeft">
              <div className="pd-bottomTitle">{title}</div>
              <div className="pd-bottomPrice">
                {shownPrice ? `${formatUZS(shownPrice)} so‘m` : "Narx yo‘q"}
                {shownUnit ? ` / ${shownUnit}` : ""}
              </div>
            </div>

            <div className="pd-bottomRight">
              <a className="pd-btn" href={`tel:${seller.phone}`}>
                Qo‘ng‘iroq
              </a>
              {tgLink ? (
                <a className="pd-btn ghost" href={tgLink} target="_blank" rel="noreferrer">
                  Telegram
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Seller strip (pastda) */}
        <div className="pd-seller">
          <div className="pd-sellerLeft">
            <div className="pd-sellerBadge">
              <ion-icon name="storefront-outline"></ion-icon>
              Sotuvchi
            </div>

            <Link className="pd-sellerName" to={`/seller/${sellerId}`}>
              {sellerName}
              <span className="pd-sellerGo">
                Profilini ko‘rish <ion-icon name="arrow-forward-outline"></ion-icon>
              </span>
            </Link>

            <div className="pd-sellerMeta">
              <span className="pd-sellerDot"></span>
              <span>{sellerRegion}</span>
            </div>
          </div>

          <Link to={`/seller/${sellerId}`} className="pd-sellerBtn">
            <ion-icon name="open-outline"></ion-icon>
            O‘tish
          </Link>
        </div>
      </div>
    </div>
  );
}
