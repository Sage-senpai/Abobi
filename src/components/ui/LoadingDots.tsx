"use client";

interface LoadingDotsProps {
  size?: "sm" | "md";
  className?: string;
}

export function LoadingDots({ size = "md", className = "" }: LoadingDotsProps) {
  const dotClass = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`${dotClass} rounded-full bg-current`}
          style={{
            animation: `typing-dot 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </span>
  );
}
