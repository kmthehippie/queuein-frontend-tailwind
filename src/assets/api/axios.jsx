import axios from "axios";

// const userAgentString = navigator.userAgent;

const api = axios.create({
  baseURL: "/api",
});
export default api;
export const apiPrivate = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  credentials: "include",
});

export const interceptedApiPrivate = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  credentials: "include",
});
