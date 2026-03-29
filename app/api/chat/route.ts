import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { readFileSync } from "fs";
import { join } from "path";

// Load system prompt from file at startup
let systemPrompt: string;
try {
  systemPrompt = readFileSync(
    join(process.cwd(), "system-prompt.txt"),
    "utf-8"
  );
} catch {
  systemPrompt = "Sei Worky, coach AI di personal branding di Workengo.it.";
}

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const modelId = process.env.MODEL_ID || "openai/gpt-4o-mini";

  const result = streamText({
    model: openrouter(modelId),
    system: systemPrompt,
    messages,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
