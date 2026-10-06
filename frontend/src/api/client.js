import axios from "axios";
import { getToken, clearSession } from "../utils/auth";

const resolveBaseUrl = () => {
  const envUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_PROXY_TARGET;

  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/+$/, "");
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }

  // Fallback for production builds to connect to the deployed backend
  if (import.meta.env.PROD) {
    return "https://ct-coaching.onrender.com/api";
  }

  // Fallback for local Vite dev server proxy
  return "/api";
};

const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 Unauthorized
      clearSession();
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/signup")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  if (!error) return "An unexpected error occurred. Please try again.";
  if (typeof error === "string") return error;

  const data = error.response?.data;
  if (typeof data === "string") return data;

  if (data?.message) {
    if (typeof data.message === "string") return data.message;
    if (typeof data.message === "object" && typeof data.message.message === "string") {
      return data.message.message;
    }
  }

  if (data?.error) {
    if (typeof data.error === "string") return data.error;
    if (typeof data.error === "object") {
      if (typeof data.error.message === "string") return data.error.message;
      try {
        return JSON.stringify(data.error);
      } catch (_) {}
    }
  }

  if (typeof error.message === "string") return error.message;

  return "An unexpected error occurred. Please try again.";
};

export default apiClient;