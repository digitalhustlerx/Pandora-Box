export type ModelOption = {
  id: string;
  label: string;
  providerModel: string;
};

// Pandora's Box v1 models (OpenRouter provider models).
// Adjust labels/ids freely; keep ids stable for saved chats later.
export const MODEL_OPTIONS: ModelOption[] = [
  { id: "gpt-4o", label: "GPT‑4o", providerModel: "openai/gpt-4o" },
  {
    id: "gpt-4.1-mini",
    label: "GPT‑4.1 Mini",
    providerModel: "openai/gpt-4.1-mini",
  },
  {
    id: "claude-3.5-sonnet",
    label: "Claude 3.5 Sonnet",
    providerModel: "anthropic/claude-3.5-sonnet",
  },
  {
    id: "gemini-1.5-pro",
    label: "Gemini 1.5 Pro",
    providerModel: "google/gemini-1.5-pro",
  },
  {
    id: "llama-3.1-70b",
    label: "Llama 3.1 70B",
    providerModel: "meta-llama/llama-3.1-70b-instruct",
  },
  {
    id: "deepseek-r1",
    label: "DeepSeek R1",
    providerModel: "deepseek/deepseek-r1",
  },
];

export const DEFAULT_MODEL_ID = MODEL_OPTIONS[0].id;

export function getModelById(id: string | undefined) {
  if (!id) return MODEL_OPTIONS[0];
  return MODEL_OPTIONS.find((m) => m.id === id) ?? MODEL_OPTIONS[0];
}

