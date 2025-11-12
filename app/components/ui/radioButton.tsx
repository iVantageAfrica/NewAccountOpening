"use client";

import React, { useState } from "react";

interface RadioButtonProps {
  label: string | React.ReactNode;
  name: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  infoText?: string;
  error?: string | null;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  name,
  checked,
  onChange,
  infoText,
  error,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const showTooltip = isHovered || !!error;

  return (
    <div
      className="relative flex items-center space-x-3 cursor-pointer select-none transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
          checked ? "border-primary" : "border-gray-400"
        } ${error ? "border-red-500" : ""}`}
        onClick={() => onChange(!checked)}
      >
        {checked && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
      </div>

      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={() => onChange(!checked)}
        className="hidden"
      />

      <div className="relative w-fit">
        {showTooltip && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs bg-black text-white text-xs italic p-2 rounded-md shadow-md z-10">
            {error || infoText}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
          </div>
        )}

        <label
          htmlFor={name}
          className={`text-xs md:text-sm ${checked ? "text-black" : "text-gray-600"}`}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default RadioButton;