"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glow?: boolean;
  children: React.ReactNode;
}

export function GlassCard({ glow = false, className = "", children, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={`glass ${glow ? "glow-purple" : ""} p-5 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
