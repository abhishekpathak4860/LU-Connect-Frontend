import type { Metadata } from "next";
import "./globals.css"; // Global styles
import Navbar from "@/components/Navbar";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { dark } from "@clerk/themes";
import StudentAuthSync from "@/components/StudentAuthSync";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LU Connect | Modern Job & Resume Platform",
  description:
    "A modern platform for job postings, resume analysis, and HR preparation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body
        className="font-sans antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 min-h-screen flex flex-col relative"
        suppressHydrationWarning
      >
        <ClerkProvider appearance={{theme:dark}}>
          {/* Global Animated Background */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 dark:bg-indigo-500/10 blur-[100px] animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-violet-500/20 dark:bg-violet-500/10 blur-[120px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 dark:bg-emerald-500/10 blur-[120px] animate-blob animation-delay-4000"></div>
          </div>

          <Navbar />
          <StudentAuthSync />
          <main className="flex-grow pt-16 relative z-10">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
