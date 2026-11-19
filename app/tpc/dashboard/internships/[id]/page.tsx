
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
  Clock,
  Wallet,
  Monitor,
  GraduationCap,
  Code,
} from "lucide-react";

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

export default function TPCInternshipDetailsPage() {
  const params = useParams<{ id: string }>();
  const internshipId = params.id;

  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get<{ internship: Internship }>(
          `/internships/${internshipId}`
        );

        setInternship(response.data.internship);
      } catch (err) {
        console.error("Failed to fetch internship:", err);
        setError("Unable to load this internship posting.");
      } finally {
        setLoading(false);
      }
    };

    if (internshipId) fetchInternship();
  }, [internshipId]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatWorkMode = (mode: Internship["work_mode"]) =>
    mode.charAt(0) + mode.slice(1).toLowerCase();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-blue-600" size={25} />
        <p className="mt-3 text-sm text-gray-500">
          Loading internship details...
        </p>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white px-5 py-16 text-center">
        <p className="text-sm text-red-600">
          {error || "Internship not found."}
        </p>
        <Link
          href="/tpc/dashboard/internships"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to internships
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Back navigation */}
      <Link
        href="/tpc/dashboard/internships"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={17} />
        Back to internship postings
      </Link>

      {/* Internship header */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <BriefcaseBusiness size={13} />
              Internship Posting
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              {internship.role}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-gray-600">
              <Building2 size={17} />
              {internship.company_name}
            </p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-[#fafaf8] p-4">
            <p className="text-xs font-medium text-gray-500">Location</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
              <MapPin size={16} className="shrink-0 text-blue-600" />
              {internship.location}
            </p>
          </div>

          <div className="rounded-lg bg-[#fafaf8] p-4">
            <p className="text-xs font-medium text-gray-500">Work Mode</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
              <Monitor size={16} className="shrink-0 text-blue-600" />
              {formatWorkMode(internship.work_mode)}
            </p>
          </div>

          <div className="rounded-lg bg-[#fafaf8] p-4">
            <p className="text-xs font-medium text-gray-500">Stipend</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
              <Wallet size={16} className="shrink-0 text-blue-600" />
              {internship.stipend}
            </p>
          </div>

          <div className="rounded-lg bg-[#fafaf8] p-4">
            <p className="text-xs font-medium text-gray-500">Duration</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
              <Clock size={16} className="shrink-0 text-blue-600" />
              {internship.duration}
            </p>
          </div>

          <div className="rounded-lg bg-[#fafaf8] p-4">
            <p className="text-xs font-medium text-gray-500">Start Date</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
              <CalendarDays size={16} className="shrink-0 text-blue-600" />
              {internship.start_date
                ? formatDate(internship.start_date)
                : "Not specified"}
            </p>
          </div>

          <div className="rounded-lg bg-[#fafaf8] p-4">
            <p className="text-xs font-medium text-gray-500">
              Application Deadline
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
              <CalendarDays size={16} className="shrink-0 text-blue-600" />
              {formatDate(internship.application_deadline)}
            </p>
          </div>
        </div>
      </div>

      {/* Internship information */}
      <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 sm:p-8">
        <section>
          <h2 className="text-base font-semibold text-gray-950">
            Internship Description
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-600">
            {internship.description}
          </p>
        </section>

        <div className="border-t border-gray-100" />

        <section>
          <h2 className="text-base font-semibold text-gray-950">
            Eligibility Criteria
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-600">
            {internship.eligibility_criteria}
          </p>
        </section>

        <div className="border-t border-gray-100" />

        <section>
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-950">
            <Code size={17} className="text-blue-600" />
            Required Skills
          </h2>

          {internship.required_skills?.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {internship.required_skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-gray-200 bg-[#fafaf8] px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-500">
              No specific skills listed.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
