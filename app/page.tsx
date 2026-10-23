'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Briefcase, 
  FileText, 
  CheckCircle, 
  Users, 
  Target, 
  Zap, 
  Shield, 
  ArrowRight, 
  Github, 
  Twitter, 
  Linkedin 
} from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';

const modules = [
  {
    title: 'Job Postings',
    description: 'Exclusive on-campus and off-campus opportunities curated by the TPC.',
    icon: <Briefcase className="w-5 h-5" />,
    href: '/jobs',
  },
  {
    title: 'Compatibility Analyzer',
    description: 'Upload your resume and instantly check your match percentage for any job.',
    icon: <CheckCircle className="w-5 h-5" />,
    href: '/jobs',
  },
  {
    title: 'Resume Analyzer',
    description: 'Get AI-powered feedback on your resume, skill gaps, and role suggestions.',
    icon: <FileText className="w-5 h-5" />,
    href: '/resume-analyzer',
  },
  {
    title: 'HR Prep',
    description: 'Master the STAR method and prepare for behavioral interviews with confidence.',
    icon: <Users className="w-5 h-5" />,
    href: '/hr-prep',
  },
];

const needs = [
  {
    title: 'The Resume Black Hole',
    description: 'Thousands of resumes are rejected by ATS systems before a human ever sees them.',
    icon: <Shield className="w-5 h-5" />
  },
  {
    title: 'Interview Anxiety',
    description: 'Behavioral interviews can be daunting. Master the STAR method to answer with confidence.',
    icon: <Zap className="w-5 h-5" />
  },
  {
    title: 'Fragmented Opportunities',
    description: 'Stop scrolling generic boards. Get access to curated roles specifically targeted for you.',
    icon: <Target className="w-5 h-5" />
  }
];

export default function Home() {
//   const { getToken, isLoaded, isSignedIn } = useAuth();
// const [testResult, setTestResult] = useState('');

// const testBackend = async () => {
//   try {
//     setTestResult('Testing...');

//     const token = await getToken();

//     if (!token) {
//       setTestResult('Please sign in first.');
//       return;
//     }

//     const response = await fetch(
//       'http://localhost:8080/student-auth/verify',
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     const data = await response.json();
//     setTestResult(
//       `Status: ${response.status}\n${JSON.stringify(data, null, 2)}`,
//     );
//   } catch (error) {
//     setTestResult(
//       error instanceof Error ? error.message : 'Request failed',
//     );
//   }
// };
  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] selection:bg-[#2563EB] selection:text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2563EB] mb-4 block">
              University Career Portal
            </span>
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-8 leading-[0.95]">
              LU CONNECT<span className="text-[#2563EB]">.</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              <p className="md:col-span-7 text-xl md:text-2xl text-[#4A4A4A] leading-relaxed">
                The professional bridge for Lucknow University. 
                A streamlined ecosystem for career discovery, resume intelligence, and interview mastery.
              </p>
              <div className="md:col-span-5 flex gap-4">
                <Link
                  href="/jobs"
                  className="px-6 py-3 bg-[#1A1A1A] text-white text-sm font-bold hover:bg-[#2563EB] transition-colors duration-300"
                >
                  VIEW JOBS
                </Link>
                <Link
                  href="/resume-analyzer"
                  className="px-6 py-3 border border-black text-sm font-bold hover:bg-black hover:text-white transition-all duration-300"
                >
                  ANALYZE RESUME
                </Link>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Objective Section */}
      <section className="py-24 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h2 className="text-xs uppercase tracking-widest font-black text-black/30 mb-4">Objective</h2>
              <p className="text-2xl font-medium">Democratizing access to high-tier professional growth.</p>
            </div>
            <div className="md:w-2/3 space-y-8">
              <p className="text-lg text-[#4A4A4A] leading-relaxed">
                At LU Connect, our mandate is to strip away the complexity of the job market. 
                We provide every student with the technical edge required to bypass ATS filters and 
                present their talent directly to industry leaders.
              </p>
              <div className="relative aspect-video overflow-hidden bg-zinc-200">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
                  alt="Architecture" 
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Need Section - Clean List */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs uppercase tracking-widest font-black text-black/30 mb-16 text-center">Core Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10 border-y border-black/10">
            {needs.map((need) => (
              <div key={need.title} className="py-12 md:px-8 first:pl-0 last:pr-0">
                <div className="mb-6 text-[#2563EB]">{need.icon}</div>
                <h3 className="text-lg font-bold mb-4">{need.title}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{need.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules - Minimal Grid */}
      <section className="py-24 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10 border border-black/10">
            {modules.map((module) => (
              <Link 
                key={module.title} 
                href={module.href}
                className="group bg-[#F9F9F7] p-12 hover:bg-white transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="p-3 bg-black text-white group-hover:bg-[#2563EB] transition-colors">
                    {module.icon}
                  </div>
                  <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{module.title}</h3>
                <p className="text-[#666] max-w-sm">{module.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <span className="text-3xl font-bold tracking-tighter block mb-6">LU CONNECT.</span>
              <p className="text-zinc-400 max-w-xs text-sm leading-relaxed">
                The official career management system for the University of Lucknow. Built for precision.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-black text-zinc-500 mb-6">Navigation</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link href="/jobs" className="hover:text-[#2563EB] transition-colors">Jobs</Link></li>
                <li><Link href="/resume-analyzer" className="hover:text-[#2563EB] transition-colors">Analyzer</Link></li>
                <li><Link href="/hr-prep" className="hover:text-[#2563EB] transition-colors">HR Prep</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-black text-zinc-500 mb-6">Social</h4>
              <div className="flex gap-4">
                <Twitter className="w-5 h-5 hover:text-[#2563EB] cursor-pointer" />
                <Linkedin className="w-5 h-5 hover:text-[#2563EB] cursor-pointer" />
                <Github className="w-5 h-5 hover:text-[#2563EB] cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">
            <p>© {new Date().getFullYear()} LU Connect. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}