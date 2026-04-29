'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Users, Briefcase, FileText, ExternalLink, 
  Loader2, ChevronLeft, Search, CheckCircle2, MoreHorizontal 
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Data State
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<'applicants' | 'shortlisted' | 'details'>('applicants');
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [creatingJob, setCreatingJob] = useState(false);
  
  const [newJob, setNewJob] = useState({
    company_name: '', role: '', location: '', package: '',
    eligibility_criteria: '', description: '', application_deadline: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('jwt')) {
      router.push('/tpc/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        axios.get('/jobs'),
        axios.get('/applications'),
      ]);
      setJobs(jobsRes.data.jobs || []);
      setApplications(appsRes.data.applications || []);
    } catch (error: any) {
      if (error.response?.status === 401) router.push('/tpc/login');
    } finally {
      setLoading(false);
    }
  };

  // Memoized data for the selected job to optimize performance
  const selectedJob = useMemo(() => jobs.find(j => j.id === selectedJobId), [jobs, selectedJobId]);
  const jobApplications = useMemo(() => applications.filter(a => a.job_id === selectedJobId), [applications, selectedJobId]);
  const shortlistedCount = useMemo(() => jobApplications.filter(a => a.status === 'shortlisted').length, [jobApplications]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingJob(true);
    try {
      const payload = { ...newJob, application_deadline: new Date(newJob.application_deadline).toISOString() };
      await axios.post('/jobs', payload);
      setShowNewJobModal(false);
      setNewJob({ company_name: '', role: '', location: '', package: '', eligibility_criteria: '', description: '', application_deadline: '' });
      fetchData();
    } catch (error) { console.error(error); } finally { setCreatingJob(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F9F9F7]">
      <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
      <p className="mt-4 text-[#4A4A4A] animate-pulse">Loading TPC Intelligence...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP NAVIGATION & HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 border-b border-black/5 pb-12">
          <div>
            {selectedJobId ? (
              <button 
                onClick={() => setSelectedJobId(null)}
                className="flex items-center gap-2 text-[#2563EB] font-bold mb-4 hover:text-[#1A1A1A] transition-colors text-sm uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Dashboard
              </button>
            ) : null}
            <h1 className="text-6xl md:text-7xl font-medium tracking-tight leading-[0.95]">
              {selectedJobId ? selectedJob?.company_name : "TPC Portal"}
            </h1>
            <p className="text-[#4A4A4A] mt-2 text-lg">
              {selectedJobId ? `Managing recruitment for ${selectedJob?.role}` : "Overview of active placements and talent."}
            </p>
          </div>
          {!selectedJobId && (
            <button
              onClick={() => setShowNewJobModal(true)}
              className="px-6 py-3 bg-[#1A1A1A] text-white font-bold text-sm hover:bg-[#2563EB] transition-colors duration-300 flex items-center gap-2 uppercase tracking-wider"
            >
              <Plus className="w-5 h-5" /> Post Job
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!selectedJobId ? (
            /* VIEW 1: JOB GRID */
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-black/5"
            >
              {jobs.map((job) => {
                const count = applications.filter(a => a.job_id === job.id).length;
                return (
                  <div 
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className="group border-r border-b border-black/5 last:border-r-0 p-6 hover:bg-black/2.5 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 border border-black/10 flex items-center justify-center text-[#2563EB] text-xl font-bold">
                        {job.company_name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold px-3 py-1.5 bg-[#1A1A1A] text-white">
                        {job.location}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-[#1A1A1A]">{job.role}</h3>
                    <p className="text-[#4A4A4A] text-sm mb-4">{job.company_name}</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-black/5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#2563EB]" />
                        <span className="text-sm font-bold">{count} Apps</span>
                      </div>
                      <div className="ml-auto text-[#2563EB] font-bold text-sm group-hover:translate-x-1 transition-transform">
                        Manage →
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            /* VIEW 2: JOB DRILL-DOWN */
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* SUB-TABS */}
              <div className="flex p-0 gap-0 border border-black/5">
                {(['details', 'applicants', 'shortlisted'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSubTab(t)}
                    className={`px-6 py-3 text-sm font-bold capitalize transition-all flex-1 border-r border-black/5 last:border-r-0 uppercase tracking-wider ${
                      subTab === t ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#4A4A4A] hover:bg-black/2.5'
                    }`}
                  >
                    {t === 'applicants' ? `Applicants (${jobApplications.length})` : t}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
                <div className="border border-black/5 bg-white dark:bg-transparent">
                  {subTab === 'details' ? (
                    <div className="p-10 space-y-12"> {/* Increased padding and section spacing */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-10 border-b border-black/5">
                        <div>
                          <p className="text-xs text-[#4A4A4A] uppercase font-bold mb-2 tracking-wider">Package</p>
                          <p className="font-bold text-xl text-[#1A1A1A] dark:text-white">{selectedJob?.package}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#4A4A4A] uppercase font-bold mb-2 tracking-wider">Deadline</p>
                          <p className="font-bold text-xl text-[#1A1A1A] dark:text-white">
                            {new Date(selectedJob?.application_deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4"> {/* Added internal spacing between label and content */}
                        <h4 className="font-bold text-lg text-[#1A1A1A] dark:text-white uppercase tracking-tight">Eligibility</h4>
                        <p className="text-[#4A4A4A] leading-relaxed whitespace-pre-wrap">{selectedJob?.eligibility_criteria}</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-lg text-[#1A1A1A] dark:text-white uppercase tracking-tight">Description</h4>
                        <p className="text-[#4A4A4A] leading-relaxed whitespace-pre-wrap">{selectedJob?.description}</p>
                      </div>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#1A1A1A] text-white">
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">Candidate</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">Contact</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider">Resume</th>
                          <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {jobApplications
                          .filter(app => subTab === 'shortlisted' ? app.status === 'shortlisted' : true)
                          .map((app) => (
                            <tr key={app.id} className="hover:bg-black/[0.02] transition-colors">
                              <td className="px-8 py-6">
                                <p className="font-bold text-[#1A1A1A] dark:text-white">{app.name}</p>
                                <p className="text-xs text-[#4A4A4A] mt-0.5">{app.email}</p>
                              </td>
                              <td className="px-8 py-6 text-sm text-[#4A4A4A]">{app.phone}</td>
                              <td className="px-8 py-6">
                                <a href={app.resume_url} target="_blank" className="text-[#2563EB] hover:underline flex items-center gap-2 text-sm font-bold">
                                  <FileText className="w-4 h-4" /> View PDF
                                </a>
                              </td>
                              <td className="px-8 py-6 text-right">
                                {app.status !== 'shortlisted' ? (
                                  <button className="px-6 py-2 bg-[#1A1A1A] text-white text-xs font-bold hover:bg-[#2563EB] transition-all uppercase tracking-widest">
                                    Shortlist
                                  </button>
                                ) : (
                                  <span className="flex items-center justify-end gap-2 text-[#2563EB] text-xs font-bold uppercase tracking-widest">
                                    <CheckCircle2 className="w-4 h-4" /> Shortlisted
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
            </motion.div>
          )}
          {showNewJobModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#F9F9F7] dark:bg-slate-900 border border-black/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10"
              >
                <h2 className="text-3xl font-bold text-[#1A1A1A] dark:text-white mb-8 uppercase tracking-wider">Create Opportunity</h2>

                <form onSubmit={handleCreateJob} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#4A4A4A] dark:text-slate-400 uppercase tracking-wider">Company</label>
                      <input required type="text" placeholder="e.g. Google" value={newJob.company_name} onChange={e => setNewJob({ ...newJob, company_name: e.target.value })} className="w-full px-4 py-3 border border-black/10 bg-white dark:bg-slate-950 text-white focus:ring-2 focus:ring-[#2563EB] outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#4A4A4A] dark:text-slate-400 uppercase tracking-wider">Role</label>
                      <input required type="text" placeholder="e.g. SDE-1" value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })} className="w-full px-4 py-3 border border-black/10 bg-white dark:bg-slate-950 text-white focus:ring-2 focus:ring-[#2563EB] outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Location</label>
                      <input required type="text" placeholder="Remote / Bengaluru" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Package (CTC)</label>
                      <input required type="text" placeholder="e.g. 12 LPA" value={newJob.package} onChange={e => setNewJob({ ...newJob, package: e.target.value })} className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Deadline</label>
                      <input required type="datetime-local" value={newJob.application_deadline} onChange={e => setNewJob({ ...newJob, application_deadline: e.target.value })} className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Eligibility</label>
                      <textarea required rows={3} placeholder="Mention CGPA, Branch, etc." value={newJob.eligibility_criteria} onChange={e => setNewJob({ ...newJob, eligibility_criteria: e.target.value })} className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Job Description</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe the responsibilities..."
                        value={newJob.description}
                        onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                        className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewJobModal(false)}
                      className="px-8 py-3 rounded-2xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={creatingJob}
                      className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2 disabled:opacity-50"
                    >
                      {creatingJob ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Job'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}