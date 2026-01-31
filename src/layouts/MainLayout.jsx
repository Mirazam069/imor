import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Navbar (senda shu yo‘l bo‘lishi mumkin)
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
// Agar senda Navbar shu faylda bo‘lsa: "../components/common/Navbar.jsx" qilib qo‘y.

function MainLayout() {
  const location = useLocation();

  // Route o‘zgarganda tepaga scroll
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname, location.search]);

  return (
    <div className="appShell">
      <Navbar />
      <main className="appMain">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}

export default MainLayout;
