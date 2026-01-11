import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';

// Models to try in order.
// 1. Meta Llama 3 (Best, but might be gated or need correct endpoint)
// 2. Mistral 7B (Very reliable, usually open)
// 3. Microsoft Phi 3 (Lightweight, robust)
const MODELS = [
  "meta-llama/Meta-Llama-3-8B-Instruct",
  "mistralai/Mistral-7B-Instruct-v0.3",
  "microsoft/Phi-3-mini-4k-instruct"
];

// Helper to format prompt for Llama 3
// Llama 3 format:
// <|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{user}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n
function formatPromptLlama3(messages: { role: string; content: string }[]) {
  let prompt = "<|begin_of_text|>";

  // Add system prompt if not present in messages (though we usually prepend it)
  prompt += `<|start_header_id|>system<|end_header_id|>\n\n${SYSTEM_PROMPT}<|eot_id|>`;

  for (const msg of messages) {
    if (msg.role === 'system') continue;
    prompt += `<|start_header_id|>${msg.role}<|end_header_id|>\n\n${msg.content}<|eot_id|>`;
  }

  prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n";
  return prompt;
}

// Helper for Mistral/Phi (Standard ChatML or similar)
// We'll use a generic ChatML-like format which most instruction tuned models understand reasonably well
// <|im_start|>system\n...\n<|im_end|>\n<|im_start|>user\n...\n<|im_end|>\n<|im_start|>assistant\n
function formatPromptGeneric(messages: { role: string; content: string }[]) {
  let prompt = "";
  prompt += `<|im_start|>system\n${SYSTEM_PROMPT}\n<|im_end|>\n`;

  for (const msg of messages) {
     if (msg.role === 'system') continue;
     prompt += `<|im_start|>${msg.role}\n${msg.content}\n<|im_end|>\n`;
  }

  prompt += `<|im_start|>assistant\n`;
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

    let lastError: string | null = null;

    // Try each model in the list until one works
    for (const model of MODELS) {
      try {
        console.log(`Attempting model: ${model}`);

        // Choose prompt format based on model family
        let prompt = "";
        if (model.includes("Llama-3")) {
          prompt = formatPromptLlama3(messages);
        } else {
          prompt = formatPromptGeneric(messages);
        }

        // Correct Endpoint: router.huggingface.co/hf-inference/models/...
        const response = await fetch(
          `https://router.huggingface.co/hf-inference/models/${model}`,
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
                return_full_text: false,
                stop: ["<|eot_id|>", "<|im_end|>"]
              }
            }),
          }
        );

        if (!response.ok) {
           const errText = await response.text();
           console.warn(`Model ${model} failed: ${response.status} - ${errText}`);
           lastError = `Erro ${response.status}: ${errText}`;

           // If 401 (Unauthorized), user key is wrong. No point trying other models.
           if (response.status === 401) {
             return NextResponse.json(
               { error: "Chave da API inválida (401). Verifique suas permissões." },
               { status: 401 }
             );
           }

           continue; // Try next model
        }

        const data = await response.json();

        let reply = "";
        if (Array.isArray(data) && data[0] && data[0].generated_text) {
            reply = data[0].generated_text;
        } else if (typeof data === 'object' && data.generated_text) {
            reply = data.generated_text;
        } else {
            console.error("Unexpected HF Response:", data);
            continue; // Bad response, try next
        }

        // Success!
        return NextResponse.json({ reply });

      } catch (e) {
        console.error(`Exception with model ${model}:`, e);
        lastError = e instanceof Error ? e.message : "Erro desconhecido";
      }
    }

    // If we get here, all models failed
    return NextResponse.json(
      { error: `Falha em todos os modelos de IA. Último erro: ${lastError}` },
      { status: 503 }
    );

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
