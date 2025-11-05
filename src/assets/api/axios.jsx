import axios from "axios";

// const userAgentString = navigator.userAgent;

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
});

export default api;
export const apiPrivate = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  credentials: "include",
});

export const interceptedApiPrivate = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  credentials: "include",
});
