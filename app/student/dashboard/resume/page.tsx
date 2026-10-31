

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  FileText,
  Upload,
  Eye,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ArrowUpRight,
  FileCheck2,
  X,
  Maximize2,
} from "lucide-react";
import AIResumeAnalyzer from "@/components/student/AIResumeAnalyzer";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function Page() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
const [showFullResume, setShowFullResume] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewError, setPreviewError] = useState(false);

  const loadResume = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      if (isLoaded) setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await getToken();

      if (!token) throw new Error("Authentication token unavailable.");

      const { data } = await axios.get("/student-resume/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResumeUrl(data.resumeUrl ?? null);
      setPreviewError(false);
    } catch {
      setError("Unable to load your resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    void loadResume();
  }, [loadResume]);

  const chooseFile = (file?: File) => {
    setError("");
    setSuccess("");

    if (!file) return;

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setSelectedFile(null);
      setError("Please select a PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setError("Your resume must be 5 MB or smaller.");
      return;
    }

    setSelectedFile(file);
  };

  const uploadResume = async () => {
    if (!selectedFile || uploading) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const token = await getToken();

      if (!token) throw new Error("Authentication token unavailable.");

      const formData = new FormData();
      formData.append("resume", selectedFile);

      const { data } = await axios.post(
        "/student-resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setResumeUrl(data.resumeUrl);
      setPreviewError(false);
      setSelectedFile(null);
      setSuccess("Your resume has been updated successfully.");

      if (inputRef.current) inputRef.current.value = "";

      // Bring the updated resume preview into view.
      setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const message = err.response?.data?.message;
        setError(
          Array.isArray(message)
            ? message.join(", ")
            : message ?? "Upload failed. Please try again.",
        );
      } else {
        setError("Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const viewResume = () => {
    previewRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const formatSize = (size: number) =>
    size < 1024 * 1024
      ? `${(size / 1024).toFixed(0)} KB`
      : `${(size / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-7 px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
            <FileCheck2 size={17} />
            Career toolkit
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Resume
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your resume, keep your profile up to date, and get ready
            for your next campus opportunity.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <ShieldCheck size={16} />
          Private student workspace
        </div>
      </section>

      {/* Status messages */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p className="flex-1">{error}</p>
          <button
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="rounded-md p-1 hover:bg-red-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          <CheckCircle2 size={19} className="shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Main resume card */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
          <div>
            <h2 className="text-lg font-semibold">Your resume</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your latest saved resume is shared across My Profile and My Resume.
            </p>
          </div>

          {!loading && resumeUrl && (
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 size={14} />
              Resume saved
            </span>
          )}
        </div>

        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Current resume information */}
          <div className="flex min-h-64 flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            {loading ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-slate-500">
                <LoaderCircle className="animate-spin" size={28} />
                <p className="text-sm">Loading your resume...</p>
              </div>
            ) : resumeUrl ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <FileText size={28} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">Current resume</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your latest uploaded PDF
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <CheckCircle2 size={14} />
                      Available in your profile
                    </p>
                  </div>
                </div>

                {/* Inline PDF thumbnail preview */}
                <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Eye size={15} className="text-indigo-600" />
                      Resume preview
                    </span>
                    <span className="text-xs text-slate-400">PDF</span>
                  </div>

                  <div className="relative h-64 bg-slate-100 sm:h-80">
                    {!previewError ? (
                      <iframe
                        key={resumeUrl}
                        src={`${resumeUrl}#toolbar=0&navpanes=0&view=FitH`}
                        title="Current resume PDF preview"
                        className="h-full w-full border-0"
                        onError={() => setPreviewError(true)}
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center">
                        <FileText size={32} className="text-slate-400" />
                        <p className="text-sm text-slate-600">
                          The PDF preview could not be displayed.
                        </p>
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          Open PDF directly
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
                  <button
                    type="button"
                 onClick={() => {
  setShowFullResume(true);
  setTimeout(() => {
    previewRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <Eye size={16} />
                    View resume
                  </button>

                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    <RefreshCw size={16} />
                    Replace
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                  <FileText size={30} />
                </div>
                <h3 className="font-semibold">No resume uploaded yet</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  Upload your resume to get started with your career toolkit.
                </p>
              </div>
            )}
          </div>

          {/* Upload area */}
          <div className="flex flex-col">
            <h3 className="font-semibold">
              {resumeUrl ? "Update your resume" : "Upload your resume"}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Upload a newer version whenever your skills, projects, or
              experience change.
            </p>

            <button
              type="button"
              disabled={uploading || loading}
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                chooseFile(event.dataTransfer.files?.[0]);
              }}
              className={`mt-5 flex min-h-44 flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition disabled:cursor-not-allowed disabled:opacity-60 ${
                dragging
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/40"
              }`}
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                <Upload size={23} />
              </div>
              <span className="text-sm font-semibold text-slate-800">
                Click to choose or drag your PDF here
              </span>
              <span className="mt-2 text-xs text-slate-500">
                PDF only · Maximum file size 5 MB
              </span>
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(event) => {
                chooseFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />

            {selectedFile && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-700">
                  <FileText size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {selectedFile.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  aria-label="Remove selected file"
                  disabled={uploading}
                  className="rounded-md p-2 text-slate-500 hover:bg-white hover:text-slate-800"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            <button
              type="button"
              disabled={!selectedFile || uploading || loading}
              onClick={uploadResume}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {uploading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Uploading resume...
                </>
              ) : (
                <>
                  <Upload size={17} />
                  {resumeUrl ? "Upload new resume" : "Upload resume"}
                  <ArrowUpRight size={16} />
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-500">
              Your new upload updates your student profile resume, not resumes
              already submitted with job applications.
            </p>
          </div>
        </div>
      </section>

      {/* Full-width resume preview */}
  {/* Full-width resume preview */}
{resumeUrl && showFullResume && (
  <section
    ref={previewRef}
    className="scroll-mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
  >
    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <FileText size={20} className="text-indigo-600" />
          Resume document
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Preview your uploaded resume without leaving this page.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowFullResume(false)}
        aria-label="Close resume preview"
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <X size={17} />
        Close resume
      </button>
    </div>

    <div className="h-[65vh] min-h-[480px] sm:h-[75vh]">
      <iframe
        key={`full-${resumeUrl}`}
        src={`${resumeUrl}#toolbar=1&navpanes=0&view=FitH`}
        title="Full resume preview"
        className="h-full w-full border-0"
      />
    </div>
  </section>
)}
      {/* Upcoming AI analyzer */}
      <section className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 sm:p-7">
        <AIResumeAnalyzer />
      </section>
    </main>
  );
}
