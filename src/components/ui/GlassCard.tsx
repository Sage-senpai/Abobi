"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glow?: boolean;
  variant?: "default" | "accent" | "dark" | "success" | "warning";
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  default: "bg-white border border-[#E2E8F0] shadow-sm",
  accent:  "bg-[#FEF2F2] border border-[#FECACA]",
  dark:    "bg-[#0F172A] text-white border border-[#1E293B]",
  success: "bg-[#F0FDF4] border border-green-200",
  warning: "bg-[#FFFBEB] border border-amber-200",
};

export function GlassCard({
  glow = false,
  variant = "default",
  className = "",
  children,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        rounded-2xl p-5
        ${variantClasses[variant]}
        ${glow ? "shadow-[0_0_0_3px_rgba(220,38,38,0.12),0_8px_24px_rgba(220,38,38,0.08)]" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
