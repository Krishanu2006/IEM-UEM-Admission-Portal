import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("iem_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend rejects a stored token (expired / invalid), tell AuthContext
// to clear the session. Login requests are excluded so that "wrong password"
// errors are shown on the form instead of being treated as a session expiry.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isLoginRequest = url.includes("/auth/login") || url.includes("/auth/admin/login");

    if (error.response?.status === 401 && !isLoginRequest && localStorage.getItem("iem_token")) {
      window.dispatchEvent(new Event("iem:unauthorized"));
    }

    return Promise.reject(error);
  }
);

export default api;
