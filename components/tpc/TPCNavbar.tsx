"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowUpRight, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import axios from "@/lib/axios";

interface TPCNavbarProps {
  onMenuClick?: () => void;
}

export default function TPCNavbar({ onMenuClick }: TPCNavbarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await axios.post(
        "/auth/logout",
        {},
        { withCredentials: true }
      );

      router.replace("/tpc/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-black/10 bg-[#fafaf8]/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 sm:px-8">

        {/* Left section */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick ?? (() => setMobileMenuOpen(!mobileMenuOpen))}
            className="rounded-md p-2 text-neutral-700 transition hover:bg-black/5 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FiX size={21} /> : <FiMenu size={21} />}
          </button>

          <Link
            href="/tpc/dashboard"
            className="group flex items-center gap-2"
          >
            <span className="text-xl font-bold tracking-tight text-black">
              LU.CONNECT
            </span>
            <span className="h-2 w-2 rounded-full bg-blue-600" />
          </Link>

          <span className="hidden border-l border-black/10 pl-3 text-xs font-medium text-neutral-500 sm:block">
            TPC WORKSPACE
          </span>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-5 sm:flex">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-neutral-600 transition hover:text-blue-600"
          >
            Main site
            <FiArrowUpRight size={15} />
          </Link>

          <div className="h-6 border-l border-black/10" />

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiLogOut size={16} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Mobile logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-red-600 disabled:opacity-50 sm:hidden"
        >
          <FiLogOut size={17} />
          <span className="sr-only">Logout</span>
        </button>
      </div>

      {/* Optional mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-black/10 bg-[#fafaf8] px-5 py-3 md:hidden">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-sm text-neutral-600 hover:text-blue-600"
          >
            Main site
            <FiArrowUpRight size={15} />
          </Link>
        </div>
      )}
    </header>
  );
}