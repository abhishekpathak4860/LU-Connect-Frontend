'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Briefcase, MapPin, DollarSign, Calendar, UploadCloud, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';

interface Job {
  id: string;
  company_name: string;
  role: string;
  location: string;
  package: string;
  eligibility_criteria: string;
  description: string;
  application_deadline: string;
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Application State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  // Compatibility State
  const [checkingCompat, setCheckingCompat] = useState(false);
  const [compatResult, setCompatResult] = useState<any>(null);
  const [compatError, setCompatError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) {
          console.error('Failed to fetch job. Status:', res.status);
          return;
        }
        const data = await res.json();
        if (data.job) setJob(data.job);
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setResume(acceptedFiles[0]);
      setApplyError('');
      setCompatError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      setApplyError('Please upload a resume');
      return;
    }

    setApplying(true);
    setApplyError('');

    const formData = new FormData();
    formData.append('jobId', id as string);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('resume', resume);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = 'Failed to apply';
        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      setApplySuccess(true);
    } catch (err: any) {
      setApplyError(err.message);
    } finally {
      setApplying(false);
    }
  };

  const handleCheckCompatibility = async () => {
    if (!resume) {
      setCompatError('Please upload a resume first');
      return;
    }

    setCheckingCompat(true);
    setCompatError('');

    const formData = new FormData();
    formData.append('jobId', id as string);
    formData.append('resume', resume);

    try {
      const res = await fetch('/api/check-compatibility', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = 'Failed to check compatibility';
        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setCompatResult(data.analysis);
    } catch (err: any) {
      setCompatError(err.message);
    } finally {
      setCheckingCompat(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Job not found</h2>
        <Link href="/jobs" className="text-indigo-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-3xl">
                  {job.company_name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display mb-1">{job.role}</h1>
                  <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">{job.company_name}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-8 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <MapPin className="w-4 h-4 text-indigo-500" /> {job.location}
                </div>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <DollarSign className="w-4 h-4 text-emerald-500" /> {job.package}
                </div>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <Calendar className="w-4 h-4 text-amber-500" /> Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-500" /> Description
                  </h3>
                  <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {job.description}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" /> Eligibility Criteria
                  </h3>
                  <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {job.eligibility_criteria}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form & Compatibility */}
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-display">Apply Now</h2>
              
              {applySuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Application Submitted!</h3>
                  <p className="text-slate-500 dark:text-slate-400">Your application has been successfully sent to the TPC.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Resume (PDF)</label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                        isDragActive ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-900/20' : 'border-slate-300/50 dark:border-slate-700/50 hover:border-indigo-400'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <UploadCloud className={`w-8 h-8 mx-auto mb-2 ${isDragActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                      {resume ? (
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{resume.name}</p>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400">Drag & drop or click to upload</p>
                      )}
                    </div>
                  </div>

                  {applyError && <p className="text-sm text-red-500">{applyError}</p>}
                  {compatError && <p className="text-sm text-red-500">{compatError}</p>}

                  <div className="pt-4 space-y-3">
                    <button
                      type="button"
                      onClick={handleCheckCompatibility}
                      disabled={checkingCompat || !resume}
                      className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {checkingCompat ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check Compatibility'}
                    </button>

                    <button
                      type="submit"
                      disabled={applying}
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {applying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
                    </button>
                  </div>
                </form>
              )}

              {/* Compatibility Results */}
              {compatResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">Match Score</h3>
                    <div className={`text-2xl font-black ${
                      compatResult.score >= 80 ? 'text-emerald-500' : 
                      compatResult.score >= 50 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {compatResult.score}%
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Matching Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {compatResult.matchingSkills.map((s: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded text-xs border border-emerald-100 dark:border-emerald-900/50">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Missing Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {compatResult.missingSkills.map((s: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded text-xs border border-rose-100 dark:border-rose-900/50">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Suggestions</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{compatResult.suggestions}</p>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
