
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

  return (
    <>
      {!isStudentDashboard && <Navbar />}

      <main
        className={`relative z-10 flex-grow ${
          isStudentDashboard ? "" : "pt-16"
        }`}
      >
        {children}
      </main>
    </>
  );
}
