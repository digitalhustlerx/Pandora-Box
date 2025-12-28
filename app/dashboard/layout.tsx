import { ReactNode } from "react";
import BlackboxSidebar from "@/components/blackbox/blackbox-sidebar";
import BlackboxTopNav from "@/components/blackbox/blackbox-top-nav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <BlackboxSidebar />
      <BlackboxTopNav />
      <main className="ml-0 lg:ml-64 min-h-screen overflow-y-auto pt-20">
        {children}
      </main>
    </div>
  );
}
