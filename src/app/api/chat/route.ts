import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';

// Using a free, reliable model on HF Inference API
// google/gemma-2-9b-it is smart and lightweight enough for free tier
// or meta-llama/Meta-Llama-3-8B-Instruct
const MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct";

export async function POST(req: Request) {
  try {
    const { messages, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API Hugging Face não fornecida." },
        { status: 401 }
      );
    }

    // Format messages for Llama 3
    // Llama 3 uses <|begin_of_text|><|start_header_id|>system<|end_header_id|>...
    // But the HF Inference API often handles standard role/content arrays nicely if we use the right endpoint,
    // OR we just format it as a single prompt string if using the raw generation API.
    // For best results on free tier, we often use the `/chat/completions` compatibility layer provided by HF or format manually.

    // Let's use the standard fetch to the model URL.

    const response = await fetch(
      `https://router.huggingface.co/models/${MODEL_ID}/v1/chat/completions`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages
          ],
          max_tokens: 500,
          temperature: 0.7,
          stream: false // Simpler for now, ensures full JSON valid response
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF Error:", errorText);
      return NextResponse.json(
        { error: `Erro na IA: ${response.status} - ${errorText}` },
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
