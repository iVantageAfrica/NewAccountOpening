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
  value?: string;
  onChange?: (value: string) => void;
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
  value = "",
  onChange,
}) => {
  const [country, setCountry] = React.useState(defaultCountryCode);
  const [phone, setPhone] = React.useState(value.replace(/\D/g, ""));


  React.useEffect(() => {
    if (onChange) {
      const formatted = `${country}${phone.replace(/^0+/, "")}`;
      onChange(formatted);
    }
  }, [country, phone]);

  return (
    <div className="space-y-1 w-full">
      {labelName && (
        <label htmlFor={name} className="text-gray-700 text-sm">
          {labelName} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex border border-gray-300 rounded overflow-hidden">
        <select
          className="hidden md:block px-3 py-2 bg-gray-100 text-sm border-r border-gray-300 outline-none w-[180px]"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label} ({c.code})
            </option>
          ))}
        </select>

        <select
          className="block md:hidden px-3 py-2 bg-gray-100 text-sm border-r border-gray-300 outline-none w-[77px]"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code}
            </option>
          ))}
        </select>

        <input
          id={name}
          name={name}
          type="tel"
          inputMode="numeric"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          className="flex-1 px-3 py-2 text-sm text-black placeholder:text-xs outline-none min-w-0"
        />
      </div>

      {inputError && <p className="text-red-500 text-xs">{inputError}</p>}
    </div>
  );
};

export default PhoneNumberInput;