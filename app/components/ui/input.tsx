"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelName?: string;
  required?: boolean;
  inputError?: string | null;
  type?: "text" | "password" | "amount" | "email" | "number";
  maxLength?: number;
  name: string;
  formValue?: string;
  onFormChange?: (name: string, value: string) => void;
}

const formatAmount = (value: string) => {
  const numeric = value.replace(/[^\d.]/g, "");
  const [intPart, decimal] = numeric.split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal ? `${formattedInt}.${decimal}` : formattedInt;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ labelName, required, inputError, type = "text", name, className, formValue, onFormChange, maxLength = 1000, ...props }, ref) => {
    const [value, setValue] = React.useState(props.value || "");
    const [showPassword, setShowPassword] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      if (newValue.length > maxLength) newValue = newValue.slice(0, maxLength);
      if (type === "amount") newValue = formatAmount(newValue);
      else if (type === "number") newValue = newValue.replace(/\D/g, "");

      setValue(newValue);
      onFormChange?.(name, newValue);
      props.onChange?.(e);
    };

    return (
      <div className="space-y-1">
        {labelName && (
          <label className="text-black dark:text-white text-sm md:text-[15px] opacity-80" htmlFor={props.id}>
            {labelName} {required && <span className="-ms-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative w-full">
          <input
            {...props}
            ref={ref}
            name={name}
            type={type === "password" ? (showPassword ? "text" : "password") : type === "amount" || type === "number" ? "text" : type}
            value={value}
            onChange={handleChange}
            className={`w-full px-4 py-2 border border-gray-300 rounded text-sm text-black dark:text-white placeholder:text-xs focus:outline-none focus:border-primary pr-10 ${className || ""}`}
          />

          {type === "password" && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          )}
        </div>

        {inputError && <p className="text-red-500 text-xs">{inputError}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;