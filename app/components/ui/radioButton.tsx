"use client";

import React, { useState } from "react";

interface RadioButtonProps {
    label: string | React.ReactNode;
    name: string;
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    infoText?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
    label,
    name,
    value,
    checked,
    onChange,
    infoText,
}) => {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div
            className="relative flex items-center space-x-3 cursor-pointer select-none transition-colors"
            onMouseEnter={() => infoText && setShowInfo(true)}
            onMouseLeave={() => infoText && setShowInfo(false)}
        >

            <div
                className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${checked ? "border-primary" : "border-gray-400"
                    }`}
                onClick={() => onChange(value)}
            >
                {checked && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
            </div>

            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={() => onChange(value)}
                className="hidden"
            />
            <div className="relative w-fit">
                {infoText && showInfo && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs bg-black text-white text-xs italic p-2 rounded-md shadow-md z-10">
                        {infoText}
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