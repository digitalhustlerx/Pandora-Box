"use client";

import { useState } from "react";
import { Paperclip, Mic } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BlackboxChatInput() {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("claude-sonnet-4.5");

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="relative flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-3">
        {/* Attachment Icon */}
        <button className="text-muted-foreground hover:text-white transition-colors">
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input Field */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message Blackbox"
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-muted-foreground text-sm"
        />

        {/* Model Selector */}
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[180px] border-none bg-transparent text-white text-sm h-8">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-xs font-bold">AI</span>
              </div>
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-secondary border-border">
            <SelectItem value="claude-sonnet-4.5">Claude Sonnet 4.5</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
            <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
          </SelectContent>
        </Select>

        {/* Voice Input */}
        <button className="text-white hover:text-gray-300 transition-colors">
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
