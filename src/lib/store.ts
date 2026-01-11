import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/components/MessageList';

interface JarvisState {
  messages: Message[];
  apiKey: string | null;
  userName: string;
  voiceSpeed: number;
  addMessage: (msg: Message) => void;
  setApiKey: (key: string) => void;
  setUserName: (name: string) => void;
  setVoiceSpeed: (speed: number) => void;
  clearHistory: () => void;
}

export const useJarvisStore = create<JarvisState>()(
  persist(
    (set) => ({
      messages: [],
      apiKey: null,
      userName: "Senhor",
      voiceSpeed: 1.0,
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      setApiKey: (key) => set({ apiKey: key }),
      setUserName: (name) => set({ userName: name }),
      setVoiceSpeed: (speed) => set({ voiceSpeed: speed }),
      clearHistory: () => set({ messages: [] }),
    }),
    {
      name: 'jarvis-storage',
    }
  )
);
