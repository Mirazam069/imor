import "./Home.css";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import Banner1 from "../images/banner1.png";
import Banner2 from "../images/banner1.png";
import Banner3 from "../images/banner1.png";

/* ✅ Mashhur materiallar rasmlari (src/pages/Home/images/) */
import rasm1 from "../images/rasm1.png";
import rasm2 from "../images/rasm2.png";
import rasm3 from "../images/rasm3.png";
import rasm4 from "../images/rasm4.png";
import rasm5 from "../images/rasm5.png";
import rasm6 from "../images/rasm6.png";
import rasm7 from "../images/rasm7.png";
import rasm8 from "../images/rasm8.png";
import rasm9 from "../images/rasm9.png";
import rasm10 from "../images/rasm10.png";
import rasm11 from "../images/rasm11.png";
import rasm12 from "../images/rasm12.png";

function Home() {
  const popularMaterials = useMemo(
    () => [
      { key: "bulk", label: "Ommaviy qurilish materiallari", img: rasm1, to: "/catalog?cat=bulk" },
      { key: "wall", label: "Devor ko‘tarish uchun materiallar", img: rasm2, to: "/catalog?cat=wall" },
      { key: "electro", label: "Boshqa elektr materiallari", img: rasm3, to: "/catalog?cat=electro" },
      { key: "tools", label: "Uskunalar", img: rasm4, to: "/catalog?cat=tools" },
      { key: "roof", label: "Tom yopish materiallari", img: rasm5, to: "/catalog?cat=roof" },
      { key: "wood", label: "Yog‘och materiallari", img: rasm6, to: "/catalog?cat=wood" },
      { key: "paint", label: "Bo‘yoq va pardozlash", img: rasm7, to: "/catalog?cat=paint" },
      { key: "cover", label: "Devor qoplamalari", img: rasm8, to: "/catalog?cat=cover" },
      { key: "power", label: "Elektr asboblari", img: rasm9, to: "/catalog?cat=power" },
      { key: "light", label: "Yoritish", img: rasm10, to: "/catalog?cat=light" },
      { key: "cables", label: "Kabel va simlar", img: rasm11, to: "/catalog?cat=cables" },
      { key: "dry", label: "Quruq qurilish aralashmalari", img: rasm12, to: "/catalog?cat=dry" },
    ],
    []
  );

  const banners = useMemo(
    () => [
      {
        title: "TOP sotuvchilar — eng yaxshi narxlar",
        desc: "Katalogdan toping, solishtiring va tez bog‘laning.",
        cta: "Katalogga o‘tish",
        to: "/catalog",
        img: Banner1,
        icon: "pricetags-outline",
      },
      {
        title: "Sotuvchimisiz? 1 daqiqada e’lon joylang",
        desc: "Rasm + narx + telefon. Qolganini platforma qiladi.",
        cta: "E’lon joylash",
        to: "/seller/add",
        img: Banner2,
        icon: "add-circle-outline",
      },
      {
        title: "Hududingizdagi materiallar",
        desc: "Viloyat/tuman bo‘yicha qidirib, yaqin sotuvchini toping.",
        cta: "Qidiruvni boshlash",
        to: "/catalog",
        img: Banner3,
        icon: "location-outline",
      },
    ],
    []
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((p) => (p + 1) % banners.length);
    }, 4500);
    return () => clearInterval(t);
  }, [banners.length]);

  const go = (idx) => setActive(idx);

  return (
    <div className="home">
      {/* HERO */}
      <section className="heroV2">
        <div className="container">
          <div className="heroCard">
            {/* LEFT */}
            <div className="heroLeft">
              <h1 className="heroTitle">
                O‘zbekiston­dagi{" "}
                <span className="heroAccent">qurilish materiallari</span>
                <br /> bitta joyda
              </h1>

              <p className="heroSubtitle">
                Materiallarni narx, hudud va kategoriya bo‘yicha toping.
                Sotuvchilar uchun — e’lon joylash juda oson.
              </p>

              <div className="heroActions">
                <Link className="hbtn primary" to="/catalog">
                  <ion-icon name="grid-outline"></ion-icon>
                  Katalogga o‘tish
                </Link>

                <Link className="hbtn ghost" to="/seller/add">
                  <ion-icon name="add-circle-outline"></ion-icon>
                  E’lon joylash
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="heroRight">
              <div className="qs2">
                <div className="qs2Head">
                  <div className="qs2Title">
                    <ion-icon name="flash-outline"></ion-icon>
                    Tez qidiruv
                  </div>
                  <div className="qs2Hint">Katalogga tez o‘tish</div>
                </div>

                <div className="qs2Search">
                  <ion-icon name="search-outline"></ion-icon>
                  <input className="qs2Input" placeholder="Masalan: g‘isht, sement..." />
                  <Link className="qs2Go" to="/catalog" aria-label="Search">
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                  </Link>
                </div>

                <div className="qs2Chips">
                  <Link className="qs2Chip" to="/catalog?q=g%CA%BBisht">G‘isht</Link>
                  <Link className="qs2Chip" to="/catalog?q=sement">Sement</Link>
                  <Link className="qs2Chip" to="/catalog?q=armatura">Armatura</Link>
                  <Link className="qs2Chip" to="/catalog?q=qum">Qum</Link>
                  <Link className="qs2Chip" to="/catalog?q=shag%CA%BBal">Shag‘al</Link>
                </div>

                <div className="qs2Grid">
                  <div className="qs2Item">
                    <div className="qs2K">Hudud</div>
                    <div className="qs2V">Toshkent</div>
                  </div>
                  <div className="qs2Item">
                    <div className="qs2K">Narx</div>
                    <div className="qs2V">arzon → qimmat</div>
                  </div>
                  <div className="qs2Item">
                    <div className="qs2K">Yetkazish</div>
                    <div className="qs2V">bor / yo‘q</div>
                  </div>
                  <div className="qs2Item">
                    <div className="qs2K">Sotuvchi</div>
                    <div className="qs2V">tekshirilgan</div>
                  </div>
                </div>

                <div className="qs2Note">
                  <ion-icon name="bulb-outline"></ion-icon>
                  <span>Tezroq qurishni boshlang.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER CAROUSEL */}
      {/* <section className="bannerV2">
        <div className="container">
          <div className="bannerWrap">
            <div className="bannerSlider">
              {banners.map((b, idx) => (
                <div
                  key={idx}
                  className={idx === active ? "bannerSlide active" : "bannerSlide"}
                >
                  <img className="bannerImg" src={b.img} alt="" />

                  <div className="bannerInner">
                    <div className="bannerIcon">
                      <ion-icon name={b.icon}></ion-icon>
                    </div>

                    <div className="bannerContent">
                      <div className="bannerTitle">{b.title}</div>
                      <div className="bannerDesc">{b.desc}</div>

                      <Link to={b.to} className="bannerCta">
                        {b.cta}
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bannerDots">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  className={idx === active ? "dot active" : "dot"}
                  onClick={() => go(idx)}
                  aria-label={`Banner ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* ✅ MASHHUR MATERIAL LAR (CTA dan oldin) */}
      <section className="popularV2">
        <div className="container">
          <div className="popularHead">
            <h2 className="popularTitle">Mashhur materiallar</h2>
          </div>

          <div className="popularGrid">
            {popularMaterials.map((m) => (
              <Link key={m.key} to={m.to} className="popularCard">
                <div className="popularImgBox">
                  <img className="popularImg" src={m.img} alt={m.label} />
                </div>
                <div className="popularLabel">{m.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ctaV2">
        <div className="container">
          <div className="ctaBox">
            <div>
              <h2>Material sotasizmi?</h2>
              <p>Bitta e’lon qo‘ying — yaqin xaridorlar o‘zlari bog‘lanadi.</p>
            </div>

            <Link className="hbtn primary" to="/seller/add">
              <ion-icon name="add-circle-outline"></ion-icon>
              E’lon joylash
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
