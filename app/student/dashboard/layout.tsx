"use client";

import { useState, useEffect } from "react";
import StudentDashboardNavbar from "@/components/student/StudentDashboardNavbar";
import StudentSidebar from "@/components/student/StudentSidebar";
import { FiMenu, FiX } from "react-icons/fi";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent scrolling on the body when the mobile sidebar is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-[#fafaf8] text-neutral-900">
      <StudentDashboardNavbar />

      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop Sidebar (Hidden on mobile) */}
        <div className="hidden md:block">
          <StudentSidebar />
        </div>

        {/* Mobile Collapsible Sidebar (Drawer/Overlay) */}
        <div 
          className={`fixed inset-0 z-50 flex md:hidden transition-all duration-300 ${
            menuOpen ? "visible" : "invisible pointer-events-none"
          }`}
        >
          {/* Dark Backdrop */}
          <div 
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              menuOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Sliding Sidebar Panel */}
          <div 
            className={`relative flex w-[280px] max-w-[80%] flex-col bg-[#fafaf8] shadow-2xl transition-transform duration-300 ease-in-out ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Close Button */}
            <div className="absolute right-4 top-4 z-50">
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center rounded-md border border-black/10 bg-white p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="h-full overflow-y-auto pt-2">
              <StudentSidebar onNavigate={() => setMenuOpen(false)} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
          <div className="mb-5 md:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50 transition-colors"
              aria-expanded={menuOpen}
            >
              <FiMenu size={18} />
              Dashboard menu
            </button>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}