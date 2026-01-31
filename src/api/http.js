// src/api/http.js
import axios from "axios";
import { API_URL } from "../config/env";
import { getToken, clearToken } from "../utils/storage";

export const http = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) clearToken();

    const url = err?.config?.baseURL
      ? `${err.config.baseURL}${err.config.url || ""}`
      : err?.config?.url;

    console.error("[API ERROR]", {
      status: err?.response?.status,
      url,
      data: err?.response?.data,
      message: err?.message,
    });

    return Promise.reject(err);
  }
);
