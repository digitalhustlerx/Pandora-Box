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
import { authClient } from "@/lib/auth-client";
import { DEFAULT_MODEL_ID, MODEL_OPTIONS } from "@/lib/models";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";

const PUBLIC_FREE_MESSAGES = 3;

export default function PublicHomeChat() {
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    authClient
      .getSession()
      .then((res) => setIsAuthenticated(!!res.data?.user))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 10,
    body: { model_id: modelId },
  });

  const userMessageCount = useMemo(
    () => messages.filter((m) => m.role === "user").length,
    [messages],
  );
  const isLocked =
    isAuthenticated === false && userMessageCount >= PUBLIC_FREE_MESSAGES;

  return (
    <div className="mt-10 w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border bg-background/80 backdrop-blur-sm p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-medium">Try Pandora&apos;s Box</h2>
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger size="sm" className="min-w-44">
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
        </div>

        <div className="space-y-3 min-h-40 max-h-80 overflow-y-auto pr-1">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Ask anything. You get {PUBLIC_FREE_MESSAGES} free messages before
              signing in.
            </p>
          )}
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
                  "max-w-[80%] px-3 py-1.5 text-sm shadow-sm",
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

        <div className="mt-3">
          {isLocked ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                You&apos;ve used your free messages.
              </p>
              <Button asChild size="sm">
                <Link href="/sign-in">Sign in to continue</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Message Pandora's Box..."
              />
              <Button size="sm" type="submit">
                Send
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

