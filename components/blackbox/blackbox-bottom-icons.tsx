"use client";

import { Grid3x3, User } from "lucide-react";
import Link from "next/link";

export default function BlackboxBottomIcons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <Link href="/dashboard">
        <button className="p-3 bg-secondary hover:bg-accent border border-border rounded-lg text-white transition-colors">
          <Grid3x3 className="w-5 h-5" />
        </button>
      </Link>
      <Link href="/dashboard/settings">
        <button className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white transition-colors">
          <User className="w-5 h-5" />
        </button>
      </Link>
    </div>
  );
}
