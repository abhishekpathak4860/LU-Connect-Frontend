"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "motion/react";
import { Shield, Zap, Target } from 'lucide-react';

function AuthSideInfo() {
  const points = [
    {
      title: 'Instant Resume Insights',
      description:
        'Upload your CV and receive AI-powered suggestions instantly — clear improvements without jargon.',
      icon: <Shield className="w-6 h-6 text-[#1A1A1A]" />,
    },
    {
      title: 'Practice Interviews',
      description:
        'Use our built-in mock interview tool to rehearse common questions and get real-time feedback.',
      icon: <Zap className="w-6 h-6 text-[#1A1A1A]" />,
    },
    {
      title: 'Unified Opportunity Dashboard',
      description:
        'Connect to multiple job feeds and track applications in one place. No more bouncing between sites.',
      icon: <Target className="w-6 h-6 text-[#1A1A1A]" />,
    },
  ];

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-3xl font-bold text-[#1A1A1A]">
        Accelerate Your Career
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {points.map((p) => (
          <div
            key={p.title}
            className="p-6 border border-black/10"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#2563EB]/10 border border-[#2563EB] flex items-center justify-center mr-4">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A]">
                {p.title}
              </h3>
            </div>
            <p className="text-[#4A4A4A] leading-relaxed">
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
  <div className="min-h-screen w-full bg-[#F9F9F7] flex items-center justify-center px-4 sm:px-6 py-6 sm:py-12 overflow-x-hidden">
    <div className="flex flex-col md:flex-row w-full max-w-7xl gap-10 md:gap-16">

      {/* Clerk column */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md border border-black/5 p-4 sm:p-6 md:p-8"
        >
          <div className="flex flex-col items-center overflow-hidden">
            <SignUp
              appearance={{
                variables: {
                  colorPrimary: "#2563EB",
                },
              }}
              fallbackRedirectUrl="student/dashboard"
              signInUrl="/student/sign-in"
            />
          </div>
        </motion.div>
      </div>

      {/* Info column */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <AuthSideInfo />
      </div>
    </div>
  </div>
);
}
