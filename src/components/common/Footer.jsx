import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footerX">
      <div className="footerX-container">
        
        {/* TOP */}
        <div className="footerX-top">
          <div className="footerX-brand">
            <h3>IMOR</h3>
            <p>
              Qurilish materiallari uchun zamonaviy marketplace. 
              Ishonchli sotuvchilar, real narxlar va tez yetkazib berish.
            </p>
          </div>

          <div className="footerX-links">
            <div>
              <h4>Platforma</h4>
              <a href="/catalog">Katalog</a>
              <a href="/post-ad">E’lon joylash</a>
              <a href="/login">Kirish</a>
            </div>

            <div>
              <h4>Ma’lumot</h4>
              <a href="#">Biz haqimizda</a>
              <a href="#">Foydalanish shartlari</a>
              <a href="#">Maxfiylik siyosati</a>
            </div>

            <div>
              <h4>Aloqa</h4>
              <a href="tel:+998900000000">+998 90 000 00 00</a>
              <a href="mailto:info@imor.uz">info@imor.uz</a>
              <span>Toshkent, O‘zbekiston</span>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footerX-bottom">
          <span>© {new Date().getFullYear()} IMOR</span>
          <span>Qurilish bozori platformasi</span>
        </div>

      </div>
    </footer>
  );
}
