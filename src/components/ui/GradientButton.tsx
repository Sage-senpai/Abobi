"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

const sizeClasses = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-8 py-4 text-lg gap-2.5",
};

const variantClasses = {
  primary:   "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-red-800 shadow-sm hover:shadow-md",
  secondary: "bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-sm",
  outline:   "bg-white text-[#DC2626] border-2 border-[#DC2626] hover:bg-[#FEF2F2]",
  ghost:     "bg-transparent text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]",
};

export function GradientButton({
  loading = false,
  size = "md",
  variant = "primary",
  className = "",
  children,
  disabled,
  ...props
}: GradientButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      className={`
        inline-flex items-center justify-center
        rounded-xl font-semibold
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      disabled={disabled ?? loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
