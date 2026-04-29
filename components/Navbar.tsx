"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { Show, UserButton } from "@clerk/nextjs";
import axios from "@/lib/axios";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Jobs", href: "/jobs" },
  { name: "Resume Analyzer", href: "/resume-analyzer" },
  { name: "HR Prep", href: "/hr-prep" },
];

const tpcNavLinks = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/tpc/dashboard" },
];

const optionalNavLinks = [
  { name: "Sign Up", href: "/sign-up" },
  { name: "Sign In", href: "/sign-in" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [isTpcLoggedIn, setIsTpcLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // check admin auth by calling /auth/me
    const check = async () => {
      try {
        await axios.get('/auth/me');
        setIsTpcLoggedIn(true);
      } catch (e) {
        setIsTpcLoggedIn(false);
      }
    };
    check();
  }, []);

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
          ? "bg-[#F9F9F7]  border-b border-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-baseline gap-8">
            <Link
              href="/"
              className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? "text-[#1A1A1A]" : "text-white"
                }`}
            >
              LU<span className="text-[#2563EB]">.</span>CONNECT
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {!isTpcLoggedIn && navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#2563EB] ${
                    pathname === link.href
                      ? "text-[#2563EB]"
                      : "text-[#4A4A4A]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            {!isTpcLoggedIn && <Show when="signed-out">
              <div className="relative group">
                <Menu size={20} />
                <div className="absolute right-0 mt-0 w-48 bg-[#F9F9F7] border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-10">
                  <Link href="/student/sign-up" className="block px-4 py-2 text-[#4A4A4A] hover:text-[#2563EB] hover:bg-black/2.5 text-sm font-medium">
                    Student Signup
                  </Link>
                  <Link href="/student/sign-in" className="block px-4 py-2 text-[#4A4A4A] hover:text-[#2563EB] hover:bg-black/2.5 text-sm font-medium">
                    Student Login
                  </Link>
                  {!isTpcLoggedIn && (
                    <Link href="/tpc/login" className="block px-4 py-2 text-[#4A4A4A] hover:text-[#2563EB] hover:bg-black/2.5 text-sm font-medium">
                      TPC Login
                    </Link>
                  )}
                </div>
              </div>
            </Show>}
            {isTpcLoggedIn && tpcNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#2563EB] ${
                    pathname === link.href
                      ? "text-[#2563EB]"
                      : "text-[#4A4A4A]"
                  }`}
                >
                  {link.name}
                </Link>
            )
          )}
            {isTpcLoggedIn && (
              <button
                onClick={async () => {
                  localStorage.removeItem('jwt');
                  document.cookie = 'tpc=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                  try { await axios.post('/auth/logout'); } catch {};
                  setIsTpcLoggedIn(false);
                  router.push('/');
                }}
                className="px-6 py-2 bg-[#1A1A1A] text-white text-sm font-bold hover:bg-[#2563EB] transition-colors duration-300"
              >
                Logout
              </button>
            )}
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors focus:outline-none ${scrolled ? "text-[#1A1A1A] hover:text-[#2563EB]" : "text-white hover:text-[#2563EB]"}`}
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
          className="md:hidden bg-[#F9F9F7] border-b border-black/5"
        >
          <div className="px-6 pt-4 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? "text-[#2563EB]"
                    : "text-[#4A4A4A] hover:text-[#2563EB]"
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
                  className={`block px-4 py-2 text-sm font-medium ${
                    pathname === link.href
                      ? "text-[#2563EB]"
                      : "text-[#4A4A4A] hover:text-[#2563EB]"
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
