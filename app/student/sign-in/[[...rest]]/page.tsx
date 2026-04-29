"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "motion/react";

function AuthSideInfo() {
  return (
    <div className="max-w-lg space-y-6">
      {/* visual card */}
      <div className="aspect-square md:aspect-[4/3] border border-black/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
          alt="Students collaborating"
          className="w-full h-full object-cover grayscale"
        />
      </div>

      <h2 className="text-3xl font-bold text-[#1A1A1A]">
        Our Mission
      </h2>
      <p className="text-lg text-[#4A4A4A] leading-relaxed">
        At LU Connect, we democratize access to career opportunities and professional development. Every student deserves the tools to present their best self to potential employers.
      </p>
      <p className="text-lg text-[#4A4A4A] leading-relaxed">
        By leveraging advanced AI and curating high-quality job postings, we reduce friction in hiring. Talent meets opportunity seamlessly and efficiently.
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full bg-[#F9F9F7] flex items-center justify-center px-6 py-12">
      <div className="flex flex-col md:flex-row w-full max-w-7xl gap-16">
        {/* Clerk iframe column */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md border border-black/5 p-8"
          >
            <div className="flex flex-col items-center">
              <SignIn
                path="/student/sign-in"
                routing="path"
                appearance={{
                  variables: {
                    colorPrimary: "#2563EB",
                  },
                }}
                fallbackRedirectUrl="/"
                signUpUrl="/student/sign-up"
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
