import { useState, useEffect, useCallback } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Try to find a good Portuguese voice
        // Prioritize "Google Português do Brasil" or "Luciana" or "Daniel"
        const ptVoice = availableVoices.find(v => v.lang === 'pt-BR' && (v.name.includes('Google') || v.name.includes('Natural')));
        const fallbackPt = availableVoices.find(v => v.lang === 'pt-BR');

        setSelectedVoice(ptVoice || fallbackPt || null);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text: string, speed = 1.0) => {
    if (typeof window === "undefined") return;

    // Cancel current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Adjust pitch/rate for a "calmer" JARVIS tone
    // Lower pitch slightly makes it sound less "default robotic"
    utterance.pitch = 0.9;
    utterance.rate = speed;
    utterance.lang = "pt-BR";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [selectedVoice]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { isSpeaking, speak, stopSpeaking, voices, selectedVoice, setSelectedVoice };
}
