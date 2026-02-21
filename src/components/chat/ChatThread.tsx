"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage } from "@/types/chat";

interface ChatThreadProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatThread({ messages, isLoading }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-abobi-purple to-abobi-glow flex items-center justify-center text-3xl mb-4">
          A
        </div>
        <h3 className="text-white font-bold text-lg mb-2">Abobi dey here!</h3>
        <p className="text-abobi-muted text-sm max-w-xs leading-relaxed">
          How far? I be your Pidgin AI bro. Ask me anything — no dull yourself!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.map((msg, i) => (
        <ChatBubble key={msg.id} message={msg} index={i} />
      ))}
      <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
