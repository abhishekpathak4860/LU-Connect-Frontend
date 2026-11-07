'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useParams } from 'next/navigation';
import { Briefcase, MapPin, DollarSign, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';
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
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/jobs/${id}`);
        if (res.data?.job) {
          setJob(res.data.job);
        }
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#F9F9F7]">
        <div className="w-10 h-10 border-4 border-[#2563EB]/20 border-t-[#2563EB] animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F9F9F7]">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Job not found</h2>
        <Link href="/jobs" className="text-[#2563EB] hover:text-[#1A1A1A] flex items-center gap-2 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-[#4A4A4A] hover:text-[#2563EB] mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="border border-black/5 p-8 bg-white">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-2 leading-tight">{job.role}</h1>
              <p className="text-2xl text-[#4A4A4A] font-medium mb-8">{job.company_name}</p>

              <div className="flex flex-wrap gap-6 pb-8 border-b border-black/5">
                <div className="flex items-center gap-2 text-[#4A4A4A]">
                  <MapPin className="w-4 h-4 text-[#2563EB]" /> {job.location}
                </div>
                <div className="flex items-center gap-2 text-[#4A4A4A]">
                  <DollarSign className="w-4 h-4 text-[#2563EB]" /> {job.package}
                </div>
                <div className="flex items-center gap-2 text-[#4A4A4A]">
                  <Calendar className="w-4 h-4 text-[#2563EB]" /> Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-8 py-8">
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2 uppercase tracking-[0.1em]">
                    <Briefcase className="w-5 h-5 text-[#2563EB]" /> Description
                  </h3>
                  <div className="prose-like text-[#4A4A4A] whitespace-pre-wrap leading-relaxed">
                    {job.description}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2 uppercase tracking-[0.1em]">
                    <CheckCircle className="w-5 h-5 text-[#2563EB]" /> Eligibility Criteria
                  </h3>
                  <div className="prose-like text-[#4A4A4A] whitespace-pre-wrap leading-relaxed">
                    {job.eligibility_criteria}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Sticky Button */}
          <div className="lg:col-span-1">
            <div className="border border-black/5 p-8 sticky top-24 bg-white">
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">How to Apply</h3>
              <p className="text-[#4A4A4A] text-sm mb-6">
                You can apply for this role and track your application status directly from your dashboard.
              </p>
              <button
            
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold py-4 px-6 transition-colors"
              >
                Apply through Dashboard
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}