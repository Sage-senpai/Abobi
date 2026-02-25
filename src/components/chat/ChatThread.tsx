"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage } from "@/types/chat";

interface ChatThreadProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const SUGGESTED_QUESTIONS = [
  { icon: "🇺🇸", text: "US visa options for Nigerian nationals" },
  { icon: "🏠", text: "How to apply for asylum in Germany" },
  { icon: "👨‍👩‍👧", text: "Family reunification visa requirements" },
  { icon: "💼", text: "Work permit documents checklist" },
];

export function ChatThread({ messages, isLoading }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-20 h-20 rounded-3xl bg-[#DC2626] flex items-center justify-center mb-5 shadow-lg shadow-red-200"
        >
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#0F172A] font-black text-xl mb-2"
        >
          Your AI Immigration Advisor
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[#64748B] text-sm max-w-sm leading-relaxed mb-8"
        >
          Ask anything about visas, asylum, work permits, or family immigration. I provide guidance based on official immigration guidelines.
        </motion.p>

        {/* Suggested questions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm space-y-2"
        >
          <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-3">
            Popular questions
          </p>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <motion.button
              key={q.text}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.05 }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E2E8F0] text-left hover:border-[#DC2626] hover:bg-[#FEF2F2] transition-all group"
            >
              <span className="text-xl">{q.icon}</span>
              <span className="text-[#0F172A] text-sm font-medium group-hover:text-[#DC2626] transition-colors">
                {q.text}
              </span>
              <svg className="w-4 h-4 text-[#94A3B8] ml-auto group-hover:text-[#DC2626] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F8FAFC]">
      {messages.map((msg, i) => (
        <ChatBubble key={msg.id} message={msg} index={i} />
      ))}
      <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
