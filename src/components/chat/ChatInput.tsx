"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isLoading, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-grow textarea
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const canSend = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="px-4 pb-4 safe-bottom">
      <div className="glass flex items-end gap-3 p-3 rounded-2xl">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Talk to Abobi..."
          rows={1}
          className="flex-1 bg-transparent text-white placeholder:text-white/30 resize-none outline-none text-sm leading-relaxed max-h-28 overflow-y-auto"
          disabled={disabled}
        />
        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          whileTap={{ scale: 0.92 }}
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
            transition-all duration-200
            ${canSend
              ? "bg-gradient-to-br from-abobi-purple to-abobi-glow glow-sm"
              : "bg-white/10 cursor-not-allowed"
            }
          `}
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </motion.button>
      </div>
    </div>
  );
}
