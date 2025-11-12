"use client";

import * as React from "react";

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
  ({ labelName, required, inputError, type = "text", name, className,formValue, onFormChange, maxLength = 1000, ...props }, ref) => {
    const [value, setValue] = React.useState(props.value || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      if (newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
      }
      if (type === "amount") {
        newValue = formatAmount(newValue);
      }
      else if (type === "number") {
        newValue = newValue.replace(/\D/g, "");
      }
      setValue(newValue);
      onFormChange?.(name, newValue);
      props.onChange?.(e);
    };

    return (
      <div className="space-y-1">
        {labelName && (
          <label className="text-gray-700 dark:text-white text-sm md:text-[15px]" htmlFor={props.id}>
            {labelName} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          {...props}
          ref={ref}
          name={name}
          type={type === "amount" ||"number" ? "text" : type}
          value={value}
          onChange={handleChange}
          className={`w-full px-4 py-2 border border-gray-300 rounded text-sm text-black dark:text-white placeholder:text-xs focus:outline-none focus:border-primary ${className || ""}`}
        />
        {inputError && <p className="text-red-500 text-xs">{inputError}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;