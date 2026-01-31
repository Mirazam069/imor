import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

function RequireAuth() {
  const { isAuthed, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ maxWidth: 1100, margin: "60px auto", padding: "0 40px", fontWeight: 900 }}>
        Yuklanmoqda...
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
