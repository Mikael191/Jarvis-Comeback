import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';

// Using Groq API for Llama 3 (Fast, Free Tier)
const MODEL_ID = "llama3-8b-8192";

export async function POST(req: Request) {
  try {
    const { messages, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API Groq não fornecida." },
        { status: 401 }
      );
    }

    // Groq uses standard OpenAI-compatible format
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages
          ],
          max_tokens: 1024,
          temperature: 0.7,
          stream: false
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);

      // Handle invalid key specifically
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
    const reply = data.choices[0].message.content;

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
