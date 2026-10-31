
"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

interface Analysis {
  candidateOverview: string;
  skills: string[];
  education: string[];
  projects: string[];
  experience: string[];
  suggestedRoles: string[];
  skillGaps: string[];
  enhancementTips: string[];
  actionPlan: string[];
  missingInformation: string[];
}

interface AnalyzeResponse {
  success: boolean;
  analysis: Analysis;
}

export default function AIResumeAnalyzer() {
  const { getToken } = useAuth();

  const [mode, setMode] = useState<"saved" | "new">("saved");
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (selectedFile?: File) => {
    setError("");
    setAnalysis(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !== "application/pdf" ||
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a valid PDF resume.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Resume must be 5MB or smaller.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      if (mode === "new" && !file) {
        setError("Please select a PDF resume first.");
        return;
      }

      const token = await getToken();

      if (!token) {
        setError("Authentication failed. Please sign in again.");
        return;
      }

      let body: FormData | null = null;

      if (mode === "new" && file) {
        body = new FormData();
        body.append("resume", file);
      }

      const response = await axios.post<AnalyzeResponse>(
        "/student-resume/analyze",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(response.data.analysis);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Resume analysis failed. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { title: "Technical Skills", icon: "⚡", data: analysis?.skills },
    { title: "Education", icon: "🎓", data: analysis?.education },
    { title: "Projects", icon: "🚀", data: analysis?.projects },
    { title: "Experience", icon: "💼", data: analysis?.experience },
    { title: "Suitable Job Roles", icon: "🎯", data: analysis?.suggestedRoles },
    { title: "Skills to Improve", icon: "📈", data: analysis?.skillGaps },
    { title: "Resume Improvements", icon: "✨", data: analysis?.enhancementTips },
    { title: "Your Action Plan", icon: "📋", data: analysis?.actionPlan },
    {
      title: "Missing Information",
      icon: "🔍",
      data: analysis?.missingInformation,
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Analyzer Header */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              ✨ AI POWERED ANALYSIS
            </div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              AI Resume Analyzer
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Get detailed feedback on your skills, projects, experience,
              suitable roles, and ways to improve your resume.
            </p>
          </div>
        </div>

        {/* Resume Source */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setMode("saved");
              setFile(null);
              setError("");
              setAnalysis(null);
            }}
            className={`rounded-xl border p-4 text-left transition ${
              mode === "saved"
                ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                : "border-gray-200 bg-white hover:border-indigo-300"
            }`}
          >
            <div className="text-sm font-semibold text-gray-900">
              Use saved resume
            </div>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Analyze the resume already saved in your profile.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("new");
              setError("");
              setAnalysis(null);
            }}
            className={`rounded-xl border p-4 text-left transition ${
              mode === "new"
                ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                : "border-gray-200 bg-white hover:border-indigo-300"
            }`}
          >
            <div className="text-sm font-semibold text-gray-900">
              Upload new resume
            </div>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Analyze another PDF without replacing your saved resume.
            </p>
          </button>
        </div>

        {/* File Selection */}
        {mode === "new" && (
          <div className="mt-4 rounded-xl border border-dashed border-indigo-300 bg-white p-5">
            <label className="flex cursor-pointer flex-col items-center text-center">
              <span className="text-3xl">📄</span>
              <span className="mt-2 text-sm font-semibold text-gray-800">
                {file ? file.name : "Choose your resume PDF"}
              </span>
              <span className="mt-1 text-xs text-gray-500">
                PDF only · Maximum 5MB
              </span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="sr-only"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
              <span className="mt-3 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                Browse file
              </span>
            </label>

            {file && (
              <button
                type="button"
                onClick={() => handleFileChange()}
                className="mt-3 block w-full text-center text-xs font-medium text-red-600 hover:underline"
              >
                Remove selected file
              </button>
            )}
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || (mode === "new" && !file)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Analyzing Resume...
            </>
          ) : (
            "✨ Analyze My Resume"
          )}
        </button>

        <p className="mt-3 text-xs text-gray-500">
          Your selected PDF is analyzed without replacing your saved resume.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <h3 className="mt-4 font-semibold text-gray-900">
            Analyzing your resume
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            AI is reviewing your profile and preparing personalized feedback.
            This may take a little while.
          </p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Your Resume Analysis
              </h3>
              <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Analysis completed
              </span>
            </div>

            <h4 className="mt-5 text-sm font-semibold text-gray-700">
              Candidate Overview
            </h4>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
              {analysis.candidateOverview}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                  <span>{section.icon}</span>
                  {section.title}
                </h3>

                {section.data && section.data.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {section.data.map((item, index) => (
                      <li
                        key={index}
                        className="flex gap-2 text-sm leading-6 text-gray-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-gray-400">
                    No information available.
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setAnalysis(null);
              setError("");
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Analyze another resume
          </button>
        </div>
      )}
    </div>
  );
}
