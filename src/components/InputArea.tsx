"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Send, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  onToggleVoice: () => void;
  isListening: boolean;
  isLoading: boolean;
  disabled?: boolean;
}

export function InputArea({
  onSendMessage,
  onToggleVoice,
  isListening,
  isLoading,
  disabled
}: InputAreaProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  return (
    <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 backdrop-blur-md">
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        <button
          onClick={onToggleVoice}
          disabled={disabled || isLoading}
          className={cn(
            "p-3 rounded-full transition-all duration-300 flex items-center justify-center",
            isListening
              ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse border border-red-500/50"
              : "bg-zinc-800 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-700 border border-zinc-700"
          )}
          title={isListening ? "Parar de ouvir" : "Falar com JARVIS"}
        >
          {isListening ? <StopCircle size={24} /> : <Mic size={24} />}
        </button>

        <div className="flex-1 bg-zinc-800 rounded-2xl border border-zinc-700 focus-within:border-cyan-500/50 transition-colors flex items-center px-4 py-2 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Converse com JARVIS..."
            className="w-full bg-transparent resize-none outline-none text-zinc-100 placeholder:text-zinc-500 max-h-32 min-h-[24px] py-1"
            rows={1}
            disabled={disabled || isLoading}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled || isLoading}
          className={cn(
            "p-3 rounded-full transition-all duration-200",
            input.trim() && !isLoading
              ? "bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/20"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          )}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
