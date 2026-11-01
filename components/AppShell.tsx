"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isStudentDashboard = pathname.startsWith("/student/dashboard");
  const isTpcDashboard = pathname.startsWith("/tpc/dashboard");

  const isDashboard = isStudentDashboard || isTpcDashboard;

  return (
    <>
      {!isDashboard && <Navbar />}

      <main
        className={`relative z-10 flex-grow ${
          isDashboard ? "" : "pt-16"
        }`}
      >
        {children}
      </main>
    </>
  );
}