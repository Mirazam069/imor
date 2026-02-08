import "./Cart.css";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { CATALOG_TREE } from "../Catalog/catalogData";

// Catalog’dagi bilan bir xil PRICE_MAP (fallback uchun)
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

function flattenLeaves(tree, out = []) {
  for (const n of tree) {
    if (n.children?.length) flattenLeaves(n.children, out);
    else out.push(n);
  }
  return out;
}

function isNumericKey(k) {
  return /^\d+$/.test(String(k));
}

export default function Cart() {
  const navigate = useNavigate();

  // ✅ new context fields
  const { cart, cartItems, cartCount, cartTotal, addToCart, removeFromCart } = useCart();

  const leafIndex = useMemo(() => {
    const leaves = flattenLeaves(CATALOG_TREE, []);
    const m = new Map();
    leaves.forEach((x) => m.set(x.key, x));
    return m;
  }, []);

  // ✅ Build rows using product meta when available; fallback to leafIndex/PRICE_MAP for old demo keys
  const rows = useMemo(() => {
    const list = Array.isArray(cartItems) ? cartItems : [];

    return list
      .filter((it) => Number(it.qty) > 0)
      .map((it) => {
        const key = String(it.key);

        // If we have product meta (DB product added correctly), use it
        const p = it.product;

        const node = leafIndex.get(key);

        // fallback meta (old behavior)
        const fallback = PRICE_MAP[key] || { price: 0, unit: "" };

        const title = p?.title || node?.title || key;
        const img = p?.image || node?.img || "";
        const unit = p?.unit || fallback.unit || "";
        const price = Number(p?.price ?? fallback.price ?? 0) || 0;

        const qty = Number(it.qty) || 0;
        const sum = price * qty;

        // Details link:
        // - If numeric id exists in product meta => use /product/:id
        // - else use key (old)
        const detailsId = p?.id ? String(p.id) : isNumericKey(key) ? key : key;

        return {
          key,
          qty,
          title,
          img,
          price,
          unit,
          sum,
          detailsId,
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [cartItems, leafIndex]);

  // ✅ Total: prefer cartTotal (works for DB products); fallback to rows sum
  const total = useMemo(() => {
    const t = Number(cartTotal);
    if (Number.isFinite(t) && t > 0) return t;
    return rows.reduce((acc, r) => acc + (Number(r.sum) || 0), 0);
  }, [cartTotal, rows]);

  return (
    <div className="cart-wrap">
      <div className="cart-container">
        <div className="cart-head">
          <div>
            <div className="cart-badge">IMOR</div>
            <h1 className="cart-title">Korzina</h1>
            <div className="cart-sub">
              Tanlanganlar: <b>{cartCount} dona</b>
            </div>
          </div>

          <div className="cart-actions">
            <button className="cart-btn ghost" onClick={() => navigate("/catalog")} type="button">
              Katalogga qaytish
            </button>
            
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-emptyIc">
              <ion-icon name="cart-outline" />
            </div>
            <div className="cart-emptyTitle">Korzina bo‘sh</div>
            <div className="cart-emptySub">Katalogdan mahsulot tanlab, “+” tugmasini bosing.</div>
            <button className="cart-btn" onClick={() => navigate("/catalog")} type="button">
              Katalogga o‘tish
            </button>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {rows.map((r) => (
                <div key={r.key} className="cart-row">
                  <div className="cart-media">
                    {r.img ? (
                      <img src={r.img} alt={r.title} />
                    ) : (
                      <div className="cart-noimg">
                        <ion-icon name="image-outline" />
                      </div>
                    )}
                  </div>

                  <div className="cart-info">
                    <div className="cart-name">{r.title}</div>
                    <div className="cart-meta">
                      <span className="cart-price">
                        {r.price ? `${formatUZS(r.price)} so‘m` : "Narx yo‘q"}
                      </span>
                      {r.unit ? <span className="cart-unit">/ {r.unit}</span> : null}
                      <span className="cart-dot">•</span>
                      <span className="cart-key">ID: {r.key}</span>
                    </div>
                  </div>

                  <div className="cart-qty">
                    <button
                      className="qtyBtn"
                      type="button"
                      onClick={() => removeFromCart(r.key)}
                      disabled={r.qty <= 0}
                      title="Kamaytirish"
                    >
                      <ion-icon name="remove-outline" />
                    </button>

                    <div className="qtyNum">{r.qty}</div>

                    <button
                      className="qtyBtn"
                      type="button"
                      // ✅ IMPORTANT: if you stored product meta in cart, addToCart(r.key) still works (keeps existing meta)
                      // better is addToCart(r.key) for simplicity here
                      onClick={() => addToCart(r.key)}
                      title="Ko‘paytirish"
                    >
                      <ion-icon name="add-outline" />
                    </button>
                  </div>

                  <div className="cart-sum">
                    <div className="cart-sumNum">{formatUZS(r.sum)} so‘m</div>
                    <button
                      className="cart-miniLink"
                      type="button"
                      onClick={() => navigate(`/product/${r.detailsId}`)}
                    >
                      Batafsil →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <div className="cart-totalLeft">
                <div className="cart-totalTitle">Jami</div>
                <div className="cart-totalSub">Mahsulotlar bo‘yicha umumiy summa</div>
              </div>

              <div className="cart-totalRight">
                <div className="cart-totalNum">{formatUZS(total)} so‘m</div>
                <button
              className="cart-btn"
              onClick={() => window.open("https://t.me/mirzahidov1ch", "_blank", "noopener,noreferrer")}
              type="button"
            >
              Buyurtma berish
            </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
