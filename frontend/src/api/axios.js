
import axios from "axios";

const api = axios.create({
  baseURL: "https://ludhiana-express-3zlsuk6os-practice-74ee.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired / invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new CustomEvent("auth-expired"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
