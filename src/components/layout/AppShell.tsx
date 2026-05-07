"use client";

import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { useAutoSyncCases } from "@/hooks/useAutoSyncCases";

interface AppShellProps {
  children: React.ReactNode;
}

function AutoSyncMount() {
  useAutoSyncCases();
  return null;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC]">
      <AutoSyncMount />

      {/* Desktop sidebar — dark navy, sticky */}
      <Sidebar />

      {/* Main content area — scrolls independently */}
      <main className="flex-1 flex flex-col overflow-y-auto pb-20 lg:pb-0 min-h-0 relative">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
