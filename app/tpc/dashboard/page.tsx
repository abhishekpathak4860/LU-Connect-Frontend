"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import {
  FiBriefcase,
  FiUsers,
  FiBookmark,
  FiArrowUpRight,
  FiPlus,
  FiFileText,
  FiCalendar,
  FiMapPin,
  FiRefreshCw,
} from "react-icons/fi";

interface Job {
  id: string;
  company_name: string;
  role: string;
  location: string;
  application_deadline: string;
}

interface Application {
  id: string;
  name: string;
  email: string;
  status: string;
  job?: {
    id: string;
    role: string;
    company_name: string;
  };
}

export default function TPCDashboardPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      await axios.get("/auth/me", { withCredentials: true });

      const [jobsRes, applicationsRes] = await Promise.all([
        axios.get("/jobs", { withCredentials: true }),
        axios.get("/applications", { withCredentials: true }),
      ]);

      setJobs(jobsRes.data.jobs || []);
      setApplications(applicationsRes.data.applications || []);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.replace("/tpc/login");
        return;
      }

      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const shortlistedCount = applications.filter(
    (application) => application.status === "shortlisted"
  ).length;

  const stats = [
    {
      label: "Total jobs",
      value: jobs.length,
      description: "Job opportunities posted",
      icon: FiBriefcase,
    },
    {
      label: "Applications",
      value: applications.length,
      description: "Student applications received",
      icon: FiUsers,
    },
    {
      label: "Shortlisted",
      value: shortlistedCount,
      description: "Candidates shortlisted",
      icon: FiBookmark,
    },
  ];

  const recentJobs = [...jobs].slice(0, 5);
  const recentApplications = [...applications].slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-sm text-neutral-500">
          Loading placement workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page heading */}
      <section className="mb-9 flex flex-col justify-between gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
            University career portal
          </p>

          <h1 className="text-4xl font-medium tracking-tight text-neutral-950 sm:text-5xl">
            Placement operations.
            <br />
            <span className="text-neutral-400">One workspace.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
            Manage job opportunities, review student applications, and track
            your placement activity.
          </p>
        </div>

        <Link
          href="/tpc/dashboard/jobs"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FiPlus size={17} />
          Manage jobs
          <FiArrowUpRight size={15} />
        </Link>
      </section>

      {/* Error state */}
      {error && (
        <div className="mb-6 flex flex-col gap-3 border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-700">{error}</p>

          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-900"
          >
            <FiRefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {/* Statistics */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
            Placement overview
          </h2>

          <span className="text-xs text-neutral-400">All time</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map(({ label, value, description, icon: Icon }) => (
            <div
              key={label}
              className="border border-black/10 bg-white p-5 transition hover:border-blue-600/40 sm:p-6"
            >
              <div className="mb-7 flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-500">
                  {label}
                </p>

                <div className="flex h-9 w-9 items-center justify-center bg-blue-50 text-blue-600">
                  <Icon size={18} />
                </div>
              </div>

              <p className="text-4xl font-semibold tracking-tight text-neutral-950">
                {value}
              </p>

              <p className="mt-2 text-xs text-neutral-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Recent jobs */}
        <div className="border border-black/10 bg-white lg:col-span-3">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-semibold text-neutral-950">Recent jobs</h2>
              <p className="mt-1 text-xs text-neutral-400">
                Latest opportunities in the portal
              </p>
            </div>

            <Link
              href="/tpc/dashboard/jobs"
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View all <FiArrowUpRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-black/5">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {job.role}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {job.company_name}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <FiMapPin size={12} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} />
                        {new Date(
                          job.application_deadline
                        ).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <span className="w-fit border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-700">
                    Posted
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <FiBriefcase className="mx-auto text-2xl text-neutral-300" />
                <p className="mt-3 text-sm font-medium text-neutral-700">
                  No jobs posted yet
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  Your posted opportunities will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent applications */}
        <div className="border border-black/10 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-semibold text-neutral-950">
                Recent applications
              </h2>
              <p className="mt-1 text-xs text-neutral-400">
                Latest student activity
              </p>
            </div>

            <Link
              href="/tpc/dashboard/applications"
              className="text-blue-600 transition hover:text-blue-800"
              aria-label="View all applications"
            >
              <FiArrowUpRight size={18} />
            </Link>
          </div>

          <div className="divide-y divide-black/5">
            {recentApplications.length > 0 ? (
              recentApplications.map((application) => (
                <div key={application.id} className="px-5 py-4 sm:px-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-neutral-100 text-neutral-500">
                      <FiFileText size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {application.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-neutral-400">
                        {application.email}
                      </p>
                      <p className="mt-2 truncate text-xs text-neutral-500">
                        {application.job?.role || "Job application"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`inline-flex px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        application.status === "shortlisted"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {application.status || "Pending"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <FiUsers className="mx-auto text-2xl text-neutral-300" />
                <p className="mt-3 text-sm font-medium text-neutral-700">
                  No applications yet
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  Student applications will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}