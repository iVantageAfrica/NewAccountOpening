"use client";
import { Check } from "lucide-react";
import React from "react";

interface PasswordRequirementIndicatorProps {
    password: string;
}

const requirements = [
    { label: "At least 7 characters", test: (pw: string) => pw.length >= 7 },
    { label: "1 uppercase letter (A-Z)", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "1 lowercase letter (a-z)", test: (pw: string) => /[a-z]/.test(pw) },
    { label: "1 number (0-9)", test: (pw: string) => /\d/.test(pw) },
    { label: "1 special character (!@#$%^&*)", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

const PasswordRequirementIndicator: React.FC<PasswordRequirementIndicatorProps> = ({ password }) => {
    const value = password ?? "";
    const passedCount = requirements.filter((r) => r.test(value)).length;
    const allPassed = passedCount === requirements.length;

    return (
        <div className="grid gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-gray-600">Password Requirements</p>
                <p className={`text-[11px] font-bold ${allPassed ? "text-emerald-600" : "text-gray-500"}`}>
                    {passedCount}/{requirements.length}
                </p>
            </div>
            <div className="grid gap-1.5">
                {requirements.map((req, index) => {
                    const passed = req.test(value);
                    return (
                        <div key={index} className="flex items-center gap-2">
                            {passed ? (
                                <Check size={13} className="text-emerald-500 shrink-0" />
                            ) : (
                                <span className="w-[13px] h-[13px] rounded-full border border-gray-300 shrink-0" />
                            )}
                            <span className={`text-[11px] ${passed ? "text-emerald-700 font-medium" : "text-gray-400"}`}>
                                {req.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PasswordRequirementIndicator;