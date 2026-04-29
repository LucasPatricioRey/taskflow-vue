import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://backend-portafolio-r87v.onrender.com";
const REQUEST_TIMEOUT = 15000;
const NETWORK_ERROR_MESSAGE =
  "El backend no respondio a tiempo. Puede estar despertandose en Render; espera unos segundos e intenta nuevamente.";

const api = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    const isNetworkError =
      err.code === "ECONNABORTED" ||
      err.message === "Network Error" ||
      !err.response;

    if (isNetworkError && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      return api(originalRequest);
    }

    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      window.location.href = "/login";
    }

    if (isNetworkError) {
      err.userMessage = NETWORK_ERROR_MESSAGE;
    }

    return Promise.reject(err);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
