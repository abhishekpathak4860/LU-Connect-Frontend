"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { Show, UserButton } from "@clerk/nextjs";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Jobs", href: "/jobs" },
  { name: "Resume Analyzer", href: "/resume-analyzer" },
  { name: "HR Prep", href: "/hr-prep" },
];

const optionalNavLinks = [
  { name: "Sign Up", href: "/sign-up" },
  { name: "Sign In", href: "/sign-in" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-sm border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-baseline gap-8">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tighter text-indigo-600 dark:text-indigo-400"
            >
              LU Connect
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-md font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                    pathname === link.href
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            <Show when="signed-out">
              <div className="relative group">
                <Menu size={24} />
                <div className="absolute right-0 mt-0 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-10">
                  <Link href="/student/sign-up" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                    Student Signup
                  </Link>
                  <Link href="/student/sign-in" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                    Student Login
                  </Link>
                  <Link href="/tpc/login" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                    TPC Login
                  </Link>
                </div>
              </div>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
            {/* <Link
              href="/admin"
              className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Admin Login
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Show when="signed-out">
              {optionalNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href
                      ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </Show>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
