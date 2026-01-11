"use client";

import { motion } from "framer-motion";

interface AudioVisualizerProps {
  state: "idle" | "listening" | "thinking" | "speaking";
}

export function AudioVisualizer({ state }: AudioVisualizerProps) {
  const isListening = state === "listening";
  const isSpeaking = state === "speaking";
  const isThinking = state === "thinking";

  // Different animation variants based on state
  const bars = Array.from({ length: 5 });

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {state === "idle" && (
        <div className="w-16 h-1 bg-cyan-900/50 rounded-full" />
      )}

      {(isListening || isSpeaking || isThinking) && bars.map((_, i) => (
        <motion.div
          key={i}
          className={`w-2 rounded-full ${
            isListening ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" :
            isThinking ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" :
            "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          }`}
          animate={{
            height: isThinking
              ? [10, 20, 10]
              : [10, 30, 50, 20, 10], // Fixed animation for SSR safety
          }}
          transition={{
            duration: isThinking ? 1 : 0.4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
