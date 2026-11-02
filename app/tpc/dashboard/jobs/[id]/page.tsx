
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  Building2,
  RefreshCw,
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
  created_at?: string;
}

export default function TPCJobDetailsPage() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get<{ job: Job }>(
          `/jobs/${jobId}`
        );

        setJob(response.data.job);
      } catch (err) {
        console.error("Failed to fetch job:", err);
        setError("Unable to load this job posting.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-blue-600" size={25} />
        <p className="mt-3 text-sm text-gray-500">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white px-5 py-16 text-center">
        <p className="text-sm text-red-600">
          {error || "Job not found."}
        </p>
        <Link
          href="/tpc/dashboard/jobs"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Back navigation */}
      <Link
        href="/tpc/dashboard/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={17} />
        Back to job postings
      </Link>

      {/* Job header */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <BriefcaseBusiness size={13} />
              Job Posting
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              {job.role}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-gray-600">
              <Building2 size={17} />
              {job.company_name}
            </p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-[#fafaf8] p-4">
            <p className="text-xs font-medium text-gray-500">Location</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
              <MapPin size={16} className="text-blue-600" />
              {job.location}
            </p>
          </div>

          <div className="rounded-lg bg-[#fafaf8] p-4">
            <p className="text-xs font-medium text-gray-500">Package</p>
            <p className="mt-2 text-sm font-medium text-gray-900">
              {job.package}
            </p>
          </div>

          <div className="rounded-lg bg-[#fafaf8] p-4">
            <p className="text-xs font-medium text-gray-500">
              Application Deadline
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
              <CalendarDays size={16} className="text-blue-600" />
              {formatDate(job.application_deadline)}
            </p>
          </div>
        </div>
      </div>

      {/* Job information */}
      <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 sm:p-8">
        <section>
          <h2 className="text-base font-semibold text-gray-950">
            Job Description
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-600">
            {job.description}
          </p>
        </section>

        <div className="border-t border-gray-100" />

        <section>
          <h2 className="text-base font-semibold text-gray-950">
            Eligibility Criteria
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-600">
            {job.eligibility_criteria}
          </p>
        </section>
      </div>
    </div>
  );
}
