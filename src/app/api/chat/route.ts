import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';

// Using Groq API with the latest Llama 3.3 70B (Versatile)
// This model is much smarter than 8B and still very fast on Groq.
// Fallback: llama-3.1-8b-instant if 70B is unavailable (implemented in logic below)
const PRIMARY_MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

export async function POST(req: Request) {
  try {
    const { messages, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API Groq não fornecida." },
        { status: 401 }
      );
    }

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
                { role: "system", content: SYSTEM_PROMPT },
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
        // We generally retry on errors, but especially 400 (Bad Request/Decommissioned) or 429 (Rate Limit)
        if (response.status !== 401) { // Don't retry if key is invalid
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
