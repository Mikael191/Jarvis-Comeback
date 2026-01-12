"use client";

import { useState, useEffect } from "react";
import { Mic, Volume2 } from "lucide-react";

interface VoiceSelectorProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  selectedVoice: SpeechSynthesisVoice | null;
}

export function VoiceSelector({ onVoiceChange, selectedVoice }: VoiceSelectorProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith("pt") || v.lang.startsWith("en"));
      setVoices(available);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  return (
    <div className="w-full">
      <label className="block text-sm text-zinc-400 mb-1 flex items-center gap-2">
        <Volume2 size={14} /> Selecionar Voz
      </label>
      <select
        value={selectedVoice?.name || ""}
        onChange={(e) => {
          const voice = voices.find(v => v.name === e.target.value);
          if (voice) onVoiceChange(voice);
        }}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none text-sm"
      >
        {voices.map((v) => (
          <option key={v.name} value={v.name}>
            {v.name} ({v.lang})
          </option>
        ))}
      </select>
      <p className="text-xs text-zinc-500 mt-1">
        Dica: No PC, procure por "Microsoft Daniel" ou "Google Português". No celular, as opções variam.
      </p>
    </div>
  );
}
