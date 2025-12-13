"use client";
import React from "react";

interface CountryOption { label: string; code: string; }

interface PhoneNumberInputProps {
  name: string;
  labelName?: string;
  required?: boolean;
  inputError?: string | null;
  countries?: CountryOption[];
  defaultCountryCode?: string;
  value: string;
  onChange: (value: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  name,
  labelName = "Phone Number",
  required,
  inputError,
  countries = [
    { label: "🇳🇬 Nigeria", code: "+234" },
    { label: "🇬🇭 Ghana", code: "+233" },
    { label: "🇰🇪 Kenya", code: "+254" },
    { label: "🇿🇦 South Africa", code: "+27" },
  ],
  defaultCountryCode = "+234",
  value,
  onChange,
}) => {

  const countryCode = countries.find(c => value.startsWith(c.code))?.code || defaultCountryCode;

  const phone = value.replace(countryCode, "").replace(/\D/g, "");

  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/\D/g, "");
    onChange(`${countryCode}${clean.replace(/^0+/, "")}`);
  };

  const handleCountryChange = (val: string) => {
    onChange(`${val}${phone}`);
  };

  return (
    <div className="space-y-1 w-full">
      {labelName && (
        <label htmlFor={name} className="text-gray-700 text-sm dark:text-white">
          {labelName} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex border border-gray-300 rounded overflow-hidden">
        <select
          className="hidden md:block px-3 py-2 bg-gray-100 text-sm border-r border-gray-300 outline-none w-[180px] dark:text-black"
          value={countryCode}
          onChange={(e) => handleCountryChange(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label} ({c.code})
            </option>
          ))}
        </select>

        <select
          className="block md:hidden px-3 py-2 bg-gray-100 text-sm border-r border-gray-300 outline-none w-[77px] dark:text-black"
          value={countryCode}
          onChange={(e) => handleCountryChange(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>{c.code}</option>
          ))}
        </select>

        <input
          id={name}
          name={name}
          type="tel"
          inputMode="numeric"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm text-black placeholder:text-xs outline-none min-w-0 dark:text-white"
        />
      </div>

      {inputError && <p className="text-red-500 text-xs">{inputError}</p>}
    </div>
  );
};

export default PhoneNumberInput;