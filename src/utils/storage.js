const KEY = "qrs_token_v1";

export function getToken() {
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    // ignore
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
