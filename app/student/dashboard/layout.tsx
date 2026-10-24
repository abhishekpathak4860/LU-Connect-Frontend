
"use client";

import { useState } from "react";
import StudentDashboardNavbar from "@/components/student/StudentDashboardNavbar";
import StudentSidebar from "@/components/student/StudentSidebar";
import { FiMenu, FiX } from "react-icons/fi";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafaf8] text-neutral-900">
      <StudentDashboardNavbar />

      <div className="mx-auto flex max-w-[1600px]">
        <div className="hidden md:block">
          <StudentSidebar />
        </div>

        <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
          <div className="mb-5 md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 border border-black/10 px-4 py-2 text-sm"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              {menuOpen ? "Close menu" : "Dashboard menu"}
            </button>

            {menuOpen && (
              <div className="mt-3 border border-black/10 bg-white p-3">
                <StudentSidebar />
              </div>
            )}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
