import { cn } from "@/lib/utils";
import { User, Cpu } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-50">
          <Cpu className="w-16 h-16 mb-4" />
          <p>Estou pronto. Como posso ajudar?</p>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "flex gap-3 max-w-3xl mx-auto",
            msg.role === "user" ? "flex-row-reverse" : "flex-row"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            msg.role === "user" ? "bg-zinc-700" : "bg-cyan-900/50"
          )}>
            {msg.role === "user" ? <User size={16} /> : <Cpu size={16} />}
          </div>

          <div className={cn(
            "p-3 rounded-2xl max-w-[80%] text-sm md:text-base leading-relaxed whitespace-pre-wrap",
            msg.role === "user"
              ? "bg-zinc-800 text-zinc-100 rounded-tr-none border border-zinc-700"
              : "bg-cyan-950/30 text-cyan-50 rounded-tl-none border border-cyan-900/30 shadow-[0_0_15px_rgba(8,145,178,0.1)]"
          )}>
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  );
}
