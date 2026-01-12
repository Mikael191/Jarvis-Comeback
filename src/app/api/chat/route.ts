import { NextResponse } from 'next/server';
import { buildSystemPrompt, JarvisMode } from '@/lib/jarvis-core';
import { Insight } from '@/lib/store';

// Using Groq API with the latest Llama 3.3 70B (Versatile)
const PRIMARY_MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

export async function POST(req: Request) {
  try {
    const { messages, apiKey, userName, mode, insights } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API Groq não fornecida." },
        { status: 401 }
      );
    }

    // Build Dynamic System Prompt based on Mode and Memory
    const currentMode: JarvisMode = mode || 'rational';
    const userInsights: Insight[] = insights || [];
    const systemPrompt = buildSystemPrompt(userName || "Senhor", currentMode, userInsights);

    // Helper function to call Groq
    const callGroq = async (model: string) => {
        return await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              model: model,
              messages: [
                { role: "system", content: systemPrompt },
                ...messages
              ],
              max_tokens: 1024,
              temperature: 0.7,
              stream: false
            }),
          }
        );
    };

    // Try Primary Model (70B)
    let response = await callGroq(PRIMARY_MODEL);

    // If 400/404/429, try Fallback Model (8B)
    if (!response.ok) {
        console.warn(`Primary model ${PRIMARY_MODEL} failed: ${response.status}. Trying fallback...`);
        if (response.status !== 401) {
            response = await callGroq(FALLBACK_MODEL);
        }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);

      if (response.status === 401) {
          return NextResponse.json(
            { error: "Chave da API Groq inválida." },
            { status: 401 }
          );
      }

      return NextResponse.json(
        { error: `Erro na IA (Groq): ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    let reply = data.choices[0].message.content;
    let music = null;
    let memory = null;

    // Check for [MUSIC: ...] tag
    const musicMatch = reply.match(/\[MUSIC:\s*(.*?)\]/i);
    if (musicMatch) {
        music = musicMatch[1].trim();
        reply = reply.replace(musicMatch[0], "").trim();
    }

    // Check for [MEMORY: ...] tag
    const memoryMatch = reply.match(/\[MEMORY:\s*(.*?)\]/i);
    if (memoryMatch) {
        memory = memoryMatch[1].trim();
        reply = reply.replace(memoryMatch[0], "").trim();
    }

    return NextResponse.json({ reply, music, memory });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
