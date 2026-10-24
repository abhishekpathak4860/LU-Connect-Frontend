
"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { FiArrowUpRight } from "react-icons/fi";

export default function StudentDashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-black/10 bg-[#fafaf8]/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 sm:px-8">
        <Link href="/student/dashboard" className="group flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-black">
            LU.CONNECT
          </span>
          <span className="h-2 w-2 rounded-full bg-blue-600" />
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="hidden items-center gap-1 text-sm text-neutral-600 transition hover:text-blue-600 sm:flex"
          >
            Main site <FiArrowUpRight size={15} />
          </Link>

          <div className="border-l border-black/10 pl-4">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
