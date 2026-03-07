"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "motion/react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-[90vh] w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header Section */}
        {/* <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              LU Connect
            </h1>
          </Link>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Create your account to get started
          </p>
        </div> */}

        {/* Clerk Sign Up Component */}
        <div className="flex flex-col items-center">
          <SignUp
            appearance={{
            variables: {
              colorPrimary: "#7c3aed",
              colorBackground: "#020617",
              colorText: "#e2e8f0",
              colorInputBackground: "#0f172a",
              colorInputText: "#e2e8f0",
            },

            elements: {
              card:
                "bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl",

              headerTitle:
                "text-white text-2xl font-semibold",

              headerSubtitle:
                "text-slate-400",

              socialButtonsBlockButton:
                "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200",

              formButtonPrimary:
                "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg",

              formFieldInput:
                "bg-slate-800 border border-slate-700 text-slate-200 focus:border-purple-500",

              footerActionLink:
                "text-purple-400 hover:text-purple-300",

              dividerLine:
                "bg-slate-700",

              dividerText:
                "text-slate-400",
            },
          }}
            fallbackRedirectUrl="/"
            signInUrl="/student/sign-in"
          />
        </div>
      </motion.div>
    </div>
  );
}
