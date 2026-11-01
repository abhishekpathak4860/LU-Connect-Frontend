"use client";

import { useState } from "react";
import TPCNavbar from "@/components/tpc/TPCNavbar";
import TPCSidebar from "@/components/tpc/TPCSidebar";

export default function TPCDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TPCNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px]">
        <TPCSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}