import "./AboutProject.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AboutProject() {
  const navigate = useNavigate();

  const faqs = useMemo(
    () => [
      {
        q: "IMOR.uz nima?",
        a: "IMOR.uz — qurilish materiallari bozorini soddalashtiradigan marketplace. Xaridorlar materiallarni tez topadi, sotuvchilar esa o‘z mahsulotlarini ko‘proq mijozga chiqaradi.",
      },
      {
        q: "Kimlar uchun?",
        a: "Uy qurayotganlar, usta va brigadalar, qurilish kompaniyalari, do‘konlar, dilerlar, ishlab chiqaruvchilar va logistika xizmatlari uchun.",
      },
      {
        q: "Mahsulotlar qanday joylanadi?",
        a: "Sotuvchi “Mahsulot qo‘shish” orqali nom, narx, birlik, minimal miqdor, hudud, telefon/telegram va mahsulot rasmini yuklab e’lon qiladi. E’lon katalogda ko‘rinadi.",
      },
      {
        q: "Buyurtma va to‘lov qanday bo‘ladi?",
        a: "Hozirgi bosqichda buyurtma oqimi soddalashtirilgan (demo / MVP). Keyingi bosqichlarda: buyurtma, to‘lov, hisob-faktura, yetkazib berish tracking va kafolat tizimi qo‘shiladi.",
      },
      {
        q: "Nega rasm majburiy?",
        a: "Rasm — ishonchni oshiradi va mijoz tanlovini tezlashtiradi. IMOR’da e’lon sifati yuqori bo‘lishi uchun rasm talab qilinadi.",
      },
      {
        q: "Qanday foyda beradi?",
        a: "Vaqt tejaladi, solishtirish oson, sotuvchilar uchun ko‘proq so‘rov, xaridor uchun aniq narx va hudud bo‘yicha topish, kelishuvni tezlashtiradi.",
      },
    ],
    []
  );

  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="apj-wrap dot-bg">
      <div className="apj-container">
        {/* TOP BAR */}
        <div className="apj-top">
          <button className="apj-back" type="button" onClick={() => navigate(-1)}>
            ← Orqaga
          </button>

          <div className="apj-actions">
            <button className="apj-btn ghost" type="button" onClick={() => navigate("/catalog")}>
              Katalogni ko‘rish
            </button>
            <a
              className="apj-btn"
              href="https://t.me/USERNAME"
              target="_blank"
              rel="noopener noreferrer"
            >
              E'lon joylash
            </a>
          </div>
        </div>

        {/* HERO */}

        {/* WHO FOR */}
        <section className="apj-sec">
          <div className="apj-secHead">
            <h2 className="apj-h2">IMOR.uz kimlar uchun?</h2>
            <p className="apj-p">
              Platforma qurilish ekotizimidagi hamma ishtirokchilarni birlashtiradi.
            </p>
          </div>

          <div className="apj-grid3">
            <div className="apj-card">
              <div className="apj-ic">
                <ion-icon name="home-outline" />
              </div>
              <h3>Uy qurayotganlar</h3>
              <p>Materiallarni tez toping, narx va birlik bo‘yicha solishtiring, sotuvchi bilan bog‘laning.</p>
            </div>

            <div className="apj-card">
              <div className="apj-ic">
                <ion-icon name="hammer-outline" />
              </div>
              <h3>Usta va brigadalar</h3>
              <p>Kerakli materiallarni bir joydan topib, vaqtni tejang. Hudud bo‘yicha topish qulay.</p>
            </div>

            <div className="apj-card">
              <div className="apj-ic">
                <ion-icon name="business-outline" />
              </div>
              <h3>Kompaniyalar</h3>
              <p>Ko‘p miqdordagi materiallar uchun tez kelishuv. Minimal miqdor va yetkazib berish ko‘rsatiladi.</p>
            </div>

            <div className="apj-card">
              <div className="apj-ic">
                <ion-icon name="storefront-outline" />
              </div>
              <h3>Do‘konlar va dilerlar</h3>
              <p>E’lon berib, mahsulotingizni ko‘proq odamga ko‘rsating. Telefon/Telegram orqali tez savdo.</p>
            </div>

            <div className="apj-card">
              <div className="apj-ic">
                <ion-icon name="cube-outline" />
              </div>
              <h3>Ishlab chiqaruvchilar</h3>
              <p>Mahsulotingizni brend sifatida joylang, premium ko‘rinish/SEO pozitsiyalarini keyinroq ulash mumkin.</p>
            </div>

            <div className="apj-card">
              <div className="apj-ic">
                <ion-icon name="car-outline" />
              </div>
              <h3>Logistika</h3>
              <p>Yetkazib berish xizmatlari bilan integratsiya — keyingi bosqichlarimizdan biri.</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="apj-sec">
          <div className="apj-secHead">
            <h2 className="apj-h2">Qanday ishlaydi?</h2>
            <p className="apj-p">
              3 qadamda: topish → aloqa → kelishuv. Sotuvchi uchun: joylash → ko‘rinish → savdo.
            </p>
          </div>

          <div className="apj-steps">
            <div className="apj-step">
              <div className="apj-stepNum">1</div>
              <div className="apj-stepBody">
                <h3>Qidirish va solishtirish</h3>
                <p>Katalogdan tur tanlang: g‘isht, sement, armatura va boshqalar. Narx va birlik aniq ko‘rinadi.</p>
              </div>
            </div>

            <div className="apj-step">
              <div className="apj-stepNum">2</div>
              <div className="apj-stepBody">
                <h3>Aloqa</h3>
                <p>Telefon yoki Telegram orqali sotuvchi bilan bog‘laning. Hudud va minimal miqdor ham ko‘rsatiladi.</p>
              </div>
            </div>

            <div className="apj-step">
              <div className="apj-stepNum">3</div>
              <div className="apj-stepBody">
                <h3>Kelishuv va yetkazib berish</h3>
                <p>Kelishuv qiling. Yetkazib berish bor-yo‘qligi e’lonning o‘zida ko‘rinadi.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        {/* <section className="apj-sec">
          <div className="apj-secHead">
            <h2 className="apj-h2">Asosiy imkoniyatlar</h2>
            <p className="apj-p">MVP bosqichida ham eng kerakli funksiyalar bor — tez ishlash, soddalik va aniqlik.</p>
          </div>

          <div className="apj-grid2">
            <div className="apj-feature">
              <ion-icon name="search-outline" />
              <div>
                <h3>Katalog va tez topish</h3>
                <p>Tur bo‘yicha tartib, demo narxlar bilan fallback, keyin real DB mahsulotlar bilan to‘liq ishlaydi.</p>
              </div>
            </div>

            <div className="apj-feature">
              <ion-icon name="images-outline" />
              <div>
                <h3>Rasm bilan e’lon</h3>
                <p>Rasm ishonchni oshiradi. Sotuvchi panelida rasm yuklanadi va e’lon bilan birga chiqadi.</p>
              </div>
            </div>

            <div className="apj-feature">
              <ion-icon name="location-outline" />
              <div>
                <h3>Hudud bo‘yicha</h3>
                <p>E’lonlarda hudud ko‘rsatiladi — logistika va kelishuv ancha tez bo‘ladi.</p>
              </div>
            </div>

            <div className="apj-feature">
              <ion-icon name="call-outline" />
              <div>
                <h3>Tez aloqa</h3>
                <p>Telefon va Telegram orqali sotuvchi bilan tez bog‘lanish — “yozish/qo‘ng‘iroq qilish” qulay.</p>
              </div>
            </div>

            <div className="apj-feature">
              <ion-icon name="calculator-outline" />
              <div>
                <h3>Birlik va minimal miqdor</h3>
                <p>kg, qop, dona, metr va hokazo. Minimal miqdor ham yoziladi — ortiqcha savollar kamayadi.</p>
              </div>
            </div>

            <div className="apj-feature">
              <ion-icon name="cart-outline" />
              <div>
                <h3>Korzina</h3>
                <p>Tanlangan mahsulotlarni jamlab ko‘rish, miqdorini boshqarish va umumiy summani bilish.</p>
              </div>
            </div>
          </div>
        </section> */}

        {/* TRUST */}

        {/* ROADMAP */}
        <section className="apj-sec">
          <div className="apj-secHead">
            <h2 className="apj-h2">Roadmap</h2>
            <p className="apj-p">MVP → Stabil → Marketplace. Dastlab tez start, keyin kuchli tizim.</p>
          </div>

          <div className="apj-timeline">
            <div className="apj-timeItem">
              <div className="apj-timeDot" />
              <div className="apj-timeBody">
                <h3>MVP (hozir)</h3>
                <p>Katalog, mahsulot e’lonlari, rasm, aloqa, korzina, sotuvchi paneli.</p>
              </div>
            </div>

            <div className="apj-timeItem">
              <div className="apj-timeDot" />
              <div className="apj-timeBody">
                <h3>Stabil versiya</h3>
                <p>Buyurtma oqimi, to‘lov, invoice, yetkazib berish holati (tracking), profil va verifikatsiya.</p>
              </div>
            </div>

            <div className="apj-timeItem">
              <div className="apj-timeDot" />
              <div className="apj-timeBody">
                <h3>Marketplace</h3>
                <p>Reyting, sharhlar, premium joylar, SEO pozitsiyalar, brendlar uchun bannerlar.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="apj-sec">
          <div className="apj-secHead">
            <h2 className="apj-h2">Ko‘p so‘raladigan savollar</h2>
            <p className="apj-p">Eng ko‘p beriladigan savollarga qisqa va aniq javoblar.</p>
          </div>

          <div className="apj-faq">
            {faqs.map((x, idx) => {
              const open = openFaq === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`apj-faqItem ${open ? "open" : ""}`}
                  onClick={() => setOpenFaq(open ? -1 : idx)}
                >
                  <div className="apj-faqQ">
                    <span>{x.q}</span>
                    <ion-icon name={open ? "remove-outline" : "add-outline"} />
                  </div>
                  {open ? <div className="apj-faqA">{x.a}</div> : null}
                </button>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="apj-cta">
          <div className="apj-ctaBox">
            <div>
              <h2>IMOR’da boshlashga tayyormisiz?</h2>
              <p>
                Katalogni ko‘ring yoki darhol e’lon bering. IMOR — qurilish materiallarini topish va sotishni
                tezlashtiradi.
              </p>
            </div>

            <div className="apj-ctaBtns">
              <a
              className="apj-btn"
              href="https://t.me/USERNAME"
              target="_blank"
              rel="noopener noreferrer"
            >
              E'lon joylash
              <ion-icon name="megaphone-outline" />
            </a>
            </div>
          </div>

          <div className="apj-footNote">
            <ion-icon name="information-circle-outline" />
            <span>
              Eslatma: platforma MVP bosqichida. Takliflar va hamkorlik uchun aloqa:{" "}
              <b>@mirzahidov1ch</b> (Telegram).
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
