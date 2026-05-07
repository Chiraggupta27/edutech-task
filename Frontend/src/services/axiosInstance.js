import axios from "axios";

function normalizeBaseURL(raw) {
  return raw.replace(/\/+$/, "") || raw;
}

/**
 * Vite only inlines VITE_* at **build** time. If Vercel build runs without
 * VITE_API_BASE_URL, this becomes `undefined` → axios uses same-origin →
 * `/auth/login` hits the frontend and returns 404.
 */
function resolveBaseURL() {
  const raw = (import.meta.env.VITE_API_BASE_URL || "").trim();
  const local = "http://localhost:5000/api";

  if (!raw) {
    if (import.meta.env.PROD) {
      throw new Error(
        "VITE_API_BASE_URL missing in production build. Vercel: set env → Redeploy. " +
          "Value example: https://your-service.onrender.com/api"
      );
    }
    return normalizeBaseURL(local);
  }

  if (!/^https?:\/\//i.test(raw)) {
    if (import.meta.env.PROD) {
      throw new Error(
        "VITE_API_BASE_URL must be a full URL (https://backend.onrender.com/api), not /api alone."
      );
    }
    console.warn(
      "[taskdash] VITE_API_BASE_URL should be absolute. Using local fallback."
    );
    return normalizeBaseURL(local);
  }

  return normalizeBaseURL(raw);
}

const baseURL = resolveBaseURL();

const getToken = () => {
  try {
    const raw = localStorage.getItem("taskdash_auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
};

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const apiOrigin = new URL(baseURL).origin;
      if (apiOrigin === window.location.origin) {
        console.warn(
          "[taskdash] API URL is same as this site — set VITE_API_BASE_URL to your Render URL, redeploy."
        );
      }
    } catch (_) {
      // ignore
    }
  }

  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem("taskdash_auth");
      } catch {
        // ignore
      }
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);
