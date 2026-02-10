import "./Catalog.css";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CATALOG_TREE } from "./catalogData";
import { useCart } from "../../context/CartContext";
import { getProducts } from "../../api/products.api";
import { API_URL } from "../../config/env";

// ✅ API_URL dan uploads uchun toza origin yasaymiz
const API_ORIGIN = (() => {
  const raw = String(API_URL || "").trim().replace(/\/+$/g, "");
  if (!raw) return "";
  return raw.replace(/\/api$/i, "");
})();

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

// ✅ node (parent bo‘lsa ham) ichidagi birinchi leaf key ni topamiz
function getFirstLeafKey(node) {
  if (!node) return null;
  if (!node.children?.length) return node.key; // leaf
  for (const ch of node.children) {
    const k = getFirstLeafKey(ch);
    if (k) return k;
  }
  return null;
}

// ✅ tree root array ichidagi key bo‘yicha first leaf key (root bosilganda ham ishlasin)
function getFirstLeafKeyByKey(tree, key) {
  const node = findNodeByKey(tree, key);
  if (!node) return null;
  return getFirstLeafKey(node);
}

function resolveImageUrl(url) {
  const u = String(url || "").trim();
  if (!u) return "";

  if (u.startsWith("data:image")) return u;
  if (/^https?:\/\//i.test(u)) return u;

  if (u.startsWith("/uploads/")) return `${API_ORIGIN}${u}`;
  if (u.startsWith("uploads/")) return `${API_ORIGIN}/${u}`;

  return u;
}

function findPath(tree, key, path = []) {
  for (const n of tree) {
    const next = [...path, n.key];
    if (n.key === key) return next;
    if (n.children?.length) {
      const found = findPath(n.children, key, next);
      if (found) return found;
    }
  }
  return null;
}

function flattenToLeaves(tree, out = []) {
  for (const n of tree) {
    if (n.children?.length) flattenToLeaves(n.children, out);
    else out.push(n);
  }
  return out;
}

// ✅ birinchi root → uning birinchi leafiga olib boramiz
function pickFirstNodeKey(tree) {
  if (!tree?.length) return null;
  const first = tree[0];
  const leaf = getFirstLeafKey(first);
  return leaf || first.key;
}

function formatUZS(n) {
  const s = String(Math.round(Number(n || 0)));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

/* ===== Component ===== */
function Catalog() {
  const params = useQueryParams();
  const navigate = useNavigate();

  // URL params
  const urlCategory = params.get("category");
  const urlQ = params.get("q");

  // ✅ SEARCH MODE
  const qText = useMemo(() => String(urlQ || "").trim(), [urlQ]);
  const isSearching = !!qText;

  // default active
  const defaultKey = useMemo(() => {
    const fromUrl = urlCategory;

    // ✅ URL category parent bo‘lsa ham — birinchi leafga tushiramiz
    if (fromUrl) {
      const leaf = getFirstLeafKeyByKey(CATALOG_TREE, fromUrl);
      if (leaf && findNodeByKey(CATALOG_TREE, leaf)) return leaf;
    }

    return pickFirstNodeKey(CATALOG_TREE) || "brick";
  }, [urlCategory]);

  const [activeKey, setActiveKey] = useState(defaultKey);
  const [openKeys, setOpenKeys] = useState(() => findPath(CATALOG_TREE, defaultKey) || []);

  // ✅ DB products state
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const [dbItems, setDbItems] = useState([]);

  // 🛒 Cart
  const { cart, cartCount, addToCart, removeFromCart } = useCart();

  // active node
  const activeNode = useMemo(() => findNodeByKey(CATALOG_TREE, activeKey), [activeKey]);

  // leaf?
  const isLeaf = useMemo(() => {
    return !!activeNode && !(activeNode.children && activeNode.children.length);
  }, [activeNode]);

  // current list (sub categories) — faqat non-leaf uchun
  const rawSubCategories = useMemo(() => {
    if (!activeNode) return [];
    return activeNode.children || [];
  }, [activeNode]);

  // q from navbar: filtering demo (sub-kategoriya bo‘yicha) — faqat subcategory listga
  const filteredByQ = useMemo(() => {
    const q = (urlQ || "").trim().toLowerCase();
    if (!q) return rawSubCategories;

    if (rawSubCategories.length) {
      const shallow = rawSubCategories.filter((x) => (x.title || "").toLowerCase().includes(q));
      if (shallow.length) return shallow;

      const deeper = flattenToLeaves(rawSubCategories, []).filter((x) =>
        (x.title || "").toLowerCase().includes(q)
      );
      return deeper;
    }

    return [];
  }, [rawSubCategories, urlQ]);

  // URL category o‘zgarsa activeKey sync
  useEffect(() => {
    setActiveKey(defaultKey);
    const p = findPath(CATALOG_TREE, defaultKey);
    if (p) setOpenKeys(p);
  }, [defaultKey]);

  const toggleOpen = (key) => {
    setOpenKeys((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      return [...prev, key];
    });
  };

  // ✅ Bitta funksiya: node bosilsa parent bo‘lsa ham first leafga kiradi
  const onSelectNode = (nodeOrKey) => {
    const node = typeof nodeOrKey === "string" ? findNodeByKey(CATALOG_TREE, nodeOrKey) : nodeOrKey;
    if (!node) return;

    // ✅ parent -> birinchi leaf
    const nextKey = node.children?.length ? getFirstLeafKey(node) : node.key;
    if (!nextKey) return;

    setActiveKey(nextKey);

    const p = findPath(CATALOG_TREE, nextKey);
    if (p) setOpenKeys(p);

    const next = new URLSearchParams(window.location.search);
    next.set("category", nextKey); // ✅ endi URL ham leaf bo‘ladi
    next.delete("q"); // ✅ kategoriya tanlansa qidiruv tozalanadi (avvalgi holat saqlandi)
    navigate(`/catalog?${next.toString()}`);
  };

  const buyNowLeafProduct = (p) => {
    addToCart({
      id: p.id,
      title: p.title,
      price: p.price,
      unit: p.unit,
      image: resolveImageUrl(p.image),
      catalogKey: p.catalogKey,
    });
    navigate("/cart");
  };

  const addOneLeafProduct = (p) => {
    addToCart({
      id: p.id,
      title: p.title,
      price: p.price,
      unit: p.unit,
      image: resolveImageUrl(p.image),
      catalogKey: p.catalogKey,
    });
  };

  const removeOneLeafProduct = (p) => {
    removeFromCart(String(p.id));
  };

  const qtyByProductId = (pid) => {
    const k = String(pid);
    const v = cart?.[k];
    if (typeof v === "number") return v;
    if (v && typeof v === "object") return Number(v.qty) || 0;
    return 0;
  };

  // ✅ DB’dan mahsulotlarni olib kelish:
  // - leaf bo‘lsa: catalogKey=activeKey
  // - qidiruv bo‘lsa: q bo‘yicha (kategoriya bo‘lmasa ham ishlaydi)
  useEffect(() => {
    let alive = true;

    async function load() {
      // ✅ qidiruv ham, leaf ham bo‘lmasa — DB yuklamaymiz
      if (!isLeaf && !isSearching) {
        setDbItems([]);
        setDbError("");
        setDbLoading(false);
        return;
      }

      setDbLoading(true);
      setDbError("");

      try {
        const payload = {
          status: "active",
          sort: "new",
          page: 1,
          limit: 60,
        };

        // ✅ Agar qidiruv bo‘lsa — q yuboramiz (global search)
        if (isSearching) payload.q = qText;

        // ✅ Agar leaf bo‘lsa — category filter ham yuboramiz
        if (isLeaf) payload.catalogKey = activeKey;

        const res = await getProducts(payload);

        const items = Array.isArray(res?.items) ? res.items : [];
        if (!alive) return;
        setDbItems(items);
      } catch (e) {
        if (!alive) return;
        setDbError(e?.message || "Mahsulotlarni olishda xatolik.");
        setDbItems([]);
      } finally {
        if (!alive) return;
        setDbLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [isLeaf, activeKey, isSearching, qText]);

  // ✅ qidiruv uchun client-side filter (backend q ni qo‘llamasa ham ishlaydi)
  const filteredProductsByQ = useMemo(() => {
    const q = String(qText || "").trim().toLowerCase();
    if (!q) return dbItems;

    return (dbItems || []).filter((p) => {
      const hay = [
        p?.title,
        p?.description,
        p?.category,
        p?.catalogKey,
        p?.region,
        p?.city,
        p?.phone,
        p?.telegram,
        p?.unit,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [dbItems, qText]);

  const showSubCats = filteredByQ;

  // ✅ UI title/breadcrumb uchun
  const pageTitle = isSearching ? `Qidiruv natijalari: "${qText}"` : activeNode?.title || "Katalog";

  return (
    <div className="catalog-page">
      <div className="catalog-wrap">
        {/* LEFT */}
        <aside className="cat-side">
          <h1 className="cat-h1">{pageTitle}</h1>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <ion-icon name="list-outline"></ion-icon>
                <span>Kategoriyalar</span>
              </div>
            </div>

            <div className="tree">
              {CATALOG_TREE.map((node) => (
                <TreeNode
                  key={node.key}
                  node={node}
                  openKeys={openKeys}
                  activeKey={activeKey}
                  onToggle={toggleOpen}
                  onSelect={onSelectNode}
                  level={0}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <main className="cat-main">
          <div className="topbar">
            <div className="crumb">
              <ion-icon name="home-outline"></ion-icon>
              <span>Katalog</span>
              <span className="sep">/</span>
              <span className="strong">{isSearching ? `Qidiruv` : activeNode?.title || "Bo‘lim"}</span>
              {isSearching ? <span className="sep">/</span> : null}
              {isSearching ? <span className="strong">"{qText}"</span> : null}
            </div>

            <button className="cartBtn" type="button" title="Korzina" onClick={() => navigate("/cart")}>
              <ion-icon name="cart-outline"></ion-icon>
              <span>Korzina</span>
              <span className="cartCount">{cartCount}</span>
            </button>
          </div>

          {/* ✅ SEARCH MODE: har doim products grid ko‘rsatamiz */}
          {isSearching ? (
            <div className="cards-grid products">
              {dbLoading ? (
                <div className="empty">
                  <div className="empty-ic">
                    <ion-icon name="sync-outline" />
                  </div>
                  <div className="empty-title">Yuklanmoqda...</div>
                  <div className="empty-sub">Qidiruv natijalari olinmoqda</div>
                </div>
              ) : dbError ? (
                <div className="empty">
                  <div className="empty-ic">
                    <ion-icon name="alert-circle-outline" />
                  </div>
                  <div className="empty-title">Xatolik</div>
                  <div className="empty-sub">{dbError}</div>
                </div>
              ) : filteredProductsByQ.length === 0 ? (
                <div className="empty">
                  <div className="empty-ic">
                    <ion-icon name="search-outline" />
                  </div>
                  <div className="empty-title">Hech narsa topilmadi</div>
                  <div className="empty-sub">
                    Qidiruv bo‘yicha mos mahsulot yo‘q. Boshqa so‘z bilan urinib ko‘ring.
                  </div>
                </div>
              ) : (
                filteredProductsByQ.map((p) => {
                  const qty = qtyByProductId(p.id);

                  return (
                    <div key={p.id} className="sub-cardX" title={p.title}>
                      <button className="sub-head" onClick={() => navigate(`/product/${p.id}`)} type="button">
                        <div className="sub-media">
                          <div className="sub-img">
                            {p.image ? (
                              <img src={resolveImageUrl(p.image)} alt={p.title} />
                            ) : (
                              <div className="sub-noimg">
                                <ion-icon name="image-outline" />
                              </div>
                            )}
                          </div>

                          <div className="sub-badge">
                            <ion-icon name="pricetag-outline"></ion-icon>
                            <span>mahsulot</span>
                          </div>
                        </div>

                        <div className="sub-foot">
                          <div className="sub-meta">
                            <div className="sub-title">{p.title}</div>

                            {/* ✅ NARX + BIRLIK — nomi tagiga tushdi */}
                            <div className="sub-priceInline">
                              <div className="sub-priceNum">{p.price ? `${formatUZS(p.price)} so‘m` : "Narx yo‘q"}</div>
                              {p.unit ? <div className="sub-priceUnit">/{p.unit}</div> : null}
                            </div>
                          </div>

                          <div className="sub-go">
                            <ion-icon name="arrow-forward-outline"></ion-icon>
                          </div>
                        </div>
                      </button>

                      <div className="sub-actions">
                        <div className="btnRow">
                          <button
                            className="buyBtn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              buyNowLeafProduct(p);
                            }}
                          >
                            <ion-icon name="flash-outline"></ion-icon>
                            Sotib olish
                          </button>

                          <div className="qtyBox" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="qtyBtn"
                              type="button"
                              onClick={() => removeOneLeafProduct(p)}
                              disabled={qty === 0}
                              title="Kamaytirish"
                            >
                              <ion-icon name="remove-outline"></ion-icon>
                            </button>

                            <div className="qtyNum">{qty}</div>

                            <button className="qtyBtn" type="button" onClick={() => addOneLeafProduct(p)} title="Korzina">
                              <ion-icon name="add-outline"></ion-icon>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : !isLeaf ? (
            <div className="cards-grid subcats">
              {showSubCats.length === 0 ? (
                <div className="empty">
                  <div className="empty-ic">
                    <ion-icon name="cube-outline" />
                  </div>
                  <div className="empty-title">Hech narsa topilmadi</div>
                  <div className="empty-sub">
                    Qidiruv bo‘yicha mos sub-kategoriya yo‘q. Boshqa so‘z bilan urinib ko‘ring.
                  </div>
                </div>
              ) : (
                showSubCats.map((s) => (
                  <div key={s.key} className="sub-cardX" title={s.title}>
                    <button className="sub-head" onClick={() => onSelectNode(s)} type="button">
                      <div className="sub-media">
                        <div className="sub-img">
                          {s.img ? (
                            <img src={s.img} alt={s.title} />
                          ) : (
                            <div className="sub-noimg">
                              <ion-icon name="image-outline" />
                            </div>
                          )}
                        </div>

                        <div className="sub-badge">
                          <ion-icon name="pricetag-outline"></ion-icon>
                          <span>katalog</span>
                        </div>
                      </div>

                      <div className="sub-foot">
                        <div className="sub-title">{s.title}</div>
                        <div className="sub-go">
                          <ion-icon name="arrow-forward-outline"></ion-icon>
                        </div>
                      </div>
                    </button>

                    <div className="sub-actions">
                      <div className="price">
                        <div className="price-num">Bo‘lim</div>
                        <div className="price-unit">/ tanlang</div>
                      </div>

                      <div className="btnRow">
                        <button
                          className="buyBtn"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectNode(s);
                          }}
                        >
                          <ion-icon name="flash-outline"></ion-icon>
                          Ochish
                        </button>

                        <div className="qtyBox" onClick={(e) => e.stopPropagation()}>
                          <button className="qtyBtn" type="button" disabled title="—">
                            <ion-icon name="remove-outline"></ion-icon>
                          </button>
                          <div className="qtyNum">0</div>
                          <button className="qtyBtn" type="button" disabled title="+">
                            <ion-icon name="add-outline"></ion-icon>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="cards-grid products">
              {dbLoading ? (
                <div className="empty">
                  <div className="empty-ic">
                    <ion-icon name="sync-outline" />
                  </div>
                  <div className="empty-title">Yuklanmoqda...</div>
                  <div className="empty-sub">Mahsulotlar olinmoqda</div>
                </div>
              ) : dbError ? (
                <div className="empty">
                  <div className="empty-ic">
                    <ion-icon name="alert-circle-outline" />
                  </div>
                  <div className="empty-title">Xatolik</div>
                  <div className="empty-sub">{dbError}</div>
                </div>
              ) : dbItems.length === 0 ? (
                <div className="empty">
                  <div className="empty-ic">
                    <ion-icon name="cube-outline" />
                  </div>
                  <div className="empty-title">Hech narsa topilmadi</div>
                  <div className="empty-sub">Bu kategoriyada hozircha mahsulot yo‘q.</div>
                </div>
              ) : (
                dbItems.map((p) => {
                  const qty = qtyByProductId(p.id);

                  return (
                    <div key={p.id} className="sub-cardX" title={p.title}>
                      <button className="sub-head" onClick={() => navigate(`/product/${p.id}`)} type="button">
                        <div className="sub-media">
                          <div className="sub-img">
                            {p.image ? (
                              <img src={resolveImageUrl(p.image)} alt={p.title} />
                            ) : (
                              <div className="sub-noimg">
                                <ion-icon name="image-outline" />
                              </div>
                            )}
                          </div>

                          <div className="sub-badge">
                            <ion-icon name="pricetag-outline"></ion-icon>
                            <span>mahsulot</span>
                          </div>
                        </div>

                        <div className="sub-foot">
                          <div className="sub-meta">
                            <div className="sub-title">{p.title}</div>

                            {/* ✅ NARX + BIRLIK — nomi tagiga tushdi */}
                            <div className="sub-priceInline">
                              <div className="sub-priceNum">{p.price ? `${formatUZS(p.price)} so‘m` : "Narx yo‘q"}</div>
                              {p.unit ? <div className="sub-priceUnit">/{p.unit}</div> : null}
                            </div>
                          </div>

                          <div className="sub-go">
                            <ion-icon name="arrow-forward-outline"></ion-icon>
                          </div>
                        </div>
                      </button>

                      <div className="sub-actions">
                        <div className="btnRow">
                          <button
                            className="buyBtn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              buyNowLeafProduct(p);
                            }}
                          >
                            <ion-icon name="flash-outline"></ion-icon>
                            Sotib olish
                          </button>

                          <div className="qtyBox" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="qtyBtn"
                              type="button"
                              onClick={() => removeOneLeafProduct(p)}
                              disabled={qty === 0}
                              title="Kamaytirish"
                            >
                              <ion-icon name="remove-outline"></ion-icon>
                            </button>

                            <div className="qtyNum">{qty}</div>

                            <button className="qtyBtn" type="button" onClick={() => addOneLeafProduct(p)} title="Korzina">
                              <ion-icon name="add-outline"></ion-icon>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function TreeNode({ node, openKeys, activeKey, onToggle, onSelect, level }) {
  const hasChildren = !!(node.children && node.children.length);
  const isOpen = openKeys.includes(node.key);
  const isActive = activeKey === node.key;

  return (
    <div className="tree-node" style={{ paddingLeft: 12 + level * 14 }}>
      <div className={isActive ? "tree-row active" : "tree-row"}>
        {/* ✅ node bosilganda parent bo‘lsa ham — first leafga kiradi */}
        <button className="tree-btn" onClick={() => onSelect(node)} type="button">
          <span className="tree-branch">
            <span className="tree-line" />
          </span>
          <span className="tree-text">{node.title}</span>
        </button>

        {hasChildren && (
          <button className="tree-toggle" onClick={() => onToggle(node.key)} type="button">
            <ion-icon name={isOpen ? "chevron-down-outline" : "chevron-forward-outline"} />
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="tree-children">
          {node.children.map((ch) => (
            <TreeNode
              key={ch.key}
              node={ch}
              openKeys={openKeys}
              activeKey={activeKey}
              onToggle={onToggle}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;
