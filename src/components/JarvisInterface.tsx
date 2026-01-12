"use client";

import { MessageList, Message } from "@/components/MessageList";
import { InputArea } from "@/components/InputArea";
import { AudioVisualizer } from "@/components/AudioVisualizer";
import { Settings, Music, Brain, Heart, Sparkles, MessageCircle } from "lucide-react";
import { JarvisMode, MODES } from "@/lib/jarvis-core";

interface JarvisInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isListening: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  toggleVoice: () => void;
  showSettings: () => void;
  currentTrack?: string | null;
  mode: JarvisMode;
  setMode: (mode: JarvisMode) => void;
}

export function JarvisInterface({
  messages,
  onSendMessage,
  isListening,
  isThinking,
  isSpeaking,
  toggleVoice,
  showSettings,
  currentTrack,
  mode,
  setMode
}: JarvisInterfaceProps) {

  const visualizerState = isListening
    ? "listening"
    : isThinking
      ? "thinking"
      : isSpeaking
        ? "speaking"
        : "idle";

  const modeIcons = {
    rational: Brain,
    emotional: Heart,
    reflective: Sparkles,
    light: MessageCircle
  };

  const CurrentModeIcon = modeIcons[mode];

  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh] bg-black/90 text-zinc-100 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="relative flex items-center justify-between px-4 md:px-6 py-4 border-b border-zinc-800 bg-black/50 backdrop-blur-sm z-10 gap-2">
        <div className="flex items-center gap-2 z-20 shrink-0">
          <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
          <h1 className="font-mono tracking-widest text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-700 hidden md:block">
            JARVIS
          </h1>
        </div>

        {/* Visualizer (Now next to logo/settings to avoid overlap) */}
        <div className="hidden lg:block opacity-80">
           <AudioVisualizer state={visualizerState} />
        </div>

        <div className="flex items-center gap-2 md:gap-4 z-20 shrink-0">
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
      </main>

      {/* Input Area + Mode Selector in Footer */}
      <div className="bg-zinc-900/80 border-t border-zinc-800 backdrop-blur-md pb-safe">
        {/* Mode Selector - Centered Above Input */}
        <div className="flex justify-center pt-2">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-zinc-800/50">
            {(Object.keys(MODES) as JarvisMode[]).map((m) => {
              const Icon = modeIcons[m];
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`p-2 rounded-full transition-all duration-300 relative group ${
                    isActive ? "bg-cyan-900/30 text-cyan-400" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title={MODES[m].label}
                >
                  <Icon size={16} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <InputArea
          onSendMessage={onSendMessage}
          onToggleVoice={toggleVoice}
          isListening={isListening}
          isLoading={isThinking}
          className="border-t-0 bg-transparent"
        />
      </div>
    </div>
  );
}
