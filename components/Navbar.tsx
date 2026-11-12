
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useAuth, UserButton } from "@clerk/nextjs";
import axios from "@/lib/axios";

type AuthStatus = "loading" | "tpc" | "student" | "guest";

const publicLinks = [
  { name: "Home", href: "/" },
  { name: "Jobs", href: "/jobs" },
  { name: "Resume Analyzer", href: "/resume-analyzer" },
  { name: "HR Prep", href: "/hr-prep" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

  // Check TPC and student authentication
  useEffect(() => {
    if (!isLoaded) return;

    let active = true;

    const checkAuthentication = async () => {
      // First check TPC authentication.
      try {
        await axios.get("/auth/me", {
          withCredentials: true,
        });

        if (active) {
          setAuthStatus("tpc");
        }

        return;
      } catch {
        // No valid TPC session; check Clerk below.
      }

      if (!active) return;

      // Then check student authentication.
      setAuthStatus(isSignedIn ? "student" : "guest");
    };

    checkAuthentication();

    return () => {
      active = false;
    };
  }, [isLoaded, isSignedIn]);

  // Give TPC authentication priority if both sessions exist.
  const isAuthenticated =
    authStatus === "tpc" || authStatus === "student";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleTpcLogout = async () => {
    try {
      await axios.post(
        "/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("TPC logout failed:", error);
    } finally {
      setAuthStatus("guest");
      router.replace("/");
    }
  };

  const dashboardHref =
    authStatus === "tpc"
      ? "/tpc/dashboard"
      : "/student/dashboard";

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors hover:text-[#2563EB] ${
      pathname === href
        ? "text-[#2563EB]"
        : "text-[#4A4A4A]"
    }`;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 z-50 w-full transition-all duration-300 border-b border-black/5 bg-[#F9F9F7]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight transition-colors text-[#1A1A1A]"
          >
            LU<span className="text-[#2563EB]">.</span>CONNECT
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-7 md:flex">
            {authStatus !== "loading" &&
              publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass(link.href)}
                >
                  {link.name}
                </Link>
              ))}

            {isAuthenticated && (
              <Link
                href={dashboardHref}
                className={linkClass(dashboardHref)}
              >
                Dashboard
              </Link>
            )}

            {authStatus === "guest" && (
              <div className="group relative">
                <button className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-blue-600">
                  <Menu size={19} />
                  {/* Account */}
                </button>

                <div className="invisible absolute right-0 top-full z-50 w-48 border border-black/10 bg-[#F9F9F7] py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                  <Link
                    href="/student/sign-up"
                    className="block px-4 py-2 text-sm text-neutral-600 hover:bg-black/5 hover:text-blue-600"
                  >
                    Student Signup
                  </Link>
                  <Link
                    href="/student/sign-in"
                    className="block px-4 py-2 text-sm text-neutral-600 hover:bg-black/5 hover:text-blue-600"
                  >
                    Student Login
                  </Link>
                  <Link
                    href="/tpc/login"
                    className="block px-4 py-2 text-sm text-neutral-600 hover:bg-black/5 hover:text-blue-600"
                  >
                    TPC Login
                  </Link>
                </div>
              </div>
            )}

            {authStatus === "tpc" && (
              <button
                onClick={handleTpcLogout}
                className="bg-[#1A1A1A] px-6 py-2 text-sm font-bold text-white transition hover:bg-[#2563EB]"
              >
                Logout
              </button>
            )}

            {authStatus === "student" && <UserButton />}
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-4 md:hidden">
            {authStatus === "student" && <UserButton />}

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
              className="text-neutral-900"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-b border-black/10 bg-[#F9F9F7] md:hidden"
        >
          <div className="space-y-1 px-5 py-4">

            {authStatus !== "loading" &&
              publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-3 text-sm font-medium text-neutral-600 hover:text-blue-600"
                >
                  {link.name}
                </Link>
              ))}

            {isAuthenticated && (
              <Link
                href={dashboardHref}
                className="block px-3 py-3 text-sm font-semibold text-blue-600"
              >
                Dashboard
              </Link>
            )}

            {authStatus === "guest" && (
              <>
                <div className="my-2 border-t border-black/10" />

                <Link
                  href="/student/sign-up"
                  className="block px-3 py-3 text-sm text-neutral-600 hover:text-blue-600"
                >
                  Student Signup
                </Link>

                <Link
                  href="/student/sign-in"
                  className="block px-3 py-3 text-sm text-neutral-600 hover:text-blue-600"
                >
                  Student Login
                </Link>

                <Link
                  href="/tpc/login"
                  className="block px-3 py-3 text-sm text-neutral-600 hover:text-blue-600"
                >
                  TPC Login
                </Link>
              </>
            )}

            {authStatus === "tpc" && (
              <button
                onClick={handleTpcLogout}
                className="w-full px-3 py-3 text-left text-sm font-semibold text-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
