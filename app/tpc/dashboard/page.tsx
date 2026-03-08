'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { motion } from 'motion/react';
import { Plus, Users, Briefcase, FileText, ExternalLink, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Job Form State
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    company_name: '',
    role: '',
    location: '',
    package: '',
    eligibility_criteria: '',
    description: '',
    application_deadline: ''
  });
  const [creatingJob, setCreatingJob] = useState(false);

  useEffect(() => {
    // if there's no token stored, go back to login immediately
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
      console.error('Failed to fetch admin data:', error);
      if (error.response?.status === 401) {
        // not authenticated, send back to login
        router.push('/tpc/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingJob(true);

    try {
      const payload = {
        ...newJob,
        application_deadline: new Date(newJob.application_deadline).toISOString(),
      };
      const res = await axios.post('/jobs', payload);
      // on success reset form and reload
      setShowNewJobModal(false);
      setNewJob({
        company_name: '', role: '', location: '', package: '',
        eligibility_criteria: '', description: '', application_deadline: ''
      });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to create job:', error);
    } finally {
      setCreatingJob(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">TPC Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage job postings and view candidate applications.</p>
          </div>
          <button
            onClick={() => setShowNewJobModal(true)}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Post New Job
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Jobs</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{jobs.length}</h3>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <Users className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Applications</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{applications.length}</h3>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'jobs'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Job Postings
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'applications'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Applications
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'jobs' ? (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Role</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Company</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Location</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{job.role}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{job.company_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{job.location}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(job.application_deadline).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No jobs posted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Candidate</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Applied For</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Contact</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Resume</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{app.name}</div>
                        <div className="text-xs text-slate-500">{app.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{app.jobs?.role}</div>
                        <div className="text-xs text-slate-500">{app.jobs?.company_name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{app.phone}</td>
                      <td className="px-6 py-4">
                        <a 
                          href={app.resume_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                        >
                          <FileText className="w-3 h-3" /> View PDF <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No applications received yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* New Job Modal */}
        {showNewJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-display">Post New Job</h2>
              
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                    <input required type="text" value={newJob.company_name} onChange={e => setNewJob({...newJob, company_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                    <input required type="text" value={newJob.role} onChange={e => setNewJob({...newJob, role: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                    <input required type="text" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Package (CTC)</label>
                    <input required type="text" value={newJob.package} onChange={e => setNewJob({...newJob, package: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Application Deadline</label>
                    <input required type="datetime-local" value={newJob.application_deadline} onChange={e => setNewJob({...newJob, application_deadline: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Eligibility Criteria</label>
                    <textarea required rows={3} value={newJob.eligibility_criteria} onChange={e => setNewJob({...newJob, eligibility_criteria: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Description</label>
                    <textarea required rows={5} value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewJobModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingJob}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {creatingJob ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post Job'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
