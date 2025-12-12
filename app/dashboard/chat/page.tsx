"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_MODEL_ID, MODEL_OPTIONS } from "@/lib/models";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import Markdown from "react-markdown";
import { useState } from "react";

export default function Chat() {
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 10,
    body: { model_id: modelId },
  });

  return (
    <div className="flex flex-col w-full py-24 justify-center items-center">
      <div className="w-full max-w-xl space-y-4 mb-20">
        {messages.map((message, i) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[65%] px-3 py-1.5 text-sm shadow-sm",
                message.role === "user"
                  ? "bg-[#0B93F6] text-white rounded-2xl rounded-br-sm"
                  : "bg-[#E9E9EB] text-black rounded-2xl rounded-bl-sm",
              )}
            >
              {message.parts.map((part) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="prose-sm prose-p:my-0.5 prose-li:my-0.5 prose-ul:my-1 prose-ol:my-1"
                      >
                        <Markdown>{part.text}</Markdown>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}
      </div>

      <form
        className="flex gap-2 justify-center w-full items-center fixed bottom-0"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2 justify-center items-start mb-8 max-w-xl w-full border p-2 rounded-lg bg-white ">
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger size="sm" className="w-full justify-between">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {MODEL_OPTIONS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="w-full border-0 shadow-none !ring-transparent "
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <div className="flex justify-end gap-3 items-center w-full">
            <Button size="sm" className="text-xs">
              Send
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
