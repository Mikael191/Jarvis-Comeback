import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/components/MessageList';

export interface Insight {
  id: string;
  content: string;
  date: number;
  tags?: string[];
}

interface JarvisState {
  messages: Message[];
  insights: Insight[];
  apiKey: string | null;
  userName: string;
  voiceSpeed: number;

  // Actions
  addMessage: (msg: Message) => void;
  addInsight: (content: string) => void;
  removeInsight: (id: string) => void;
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

      removeInsight: (id) => set((state) => ({
        insights: state.insights.filter(i => i.id !== id)
      })),

      setApiKey: (key) => set({ apiKey: key }),
      setUserName: (name) => set({ userName: name }),
      setVoiceSpeed: (speed) => set({ voiceSpeed: speed }),
      clearHistory: () => set({ messages: [] }),
    }),
    {
      name: 'jarvis-storage-v2', // Version bump for new structure
    }
  )
);
