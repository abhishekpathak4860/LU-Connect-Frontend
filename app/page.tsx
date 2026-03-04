'use client';

import { motion } from 'motion/react';
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

const modules = [
  {
    title: 'Job Postings',
    description: 'Exclusive on-campus and off-campus opportunities curated by the TPC.',
    icon: <Briefcase className="w-8 h-8 text-indigo-500" />,
    href: '/jobs',
    color: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  {
    title: 'Compatibility Analyzer',
    description: 'Upload your resume and instantly check your match percentage for any job.',
    icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
    href: '/jobs',
    color: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    title: 'Resume Analyzer',
    description: 'Get AI-powered feedback on your resume, skill gaps, and role suggestions.',
    icon: <FileText className="w-8 h-8 text-amber-500" />,
    href: '/resume-analyzer',
    color: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    title: 'HR Prep',
    description: 'Master the STAR method and prepare for behavioral interviews with confidence.',
    icon: <Users className="w-8 h-8 text-rose-500" />,
    href: '/hr-prep',
    color: 'bg-rose-50 dark:bg-rose-900/20',
  },
];

const needs = [
  {
    title: 'The Resume Black Hole',
    description: 'Thousands of resumes are rejected by ATS systems before a human ever sees them. We help you optimize yours to pass the filters.',
    icon: <Shield className="w-6 h-6 text-slate-700 dark:text-slate-300" />
  },
  {
    title: 'Interview Anxiety',
    description: 'Behavioral interviews can be daunting. Our HR Prep module breaks down the STAR method so you can answer with confidence.',
    icon: <Zap className="w-6 h-6 text-slate-700 dark:text-slate-300" />
  },
  {
    title: 'Fragmented Opportunities',
    description: 'Stop endlessly scrolling through generic job boards. Get access to curated, high-quality roles specifically targeted for you.',
    icon: <Target className="w-6 h-6 text-slate-700 dark:text-slate-300" />
  }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-8 border border-indigo-100 dark:border-indigo-800/50">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
                The Ultimate Career Platform
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 font-display">
                Your Career Journey <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Starts Here</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                LU Connect bridges the gap between students and opportunities. 
                Analyze your resume, prepare for interviews, and land your dream job with AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/jobs"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                  Explore Jobs <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/resume-analyzer"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm"
                >
                  Analyze Resume
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Objective Section */}
      <section className="py-24 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md relative z-10 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 font-display">
                Our Objective
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                At LU Connect, our primary objective is to democratize access to career opportunities and professional development. We believe every student deserves the tools to present their best self to potential employers.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                By leveraging advanced AI and curating high-quality job postings, we aim to reduce the friction in the hiring process, ensuring that talent meets opportunity seamlessly and efficiently.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 mix-blend-overlay"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                  alt="Students collaborating" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 hidden md:block">
                <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-1">98%</div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Placement Success</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Need Section */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-display">
              Why You Need LU Connect
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              The modern job market is complex. We built this platform to solve the most common pain points students face during recruitment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {needs.map((need, index) => (
              <motion.div
                key={need.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50"
              >
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                  {need.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {need.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {need.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Uses / Modules Section */}
      <section className="py-24 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-display">
              Platform Features & Uses
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to succeed in one unified platform. From discovery to preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={module.href}>
                  <div className="group h-full p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${module.color}`}>
                      {module.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <span className="text-2xl font-bold text-white font-display tracking-tight mb-4 block">LU Connect</span>
              <p className="text-slate-400 max-w-sm">
                The modern platform for job postings, resume analysis, and HR preparation. Empowering students to achieve their career goals.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/jobs" className="hover:text-indigo-400 transition-colors">Job Board</Link></li>
                <li><Link href="/resume-analyzer" className="hover:text-indigo-400 transition-colors">Resume Analyzer</Link></li>
                <li><Link href="/hr-prep" className="hover:text-indigo-400 transition-colors">HR Prep</Link></li>
                <li><Link href="/admin" className="hover:text-indigo-400 transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} LU Connect. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
