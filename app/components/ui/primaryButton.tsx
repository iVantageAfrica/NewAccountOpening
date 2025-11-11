import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    icon?: ReactNode;
    variant?: "primary" | "secondary";
    loading?: boolean;
}
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    icon,
    variant = "primary",
    loading = false,
    disabled,
    ...props
}) => {
    const baseClass =
        "w-full py-2 px-4 font-bold text-sm rounded cursor-pointer transform transition-transform flex items-center justify-center";
    const disabledClass =
        "cursor-not-allowed hover:scale-100";

    const variantClass =
        variant === "primary"
            ? "bg-primary text-white hover:scale-102"
            : "bg-white text-black border border-primary hover:scale-102";

    return (
        <button
            className={`${baseClass} ${variantClass} ${loading || disabled ? disabledClass : ""}`}
            disabled={loading || disabled}
            {...props}
        >

            {loading ? (
                <div className="flex items-center gap-2">
                    <svg
                        className="animate-spin h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4.5" 
                        ></circle>
                        <path
                            className="opacity-90"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 000 16v4l3.5-3.5L12 20v4a8 8 0 01-8-8z"
                        ></path>
                    </svg>

                </div>
            ) : (
                <div className="flex items-center justify-center gap-2">
                    {children}
                    {icon && <span className="inline-block font-bold">{icon}</span>}
                </div>
            )}
        </button>
    );
}

export default PrimaryButton;