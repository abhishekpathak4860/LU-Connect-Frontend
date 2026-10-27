
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  BriefcaseBusiness,
  MapPin,
  Banknote,
  CalendarDays,
  Search,
  ChevronLeft,
  ChevronRight,
  Building2,
  ArrowUpRight,
  LoaderCircle,
} from "lucide-react";

interface Job {
  id: string;
  company_name: string;
  role: string;
  location: string;
  package: string;
  eligibility_criteria: string;
  description: string;
  application_deadline: string;
  created_at: string;
}

interface Pagination {
  currentPage: number;
  limit: number;
  totalJobs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface JobsProps {
  initialJobs: Job[];
  initialPagination: Pagination;
}

export default function Jobs({
  initialJobs,
  initialPagination,
}: JobsProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [pagination, setPagination] = useState(initialPagination);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const changePage = (page: number) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.currentPage ||
      isPending
    ) {
      return;
    }

    startTransition(async () => {
      try {
        setError("");

        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!baseUrl) {
          throw new Error("Backend URL is not configured.");
        }

        const response = await fetch(
          `${baseUrl.replace(/\/$/, "")}/jobs?page=${page}&limit=${pagination.limit}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Could not load jobs. Please try again.");
        }

        const data = await response.json();

        setJobs(data.jobs ?? []);
        setPagination(data.pagination);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading jobs.",
        );
      }
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const query = search.trim().toLowerCase();

    return (
      job.role.toLowerCase().includes(query) ||
      job.company_name.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    );
  });

  const formatDate = (date: string) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="min-h-full bg-[#F9F9F7] px-4 py-8 text-[#1A1A1A] sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 border-b border-black/[0.08] pb-7 sm:mb-10 sm:pb-9">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#2563EB]">
            Student workspace / Opportunities
          </p>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Find your next
                <span className="text-[#2563EB]"> opportunity.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">
                Explore on-campus and off-campus roles curated by the
                Training and Placement Cell.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 border border-black/[0.08] bg-white px-4 py-3">
              <BriefcaseBusiness className="h-5 w-5 text-[#2563EB]" />
              <div>
                <p className="text-lg font-bold leading-5">
                  {pagination.totalJobs}
                </p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Available opportunities
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-7 max-w-lg">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search role, company or location..."
              aria-label="Search jobs"
              className="w-full border border-black/10 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
            />
          </div>
        </div>

        {/* Results header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-neutral-800">
            {search.trim() ? "Search results" : "Latest opportunities"}
          </h2>

          <p className="text-xs text-neutral-500">
            {search.trim()
              ? `${filteredJobs.length} matches on this page`
              : pagination.totalJobs === 0
                ? "No jobs available"
                : `Page ${pagination.currentPage} of ${Math.max(1, pagination.totalPages)}`}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{error}</p>
            <button
              onClick={() => changePage(pagination.currentPage)}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Job cards */}
        <div className="relative">
          {isPending && (
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-[#F9F9F7]/65 pt-20 backdrop-blur-[2px]">
              <div className="flex items-center gap-2 border border-black/10 bg-white px-4 py-3 text-sm font-medium shadow-sm">
                <LoaderCircle className="h-4 w-4 animate-spin text-[#2563EB]" />
                Loading opportunities...
              </div>
            </div>
          )}

          {filteredJobs.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={pagination.currentPage}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2"
              >
                {filteredJobs.map((job, index) => (
                  <motion.article
                    key={job.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(index * 0.045, 0.2),
                    }}
                    className="group flex min-w-0 flex-col border border-black/[0.09] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/[0.04] sm:p-6"
                  >
                    {/* Company and location */}
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-black/[0.08] bg-[#F9F9F7] text-[#2563EB]">
                        <span className="text-xl font-bold">
                          {job.company_name?.trim().charAt(0).toUpperCase() || (
                            <Building2 className="h-5 w-5" />
                          )}
                        </span>
                      </div>

                      <span className="inline-flex max-w-[60%] items-center gap-1.5 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </span>
                    </div>

                    {/* Job details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold leading-snug tracking-tight transition-colors group-hover:text-[#2563EB] sm:text-2xl">
                        {job.role}
                      </h3>

                      <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-neutral-600">
                        <Building2 className="h-4 w-4 shrink-0 text-neutral-400" />
                        <span className="break-words">{job.company_name}</span>
                      </p>

                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-500">
                        {job.description}
                      </p>

                      {/* Metadata */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="inline-flex max-w-full items-center gap-2 border border-black/[0.07] bg-[#F9F9F7] px-3 py-2 text-xs font-medium text-neutral-700">
                          <Banknote className="h-4 w-4 shrink-0 text-[#2563EB]" />
                          <span className="break-words">{job.package}</span>
                        </span>

                        <span className="inline-flex items-center gap-2 border border-black/[0.07] bg-[#F9F9F7] px-3 py-2 text-xs font-medium text-neutral-700">
                          <CalendarDays className="h-4 w-4 shrink-0 text-[#2563EB]" />
                          <span>Due {formatDate(job.application_deadline)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-black/[0.07] pt-4">
                      <span className="text-xs text-neutral-500">
                        Eligibility details available
                      </span>

                  <Link
  href={`/student/dashboard/jobs/${job.id}`}
  className="inline-flex shrink-0 items-center gap-2 bg-[#1A1A1A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
>
  View details
  <ArrowUpRight className="h-4 w-4" />
</Link>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="border border-black/[0.08] bg-white px-5 py-16 text-center sm:py-20">
              <BriefcaseBusiness className="mx-auto mb-4 h-10 w-10 text-neutral-300" />
              <h3 className="text-lg font-bold">
                {search.trim() ? "No matching jobs" : "No jobs available yet"}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                {search.trim()
                  ? "Try a different role, company, or location."
                  : "New opportunities will appear here when they are posted."}
              </p>
              {search.trim() && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 text-sm font-semibold text-[#2563EB] hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && !search.trim() && (
          <div className="mt-8 flex flex-col gap-4 border-t border-black/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-500">
              Page{" "}
              <span className="font-semibold text-neutral-900">
                {pagination.currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-neutral-900">
                {pagination.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => changePage(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage || isPending}
                className="inline-flex flex-1 items-center justify-center gap-2 border border-black/10 bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex h-11 min-w-11 items-center justify-center bg-[#2563EB] px-3 text-sm font-bold text-white">
                {pagination.currentPage}
              </div>

              <button
                onClick={() => changePage(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage || isPending}
                className="inline-flex flex-1 items-center justify-center gap-2 border border-black/10 bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
