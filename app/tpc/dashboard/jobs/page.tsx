
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import {
  BriefcaseBusiness,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  RefreshCw,
  Trash2,
  MapPin,
  Plus,
} from "lucide-react";
import JobPostForm from "@/components/tpc/JobPostForm";

interface Job {
  id: string;
  company_name: string;
  role: string;
  location: string;
  package: string;
  eligibility_criteria: string;
  description: string;
  application_deadline: string;
  created_at?: string;
}

interface JobsResponse {
  jobs: Job[];
  pagination: {
    currentPage: number;
    limit: number;
    totalJobs: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export default function TPCJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<JobsResponse["pagination"]>({
    currentPage: 1,
    limit: 10,
    totalJobs: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
const [selectedJob, setSelectedJob] = useState<Job | null>(null);
const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get<JobsResponse>("/jobs", {
        params: { page, limit: 10 },
      });

      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  // delete job by tpc
const handleDeleteJob = async () => {
  if (!jobToDelete) return;

  try {
    setIsDeleting(true);

    await axiosInstance.delete(`/jobs/${jobToDelete.id}`);

    setJobToDelete(null);
    await fetchJobs();
  } catch (error) {
    console.error("Failed to delete job:", error);
    // We'll show an inline error in the custom modal.
  } finally {
    setIsDeleting(false);
  }
};

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filteredJobs = jobs.filter((job) => {
    const query = search.trim().toLowerCase();

    return (
      job.role.toLowerCase().includes(query) ||
      job.company_name.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    );
  });

  const isJobActive = (deadline: string) => {
    // Compare calendar dates in the browser's local timezone.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    return deadlineDate.getTime() >= today.getTime();
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">TPC Workspace</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
            Job Postings
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View and manage all job opportunities posted for students.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BriefcaseBusiness size={17} />
          <span>{pagination.totalJobs} total jobs</span>
        </div>
      </div>
          <button
              onClick={() => setIsJobFormOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Post New Job
            </button>

      {/* Search and refresh */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, role or location..."
            className="w-full rounded-lg border border-gray-200 text-black  bg-[#fafaf8] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          onClick={fetchJobs}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Jobs table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw
              className="mx-auto animate-spin text-blue-600"
              size={25}
            />
            <p className="mt-3 text-sm text-gray-500">
              Loading job postings...
            </p>
          </div>
        ) : error ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchJobs}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <BriefcaseBusiness
              className="mx-auto text-gray-300"
              size={35}
            />
            <h3 className="mt-4 font-medium text-gray-900">
              No jobs found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "Try searching with a different keyword."
                : "There are no job postings available yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#fafaf8]">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Company
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Job Role
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Location
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Package
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Deadline
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredJobs.map((job) => {
                    const active = isJobActive(job.application_deadline);

                    return (
                      <tr
                        key={job.id}
                        className="transition hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-4">
                          <span className="font-medium text-gray-900">
                            {job.company_name}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-gray-800">
                            {job.role}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                            <MapPin size={14} className="text-gray-400" />
                            {job.location}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700">
                          {job.package}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatDate(job.application_deadline)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              active
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                active ? "bg-green-600" : "bg-red-600"
                              }`}
                            />
                            {active ? "Active" : "Expired"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/tpc/dashboard/jobs/${job.id}`}
                              title="View job details"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                            >
                              View
                              <ArrowUpRight size={14} />
                            </Link>
<button
  onClick={() => {
    setSelectedJob(job);
    setIsJobFormOpen(true);
  }}
  className="text-blue-600 hover:text-blue-800"
>
  Edit
</button>
                            <button
  type="button"
  title="Delete job"
 onClick={() => setJobToDelete(job)}
  className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
>
  <Trash2 size={14} />
  Delete
</button>

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing {filteredJobs.length} of {pagination.totalJobs} jobs
                <span className="ml-1 text-gray-400">
                  · Page {pagination.currentPage} of {Math.max(pagination.totalPages, 1)}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage((current) => current - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((current) => current + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
 
          </>
        )}
      </div>
                 <JobPostForm
  isOpen={isJobFormOpen}
  onClose={() => setIsJobFormOpen(false)}
  onSuccess={fetchJobs}
  selectedJob={selectedJob}
/>

{jobToDelete && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <Trash2 size={22} className="text-red-600" />
      </div>

      <h2 className="text-xl font-semibold text-gray-900">
        Delete Job?
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-900">
          {jobToDelete.role}
        </span>{" "}
        at{" "}
        <span className="font-semibold text-gray-900">
          {jobToDelete.company_name}
        </span>
        ? All student applications associated with this job will also be
        permanently deleted. This action cannot be undone.
      </p>

      <div className="mt-7 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setJobToDelete(null)}
          disabled={isDeleting}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={isDeleting}
          onClick={handleDeleteJob}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete Job"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
