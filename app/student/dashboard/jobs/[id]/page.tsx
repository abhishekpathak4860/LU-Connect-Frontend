
import { auth } from "@clerk/nextjs/server";
import axios from "@/lib/axios";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  Banknote,
  CalendarDays,
  Building2,
  CheckCircle2,
} from "lucide-react";
import JobApplicationLauncher from "@/components/student/JobApplicationLauncher";

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
  alreadyApplied: boolean;
}

async function getJob(id: string): Promise<Job | null> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Student authentication required");
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured");
  }

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/jobs/student/${encodeURIComponent(id)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch job details");
  }

  const data = await response.json();
  return data.job ?? null;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-full bg-[#F9F9F7] px-4 py-7 text-[#1A1A1A] sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {!job.alreadyApplied && <JobApplicationLauncher job={job} />}

        <Link
          href="/student/dashboard/jobs"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-[#2563EB] sm:mb-9"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all jobs
        </Link>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          <section className="min-w-0 border border-black/[0.08] bg-white lg:col-span-2">
            <div className="border-b border-black/[0.07] p-5 sm:p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-black/[0.08] bg-[#F9F9F7] text-[#2563EB]">
                  <span className="text-2xl font-bold">
                    {job.company_name?.trim().charAt(0).toUpperCase() || (
                      <Building2 className="h-6 w-6" />
                    )}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">
                    Job opportunity
                  </p>
                  <p className="break-words text-sm font-medium text-neutral-600">
                    {job.company_name}
                  </p>
                </div>
              </div>

              <h1 className="break-words text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {job.role}
              </h1>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  {job.location}
                </div>

                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  {job.package}
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  Deadline: {formatDate(job.application_deadline)}
                </div>
              </div>
            </div>

            <div className="space-y-8 p-5 sm:p-8">
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.13em]">
                  <BriefcaseBusiness className="h-5 w-5 text-[#2563EB]" />
                  Job description
                </h2>

                <div className="whitespace-pre-wrap break-words text-sm leading-7 text-neutral-600 sm:text-base">
                  {job.description || "No description provided."}
                </div>
              </section>

              <div className="border-t border-black/[0.07]" />

              <section>
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.13em]">
                  <CheckCircle2 className="h-5 w-5 text-[#2563EB]" />
                  Eligibility criteria
                </h2>

                <div className="whitespace-pre-wrap break-words text-sm leading-7 text-neutral-600 sm:text-base">
                  {job.eligibility_criteria ||
                    "No eligibility criteria provided."}
                </div>
              </section>
            </div>
          </section>

          <aside className="border border-black/[0.08] bg-white p-5 sm:p-6 lg:sticky lg:top-20">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">
              Job summary
            </p>

            <h2 className="mt-3 break-words text-xl font-bold">
              {job.role}
            </h2>

            <p className="mt-1 break-words text-sm text-neutral-500">
              {job.company_name}
            </p>

            <div className="my-5 space-y-4 border-y border-black/[0.07] py-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">Location</p>
                  <p className="mt-1 break-words text-sm font-semibold">
                    {job.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">Package</p>
                  <p className="mt-1 break-words text-sm font-semibold">
                    {job.package}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">
                    Application deadline
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(job.application_deadline)}
                  </p>
                </div>
              </div>
            </div>

            {job.alreadyApplied ? (
              <div className="flex w-full items-center justify-center gap-2 border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Already Applied
              </div>
            ) : (
              <p className="text-center text-xs leading-5 text-neutral-500">
                Apply using the application button above.
              </p>
            )}

            <Link
              href="/student/dashboard/jobs"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-black/10 px-4 py-3 text-sm font-semibold transition-colors hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all jobs
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-neutral-500">
              Applications are managed through your student dashboard.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
