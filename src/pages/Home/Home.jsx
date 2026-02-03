import "./Home.css";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import RecommendedProducts from "./sections/RecommendedProducts";
import PartnerBrands from "./sections/PartnerBrands";

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

  /* Motion */
  const heroWrap = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 },
    },
  };

  const heroItem = {
    hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  const slideVariants = {
    initial: { opacity: 0, y: 10, scale: 0.995 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -10, scale: 0.995, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  };

  const sectionWrap = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  const gridWrap = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 10, scale: 0.995 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  };

  const b = banners[active];

  return (
    <div className="home dot-bg">
      {/* HERO */}
      <section className="heroV2">
        <div className="container">
          <motion.div className="heroCard" variants={heroWrap} initial="hidden" animate="show">
            {/* LEFT */}
            <motion.div className="heroLeft" variants={heroItem}>
              <motion.h1 className="heroTitle" variants={heroItem}>
                O‘zbekiston­dagi{" "}
                <span className="heroAccent">qurilish materiallari</span>
                <br /> bitta joyda
              </motion.h1>

              <motion.p className="heroSubtitle" variants={heroItem}>
                Materiallarni narx, hudud va kategoriya bo‘yicha toping.
                Sotuvchilar uchun — e’lon joylash juda oson.
              </motion.p>

              <motion.div className="heroActions" variants={heroItem}>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link className="hbtn primary" to="/catalog">
                    <ion-icon name="grid-outline"></ion-icon>
                    Katalogga o‘tish
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link className="hbtn ghost" to="/about">
                    Batafsil ma'lumot
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* RIGHT (✅ Minimal carousel — frame yo‘q, dots rasm ichida) */}
            <motion.div className="heroRight" variants={heroItem}>
              <motion.div
                className="heroCarousel"
                initial={{ opacity: 0, y: 12, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="heroCarouselViewport">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      className="heroCarouselSlide"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <motion.img
                        className="heroCarouselImg"
                        src={b.img}
                        alt=""
                        initial={{ scale: 1.02 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      />

                      {/* overlay */}
                      <div className="heroOverlay">
                        <div className="heroOverlayTop">
                          <div className="heroOverlayIcon">
                            <ion-icon name={b.icon}></ion-icon>
                          </div>
                        </div>

                        <div className="heroOverlayText">
                          <div className="heroOverlayTitle">{b.title}</div>
                          <div className="heroOverlayDesc">{b.desc}</div>

                          <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }} style={{ display: "inline-flex" }}>
                            <Link to={b.to} className="heroOverlayCta">
                              {b.cta}
                              <span className="heroOverlayArrow">
                                <ion-icon name="arrow-forward-outline"></ion-icon>
                              </span>
                            </Link>
                          </motion.div>
                        </div>

                        {/* dots (inside image) */}
                        <div className="heroDots">
                          {banners.map((_, idx) => (
                            <motion.button
                              key={idx}
                              className={idx === active ? "dot active" : "dot"}
                              onClick={() => go(idx)}
                              aria-label={`Banner ${idx + 1}`}
                              type="button"
                              whileHover={{ scale: 1.12 }}
                              whileTap={{ scale: 0.92 }}
                              transition={{ duration: 0.15 }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ✅ MASHHUR MATERIAL LAR (CTA dan oldin) */}
      <motion.section
        className="popularV2"
        variants={sectionWrap}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="container">
          <div className="popularHead">
            <motion.h2
              className="popularTitle"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Mashhur materiallar
            </motion.h2>
          </div>

          <motion.div
            className="popularGrid"
            variants={gridWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {popularMaterials.map((m) => (
              <motion.div
                key={m.key}
                variants={cardItem}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.18 }}
              >
                <Link to={m.to} className="popularCard">
                  <motion.div className="popularImgBox" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <motion.img
                      className="popularImg"
                      src={m.img}
                      alt={m.label}
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.22 }}
                    />
                  </motion.div>

                  <motion.div className="popularLabel" initial={{ opacity: 0.92 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.18 }}>
                    {m.label}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <RecommendedProducts />
      <PartnerBrands />

      {/* CTA */}
      <motion.section
        className="ctaV2"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container">
          <motion.div className="ctaBox" whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                Material sotasizmi?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                Bitta e’lon qo‘ying — yaqin xaridorlar o‘zlari bog‘lanadi.
              </motion.p>
            </div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link className="hbtn primary" to="/seller/add">
                <ion-icon name="add-circle-outline"></ion-icon>
                E’lon joylash
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>


    </div>
  );
}

export default Home;
