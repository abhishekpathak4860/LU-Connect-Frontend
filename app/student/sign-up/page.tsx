"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "motion/react";
import { Shield, Zap, Target } from 'lucide-react';

function AuthSideInfo() {
  const points = [
    {
      title: 'Instant Resume Insights',
      description:
        'Upload your CV and receive AI-powered suggestions within seconds — no jargon, just clear improvements.',
      icon: <Shield className="w-6 h-6 text-slate-700 dark:text-slate-300" />,
    },
    {
      title: 'Practice Interviews Anywhere',
      description:
        'Use our built-in mock interview tool to rehearse common questions and get real-time feedback.',
      icon: <Zap className="w-6 h-6 text-slate-700 dark:text-slate-300" />,
    },
    {
      title: 'One Dashboard, All Opportunities',
      description:
        'Connect to multiple job feeds and track applications without bouncing between sites.',
      icon: <Target className="w-6 h-6 text-slate-700 dark:text-slate-300" />,
    },
  ];

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex align-middle">
        Get More from Your Career Journey
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {points.map((p) => (
          <div
            key={p.title}
            className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mr-4">
                {p.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {p.title}
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-7xl">
        {/* Clerk column */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="flex flex-col items-center">
              <SignUp
                appearance={{
                variables: {
                  colorPrimary: "#7c3aed",
                  // colorBackground: "#020617",
                  // colorText: "#e2e8f0",
                  // colorInputBackground: "#0f172a",
                  // colorInputText: "#e2e8f0",
                },

                // elements: {
                //   card:
                //     "bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl",

                //   headerTitle:
                //     "text-white text-2xl font-semibold",

                //   headerSubtitle:
                //     "text-slate-400",

                //   socialButtonsBlockButton:
                //     "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200",

                //   formButtonPrimary:
                //     "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg",

                //   formFieldInput:
                //     "bg-slate-800 border border-slate-700 text-slate-200 focus:border-purple-500",

                //   footerActionLink:
                //     "text-purple-400 hover:text-purple-300",

                //   dividerLine:
                //     "bg-slate-700",

                //   dividerText:
                //     "text-slate-400",
                // },
              }}
                fallbackRedirectUrl="/"
                signInUrl="/student/sign-in"
              />
            </div>
          </motion.div>
        </div>

        {/* Info column */}
        <div className="hidden md:flex w-1/2 p-12 items-center justify-center">
          <AuthSideInfo />
        </div>
      </div>
    </div>
  );
}
