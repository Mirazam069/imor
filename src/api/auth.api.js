import { http } from "./http";

export const authApi = {
  async login(payload) {
    // Backend bo‘lmasa demo qaytaradi
    // payload: { phone, password }
    try {
      const { data } = await http.post("/auth/login", payload);
      return data;
    } catch {
      // DEMO
      return {
        token: "demo-token",
        user: { id: 1, name: "Demo User", phone: payload?.phone || "" },
      };
    }
  },

  async register(payload) {
    try {
      const { data } = await http.post("/auth/register", payload);
      return data;
    } catch {
      // DEMO
      return {
        token: "demo-token",
        user: { id: 1, name: payload?.name || "Demo User", phone: payload?.phone || "" },
      };
    }
  },

  async me() {
    try {
      const { data } = await http.get("/auth/me");
      return data;
    } catch {
      // DEMO
      return { id: 1, name: "Demo User", phone: "+998" };
    }
  },
};
