import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "qrs_cart_v1";

/**
 * Cart format (new):
 * cart = {
 *   [keyOrId]: { qty: number, product: { id, title, price, unit, image, catalogKey } | null }
 * }
 *
 * Legacy format (old):
 * cart = { [keyOrId]: number }
 */

function isObj(x) {
  return x && typeof x === "object" && !Array.isArray(x);
}

function normalizeLoadedCart(raw) {
  // raw: {} | legacy {}
  if (!isObj(raw)) return {};

  const out = {};
  for (const k of Object.keys(raw)) {
    const v = raw[k];

    // legacy: number
    if (typeof v === "number") {
      const qty = Number.isFinite(v) ? v : 0;
      if (qty > 0) out[k] = { qty, product: null };
      continue;
    }

    // new: { qty, product }
    if (isObj(v)) {
      const qty = Number(v.qty);
      const safeQty = Number.isFinite(qty) ? Math.floor(qty) : 0;
      if (safeQty <= 0) continue;

      const product = isObj(v.product) ? v.product : null;
      out[k] = { qty: safeQty, product };
    }
  }

  return out;
}

function pickKeyFromInput(input) {
  // input can be string key/id OR product-like object
  if (!input) return "";
  if (typeof input === "string" || typeof input === "number") return String(input);

  if (isObj(input)) {
    // Prefer real product id, fallback to catalogKey/key
    const id = input.id != null ? String(input.id) : "";
    const catalogKey = input.catalogKey != null ? String(input.catalogKey) : "";
    const key = input.key != null ? String(input.key) : "";
    return id || catalogKey || key || "";
  }

  return "";
}

function normalizeProductMeta(input, fallbackKey) {
  // Returns a compact product object used for total calculation & rendering
  if (!isObj(input)) return null;

  const id = input.id != null ? String(input.id) : null;
  const catalogKey = input.catalogKey != null ? String(input.catalogKey) : null;

  const title = input.title != null ? String(input.title) : "";
  const unit = input.unit != null ? String(input.unit) : "";
  const image = input.image != null ? String(input.image) : input.image_url != null ? String(input.image_url) : "";

  const priceNum = Number(input.price);
  const price = Number.isFinite(priceNum) ? priceNum : 0;

  return {
    id,
    catalogKey,
    key: fallbackKey || catalogKey || id || "",
    title,
    unit,
    image,
    price,
  };
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return normalizeLoadedCart(parsed);
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  /**
   * ✅ addToCart
   * Usage:
   * - addToCart("brick_red")
   * - addToCart(11)
   * - addToCart(productObj)  // recommended for DB products
   */
  const addToCart = (input, amount = 1) => {
    const key = pickKeyFromInput(input);
    if (!key) return;

    const add = Number(amount);
    const inc = Number.isFinite(add) ? add : 1;
    if (inc <= 0) return;

    setCart((prev) => {
      const next = { ...prev };
      const cur = next[key] || { qty: 0, product: null };

      const nextQty = (Number(cur.qty) || 0) + inc;

      // If caller passed a product object, store it (so total works)
      const meta = isObj(input) ? normalizeProductMeta(input, key) : null;
      const product = meta || cur.product;

      next[key] = { qty: nextQty, product };
      return next;
    });
  };

  const removeFromCart = (input, amount = 1) => {
    const key = pickKeyFromInput(input);
    if (!key) return;

    const sub = Number(amount);
    const dec = Number.isFinite(sub) ? sub : 1;
    if (dec <= 0) return;

    setCart((prev) => {
      const next = { ...prev };
      const cur = next[key];
      if (!cur) return prev;

      const newQty = (Number(cur.qty) || 0) - dec;
      if (newQty <= 0) delete next[key];
      else next[key] = { ...cur, qty: newQty };
      return next;
    });
  };

  const setQty = (input, qty) => {
    const key = pickKeyFromInput(input);
    if (!key) return;

    const n = Number(qty);
    setCart((prev) => {
      const next = { ...prev };
      const cur = next[key] || { qty: 0, product: null };

      if (!Number.isFinite(n) || n <= 0) {
        delete next[key];
      } else {
        next[key] = { ...cur, qty: Math.floor(n) };
      }
      return next;
    });
  };

  const clearCart = () => setCart({});

  const cartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, it) => sum + (Number(it?.qty) || 0), 0);
  }, [cart]);

  // ✅ Useful for rendering cart page
  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([key, it]) => ({
      key,
      qty: Number(it?.qty) || 0,
      product: it?.product || null,
    }));
  }, [cart]);

  // ✅ Total works ONLY if product.price is known (so pass product object when adding)
  const cartTotal = useMemo(() => {
    return Object.values(cart).reduce((sum, it) => {
      const qty = Number(it?.qty) || 0;
      const price = Number(it?.product?.price) || 0;
      return sum + qty * price;
    }, 0);
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
    }),
    [cart, cartItems, cartCount, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider />");
  return ctx;
}
