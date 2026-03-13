"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "motion/react";

function AuthSideInfo() {
  return (
    <div className="max-w-lg space-y-6">
      {/* visual card */}
      <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 mix-blend-overlay"></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
          alt="Students collaborating"
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        Our Objective
      </h2>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
        At LU Connect, our primary objective is to democratize access to career
        opportunities and professional development. We believe every student
        deserves the tools to present their best self to potential employers.
      </p>
      <p className="text-lg text-slate-600 dark:text-slate-400">
        By leveraging advanced AI and curating high-quality job postings, we aim
        to reduce the friction in the hiring process, ensuring that talent meets
        opportunity seamlessly and efficiently.
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-7xl">
        {/* Clerk iframe column */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="flex flex-col items-center">
              <SignIn
                path="/student/sign-in"             //debug #3 for clerk 
                routing="path"
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
                signUpUrl="/student/sign-up"
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
