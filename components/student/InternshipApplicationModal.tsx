
"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "@/lib/axios";
import {
  X,
  UserRound,
  FileText,
  Upload,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

interface Internship {
  id: string;
  company_name: string;
  role: string;
}

interface Profile {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  email: string;
  resumeUrl: string | null;
}

interface Props {
  internship: Internship;
  onClose: () => void;
}

const inputClass =
  "mt-2 w-full min-w-0 rounded-lg border border-neutral-200 bg-white px-3.5 py-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function InternshipApplicationModal({
  internship,
  onClose,
}: Props) {
  const { getToken } = useAuth();

  const [profileResumeUrl, setProfileResumeUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  const [profileLoading, setProfileLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function fillFromProfile() {
    setProfileLoading(true);
    setError("");

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Please sign in again to load your profile.");
      }

      const response = await axios.get(
        "/student-auth/application-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const profile: Profile = response.data.profile;

      setName(
        [profile.firstName, profile.middleName, profile.lastName]
          .filter(Boolean)
          .join(" "),
      );
      setEmail(profile.email ?? "");
      setProfileResumeUrl(profile.resumeUrl ?? null);
      setResume(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load your profile.",
      );
    } finally {
      setProfileLoading(false);
    }
  }

  function fillManually() {
    setName("");
    setEmail("");
    setPhone("");
    setProfileResumeUrl(null);
    setResume(null);
    setError("");
  }

  async function submitApplication() {
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in your name, email, and phone number.");
      return;
    }

    if (!resume && !profileResumeUrl) {
      setError("Please upload a PDF resume or use your saved profile resume.");
      return;
    }

    try {
      setSubmitting(true);

      const token = await getToken();

      if (!token) {
        throw new Error("Please sign in again to continue.");
      }

      const formData = new FormData();

      formData.append("internshipId", internship.id);
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());

      // A newly selected PDF takes priority over the saved profile resume.
      if (resume) {
        formData.append("resume", resume);
      }

      await axios.post("/internships/applications", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to submit your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="internship-application-title"
        className="my-auto max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-neutral-100 bg-white px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
              Internship application
            </p>

            <h2
              id="internship-application-title"
              className="mt-1 text-xl font-bold text-neutral-900 sm:text-2xl"
            >
              Apply for {internship.role}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {internship.company_name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close application form"
            className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 p-5 sm:p-7">
          <div>
            <h3 className="font-semibold text-neutral-900">
              How would you like to fill the form?
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              Use your saved profile or enter your details yourself.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={fillFromProfile}
                disabled={profileLoading}
                className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-left transition hover:border-blue-500 hover:bg-blue-50 disabled:opacity-60"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  {profileLoading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <UserRound className="h-5 w-5" />
                  )}
                </span>

                <span>
                  <span className="block text-sm font-semibold text-neutral-900">
                    Fill from my profile
                  </span>
                  <span className="mt-1 block text-xs text-neutral-500">
                    {profileLoading
                      ? "Loading profile..."
                      : "Prefill saved details"}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={fillManually}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 text-left transition hover:border-neutral-400 hover:bg-neutral-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                  <FileText className="h-5 w-5" />
                </span>

                <span>
                  <span className="block text-sm font-semibold text-neutral-900">
                    Fill manually
                  </span>
                  <span className="mt-1 block text-xs text-neutral-500">
                    Enter your details yourself
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className="border-t border-neutral-100" />

          <div>
            <h3 className="font-semibold text-neutral-900">Your details</h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-neutral-700">
                Full name *
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </label>

              <label className="text-sm font-medium text-neutral-700">
                Email address *
                <input
                  className={inputClass}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="text-sm font-medium text-neutral-700 sm:col-span-2">
                Phone number *
                <input
                  className={inputClass}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  required
                />
              </label>
            </div>
          </div>

          <div className="border-t border-neutral-100" />

          <div>
            <h3 className="font-semibold text-neutral-900">Resume</h3>

            <p className="mt-1 text-sm text-neutral-500">
              Your saved profile resume will be used by default. You can
              optionally upload another PDF for this application.
            </p>

            {profileResumeUrl && (
              <a
                href={profileResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                <FileText className="h-4 w-4" />
                View saved profile resume
              </a>
            )}

            <label className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
              <Upload className="h-6 w-6 text-blue-600" />

              <span className="mt-2 break-all text-sm font-semibold text-neutral-800">
                {resume ? resume.name : "Choose your resume PDF"}
              </span>

              <span className="mt-1 text-xs text-neutral-500">
                PDF only · Maximum 5 MB
              </span>

              <input
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(e) => {
                  const selected = e.target.files?.[0] ?? null;

                  if (
                    selected &&
                    (selected.type !== "application/pdf" ||
                      selected.size > 5 * 1024 * 1024)
                  ) {
                    setResume(null);
                    setError("Choose a PDF file no larger than 5 MB.");
                    e.target.value = "";
                    return;
                  }

                  setResume(selected);
                  setError("");
                }}
              />
            </label>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={submitApplication}
            disabled={submitting || profileLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            )}
            {submitting ? "Submitting application..." : "Submit application"}
          </button>

          <p className="text-xs leading-5 text-neutral-500">
            Your details and resume will be shared with the Training and
            Placement Cell for this internship application.
          </p>
        </div>
      </section>
    </div>
  );
}
