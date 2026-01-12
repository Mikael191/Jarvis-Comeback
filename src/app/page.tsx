"use client";

import { useEffect, useState, useCallback } from "react";
import { JarvisInterface } from "@/components/JarvisInterface";
import { useJarvisStore } from "@/lib/store";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { SettingsModal } from "@/components/SettingsModal";
import { MusicSelector } from "@/components/MusicSelector";
import { JarvisMode } from "@/lib/jarvis-core";
import { toast, Toaster } from "sonner"; // Assuming sonner or similar usage, but let's implement a simple custom confirmation or use standard alert for now to save deps

export default function Home() {
  const { messages, apiKey, userName, voiceSpeed, addMessage, insights, addInsight } = useJarvisStore();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { isSpeaking, speak, stopSpeaking } = useSpeechSynthesis();

  const [isThinking, setIsThinking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [musicQuery, setMusicQuery] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [mode, setMode] = useState<JarvisMode>('rational');

  // Mark as hydrated after mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: text,
      timestamp: Date.now()
    };
    addMessage(userMsg);

    // 2. Call AI with Enhanced Context
    setIsThinking(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMsg).map(m => ({ role: m.role, content: m.content })),
          apiKey,
          userName,
          mode,
          insights
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro desconhecido");
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: data.reply,
        timestamp: Date.now()
      };

      addMessage(aiMsg);
      speak(data.reply, voiceSpeed);

      // Update music if command received
      if (data.music) {
          setMusicQuery(data.music);
      }

      // Handle Memory Insight
      if (data.memory) {
          setTimeout(() => {
             toast.info("JARVIS identificou um padrão importante", {
               description: `"${data.memory}"\nDeseja salvar na memória?`,
               action: {
                 label: "Salvar",
                 onClick: () => {
                   addInsight(data.memory);
                   toast.success("Memória salva.");
                 }
               },
               cancel: {
                 label: "Ignorar",
                 onClick: () => {}
               },
               duration: 10000,
             });
          }, 1000);
      }

    } catch (error: any) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `Me desculpe, ${userName}. Ocorreu um erro: ${error?.message || "Erro desconhecido"}`,
        timestamp: Date.now()
      };
      addMessage(errorMsg);
      speak(`Ocorreu um erro.`, voiceSpeed);
    } finally {
      setIsThinking(false);
    }
  }, [addMessage, messages, apiKey, userName, speak, voiceSpeed, mode, insights, addInsight]);

  // Auto-submit voice transcript when silence/end detected
  useEffect(() => {
    if (!isListening && transcript) {
      handleSendMessage(transcript);
      resetTranscript();
    }
  }, [isListening, transcript, handleSendMessage, resetTranscript]);

  // Prompt for API key
  useEffect(() => {
    if (isHydrated && !apiKey) {
      setShowSettings(true);
      const hasInit = messages.some(m => m.id === 'init');
      if (messages.length === 0 && !hasInit) {
        addMessage({
          id: 'init',
          role: 'assistant',
          content: `Olá, ${userName}. Estou pronto. Como posso ajudar hoje?`,
          timestamp: Date.now()
        });
      }
    }
  }, [isHydrated, apiKey, messages, addMessage, userName]);

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };

  return (
    <>
      <JarvisInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isListening={isListening}
        isThinking={isThinking}
        isSpeaking={isSpeaking}
        toggleVoice={toggleVoice}
        showSettings={() => setShowSettings(true)}
        currentTrack={musicQuery}
        mode={mode}
        setMode={setMode}
      />

      <MusicSelector
        query={musicQuery}
        onClose={() => setMusicQuery(null)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <Toaster position="top-center" theme="dark" />
    </>
  );
}
