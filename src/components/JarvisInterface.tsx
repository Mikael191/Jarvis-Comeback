"use client";

import { MessageList, Message } from "@/components/MessageList";
import { InputArea } from "@/components/InputArea";
import { AudioVisualizer } from "@/components/AudioVisualizer";
import { Settings, Music } from "lucide-react";

// Placeholder for full logic
interface JarvisInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isListening: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  toggleVoice: () => void;
  showSettings: () => void;
  currentTrack?: string | null;
}

export function JarvisInterface({
  messages,
  onSendMessage,
  isListening,
  isThinking,
  isSpeaking,
  toggleVoice,
  showSettings,
  currentTrack
}: JarvisInterfaceProps) {

  const visualizerState = isListening
    ? "listening"
    : isThinking
      ? "thinking"
      : isSpeaking
        ? "speaking"
        : "idle";

  return (
    <div className="flex flex-col h-screen max-h-screen bg-black/90 text-zinc-100 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
          <h1 className="font-mono tracking-widest text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-700">
            JARVIS
          </h1>
        </div>

        <div className="flex items-center gap-4">
            {currentTrack && (
                <div className="hidden md:flex items-center gap-2 text-xs text-cyan-400/70 border border-cyan-900/30 px-3 py-1 rounded-full">
                    <Music size={12} />
                    <span className="truncate max-w-[150px]">{currentTrack}</span>
                </div>
            )}
            <button
            onClick={showSettings}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-cyan-400"
            >
            <Settings size={20} />
            </button>
        </div>
      </header>

      {/* Main Chat */}
      <main className="flex-1 relative flex flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
        <MessageList messages={messages} />

        {/* Visualizer Floating (or fixed above input) */}
        <div className="absolute bottom-4 left-0 right-0 pointer-events-none flex justify-center pb-24 opacity-80">
          <AudioVisualizer state={visualizerState} />
        </div>
      </main>

      {/* Input */}
      <InputArea
        onSendMessage={onSendMessage}
        onToggleVoice={toggleVoice}
        isListening={isListening}
        isLoading={isThinking}
      />
    </div>
  );
}
