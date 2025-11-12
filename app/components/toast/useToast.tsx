"use client";

import React, { useState, useCallback, ReactNode } from "react";

type ToastOptions = {
  id?: number;
  type: 'success' | 'error';
  title?: string;
  description?: string;
  leaving?: boolean;
};

let toastCallback: ((options: Omit<ToastOptions, "id">) => void) | null = null;
export const toast = (options: Omit<ToastOptions, "id">) => {
  toastCallback?.(options);
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const toastFn = useCallback((options: Omit<ToastOptions, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...options }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );
    }, 3500);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  toastCallback = toastFn;

  return (
    <>
      {children}
      <div className="fixed top-6 right-5 flex flex-col gap-2 z-50">
        {toasts.map((t) => {
          const borderColor = t.type === "success" ? "border-green-500" : "border-red-500";
          const shadowColor = t.type === "success" ? "shadow-[0_4px_15px_rgba(34,197,94,0.4)]" : "shadow-[0_4px_15px_rgba(239,68,68,0.4)]";
          const animationClass = t.leaving ? "animate-slide-out" : "animate-slide-in";

          return (
            <div
              key={t.id}
              className={`
                bg-white text-black p-3 rounded min-w-[250px] max-w-[250px]: border-l-4
                ${borderColor} ${shadowColor}
                ${animationClass}
              `}
            >
              {t.title && <strong className="block">{t.title}</strong>}
              {t.description && <span className="text-sm">{t.description}</span>}
            </div>
          );
        })}
      </div>
    </>
  );
};