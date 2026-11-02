
"use client";

import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import {
  Search,
  Users,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BriefcaseBusiness,
  RefreshCw,
} from "lucide-react";

type ApplicationStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "REJECTED";

interface Application {
  id: string;
  created_at: string;
  status: ApplicationStatus;
  job_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  compatibility_score: number | null;
  matching_skills: string[] | null;
  missing_skills: string[] | null;
  job: {
    id: string;
    role: string;
    company_name: string;
    _count: {
      applications: number;
    };
  };
}

interface Pagination {
  currentPage: number;
  limit: number;
  totalApplications: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApplicationStats {
  totalApplications: number;
  appliedCount: number;
  underReviewCount: number;
  shortlistedCount: number;
  rejectedCount: number;
}

const statusOptions: ApplicationStatus[] = [
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "REJECTED",
];

const statusStyles: Record<ApplicationStatus, string> = {
  APPLIED: "bg-blue-50 text-blue-700 border-blue-100",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 border-amber-100",
  SHORTLISTED: "bg-green-50 text-green-700 border-green-100",
  REJECTED: "bg-red-50 text-red-700 border-red-100",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats>({
    totalApplications: 0,
    appliedCount: 0,
    underReviewCount: 0,
    shortlistedCount: 0,
    rejectedCount: 0,
  });

  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    limit: 10,
    totalApplications: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        `/applications?page=${pagination.currentPage}&limit=${pagination.limit}`
      );

      setApplications(response.data.applications);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError("Unable to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    try {
      setUpdatingId(applicationId);
      setError("");

      await axiosInstance.patch(
        `/applications/${applicationId}/status`,
        { status: newStatus }
      );

      await fetchApplications();
    } catch (err) {
      console.error("Failed to update application status:", err);
      setError("Unable to update application status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplications = applications.filter((application) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      application.name.toLowerCase().includes(searchTerm) ||
      application.email.toLowerCase().includes(searchTerm) ||
      application.job.role.toLowerCase().includes(searchTerm) ||
      application.job.company_name.toLowerCase().includes(searchTerm);

    const matchesStatus =
      statusFilter === "ALL" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const summaryCards = [
    {
      title: "Total Applications",
      count: stats.totalApplications,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Applied",
      count: stats.appliedCount,
      icon: FileText,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Under Review",
      count: stats.underReviewCount,
      icon: RefreshCw,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Shortlisted",
      count: stats.shortlistedCount,
      icon: BriefcaseBusiness,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Applications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage student applications and track their progress.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {card.count}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${card.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Applications Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Student Applications
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review applicants and update their application status.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search students or jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-black outline-none transition focus:border-blue-500 sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-blue-500"
              >
                <option value="ALL">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <Loader2 size={30} className="animate-spin text-blue-600" />
            <p className="text-sm text-gray-500">
              Loading applications...
            </p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <Users size={38} className="text-gray-300" />
            <h3 className="mt-3 font-semibold text-gray-800">
              No applications found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* Responsive Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Student
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Job Details
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Applicants
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Compatibility
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Resume
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Applied On
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredApplications.map((application) => (
                    <tr
                      key={application.id}
                      className="transition hover:bg-gray-50/70"
                    >
                      {/* Student */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {application.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {application.email}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {application.phone}
                        </p>
                      </td>

                      {/* Job */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {application.job.role}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {application.job.company_name}
                        </p>
                      </td>

                      {/* Total Applicants */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                          <Users size={14} />
                          {application.job._count.applications}
                        </span>
                      </td>

                      {/* Compatibility */}
                      <td className="px-5 py-4">
                        {application.compatibility_score !== null ? (
                          <span className="font-semibold text-gray-800">
                            {application.compatibility_score}%
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Not available
                          </span>
                        )}
                      </td>

                      {/* Resume */}
                      <td className="px-5 py-4">
                        {application.resume_url ? (
                          <a
                            href={application.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            <FileText size={15} />
                            View Resume
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Not uploaded
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {new Date(application.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      {/* Status Update */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[application.status]}`}
                          >
                            {application.status.replace("_", " ")}
                          </span>

                          <select
                            value={application.status}
                            disabled={updatingId === application.id}
                            onChange={(e) =>
                              handleStatusChange(
                                application.id,
                                e.target.value as ApplicationStatus
                              )
                            }
                            className="max-w-40 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-black outline-none focus:border-blue-500 disabled:opacity-50"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status.replace("_", " ")}
                              </option>
                            ))}
                          </select>

                          {updatingId === application.id && (
                            <Loader2
                              size={14}
                              className="animate-spin text-blue-600"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
                {" · "}
                {pagination.totalApplications} applications
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={!pagination.hasPreviousPage || loading}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage - 1,
                    }))
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage + 1,
                    }))
                  }
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
    </div>
  );
}
