import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Insight {
  id: string;
  content: string;
  date: number;
}

interface JarvisState {
  messages: Message[];
  insights: Insight[];
  apiKey: string | null;
  userName: string;
  voiceSpeed: number;

  addMessage: (msg: Message) => void;
  addInsight: (content: string) => void;
  setApiKey: (key: string) => void;
  setUserName: (name: string) => void;
  setVoiceSpeed: (speed: number) => void;
  clearHistory: () => void;
}

export const useJarvisStore = create<JarvisState>()(
  persist(
    (set) => ({
      messages: [],
      insights: [],
      apiKey: null,
      userName: "Senhor",
      voiceSpeed: 1.0,

      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      addInsight: (content) => set((state) => ({
        insights: [...state.insights, {
          id: Date.now().toString(),
          content,
          date: Date.now()
        }]
      })),
      setApiKey: (key) => set({ apiKey: key }),
      setUserName: (name) => set({ userName: name }),
      setVoiceSpeed: (speed) => set({ voiceSpeed: speed }),
      clearHistory: () => set({ messages: [] }),
    }),
    {
      name: 'jarvis-mobile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
