"use client";

import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC]">
      {/* Desktop sidebar — dark navy, sticky */}
      <Sidebar />

      {/* Main content area — scrolls independently */}
      <main className="flex-1 flex flex-col overflow-y-auto pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
