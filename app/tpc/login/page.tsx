'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        let errorMessage = 'Invalid passcode';
        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response');
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">TPC Admin Portal</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your secure passcode to access the dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="passcode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Passcode
            </label>
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter TPC Passcode"
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
