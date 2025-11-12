"use client";
import React from "react";

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  labelName?: string;
  required?: boolean;
  inputError?: string | null;
  name: string;
  options: Option[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({
  labelName,
  required,
  inputError,
  name,
  options,
  value = "",
  onChange,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {labelName && (
        <label htmlFor={name} className="text-gray-700 text-sm md:text-[15px]">
          {labelName} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-primary ${className || ""}`}
        {...props}
      >
        <option value="" disabled>
          -- Select {labelName || "option"} --
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {inputError && <p className="text-red-500 text-xs">{inputError}</p>}
    </div>
  );
};

export default Select;