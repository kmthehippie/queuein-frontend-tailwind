import axios from "axios";

// const userAgentString = navigator.userAgent;

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // headers: {
  //   "User-Agent": userAgentString,
  // },
});
export default api;

export const apiPrivate = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "User-Agent": userAgentString,
  },
  withCredentials: true,
  credentials: "include",
});

export const interceptedApiPrivate = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "User-Agent": userAgentString,
  },
  withCredentials: true,
  credentials: "include",
});
