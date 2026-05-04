"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "motion/react";
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import api from "@/lib/axios";
import "dotenv/config";

interface AnalysisResult {
  ATS_Score: number;   
  Summary: string;
  skills: string[];
  education: string[];
  projects: string[];
  experience: string[];
  suggestedRoles: string[];
  skillsToImprove: string[];
  enhancementTips: string[];
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Backend url = ", process.env.NEXT_PUBLIC_BACKEND_URL);
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const analyzeResume = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.post("/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data.analysis);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to analyse resume",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-black/5 pb-12 mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#2563EB] mb-4 block">Resume Analyzer</span>
          <h1 className="text-6xl md:text-7xl font-medium tracking-tight mb-4 leading-[0.95]">
            AI Resume<span className="text-[#2563EB]">.</span>
          </h1>
          <p className="text-lg text-[#4A4A4A] max-w-2xl">
            Upload your resume and get instant, actionable feedback from our system. Discover your strengths, areas for improvement, and the best roles for your profile.
          </p>
        </div>

        {/* Upload Section */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div
              {...getRootProps()}
              className={`border border-black/10 p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-[#2563EB] bg-[#2563EB]/5"
                  : "hover:border-[#2563EB]/50 hover:bg-black/2.5"
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud
                className={`w-16 h-16 mx-auto mb-6 ${isDragActive ? "text-[#2563EB]" : "text-[#4A4A4A]"}`}
              />

              {file ? (
                <div className="flex flex-col items-center">
                  <p className="text-lg font-bold text-[#1A1A1A] mb-2">
                    {file.name}
                  </p>
                  <p className="text-sm text-[#4A4A4A]">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-bold text-[#1A1A1A] mb-2">
                    Drag & drop your resume here
                  </p>
                  <p className="text-sm text-[#4A4A4A]">
                    Supports PDF up to 5MB
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">
                  {error}
                </p>
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={analyzeResume}
                disabled={!file || loading}
                className="px-8 py-3 bg-[#1A1A1A] text-white text-sm font-bold hover:bg-[#2563EB] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* ATS Score */}
            <div className="border border-black/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-[#1A1A1A]">Resume Strength</h2>
                <p className="text-[#4A4A4A]">Based on industry standards and AI analysis.</p>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 border-4 border-[#1A1A1A] flex items-center justify-center relative">
                  <span className="text-3xl font-bold">{result.ATS_Score}</span>
                  <span className="text-xs absolute -bottom-2 bg-[#2563EB] text-white px-2 py-0.5 font-bold">ATS</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#1A1A1A]">
                Analysis Results
              </h2>
              <button
                onClick={() => {
                  setResult(null);
                  setFile(null);
                }}
                className="text-sm font-bold text-[#2563EB] hover:text-[#1A1A1A] transition-colors"
              >
                Analyze Another
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Summary */}
              <div className="border border-black/5 p-8 col-span-full md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-[#2563EB]" />
                  <h3 className="text-lg font-bold text-[#1A1A1A] uppercase tracking-[0.1em]">
                    Professional Summary
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-[#4A4A4A]">
                  &quot;{result.Summary}&quot;
                </p>
              </div>

              {/* Suggested Roles */}
              <div className="border border-black/5 p-8 md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-5 h-5 text-[#2563EB]" />
                  <h3 className="text-lg font-bold text-[#1A1A1A] uppercase tracking-[0.1em]">
                    Suggested Roles
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.suggestedRoles.map((role, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[#1A1A1A] text-white text-xs font-bold"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            {result.skills && result.skills.length > 0 && (
              <div className="border border-black/5 p-8">
                <h3 className="text-lg font-bold text-[#1A1A1A] uppercase tracking-[0.1em] mb-4">Skills Detected</h3>
                <div className="flex flex-wrap gap-2">
                  {result.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#F9F9F7] border border-black/10 text-[#1A1A1A] text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement Tips */}
            {result.enhancementTips && result.enhancementTips.length > 0 && (
              <div className="border border-black/5 p-8">
                <h3 className="text-lg font-bold text-[#1A1A1A] uppercase tracking-[0.1em] mb-4">Enhancement Tips</h3>
                <ul className="space-y-3">
                  {result.enhancementTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-[#2563EB] mt-2 flex-shrink-0" />
                      <span className="text-[#4A4A4A]">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
//                 {/* Enhancement Tips */}
//                 <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
//                   <div className="flex items-center gap-3 mb-4">
//                     <Lightbulb className="w-6 h-6 text-amber-500" />
//                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">
//                       Enhancement Tips
//                     </h3>
//                   </div>
//                   <ul className="space-y-3">
//                     {result.enhancementTips.map((tip, i) => (
//                       <li
//                         key={i}
//                         className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
//                       >
//                         <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
//                         <span>{tip}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Extracted Data Summary */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
//                     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
//                       Experience
//                     </h3>
//                     <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
//                       {result.experience.map((exp, i) => (
//                         <li key={i}>{exp}</li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
//                     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
//                       Projects
//                     </h3>
//                     <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
//                       {result.projects.map((proj, i) => (
//                         <li key={i}>{proj}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>

//               {/* Right Column: Skills */}
//               <div className="space-y-6">
//                 {/* Current Skills */}
//                 <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
//                   <div className="flex items-center gap-3 mb-4">
//                     <CheckCircle className="w-6 h-6 text-emerald-500" />
//                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">
//                       Current Skills
//                     </h3>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {result.skills.map((skill, i) => (
//                       <span
//                         key={i}
//                         className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-sm"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Skills to Improve */}
//                 <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
//                   <div className="flex items-center gap-3 mb-4">
//                     <TrendingUp className="w-6 h-6 text-rose-500" />
//                     <h3 className="text-xl font-bold text-slate-900 dark:text-white">
//                       Skills to Learn
//                     </h3>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {result.skillsToImprove.map((skill, i) => (
//                       <span
//                         key={i}
//                         className="px-2.5 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/50 rounded-md text-sm"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );

