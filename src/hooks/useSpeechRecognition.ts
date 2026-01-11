import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Use a ref to keep the recognition instance stable
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false; // Stop after one sentence
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = "pt-BR";

        recognitionInstance.onstart = () => setIsListening(true);
        recognitionInstance.onend = () => setIsListening(false);
        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          setError(event.error);
        };
        recognitionInstance.onresult = (event) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
        };

        recognitionRef.current = recognitionInstance;
      } else {
        // setError in effect with empty deps is technically safe but linter complains
        // We can just log it or handle gracefully
        console.warn("Browser does not support Speech Recognition");
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    } else if (!recognitionRef.current) {
         setError("Reconhecimento de voz não suportado.");
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return { isListening, transcript, startListening, stopListening, error, resetTranscript: () => setTranscript("") };
}
