
'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { motion } from 'motion/react';
import {
  Briefcase,
  MapPin,
  Calendar,
  Search,
  ChevronRight,
  Clock,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

interface Internship {
  id: string;
  company_name: string;
  role: string;
  location: string;
  work_mode: string;
  stipend: string;
  duration: string;
  eligibility_criteria: string;
  required_skills: string[];
  description: string;
  application_deadline: string;
  start_date: string | null;
  created_at: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);

      try {
        const res = await axios.get('/internships', {
          params: { page, limit: 10 },
        });

        setInternships(res.data.internships || []);
        setPagination(res.data.pagination || null);
      } catch (error) {
        console.error('Failed to fetch internships:', error);
        setInternships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [page]);

  const filteredInternships = internships.filter(
    (internship) =>
      internship.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] py-24 px-6 selection:bg-[#2563EB] selection:text-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="border-b border-black/5 pb-12 mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#2563EB] mb-4 block">
              Internship Opportunities
            </span>

            <h1 className="text-6xl md:text-7xl font-medium tracking-tight mb-4 leading-[0.95]">
              Internships<span className="text-[#2563EB]">.</span>
            </h1>

            <p className="text-lg text-[#4A4A4A] max-w-2xl">
              Explore internship opportunities curated by the TPC.
              Build practical experience, develop your skills, and take
              the next step in your career.
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

        {/* Internship List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-[#2563EB]/20 border-t-[#2563EB] animate-spin"></div>
          </div>
        ) : filteredInternships.length > 0 ? (
          <>
            <div className="space-y-px border-t border-black/5">
              {filteredInternships.map((internship, index) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-black/5 py-8 px-6 hover:bg-white/50 transition-colors group"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="mb-4">
                        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1 group-hover:text-[#2563EB] transition-colors">
                          {internship.role}
                        </h2>

                        <p className="text-base font-medium text-[#4A4A4A]">
                          {internship.company_name}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-[#4A4A4A]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#2563EB]" />
                          {internship.location}
                        </div>

                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-[#2563EB]" />
                          {internship.stipend}
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#2563EB]" />
                          {internship.duration}
                        </div>

                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-[#2563EB]" />
                          {internship.work_mode}
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#2563EB]" />
                          {new Date(internship.application_deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-auto">
                      <Link
                        href={`/internships/${internship.id}`}
                        className="px-6 py-3 bg-[#1A1A1A] text-white text-sm font-bold hover:bg-[#2563EB] transition-colors duration-300 inline-flex items-center gap-2"
                      >
                        View Details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {!searchQuery && pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-10">
                <button
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="px-5 py-2 border border-black/10 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Previous
                </button>

                <span className="text-sm text-[#4A4A4A]">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-5 py-2 border border-black/10 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 border border-black/5">
            <Briefcase className="w-16 h-16 text-[#4A4A4A]/30 mx-auto mb-4" />

            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
              No internships found
            </h3>

            <p className="text-[#4A4A4A]">
              Check back later or adjust your search query.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
