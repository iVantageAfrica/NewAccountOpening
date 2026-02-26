"use client";
import React from "react";

interface CountryOption { label: string; code: string; }


interface PhoneNumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  name: string;
  labelName?: string;
  required?: boolean;
  inputError?: string | null;
  countries?: CountryOption[];
  defaultCountryCode?: string;
  value?: string;
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
    { label: "🇪🇬 Egypt", code: "+20" },
    { label: "🇹🇿 Tanzania", code: "+255" },
    { label: "🇺🇬 Uganda", code: "+256" },
    { label: "🇲🇦 Morocco", code: "+212" },
    { label: "🇩🇿 Algeria", code: "+213" },
    { label: "🇨🇮 Ivory Coast", code: "+225" },
    { label: "🇬🇧 United Kingdom", code: "+44" },
    { label: "🇩🇪 Germany", code: "+49" },
    { label: "🇫🇷 France", code: "+33" },
    { label: "🇮🇹 Italy", code: "+39" },
    { label: "🇪🇸 Spain", code: "+34" },
    { label: "🇵🇹 Portugal", code: "+351" },
    { label: "🇳🇱 Netherlands", code: "+31" },
    { label: "🇸🇪 Sweden", code: "+46" },
    { label: "🇳🇴 Norway", code: "+47" },
    { label: "🇨🇭 Switzerland", code: "+41" },
    { label: "🇧🇪 Belgium", code: "+32" },
    { label: "🇦🇹 Austria", code: "+43" },
    { label: "🇫🇮 Finland", code: "+358" },
    { label: "🇩🇰 Denmark", code: "+45" },
    { label: "🇱🇺 Luxembourg", code: "+352" },
    { label: "🇮🇸 Iceland", code: "+354" },
    { label: "🇱🇻 Latvia", code: "+371" },
    { label: "🇱🇹 Lithuania", code: "+370" },
    { label: "🇪🇪 Estonia", code: "+372" },
    { label: "🇸🇰 Slovakia", code: "+421" },
    { label: "🇸🇮 Slovenia", code: "+386" },
    { label: "🇭🇺 Hungary", code: "+36" },
    { label: "🇵🇱 Poland", code: "+48" },
    { label: "🇨🇿 Czech Republic", code: "+420" },
    { label: "🇹🇷 Turkey", code: "+90" },
    { label: "🇺🇸 United States", code: "+1" },
  ],
  defaultCountryCode = "+234",
  value ="",
  onChange,
}) => {

 const countryCode = countries.find(c => value?.startsWith(c.code))?.code || defaultCountryCode;
const phone = (value || "").replace(countryCode, "").replace(/\D/g, "");

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
        <label htmlFor={name} className="text-gray-700 text-sm">
          {labelName} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex border border-gray-300 rounded overflow-hidden">
        <select
          className="hidden lg:block px-3 py-2 bg-gray-100 text-sm border-r border-gray-300 outline-none w-[180px]"
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
          className="block lg:hidden px-3 py-2 bg-gray-100 text-sm border-r border-gray-300 outline-none w-[77px]"
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
          className="flex-1 px-3 py-2 text-sm text-black placeholder:text-xs outline-none min-w-0"
        />
      </div>

      {inputError && <p className="text-red-500 text-xs">{inputError}</p>}
    </div>
  );
};

export default PhoneNumberInput;