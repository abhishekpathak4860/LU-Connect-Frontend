"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiUser,
  FiFileText,
  FiBriefcase,
  FiBookmark,
  FiChevronRight,
} from "react-icons/fi";

const navigation = [
  {
    label: "Overview",
    href: "/student/dashboard",
    icon: FiGrid,
    exact: true,
  },
  {
    label: "My Profile",
    href: "/student/dashboard/profile",
    icon: FiUser,
  },
  {
    label: "Job Applications",
    href: "/student/dashboard/applications",
    icon: FiFileText,
  },
  {
    label: "Jobs",
    href: "/student/dashboard/jobs",
    icon: FiBriefcase,
  },
    {
    label: "Internships",
    href: "/student/dashboard/internships",
    icon: FiBriefcase,
  },
  {
  label: "Internship Apps",
  href: "/student/dashboard/internship-applications",
  icon: FiFileText,
},
  {
    label: "My Resume",
    href: "/student/dashboard/resume",
    icon: FiBookmark,
  },
];

interface StudentSidebarProps {
  onNavigate?: () => void;
}

export default function StudentSidebar({
  onNavigate,
}: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full bg-[#fafaf8] p-4 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-black/10 md:p-6">
      <p className="mb-6 mt-2 md:mt-0 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
        Student workspace
      </p>

      <nav className="flex flex-col gap-1">
        {navigation.map(({ label, href, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-neutral-600 hover:bg-black/[0.04] hover:text-neutral-950"
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />

              <span className="flex-1">{label}</span>

              {active && (
                <FiChevronRight
                  size={15}
                  className="shrink-0"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-black/10 pt-5">
        <p className="px-3 text-xs leading-5 text-neutral-500">
          Your career journey, organized in one place.
        </p>
      </div>
    </aside>
  );
}