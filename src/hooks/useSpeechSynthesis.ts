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
        // Prioritize male voices or natural sounding ones
        // "Daniel" is a common male PT-BR voice on Microsoft Edge/Windows
        // "Google Português" is usually female, but high quality.
        // "Luciana" is female. "Felipe" is male.
        const ptVoices = availableVoices.filter(v => v.lang === 'pt-BR' || v.lang === 'pt-PT');

        const maleVoice = ptVoices.find(v =>
          v.name.includes('Daniel') ||
          v.name.includes('Felipe') ||
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('homem')
        );

        const googleVoice = ptVoices.find(v => v.name.includes('Google'));

        // Prefer male voice -> then Google (quality) -> then any PT
        setSelectedVoice(maleVoice || googleVoice || ptVoices[0] || null);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text: string, speed = 1.0) => {
    if (typeof window === "undefined") return;

    // Cancel current speech
    window.speechSynthesis.cancel();

    // Clean Markdown for speech (remove **, #, etc)
    const cleanText = text
      .replace(/\*\*/g, '')      // Remove bold markers
      .replace(/\*/g, '')        // Remove italics markers
      .replace(/#{1,6}\s/g, '')  // Remove headers
      .replace(/`/g, '')         // Remove code markers
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
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
