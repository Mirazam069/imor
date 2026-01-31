import "./SellerProducts.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSellerById, getSellerProducts } from "../../../api/sellers.api";
import { deleteProduct } from "../../../api/products.api";
import { resolveBackendUrl } from "../../../config/env";

function pickImageUrl(p) {
  let u =
    p?.thumbnail ||
    p?.image_url ||
    p?.imageUrl ||
    p?.image ||
    p?.photo ||
    p?.cover ||
    (Array.isArray(p?.images) ? p.images[0] : null);

  if (!u) return "";

  // ✅ base64 data URL bo‘lsa — o‘z holicha
  if (String(u).startsWith("data:")) return u;

  // ✅ absolute yoki relative bo‘lsa ham backendga to‘g‘rilab beradi
  return resolveBackendUrl(u);
}

function formatUZS(n) {
  const s = String(Math.round(Number(n || 0)));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const DEFAULT_SELLER_ID = "s_1";

export default function SellerProducts() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [sellerId] = useState(DEFAULT_SELLER_ID);
  const [seller, setSeller] = useState(null);
  const [items, setItems] = useState([]);

  const [q, setQ] = useState("");
  const [onlyActive, setOnlyActive] = useState(true);

  const [deletingId, setDeletingId] = useState("");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const s = await getSellerById(sellerId);
      setSeller(s);

      const res = await getSellerProducts(sellerId, { limit: 999 });
      const list = res?.items || res || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.message ||
        "Yuklashda xatolik.";
      setErr(String(msg));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = [...items];

    if (query) {
      list = list.filter((p) => {
        const title = String(p.title || "").toLowerCase();
        const key = String(p.catalogKey || p.id || "").toLowerCase();
        return title.includes(query) || key.includes(query);
      });
    }

    if (onlyActive) {
      list = list.filter((p) => p.status !== "draft");
    }

    return list;
  }, [items, q, onlyActive]);

  async function onDelete(productId) {
    const ok = window.confirm("Rostdan o‘chirmoqchimisiz?");
    if (!ok) return;

    try {
      setDeletingId(productId);
      await deleteProduct(productId);
      setItems((prev) => prev.filter((x) => String(x.id) !== String(productId)));
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.message ||
        "O‘chirishda xatolik.";
      setErr(String(msg));
    } finally {
      setDeletingId("");
    }
  }

  if (loading) {
    return (
      <div className="sps-wrap">
        <div className="sps-container">
          <div className="sps-loading">Yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sps-wrap">
      <div className="sps-container">
        <div className="sps-head">
          <div className="sps-left">
            <div className="sps-badge">
              <span className="sps-dot" /> Sotuvchi • Mahsulotlar
            </div>
            <h1 className="sps-title">Mahsulotlarim</h1>
            <div className="sps-sub">
              {seller ? (
                <>
                  <span className="sps-pill">
                    <ion-icon name="storefront-outline"></ion-icon>
                    {seller.name}
                  </span>
                  <span className="sps-pill ghost">
                    <ion-icon name="location-outline"></ion-icon>
                    {seller.region || "—"}
                  </span>
                </>
              ) : (
                <span className="sps-pill ghost">Seller topilmadi (demo)</span>
              )}
            </div>
          </div>

          <div className="sps-actions">
            <Link className="sps-btn ghost" to={`/seller/${sellerId}`}>
              <ion-icon name="person-outline"></ion-icon>
              Profil
            </Link>

            <Link className="sps-btn" to="/seller/add-product">
              <ion-icon name="add-outline"></ion-icon>
              Mahsulot qo‘shish
            </Link>
          </div>
        </div>

        <div className="sps-toolbar">
          <div className="sps-search">
            <ion-icon name="search-outline"></ion-icon>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Qidirish: nom / key / id..."
            />
          </div>

          <label className="sps-toggle">
            <input type="checkbox" checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />
            <span>Faqat aktiv</span>
          </label>

          <div className="sps-count">
            <b>{filtered.length}</b> ta
          </div>
        </div>

        {err ? (
          <div className="sps-error" role="alert">
            <ion-icon name="alert-circle-outline"></ion-icon>
            <span>{err}</span>
          </div>
        ) : null}

        {filtered.length ? (
          <div className="sps-grid">
            {filtered.map((p) => {
              const img = pickImageUrl(p);

              return (
                <div key={p.id} className="sps-card">
                  <div className="sps-cardTop">
                    <div className="sps-thumb">
                      {img ? (
                        <img
                          src={img}
                          alt={p.title || "product"}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="sps-thumbEmpty">
                          <ion-icon name="cube-outline"></ion-icon>
                        </div>
                      )}
                    </div>

                    <div className="sps-cardTitle">
                      <div className="sps-name">{p.title || "Mahsulot"}</div>
                      <div className="sps-muted">
                        <span className={`sps-status ${p.status === "draft" ? "draft" : "active"}`}>
                          {p.status === "draft" ? "Draft" : "Aktiv"}
                        </span>
                        <span className="sps-dotSep">•</span>
                        <span>ID: {p.id}</span>
                        {p.catalogKey ? (
                          <>
                            <span className="sps-dotSep">•</span>
                            <span>Key: {p.catalogKey}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="sps-meta">
                    <div className="sps-price">
                      {p.price ? `${formatUZS(p.price)} so‘m` : "Narx yo‘q"}
                      {p.unit ? <span className="sps-unit"> / {p.unit}</span> : null}
                    </div>

                    <div className="sps-miniMeta">
                      <span className="sps-chip">
                        <ion-icon name="location-outline"></ion-icon>
                        {p.region || seller?.region || "—"}
                      </span>
                      <span className="sps-chip ghost">
                        <ion-icon name="calendar-outline"></ion-icon>
                        {p.updatedAt || p.createdAt || "—"}
                      </span>
                    </div>
                  </div>

                  <div className="sps-cardActions">
                    <button
                      className="sps-btnSm ghost"
                      type="button"
                      onClick={() => navigate(`/seller/edit-product/${p.id}`)}
                    >
                      <ion-icon name="create-outline"></ion-icon>
                      Tahrirlash
                    </button>

                    <button
                      className="sps-btnSm danger"
                      type="button"
                      onClick={() => onDelete(p.id)}
                      disabled={deletingId === p.id}
                    >
                      <ion-icon name="trash-outline"></ion-icon>
                      {deletingId === p.id ? "O‘chmoqda..." : "O‘chirish"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="sps-empty">
            <ion-icon name="information-circle-outline"></ion-icon>
            <div>
              <b>Mahsulot topilmadi</b>
              <div className="sps-emptySub">Yangi mahsulot qo‘shish uchun tepdagi tugmani bosing.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
