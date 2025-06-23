import React, {
  useState,
  createContext,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Toast from "../components/Toast";

const ToastContext = createContext(null);
const TOAST_TIMEOUT = 30000;
const MAX_TOASTS = 5;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastIdCounter = useRef(0);

  const openToast = useCallback((content, options = {}) => {
    const id = Date.now() + toastIdCounter.current++;
    const newToast = {
      id,
      content,
      type: options.type || "info",
      duration: options.duration || TOAST_TIMEOUT,
      sticky: options.sticky || false,
      ...options,
    };

    setToasts((prevToast) => {
      if (prevToast.some((toast) => toast.id === newToast.id)) {
        console.warn(`Toast with ID ${newToast.id} already exist.`);
        return prevToast;
      }
      let updatedToasts = [newToast, ...prevToast];
      if (updatedToasts.length > MAX_TOASTS) {
        const firstNonStickyIndex = updatedToasts.findIndex((t) => !t.sticky);
        if (firstNonStickyIndex !== -1) {
          updatedToasts.splice(firstNonStickyIndex, 1);
        } else {
          if (updatedToasts.length > MAX_TOASTS) {
            updatedToasts.shift();
          }
        }
      }
      return updatedToasts;
    });
  }, []);

  const closeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id != id));
  };

  const contextValue = useMemo(
    () => ({
      open: openToast,
      close: closeToast,
    }),
    []
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        className="fixed top-0 right-0 p-4 flex flex-col gap-2 z-[9999] pointer-events-none"
        // The individual Toast components will have pointer-events-auto
      >
        {toasts &&
          toasts.map((toast) => {
            return (
              <Toast
                key={toast.id}
                {...toast}
                close={() => closeToast(toast.id)}
              />
            );
          })}{" "}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
