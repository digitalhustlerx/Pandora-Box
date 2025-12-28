"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import UserProfile from "@/components/user-profile";

export default function BlackboxTopNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        setIsAuthenticated(!!session.data?.user);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="fixed top-0 right-0 z-40 flex items-center gap-6 px-6 py-4">
      <Link
        href="/pricing"
        className="text-sm text-muted-foreground hover:text-white transition-colors"
      >
        Pricing
      </Link>
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-white transition-colors"
      >
        Features
      </Link>
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-white transition-colors"
      >
        VSCode
      </Link>
      <Link
        href="/dashboard/payment"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
      >
        <CreditCard className="w-4 h-4" />
        Credits
      </Link>
      <div className="ml-2">
        {loading ? null : isAuthenticated ? (
          <UserProfile />
        ) : (
          <Link href="/sign-in">
            <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-200">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
