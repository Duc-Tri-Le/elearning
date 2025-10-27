import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = "primary",
    size = "md",
    ...props
}) => {
    const base =
        "inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"; // 👈 thêm cursor-pointer ở đây

    const variants = {
        primary:"bg-white text-[#0070f3] border border-[#0070f3] rounded-lg px-4 py-2 cursor-pointer font-semibold hover:bg-[#0070f3] hover:text-white transition",
        secondary:
            "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400",
        outline:
            "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-400",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            className={cn(base, variants[variant], sizes[size], className)}
            {...props}
        />
    );
};
