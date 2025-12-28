import BlackboxSidebar from "@/components/blackbox/blackbox-sidebar";
import BlackboxTopNav from "@/components/blackbox/blackbox-top-nav";
import BlackboxChatInput from "@/components/blackbox/blackbox-chat-input";
import BlackboxActionButtons from "@/components/blackbox/blackbox-action-buttons";
import BlackboxBottomIcons from "@/components/blackbox/blackbox-bottom-icons";
import BlackboxBottomBanner from "@/components/blackbox/blackbox-bottom-banner";
import BlackboxLogo from "@/components/blackbox/blackbox-logo";

export default async function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <BlackboxSidebar />

      {/* Top Navigation */}
      <BlackboxTopNav />

      {/* Main Content */}
      <main className="ml-0 lg:ml-64 min-h-screen flex flex-col items-center justify-center px-4 pb-32">
        {/* Centered Logo and Chat Input */}
        <div className="flex flex-col items-center justify-center gap-12 w-full max-w-4xl">
          {/* Logo */}
          <BlackboxLogo className="scale-150" />

          {/* Chat Input */}
          <div className="w-full">
            <BlackboxChatInput />
          </div>

          {/* Action Buttons */}
          <BlackboxActionButtons />
        </div>
      </main>

      {/* Bottom Right Icons */}
      <BlackboxBottomIcons />

      {/* Bottom Banner */}
      <BlackboxBottomBanner />
    </div>
  );
}
