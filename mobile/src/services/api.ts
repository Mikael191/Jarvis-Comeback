import { API_URL } from '../lib/config';
import { useJarvisStore } from '../store/jarvisStore';

export async function sendMessageToJarvis(text: string, mode: string = 'rational') {
  const { messages, apiKey, userName, insights } = useJarvisStore.getState();

  if (!apiKey) {
    throw new Error("API Key não configurada.");
  }

  // Last 10 messages for context window
  const contextMessages = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
  const userMsg = { role: 'user', content: text };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...contextMessages, userMsg],
        apiKey,
        userName,
        mode,
        insights
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    return data; // { reply, music, memory }
  } catch (error) {
    console.error("Jarvis API Error:", error);
    throw error;
  }
}
