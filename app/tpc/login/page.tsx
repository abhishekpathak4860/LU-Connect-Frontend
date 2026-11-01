'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import axios from '@/lib/axios';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    await axios.post("/auth/login", {
      email,
      password,
    });

    router.replace("/tpc/dashboard");
  } catch (err: any) {
    setError(err.response?.data?.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#F9F9F7] text-[#1A1A1A]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white border border-black/10 p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2563EB]/10 border border-[#2563EB] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-[#2563EB]" />
          </div>
          <h2 className="text-3xl font-bold text-[#1A1A1A]">TPC Access</h2>
          <p className="text-[#4A4A4A] mt-2 text-sm">Sign in with your admin credentials.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-[#4A4A4A] mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-black/10 bg-white text-[#1A1A1A] placeholder-[#4A4A4A] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all outline-none"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-[#4A4A4A] mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-black/10 bg-white text-[#1A1A1A] placeholder-[#4A4A4A] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-sm text-center bg-red-50 border border-red-200 p-2"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#1A1A1A] text-white font-bold text-sm hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
