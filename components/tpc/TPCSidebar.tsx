"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiBriefcase,
  FiFileText,
  FiBookmark,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

interface TPCSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "Overview",
    href: "/tpc/dashboard",
    icon: FiGrid,
    exact: true,
  },
  {
    label: "Jobs",
    href: "/tpc/dashboard/jobs",
    icon: FiBriefcase,
  },
    {
    label: "Internships",
    href: "/tpc/dashboard/internships",
    icon: FiBriefcase,
  },
  {
    label: "Job Applications",
    href: "/tpc/dashboard/applications",
    icon: FiFileText,
  },
  {
  label: "Internship Applications",
  href: "/tpc/dashboard/internship-applications",
  icon: FiFileText,
},
 {
  label: "Job Shortlisted",
  href: "/tpc/dashboard/shortlisted",
  icon: FiBookmark,
},
{
  label: "Internship Shortlisted",
  href: "/tpc/dashboard/internship-shortlisted",
  icon: FiBookmark,
},
];

export default function TPCSidebar({
  isOpen,
  onClose,
}: TPCSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      <div className="mb-6 flex items-center justify-between px-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          Placement workspace
        </p>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 text-neutral-500 hover:bg-black/5 md:hidden"
          aria-label="Close navigation menu"
        >
          <FiX size={19} />
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {navigation.map(({ label, href, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
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
          Manage campus placements, job opportunities, and student applications
          in one place.
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-black/10 bg-[#fafaf8] p-6 md:block">
        {sidebarContent}
      </aside>

      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 top-16 z-40 bg-black/30 md:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed bottom-0 left-0 top-16 z-50 w-[min(18rem,85vw)] overflow-y-auto border-r border-black/10 bg-[#fafaf8] p-5 shadow-xl transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}