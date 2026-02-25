"use client";

import { motion } from "framer-motion";
import type { ChatMessage } from "@/types/chat";

interface ChatBubbleProps {
  message: ChatMessage;
  index: number;
}

export function ChatBubble({ message, index }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.25) }}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-[#DC2626] flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5 shadow-sm shadow-red-200">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      )}

      <div className="flex flex-col max-w-[78%]">
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-[#0F172A] text-white rounded-br-sm shadow-sm"
              : "bg-white text-[#0F172A] border border-[#E2E8F0] rounded-bl-sm shadow-sm"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <p
          className={`text-[10px] mt-1 ${
            isUser ? "text-[#94A3B8] text-right" : "text-[#94A3B8]"
          }`}
        >
          {message.timestamp
            ? new Date(message.timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </p>
      </div>
    </motion.div>
  );
}
