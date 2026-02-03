import { Navigate, Outlet, useLocation } from "react-router-dom";

function readAuth() {
  try {
    const raw = localStorage.getItem("qrs_auth") || sessionStorage.getItem("qrs_auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function RequireSeller() {
  const location = useLocation();
  const auth = readAuth();

  const isSeller = !!auth?.user?.isSeller || auth?.user?.role === "seller";

  if (!isSeller) {
    // agar kimdir /seller/* ga kirsa, keyin login bo‘lsa qaytishi uchun
    try {
      sessionStorage.setItem("qrs_redirect", location.pathname);
    } catch {}

    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
