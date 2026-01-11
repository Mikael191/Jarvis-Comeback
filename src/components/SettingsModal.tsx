import { X, Save, Key, User, Mic } from "lucide-react";
import { useState } from "react";
import { useJarvisStore } from "@/lib/store";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { apiKey, setApiKey, userName, setUserName, voiceSpeed, setVoiceSpeed } = useJarvisStore();

  const [localKey, setLocalKey] = useState(apiKey || "");
  const [localName, setLocalName] = useState(userName || "");
  const [localSpeed, setLocalSpeed] = useState(voiceSpeed || 1.0);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(localKey);
    setUserName(localName);
    setVoiceSpeed(localSpeed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-cyan-400">Configurações do JARVIS</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* API Key */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1 flex items-center gap-2">
              <Key size={14} /> Groq Cloud API Key
            </label>
            <input
              type="password"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Necessário para a inteligência. Obtenha gratuitamente em <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">console.groq.com</a>
            </p>
          </div>

          {/* User Name */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1 flex items-center gap-2">
              <User size={14} /> Como devo te chamar?
            </label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Voice Speed */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1 flex items-center gap-2">
              <Mic size={14} /> Velocidade da Voz ({localSpeed}x)
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={localSpeed}
              onChange={(e) => setLocalSpeed(parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save size={18} /> Salvar Configurações
        </button>
      </div>
    </div>
  );
}
