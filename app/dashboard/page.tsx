import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SectionCards } from "./_components/section-cards";
import { ChartAreaInteractive } from "./_components/chart-interactive";
import BlackboxChatInput from "@/components/blackbox/blackbox-chat-input";
import BlackboxActionButtons from "@/components/blackbox/blackbox-action-buttons";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const result = await auth?.api?.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!result?.session?.userId) {
    redirect("/sign-in");
  }

  return (
    <section className="flex flex-col items-center justify-start p-6 w-full min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-6xl flex flex-col gap-12 pt-8">
        {/* Centered Chat Area - Matching Homepage but for Dashboard */}
        <div className="flex flex-col items-center justify-center gap-8 w-full">
          <div className="w-full max-w-3xl">
            <h2 className="text-2xl font-medium text-center mb-8 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              How can I help you today?
            </h2>
            <BlackboxChatInput />
          </div>
          <BlackboxActionButtons />
        </div>

        {/* Dashboard Analytics Section */}
        <div className="w-full space-y-8 mt-12">
          <div className="flex flex-col items-start justify-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Interactive Chart
            </h1>
            <p className="text-muted-foreground">
              Interactive chart with data visualization and interactive elements.
            </p>
          </div>
          <div className="@container/main flex flex-1 flex-col gap-6">
            <SectionCards />
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </section>
  );
}
