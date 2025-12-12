import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import { getModelById } from "@/lib/models";

const bodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z.string(),
    }),
  ),
  model_id: z.string().optional(),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const { messages, model_id } = parsed.data;
  const selectedModel = getModelById(model_id);

  const openrouter = createOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });

  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing OPENROUTER_API_KEY" }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  const result = streamText({
    model: openrouter.chat(selectedModel.providerModel),
    messages,
  });

  return result.toDataStreamResponse();
}
