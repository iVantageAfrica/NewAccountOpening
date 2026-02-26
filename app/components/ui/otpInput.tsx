"use client";

import React, { useState, useRef, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  onChange?: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(length).fill(null));

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    onChange?.(newOtp.join(""));
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };


  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    const digits = pasted.replace(/\D/g, "").split("").slice(0, length);
    const newOtp = [...otp];
    digits.forEach((digit, i) => (newOtp[i] = digit));
    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    const nextIndex = Math.min(digits.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);



  return (
    <div className="flex flex-wrap justify-center gap-3  w-full max-w-full">
      {otp.map((value, index) => (
        <input
          key={index}
          ref={(el: HTMLInputElement | null): void => {
            inputRefs.current[index] = el; // explicitly returns void
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`w-10 h-10 text-center text-[16px] font-semibold rounded-md border-2 outline-none transition-colors
          ${value ? "border-secondary" : "border-gray-300"}
          focus:border-primary`}
        />
      ))}
    </div>
  );
};

export default OtpInput;