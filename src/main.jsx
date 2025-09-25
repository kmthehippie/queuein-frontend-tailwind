import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "./assets/context/ToastContext.jsx";
import { LocalStorageProvider } from "./assets/context/LocalStorageContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <LocalStorageProvider>
        <App />
      </LocalStorageProvider>
    </ToastProvider>
  </StrictMode>
);
