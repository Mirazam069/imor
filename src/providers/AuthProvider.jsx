import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/auth.api";
import { getToken, setToken, clearToken } from "../utils/storage";

export const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // app start
  const [authLoading, setAuthLoading] = useState(false); // login/register

  const isAuthed = !!getToken();

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          if (!cancelled) setUser(null);
          return;
        }
        const me = await authApi.me();
        if (!cancelled) setUser(me);
      } catch {
        clearToken();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    boot();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async ({ phone, password }) => {
    setAuthLoading(true);
    try {
      const res = await authApi.login({ phone, password });
      // res: { token, user }
      if (res?.token) setToken(res.token);
      setUser(res?.user || null);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e?.message || "Login xato" };
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async ({ name, phone, password }) => {
    setAuthLoading(true);
    try {
      const res = await authApi.register({ name, phone, password });
      if (res?.token) setToken(res.token);
      setUser(res?.user || null);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e?.message || "Register xato" };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      authLoading,
      isAuthed,
      login,
      register,
      logout,
    }),
    [user, loading, authLoading, isAuthed]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}
