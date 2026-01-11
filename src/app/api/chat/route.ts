import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';

const MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct";

// Helper to format prompt for Llama 3
// Llama 3 format:
// <|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{user}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n
function formatPromptLlama3(messages: { role: string; content: string }[]) {
  let prompt = "<|begin_of_text|>";

  // Add system prompt if not present in messages (though we usually prepend it)
  // Our logic passes messages array which includes user/assistant history.
  // We prepend system prompt manually in the loop if we want, or rely on the global const.

  prompt += `<|start_header_id|>system<|end_header_id|>\n\n${SYSTEM_PROMPT}<|eot_id|>`;

  for (const msg of messages) {
    if (msg.role === 'system') continue; // We already added the main system prompt
    prompt += `<|start_header_id|>${msg.role}<|end_header_id|>\n\n${msg.content}<|eot_id|>`;
  }

  prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n";
  return prompt;
}

export async function POST(req: Request) {
  try {
    const { messages, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API Hugging Face não fornecida." },
        { status: 401 }
      );
    }

    // Use Raw Inference API
    // Endpoint: https://router.huggingface.co/models/{MODEL_ID}
    const prompt = formatPromptLlama3(messages);

    const response = await fetch(
      `https://router.huggingface.co/models/${MODEL_ID}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            return_full_text: false, // We only want the new generation
            stop: ["<|eot_id|>"]
          }
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

    // HF Inference API returns array of objects for raw generation: [{ generated_text: "..." }]
    // Sometimes it's data[0].generated_text
    let reply = "";
    if (Array.isArray(data) && data[0] && data[0].generated_text) {
        reply = data[0].generated_text;
    } else if (typeof data === 'object' && data.generated_text) {
        reply = data.generated_text;
    } else {
        console.error("Unexpected HF Response:", data);
        reply = "Erro: Resposta inesperada da IA.";
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
