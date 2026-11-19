
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  Banknote,
  CalendarDays,
  Building2,
  CheckCircle2,
  Clock,
  Laptop,
  GraduationCap,
  Code,
} from "lucide-react";
import InternshipApplicationLauncher from "@/components/student/InternshipApplicationLauncher";

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
  start_date: string | null;
  alreadyApplied: boolean;
}

async function getInternship(id: string): Promise<Internship | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured");
  }

  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Student authentication required");
  }

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/internships/student/${encodeURIComponent(id)}`,
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
    throw new Error("Failed to fetch internship details");
  }

  const data = await response.json();

  return data.internship ?? null;
}

function formatDate(value: string | null) {
  if (!value) return "Not specified";

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

function formatWorkMode(mode: Internship["work_mode"]) {
  switch (mode) {
    case "REMOTE":
      return "Remote";
    case "HYBRID":
      return "Hybrid";
    case "ONSITE":
      return "On-site";
    default:
      return mode;
  }
}

export default async function InternshipDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const internship = await getInternship(id);

  if (!internship) {
    notFound();
  }

  return (
    <main className="min-h-full bg-[#F9F9F7] px-4 py-7 text-[#1A1A1A] sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          {internship.alreadyApplied ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              You have already applied
            </div>
          ) : (
            <InternshipApplicationLauncher internship={internship} />
          )}
        </div>

        <Link
          href="/student/dashboard/internships"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-[#2563EB] sm:mb-9"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all internships
        </Link>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          <section className="min-w-0 border border-black/[0.08] bg-white lg:col-span-2">
            <div className="border-b border-black/[0.07] p-5 sm:p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-black/[0.08] bg-[#F9F9F7] text-[#2563EB]">
                  <span className="text-2xl font-bold">
                    {internship.company_name?.trim().charAt(0).toUpperCase() || (
                      <Building2 className="h-6 w-6" />
                    )}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">
                    Internship opportunity
                  </p>
                  <p className="break-words text-sm font-medium text-neutral-600">
                    {internship.company_name}
                  </p>
                </div>
              </div>

              <h1 className="break-words text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {internship.role}
              </h1>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  {internship.location}
                </div>

                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  {internship.stipend}
                </div>

                <div className="flex items-center gap-2">
                  <Laptop className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  {formatWorkMode(internship.work_mode)}
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  {internship.duration}
                </div>
              </div>
            </div>

            <div className="space-y-8 p-5 sm:p-8">
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.13em]">
                  <BriefcaseBusiness className="h-5 w-5 text-[#2563EB]" />
                  Internship description
                </h2>

                <div className="whitespace-pre-wrap break-words text-sm leading-7 text-neutral-600 sm:text-base">
                  {internship.description || "No description provided."}
                </div>
              </section>

              <div className="border-t border-black/[0.07]" />

              <section>
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.13em]">
                  <GraduationCap className="h-5 w-5 text-[#2563EB]" />
                  Eligibility criteria
                </h2>

                <div className="whitespace-pre-wrap break-words text-sm leading-7 text-neutral-600 sm:text-base">
                  {internship.eligibility_criteria ||
                    "No eligibility criteria provided."}
                </div>
              </section>

              {internship.required_skills?.length > 0 && (
                <>
                  <div className="border-t border-black/[0.07]" />

                  <section>
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.13em]">
                      <Code className="h-5 w-5 text-[#2563EB]" />
                      Required skills
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      {internship.required_skills.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          </section>

          <aside className="border border-black/[0.08] bg-white p-5 sm:p-6 lg:sticky lg:top-20">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">
              Internship summary
            </p>

            <h2 className="mt-3 break-words text-xl font-bold">
              {internship.role}
            </h2>

            <p className="mt-1 break-words text-sm text-neutral-500">
              {internship.company_name}
            </p>

            <div className="my-5 space-y-4 border-y border-black/[0.07] py-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">Location</p>
                  <p className="mt-1 break-words text-sm font-semibold">
                    {internship.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">Stipend</p>
                  <p className="mt-1 break-words text-sm font-semibold">
                    {internship.stipend}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Laptop className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">Work mode</p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatWorkMode(internship.work_mode)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">Duration</p>
                  <p className="mt-1 text-sm font-semibold">
                    {internship.duration}
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
                    {formatDate(internship.application_deadline)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">Start date</p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(internship.start_date)}
                  </p>
                </div>
              </div>
            </div>

            {internship.alreadyApplied ? (
              <div className="flex items-center justify-center gap-2 border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Already applied
              </div>
            ) : (
              <InternshipApplicationLauncher internship={internship} />
            )}

            <Link
              href="/student/dashboard/internships"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-black/10 px-4 py-3 text-sm font-semibold transition-colors hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to internships
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
