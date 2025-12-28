"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function SignUpContent() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-black">
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl text-white">
            Create your Pandora&apos;s Box account
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-gray-400">
            Sign up with email and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name || !email || !password || !confirmPassword) {
                toast.error("Please fill in all fields");
                return;
              }
              if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
              }

              try {
                setLoading(true);
                await (authClient as unknown as {
                  signUp: {
                    email: (
                      input: {
                        name: string;
                        email: string;
                        password: string;
                        callbackURL: string;
                      },
                      opts?: {
                        onRequest?: () => void;
                        onSuccess?: () => void;
                        onError?: (ctx: { error: { message?: string } }) => void;
                      },
                    ) => Promise<unknown>;
                  };
                }).signUp.email(
                  {
                    name,
                    email,
                    password,
                    callbackURL: returnTo || "/dashboard",
                  },
                  {
                    onSuccess: () => {
                      toast.success("Account created!");
                      window.location.href = returnTo || "/dashboard";
                    },
                    onError: (ctx) => {
                      toast.error(ctx.error.message || "Failed to create account");
                    },
                  },
                );
              } catch (error) {
                console.error("Sign-up failed:", error);
                toast.error("Sign-up failed. Please try again.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                placeholder="Your name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                placeholder="name@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                placeholder="Create a password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                placeholder="Re-enter your password"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-400">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className={cn("w-full gap-2 bg-transparent border-zinc-700 text-white hover:bg-zinc-800")}
              disabled={loading}
              onClick={async () => {
                try {
                  await authClient.signIn.social(
                    {
                      provider: "google",
                      callbackURL: returnTo || "/dashboard",
                    },
                    {
                      onRequest: () => setLoading(true),
                      onResponse: () => setLoading(false),
                      onError: () => setLoading(false),
                    },
                  );
                } catch (error) {
                  setLoading(false);
                  console.error("Google sign-in failed:", error);
                  toast.error("Google sign-in failed. Check your Google OAuth settings.");
                }
              }}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              Continue with Google
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-white hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center w-full h-screen bg-black">
          <div className="max-w-md w-full bg-zinc-900 animate-pulse rounded-lg h-96"></div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
