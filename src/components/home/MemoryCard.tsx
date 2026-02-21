"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { useHistory } from "@/hooks/useHistory";

export function MemoryCard() {
  const { data: messages, isLoading } = useHistory(5);

  const lastMessage = messages?.filter((m) => m.role === "assistant").at(-1);

  return (
    <GlassCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-abobi-purple/30 flex items-center justify-center">
          <span className="text-xs">💭</span>
        </div>
        <p className="text-abobi-muted text-xs uppercase tracking-wider font-medium">
          Last Memory
        </p>
      </div>

      {isLoading ? (
        <LoadingDots size="sm" className="text-abobi-muted" />
      ) : lastMessage ? (
        <motion.p
          className="text-white/80 text-sm leading-relaxed line-clamp-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          &ldquo;{lastMessage.content}&rdquo;
        </motion.p>
      ) : (
        <p className="text-abobi-muted text-sm">
          No chats yet. Start a gist with Abobi!
        </p>
      )}

      {lastMessage && (
        <p className="text-abobi-muted text-xs mt-2">
          {new Date(lastMessage.timestamp).toLocaleDateString("en-NG", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </GlassCard>
  );
}
