"use client";

import { Laptop, Terminal, Blocks, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function BlackboxActionButtons() {
  return (
    <div className="flex items-center justify-center gap-3">
      <Link href="/dashboard">
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-accent border border-border rounded-lg text-sm text-white transition-colors">
          <Laptop className="w-4 h-4" />
          Remote Agent
        </button>
      </Link>
      <Link href="/dashboard">
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-accent border border-border rounded-lg text-sm text-white transition-colors">
          <Terminal className="w-4 h-4" />
          CLI
        </button>
      </Link>
      <Link href="/dashboard">
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-accent border border-border rounded-lg text-sm text-white transition-colors">
          <Blocks className="w-4 h-4" />
          App Builder
        </button>
      </Link>
      <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-accent border border-border rounded-lg text-sm text-white transition-colors">
        <MoreHorizontal className="w-4 h-4" />
        More
      </button>
    </div>
  );
}
