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
  if (String(u).startsWith("data:")) return u;
  return resolveBackendUrl(u);
}

function formatUZS(n) {
  const s = String(Math.round(Number(n || 0)));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  // YYYY-MM-DD HH:mm
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yy}-${mm}-${dd} ${hh}:${mi}`;
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
      <div className="spx-wrap">
        <div className="spx-container">
          <div className="spx-loading">Yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="spx-wrap">
      <div className="spx-container">
        {/* ===== Header ===== */}
        <div className="spx-head">
          <div className="spx-left">

            <h1 className="spx-title">Mahsulotlarim</h1>

            <div className="spx-sub">
              <span className="spx-pill ghost">
                <ion-icon name="location-outline"></ion-icon>
                {seller?.region || "—"}
              </span>
            </div>
          </div>

          <div className="spx-actions">
            <Link className="spx-btn ghost" to={`/seller/${sellerId}`}>
              <ion-icon name="person-outline"></ion-icon>
              Profil
            </Link>

            <Link className="spx-btn" to="/seller/add-product">
              <ion-icon name="add-outline"></ion-icon>
              Mahsulot qo‘shish
            </Link>
          </div>
        </div>

        {/* ===== Toolbar ===== */}
        <div className="spx-toolbar">
          <div className="spx-search">
            <ion-icon name="search-outline"></ion-icon>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Qidirish: nom / key / id..."
            />
          </div>

          <label className="spx-toggle">
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
            />
            <span>Faqat aktiv</span>
          </label>

          <div className="spx-count">
            <b>{filtered.length}</b> ta
          </div>
        </div>

        {err ? (
          <div className="spx-error" role="alert">
            <ion-icon name="alert-circle-outline"></ion-icon>
            <span>{err}</span>
          </div>
        ) : null}

        {/* ===== List ===== */}
        {filtered.length ? (
          <div className="spx-list">
            {filtered.map((p, idx) => {
              const img = pickImageUrl(p);
              const when = formatDateTime(p.updatedAt || p.createdAt);

              return (
                <div key={p.id} className="spx-row">
                  {/* index */}
                  <div className="spx-idx">
                    <span>{idx + 1}</span>
                  </div>

                  {/* thumb */}
                  <div className="spx-thumb">
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
                      <div className="spx-thumbEmpty">
                        <ion-icon name="cube-outline"></ion-icon>
                      </div>
                    )}
                  </div>

                  {/* main */}
                  <div className="spx-main">
                    <div className="spx-topline">
                      <div className="spx-name">{p.title || "Mahsulot"}</div>

                      {/* right mini meta */}
                      <div className="spx-metaRight">
                        <span className="spx-chip ghost">
                          <ion-icon name="calendar-outline"></ion-icon>
                          {when}
                        </span>
                      </div>
                    </div>

                    <div className="spx-bottomline">
                      <div className="spx-price">
                        {p.price ? `${formatUZS(p.price)} so‘m` : "Narx yo‘q"}
                        {p.unit ? <span className="spx-unit"> / {p.unit}</span> : null}
                      </div>

                      <div className="spx-chips">
                        <span className="spx-chip">
                          <ion-icon name="location-outline"></ion-icon>
                          {p.region || seller?.region || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="spx-actionsCol">
                    <button
                      className="spx-btnSm"
                      type="button"
                      onClick={() => navigate(`/seller/edit-product/${p.id}`)}
                    >
                      <ion-icon name="create-outline"></ion-icon>
                      Tahrirlash
                    </button>

                    <button
                      className="spx-btnSm danger"
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
          <div className="spx-empty">
            <ion-icon name="information-circle-outline"></ion-icon>
            <div>
              <b>Mahsulot topilmadi</b>
              <div className="spx-emptySub">
                Yangi mahsulot qo‘shish uchun tepdagi tugmani bosing.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
