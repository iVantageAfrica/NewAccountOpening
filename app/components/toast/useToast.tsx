"use client";

import React, { useState, useCallback, ReactNode, useEffect } from "react";

type ToastOptions = {
  id?: number;
  type: "success" | "error";
  title?: string;
  description?: string;
  leaving?: boolean;
};

// useRef to hold the latest callback
const toastCallbackRef = { current: null as null | ((options: Omit<ToastOptions, "id">) => void) };

// Exported toast function
export const toast = (options: Omit<ToastOptions, "id">) => {
  toastCallbackRef.current?.(options);
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);
  const toastFn = useCallback((options: Omit<ToastOptions, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...options }]);

    // Animate leaving
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );
    }, 8500);

    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 9000);
  }, []);

  // Update the ref once after mount
  useEffect(() => {
    toastCallbackRef.current = toastFn;
  }, [toastFn]);

  return (
    <>
      {children}
      <div className="fixed top-6 right-5 flex flex-col gap-2 z-50">
        {toasts.map((t) => {
          const bgColor = t.type === "success" ? "bg-green-600" : "bg-red-600";
          const textColor = "text-white";
          const animationClass = t.leaving ? "animate-slide-out" : "animate-slide-in";

          return (
            <div
              key={t.id}
              className={`
                ${bgColor} ${textColor} p-3 rounded min-w-[350px] max-w-[350px] border-l-4 border-white
                shadow-[0_4px_15px_rgba(0,0,0,0.2)]
                ${animationClass}
              `}
            >
              {t.title && <strong className="block">{t.title}</strong>}
              {t.description && <span className="block text-sm">{t.description}</span>}
            </div>
          );
        })}
      </div>
    </>
  );
};