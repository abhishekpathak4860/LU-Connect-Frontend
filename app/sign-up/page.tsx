"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "motion/react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
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
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              LU Connect
            </h1>
          </Link>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Create your account to get started
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden p-8">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 rounded-lg transition-colors",
                formFieldInput:
                  "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400",
                formFieldLabel:
                  "text-slate-700 dark:text-slate-300 font-medium",
                footerActionLink:
                  "text-indigo-600 dark:text-indigo-400 hover:underline",
                footerAction: "text-slate-600 dark:text-slate-400",
                dividerLine: "bg-slate-200 dark:bg-slate-700",
                dividerText: "text-slate-500 dark:text-slate-400",
                socialButtonsBlockButton:
                  "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg transition-colors",
                card: "bg-transparent shadow-none border-none",
                header: "hidden",
                main: "width-full",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                logoImageUrl: undefined,
              },
            }}
            fallbackRedirectUrl="/onboarding/role-selection"
            signInUrl="/sign-in"
          />
        </div>

        {/* Footer Text */}
        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Back to Home Link */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
