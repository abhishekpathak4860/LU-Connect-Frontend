'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'motion/react';
import { UploadCloud, FileText, Loader2, CheckCircle, AlertCircle, Briefcase, Lightbulb, TrendingUp } from 'lucide-react';

interface AnalysisResult {
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
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const analyzeResume = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = 'Failed to analyze resume';
        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setResult(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 font-display">
            AI Resume Analyzer
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Upload your resume and get instant, actionable feedback from our AI. Discover your strengths, areas for improvement, and the best roles for your profile.
          </p>
        </div>

        {/* Upload Section */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                isDragActive
                  ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-900/20'
                  : 'border-slate-300/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 hover:border-indigo-400 dark:hover:border-indigo-500'
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className={`w-16 h-16 mx-auto mb-6 ${isDragActive ? 'text-indigo-500' : 'text-slate-400'}`} />
              
              {file ? (
                <div className="flex flex-col items-center">
                  <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">{file.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Drag & drop your resume here
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Supports PDF up to 5MB
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={analyzeResume}
                disabled={!file || loading}
                className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  'Analyze My Resume'
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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Analysis Results</h2>
              <button
                onClick={() => { setResult(null); setFile(null); }}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Analyze Another Resume
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Strengths & Suggestions */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Suggested Roles */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="w-6 h-6 text-indigo-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Suggested Roles</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestedRoles.map((role, i) => (
                      <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium border border-indigo-100 dark:border-indigo-800">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enhancement Tips */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="w-6 h-6 text-amber-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enhancement Tips</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.enhancementTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Extracted Data Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Experience</h3>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
                      {result.experience.map((exp, i) => <li key={i}>{exp}</li>)}
                    </ul>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Projects</h3>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
                      {result.projects.map((proj, i) => <li key={i}>{proj}</li>)}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Right Column: Skills */}
              <div className="space-y-6">
                
                {/* Current Skills */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Current Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.skills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills to Improve */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-rose-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Skills to Learn</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.skillsToImprove.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/50 rounded-md text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
