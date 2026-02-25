"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const QUICK_PROMPTS = [
  "What visa do I need to work in the US?",
  "How do I apply for asylum in Europe?",
  "What documents do I need for a spousal visa?",
  "How long does a Green Card take?",
];

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [showPrompts, setShowPrompts] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setValue("");
    setShowPrompts(false);
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
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const canSend = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-4 safe-bottom">

      {/* Quick prompts */}
      <AnimatePresence>
        {showPrompts && !disabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => { setValue(p); setShowPrompts(false); textareaRef.current?.focus(); }}
                  className="text-xs text-[#64748B] border border-[#E2E8F0] rounded-full px-3 py-1.5 hover:border-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-end gap-2 p-2.5 focus-within:border-[#DC2626] focus-within:shadow-[0_0_0_3px_rgba(220,38,38,0.08)] transition-all">

        {/* Quick prompts toggle */}
        <button
          onClick={() => setShowPrompts(!showPrompts)}
          disabled={disabled}
          title="Quick question suggestions"
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
            showPrompts ? "bg-[#DC2626] text-white" : "text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#64748B]"
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Connect wallet to start..." : "Ask about visa eligibility, documents, asylum..."}
          rows={1}
          className="flex-1 bg-transparent text-[#0F172A] placeholder:text-[#94A3B8] resize-none outline-none text-sm leading-relaxed max-h-28 overflow-y-auto"
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
              ? "bg-[#DC2626] shadow-sm shadow-red-200 hover:bg-[#B91C1C]"
              : "bg-[#E2E8F0] cursor-not-allowed"
            }
          `}
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className={`w-4 h-4 ${canSend ? "text-white" : "text-[#94A3B8]"}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </motion.button>
      </div>

      <p className="text-[#94A3B8] text-[10px] text-center mt-2">
        AI guidance only — not legal advice. Press Enter to send, Shift+Enter for new line.
      </p>
    </div>
  );
}
