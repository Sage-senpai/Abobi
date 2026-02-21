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
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      {/* Avatar — assistant only */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-abobi-purple to-abobi-glow flex items-center justify-center text-xs font-bold text-white mr-2 mt-1 flex-shrink-0">
          A
        </div>
      )}

      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl leading-relaxed text-sm ${
          isUser
            ? "bg-gradient-to-br from-abobi-purple to-abobi-glow text-white rounded-br-sm"
            : "glass-sm text-white/90 rounded-bl-sm glow-sm"
        }`}
      >
        {message.content}
        <p
          className={`text-[10px] mt-1.5 ${
            isUser ? "text-white/50 text-right" : "text-white/30"
          }`}
        >
          {message.timestamp
            ? new Date(message.timestamp).toLocaleTimeString("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </p>
      </div>
    </motion.div>
  );
}
