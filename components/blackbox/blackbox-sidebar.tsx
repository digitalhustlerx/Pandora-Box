"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, History, Laptop, ChevronDown, Key } from "lucide-react";
import BlackboxLogo from "./blackbox-logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlackboxSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setIsCollapsed(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-0 h-full w-12 bg-black border-r border-border z-50 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-black border-r border-border z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <BlackboxLogo />
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* New Chat Button */}
        <Link href="/dashboard/chat">
          <Button
            className="w-full justify-start gap-2 bg-white text-black hover:bg-gray-200"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            New
          </Button>
        </Link>

        {/* History */}
        <Link href="/dashboard/chat">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-accent rounded-lg transition-colors">
            <History className="w-4 h-4" />
            History
          </button>
        </Link>

        {/* Remote Agent */}
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-accent rounded-lg transition-colors">
          <Laptop className="w-4 h-4" />
          Remote Agent
        </button>

        {/* Features Dropdown */}
        <div>
          <button
            onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-accent rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <ChevronDown className={`w-4 h-4 transition-transform ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              Features
            </span>
          </button>
          {isFeaturesOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <Link href="/dashboard/upload">
                <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-accent rounded-lg transition-colors">
                  Upload
                </button>
              </Link>
              <Link href="/dashboard/payment">
                <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-accent rounded-lg transition-colors">
                  Payment
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* API Keys */}
        <Link href="/dashboard/settings">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-accent rounded-lg transition-colors">
            <Key className="w-4 h-4" />
            API Keys
          </button>
        </Link>
      </div>
    </div>
  );
}
