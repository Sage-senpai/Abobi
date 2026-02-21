"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div
      className="flex justify-start mb-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-abobi-purple to-abobi-glow flex items-center justify-center text-xs font-bold text-white mr-2 mt-1 flex-shrink-0">
        A
      </div>
      <div className="glass-sm px-4 py-3 rounded-2xl rounded-bl-sm glow-sm flex items-center gap-1.5 h-10">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-abobi-glow"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
