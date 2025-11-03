import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "./assets/context/ToastContext.jsx";
import { LocalStorageProvider } from "./assets/context/LocalStorageContext.jsx";
import { ThemeProvider } from "./assets/context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <LocalStorageProvider>
          <App />
        </LocalStorageProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
