import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="nf">
      <div className="nf-box">
        <div className="nf-code">404</div>

        <h1 className="nf-title">Sahifa topilmadi</h1>

        <p className="nf-text">
          Siz qidirayotgan sahifa mavjud emas yoki o‘chirilgan bo‘lishi mumkin.
        </p>

        <div className="nf-actions">
          <Link to="/" className="nf-btn primary">
            <ion-icon name="home-outline"></ion-icon>
            Bosh sahifa
          </Link>

          <Link to="/catalog" className="nf-btn ghost">
            <ion-icon name="grid-outline"></ion-icon>
            Katalog
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
