
import Link from "next/link";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiFileText,
  FiUser,
  FiCheckCircle,
} from "react-icons/fi";

const actions = [
  {
    title: "Complete your profile",
    description: "Add your academic and professional details.",
    href: "/student/dashboard/profile",
    icon: FiUser,
    number: "01",
  },
  {
    title: "Track applications",
    description: "Keep track of your job application journey.",
    href: "/student/dashboard/applications",
    icon: FiFileText,
    number: "02",
  },
  {
    title: "Explore applied jobs",
    description: "Review the jobs you have applied for.",
    href: "/student/dashboard/applied-jobs",
    icon: FiBriefcase,
    number: "03",
  },
  {
    title: "Manage your resume",
    description: "Upload and manage your latest resume.",
    href: "/student/dashboard/resume",
    icon: FiCheckCircle,
    number: "04",
  },
];

export default function StudentDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-10 border-b border-black/10 pb-8">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600">
          UNIVERSITY CAREER PORTAL
        </p>

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              Your career.
              <br />
              <span className="text-neutral-400">Your next move.</span>
              <span className="text-blue-600">.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
              Welcome to your LU Connect workspace. Build your profile,
              manage your applications, and prepare for your next opportunity.
            </p>
          </div>

          <Link
            href="/student/dashboard/profile"
            className="inline-flex w-fit items-center gap-3 bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Complete your profile
            <FiArrowUpRight size={17} />
          </Link>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            WORKSPACE
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            Get started
          </h2>
        </div>

        <span className="text-xs text-neutral-400">01 — 04</span>
      </div>

      <div className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2">
        {actions.map(({ title, description, href, icon: Icon, number }) => (
          <Link
            key={href}
            href={href}
            className="group flex min-h-48 flex-col justify-between bg-[#fafaf8] p-6 transition-colors hover:bg-white sm:p-8"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center border border-black/10 text-neutral-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={19} strokeWidth={1.7} />
              </span>

              <span className="text-xs tracking-widest text-neutral-400">
                {number}
              </span>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-neutral-950">
                  {title}
                </h3>
                <FiArrowUpRight
                  size={17}
                  className="shrink-0 text-neutral-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-600"
                />
              </div>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">
          LU CONNECT — Your university career workspace.
        </p>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
          Built for what comes next
        </span>
      </div>
    </div>
  );
}
