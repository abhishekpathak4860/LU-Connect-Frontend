
"use client";

import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface Application {
  id: string;
  created_at: string;
  status: "SHORTLISTED";
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

export default function ShortlistedPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    limit: 10,
    totalApplications: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchShortlisted = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        `/applications?page=${pagination.currentPage}&limit=${pagination.limit}&status=SHORTLISTED`
      );

      setApplications(response.data.applications);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Failed to fetch shortlisted applications:", err);
      setError("Unable to load shortlisted students. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit]);

  useEffect(() => {
    fetchShortlisted();
  }, [fetchShortlisted]);

  const filteredApplications = applications.filter((application) => {
    const searchTerm = search.toLowerCase();

    return (
      application.name.toLowerCase().includes(searchTerm) ||
      application.email.toLowerCase().includes(searchTerm) ||
      application.job.role.toLowerCase().includes(searchTerm) ||
      application.job.company_name.toLowerCase().includes(searchTerm)
    );
  });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen w-full bg-[#fafaf8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-full space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Shortlisted Students
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage students shortlisted for job opportunities.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">
              Total Shortlisted Students
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {pagination.totalApplications}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">
              Students Displayed
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {applications.length}
            </p>
          </div>
        </div>

        {/* Shortlisted Applications */}
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">

          {/* Table Header */}
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Shortlisted Applications
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Students selected for further consideration.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search student or job..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-black outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-sm"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
              <button
                onClick={fetchShortlisted}
                className="ml-2 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <h3 className="font-semibold text-gray-900">
                {search
                  ? "No matching students found"
                  : "No shortlisted students yet"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try searching with a different name, email, or job title."
                  : "Students shortlisted from the Applications page will appear here."}
              </p>
            </div>
          ) : (
            <>
              {/* Expanded Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[1250px] table-auto text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="w-[18%] whitespace-nowrap px-6 py-5 font-semibold">
                        Student
                      </th>
                      <th className="w-[23%] whitespace-nowrap px-6 py-5 font-semibold">
                        Contact
                      </th>
                      <th className="w-[19%] whitespace-nowrap px-6 py-5 font-semibold">
                        Job
                      </th>
                      <th className="w-[13%] whitespace-nowrap px-6 py-5 font-semibold">
                        Compatibility
                      </th>
                      <th className="w-[10%] whitespace-nowrap px-6 py-5 font-semibold">
                        Resume
                      </th>
                      <th className="w-[12%] whitespace-nowrap px-6 py-5 font-semibold">
                        Shortlisted On
                      </th>
                      <th className="whitespace-nowrap px-6 py-5 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredApplications.map((application) => (
                      <tr
                        key={application.id}
                        className="transition hover:bg-gray-50"
                      >
                        {/* Student */}
                        <td className="whitespace-nowrap px-6 py-6">
                          <p className="font-semibold text-gray-900">
                            {application.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            ID: {application.id.slice(0, 8)}
                          </p>
                        </td>

                        {/* Contact */}
                        <td className="whitespace-nowrap px-6 py-6">
                          <p className="text-gray-800">
                            {application.email}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {application.phone}
                          </p>
                        </td>

                        {/* Job */}
                        <td className="px-6 py-6">
                          <p className="font-medium text-gray-900">
                            {application.job.role}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {application.job.company_name}
                          </p>
                        </td>

                        {/* Compatibility */}
                        <td className="whitespace-nowrap px-6 py-6">
                          {application.compatibility_score !== null ? (
                            <span className="font-semibold text-gray-900">
                              {application.compatibility_score}%
                            </span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>

                        {/* Resume */}
                        <td className="whitespace-nowrap px-6 py-6">
                          {application.resume_url ? (
                            <a
                              href={application.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              View Resume
                            </a>
                          ) : (
                            <span className="text-gray-400">
                              Not available
                            </span>
                          )}
                        </td>

                        {/* Shortlisted Date */}
                        <td className="whitespace-nowrap px-6 py-6 text-gray-600">
                          {formatDate(application.created_at)}
                        </td>

                        {/* Status */}
                        <td className="whitespace-nowrap px-6 py-6">
                          <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            Shortlisted
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Page {pagination.currentPage} of {pagination.totalPages}
                  {" · "}
                  {pagination.totalApplications} shortlisted students
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={!pagination.hasPreviousPage}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage - 1,
                      }))
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage + 1,
                      }))
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
