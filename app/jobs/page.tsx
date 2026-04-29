'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { motion } from 'motion/react';
import { Briefcase, MapPin, DollarSign, Calendar, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Job {
  id: string;
  company_name: string;
  role: string;
  location: string;
  package: string;
  eligibility_criteria: string;
  description: string;
  application_deadline: string;
  created_at: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/jobs');
        setJobs(res.data.jobs || []);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] py-24 px-6 selection:bg-[#2563EB] selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="border-b border-black/5 pb-12 mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#2563EB] mb-4 block">Job Postings</span>
            <h1 className="text-6xl md:text-7xl font-medium tracking-tight mb-4 leading-[0.95]">
              Opportunities<span className="text-[#2563EB]">.</span>
            </h1>
            <p className="text-lg text-[#4A4A4A] max-w-2xl">
              Exclusive on-campus and off-campus opportunities curated by the TPC. Search, explore, and apply with confidence.
            </p>
          </div>
          
          <div className="relative w-full md:w-96 mt-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#4A4A4A]" />
            </div>
            <input
              type="text"
              placeholder="Search roles or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-black/10 leading-5 bg-white text-[#1A1A1A] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-[#2563EB]/20 border-t-[#2563EB] animate-spin"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-px border-t border-black/5">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-black/5 py-8 px-6 hover:bg-white/50 transition-colors group"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1 group-hover:text-[#2563EB] transition-colors">
                        {job.role}
                      </h2>
                      <p className="text-base font-medium text-[#4A4A4A]">
                        {job.company_name}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-[#4A4A4A]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#2563EB]" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#2563EB]" />
                        {job.package}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#2563EB]" />
                        {new Date(job.application_deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-auto">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="px-6 py-3 bg-[#1A1A1A] text-white text-sm font-bold hover:bg-[#2563EB] transition-colors duration-300 inline-flex items-center gap-2"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-black/5">
            <Briefcase className="w-16 h-16 text-[#4A4A4A]/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No jobs found</h3>
            <p className="text-[#4A4A4A]">
              Check back later or adjust your search query.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
