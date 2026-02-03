import "./RecommendedProducts.css";
import { Link } from "react-router-dom";
import Sement from "../../images/sement.jpg";
import Sement2 from "../../images/sement2.jpg";
import Sement3 from "../../images/sement3.jpg";
import Sement4 from "../../images/sement4.jpg";

const demoProducts = [
  { id: 1, title: "Sement M500 (50kg)", price: "78 000 so‘m", city: "Toshkent",img: Sement,  to: "/catalog?q=sement" },
  { id: 2, title: "Armatura 12mm", price: "12 500 so‘m / m", city: "Toshkent", img: Sement2, to: "/catalog?q=armatura" },
  { id: 3, title: "G‘isht (pishgan)", price: "1 350 so‘m", city: "Samarqand", img: Sement3, to: "/catalog?q=g%CA%BBisht" },
  { id: 4, title: "Quruq aralashma (25kg)", price: "42 000 so‘m", city: "Andijon", img: Sement4, to: "/catalog?q=aralashma" },
];

function RecommendedProducts() {
  return (
    <section className="recV2">
      <div className="container">
        <div className="recHead">
          <div>
            <h2 className="recTitle">Tavsiya etiladigan mahsulotlar</h2>
            <p className="recDesc">
              Eng ko‘p ko‘rilayotgan va talab yuqori bo‘lgan takliflar.
            </p>
          </div>

          <Link className="recAll" to="/catalog">
            Hammasini ko‘rish
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </Link>
        </div>

        <div className="recGrid">
          {demoProducts.map((p) => (
            <Link key={p.id} to={p.to} className="recCard">
              <div className="recImgBox">
                <div className="recImgFallback" />
                <img className="recImg" src={p.img} alt={p.title} />
              </div>

              <div className="recBody">
                <div className="recName">{p.title}</div>

                <div className="recMeta">
                  <span className="recPrice">{p.price}</span>
                  <span className="recDot">•</span>
                  <span className="recCity">{p.city}</span>
                </div>

                <div className="recFoot">
                  <span className="recBadge">
                    <ion-icon name="sparkles-outline"></ion-icon>
                    Tavsiya
                  </span>

                  <span className="recLink">
                    Ko‘rish
                    <ion-icon name="chevron-forward-outline"></ion-icon>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecommendedProducts;
