"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { GraduationCap, Building2, Users } from "lucide-react";

const roles = [
  {
    id: "STUDENT",
    name: "Student",
    description: "Looking for internships, jobs, and career opportunities",
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "TPC",
    name: "TPC Member",
    description: "Training and Placement Cell member managing placements",
    icon: Users,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "COMPANY",
    name: "Company",
    description: "Hiring company posting jobs and managing applications",
    icon: Building2,
    color: "from-purple-500 to-pink-600",
  },
];

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/onboarding/${selectedRole.toLowerCase()}-details`);
    }
  };

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
        className="w-full max-w-2xl"
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              LU Connect
            </h1>
          </Link>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Choose Your Role
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Select the role that best describes you to continue with your
            profile setup
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <motion.div
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 shadow-lg"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${role.color} text-white`}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {role.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {role.description}
                    </p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              selectedRole
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            }`}
          >
            Continue
          </motion.button>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
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
