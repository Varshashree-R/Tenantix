import axios from "axios";
import { logOut } from "../features/auth/authSlice";

let store;

// Inject Redux store to dispatch logOut on token expiry
export const injectStore = (_store) => {
  store = _store;
};

// Base API URL
const baseURL =
  import.meta.env.VITE_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "https://tenantix-finalbackend.onrender.com/api"
    : "/api");

// Create Axios instance
const axiosFetch = axios.create({
  baseURL,
  withCredentials: true, // ✅ send cookies
});

// ==================== REQUEST INTERCEPTOR ====================
axiosFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
axiosFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    const userType = localStorage.getItem("userType"); // owner or tenant

    // Token expired handling
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.msg === "Access Token is not valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const rs = await axiosFetch.get(`/auth/${userType}/refresh`);
        localStorage.setItem("token", rs.data.accessToken);
        return axiosFetch(originalRequest); // Retry original request
      } catch (err) {
        const invalidRefreshMessages = [
          "Invalid refresh token",
          "Refresh token not found",
        ];
        if (
          err?.response?.status === 401 &&
          invalidRefreshMessages.includes(err?.response?.data?.msg)
        ) {
          if (store) store.dispatch(logOut()); // Dispatch logout globally
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosFetch;
