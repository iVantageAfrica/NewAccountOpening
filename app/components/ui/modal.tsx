"use client";

import { CircleX, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ModalProps {
  isVisible: boolean;
  cancelIcon: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  type?: "center" | "side";
  title?: string;
  subTitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  subTitle,
  size = "md",
  type = "center",
  title = "Modal",
  cancelIcon = true
}) => {
  const sizeClassMap: Record<string, string> = {
    xs: "lg:w-[25%]",
    sm: "lg:w-[30%]",
    md: "lg:w-[50%]",
    lg: "lg:w-[70%]",
    xl: "lg:w-[85%]",
  };

  const modalWidth = sizeClassMap[size] || sizeClassMap["md"];

  const [show, setShow] = useState(false);
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setRender(true);
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
      setTimeout(() => setRender(false), 300);
    }
  }, [isVisible]);

  if (!render) return null;

  const transitionClass =
    type === "center"
      ? show
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95"
      : show
        ? "translate-x-0"
        : "translate-x-full";

  const baseClass =
    type === "center"
      ? "transform transition-all duration-300 ease-in-out"
      : "transform transition-transform duration-300 ease-in-out";

  if (type === "center") {
    return (
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 px-4">
        <div
          className={`bg-white rounded lg:rounded-xl w-full ${modalWidth} max-h-[80%] mb-4 md:mb-0 overflow-auto ${baseClass} ${transitionClass}`}
        >
          <div className="flex justify-between items-center  py-4 px-8 text-sm">
            <span className="text-black font-semibold text-lg">{title}</span>
            {cancelIcon && (
              <X
                size={20}
                className="cursor-pointer"
                onClick={onClose}
              />
            )}

          </div>
          <div className="grid text-xs pb-4">
            {subTitle && <p className="text-md font-bold">{subTitle}</p>}
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Side modal
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-start justify-end bg-black/70">
      <div
        className={`
          bg-white w-full ${modalWidth}
          h-[80vh] md:h-screen
          rounded-t-xl md:rounded-none
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${show ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center border-b border-gray-200 p-4 bg-white">
          <span className="text-primary font-semibold text-md truncate w-[95%]">
            {title} {subTitle}
          </span>
          <CircleX
            size={16}
            className="cursor-pointer text-primary"
            onClick={onClose}
          />
        </div>

    
        <div className="flex-1 overflow-y-auto px-4 pt-2  text-xs">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;