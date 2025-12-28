"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlackboxBottomBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-accent text-xs font-semibold rounded">
            New
          </span>
          <span className="text-sm text-white">
            Get started with BLACKBOX Agent on VSCode
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-black hover:bg-gray-200"
            >
              Explore
            </Button>
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
