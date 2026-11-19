
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
  CalendarDays,
  IndianRupee,
} from "lucide-react";
import InternshipPostForm from "@/components/tpc/InternshipPostForm";


interface Internship {
  id: string;
  company_name: string;
  role: string;
  location: string;
  work_mode: "REMOTE" | "HYBRID" | "ONSITE";
  stipend: string;
  duration: string;
  eligibility_criteria: string;
  required_skills: string[];
  description: string;
  application_deadline: string;
  start_date?: string | null;
  created_at?: string;
}

interface InternshipsResponse {
  internships: Internship[];
  pagination: {
    currentPage: number;
    limit: number;
    totalInternships: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export default function TPCInternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState<
    InternshipsResponse["pagination"]
  >({
    currentPage: 1,
    limit: 10,
    totalInternships: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] =
    useState<Internship | null>(null);
  const [internshipToDelete, setInternshipToDelete] =
    useState<Internship | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInternships = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get<InternshipsResponse>(
        "/internships",
        {
          params: { page, limit: 10 },
        }
      );

      setInternships(response.data.internships);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Failed to fetch internships:", err);
      setError("Unable to load internships. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  const handleDeleteInternship = async () => {
    if (!internshipToDelete) return;

    try {
      setIsDeleting(true);

      await axiosInstance.delete(
        `/internships/${internshipToDelete.id}`
      );

      setInternshipToDelete(null);
      await fetchInternships();
    } catch (err) {
      console.error("Failed to delete internship:", err);
      setError("Unable to delete internship. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const filteredInternships = internships.filter((internship) => {
    const query = search.trim().toLowerCase();

    return (
      internship.role.toLowerCase().includes(query) ||
      internship.company_name.toLowerCase().includes(query) ||
      internship.location.toLowerCase().includes(query) ||
      internship.work_mode.toLowerCase().includes(query)
    );
  });

  const isInternshipActive = (deadline: string) => {
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

  const formatWorkMode = (mode: Internship["work_mode"]) =>
    mode.charAt(0) + mode.slice(1).toLowerCase();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            TPC Workspace
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
            Internship Postings
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View and manage internship opportunities posted for students.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BriefcaseBusiness size={17} />
          <span>{pagination.totalInternships} total internships</span>
        </div>
      </div>

      {/* Create internship */}
      <div>
        <button
          type="button"
          onClick={() => {
            setSelectedInternship(null);
            setIsFormOpen(true);
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={17} />
          Post New Internship
        </button>
      </div>

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
            className="w-full rounded-lg border border-gray-200 bg-[#fafaf8] py-2.5 pl-10 pr-4 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="button"
          onClick={fetchInternships}
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

      {/* Internships table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw
              className="mx-auto animate-spin text-blue-600"
              size={25}
            />
            <p className="mt-3 text-sm text-gray-500">
              Loading internships...
            </p>
          </div>
        ) : error ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={fetchInternships}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <BriefcaseBusiness
              className="mx-auto text-gray-300"
              size={35}
            />

            <h3 className="mt-4 font-medium text-gray-900">
              No internships found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "Try searching with a different keyword."
                : "There are no internship postings available yet."}
            </p>
          </div>
        ) : (
          <>
       
<div className="w-full">
  <table className="w-full table-fixed border-collapse text-left">
    <thead>
      <tr className="border-b border-gray-200 bg-[#fafaf8]">
        <th className="w-[17%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-3">
          Company
        </th>
        <th className="w-[20%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-3">
          Role
        </th>
        <th className="hidden w-[13%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 xl:table-cell sm:px-3">
          Location
        </th>
        <th className="hidden w-[10%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 xl:table-cell sm:px-3">
          Work Mode
        </th>
        <th className="w-[14%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-3">
          Stipend
        </th>
        <th className="hidden w-[13%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 xl:table-cell sm:px-3">
          Deadline
        </th>
        <th className="w-[11%] px-2 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-3">
          Status
        </th>
        <th className="w-[25%] px-1 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-2">
          Actions
        </th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {filteredInternships.map((internship) => {
        const active = isInternshipActive(
          internship.application_deadline
        );

        return (
          <tr
            key={internship.id}
            className="transition hover:bg-gray-50/70"
          >
            <td className="break-words px-2 py-4 text-xs font-medium text-gray-900 sm:px-3 sm:text-sm">
              {internship.company_name}
            </td>

            <td className="break-words px-2 py-4 text-xs font-medium text-gray-800 sm:px-3 sm:text-sm">
              {internship.role}
            </td>

            <td className="hidden break-words px-2 py-4 text-xs text-gray-600 xl:table-cell sm:px-3 sm:text-sm">
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} className="shrink-0 text-gray-400" />
                {internship.location}
              </span>
            </td>

            <td className="hidden px-2 py-4 text-xs text-gray-700 xl:table-cell sm:px-3 sm:text-sm">
              {formatWorkMode(internship.work_mode)}
            </td>

            <td className="break-words px-2 py-4 text-xs text-gray-700 sm:px-3 sm:text-sm">
              {internship.stipend}
            </td>

            <td className="hidden px-2 py-4 text-xs text-gray-600 xl:table-cell sm:px-3 sm:text-sm">
              {formatDate(internship.application_deadline)}
            </td>

            <td className="px-2 py-4 sm:px-3">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium sm:text-xs ${
                  active
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    active ? "bg-green-600" : "bg-red-600"
                  }`}
                />
                {active ? "Active" : "Expired"}
              </span>
            </td>

            <td className="px-1 py-4 sm:px-2">
              <div className="flex flex-wrap items-center justify-center gap-1">
                <Link
                  href={`/tpc/dashboard/internships/${internship.id}`}
                  title="View internship details"
                  className="rounded-md border border-gray-200 px-2 py-1.5 text-[11px] font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  View
                </Link>

                <button
                  type="button"
                  title="Edit internship"
                  onClick={() => {
                    setSelectedInternship(internship);
                    setIsFormOpen(true);
                  }}
                  className="rounded-md px-2 py-1.5 text-[11px] font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  title="Delete internship"
                  onClick={() => setInternshipToDelete(internship)}
                  className="rounded-md border border-red-100 p-1.5 text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={14} />
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
                Showing {filteredInternships.length} of{" "}
                {pagination.totalInternships} internships
                <span className="ml-1 text-gray-400">
                  · Page {pagination.currentPage} of{" "}
                  {Math.max(pagination.totalPages, 1)}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage((current) => current - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  type="button"
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

      {/* Internship form */}
      <InternshipPostForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedInternship(null);
        }}
        onSuccess={fetchInternships}
        selectedInternship={selectedInternship}
      />

      {/* Delete confirmation */}
      {internshipToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={22} className="text-red-600" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Delete Internship?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {internshipToDelete.role}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-gray-900">
                {internshipToDelete.company_name}
              </span>
              ? All student applications associated with this internship
              will also be permanently deleted. This action cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setInternshipToDelete(null)}
                disabled={isDeleting}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteInternship}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete Internship"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
