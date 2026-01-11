"use client";

import { useEffect, useState, useCallback } from "react";
import { JarvisInterface } from "@/components/JarvisInterface";
import { useJarvisStore } from "@/lib/store";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { SettingsModal } from "@/components/SettingsModal";
import { MediaPlayer } from "@/components/MediaPlayer";
import { detectMusicIntent } from "@/lib/musicIntent";

export default function Home() {
  const { messages, apiKey, userName, voiceSpeed, addMessage } = useJarvisStore();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { isSpeaking, speak, stopSpeaking } = useSpeechSynthesis();

  const [isThinking, setIsThinking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [musicQuery, setMusicQuery] = useState<string | null>(null);

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

    // 2. Check for Music Intent
    const musicIntent = detectMusicIntent(text);
    if (musicIntent) {
      setMusicQuery(musicIntent);
    }

    // 3. Call AI
    setIsThinking(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMsg).map(m => ({ role: m.role, content: m.content })),
          apiKey
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

    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
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
  }, [addMessage, messages, apiKey, userName, speak, voiceSpeed]);

  // Auto-submit voice transcript when silence/end detected
  useEffect(() => {
    if (!isListening && transcript) {
      handleSendMessage(transcript);
      resetTranscript();
    }
  }, [isListening, transcript, handleSendMessage, resetTranscript]);

  // Prompt for API key on first load if missing
  useEffect(() => {
    if (!apiKey) {
      setShowSettings(true);
      // Optional: Add a welcome message from local logic before AI is ready
      if (messages.length === 0) {
        addMessage({
          id: 'init',
          role: 'assistant',
          content: `Olá. Eu sou o JARVIS. Para começarmos, por favor configure sua chave de acesso nas configurações.`,
          timestamp: Date.now()
        });
      }
    }
  }, [apiKey, messages.length, addMessage]);

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking(); // Stop talking if user interrupts
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
      />

      <MediaPlayer query={musicQuery} />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
