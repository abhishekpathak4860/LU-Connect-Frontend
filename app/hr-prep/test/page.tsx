'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Building2, Loader2, CheckCircle2, AlertCircle, Send, RefreshCw, ArrowRight, Target } from 'lucide-react';
import Link from 'next/link';

type Question = {
  id: string;
  question: string;
  context: string;
};

type Evaluation = {
  id: string;
  score: number;
  feedback: string;
  improvement: string;
};

const companies = [
  "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Startup", "General Tech"
];

export default function HRTest() {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [customCompany, setCustomCompany] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const company = selectedCompany === "Custom" ? customCompany : selectedCompany;
    if (!company) {
      setError("Please select or enter a company name.");
      return;
    }

    setError(null);
    setIsGenerating(true);
    setQuestions([]);
    setAnswers({});
    setEvaluations([]);

    try {
      const res = await fetch('/api/hr-prep/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate questions');

      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluate = async () => {
    const company = selectedCompany === "Custom" ? customCompany : selectedCompany;
    
    // Check if all questions are answered
    const unanswered = questions.some(q => !answers[q.id] || answers[q.id].trim() === '');
    if (unanswered) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setError(null);
    setIsEvaluating(true);

    const formattedAnswers = questions.map(q => ({
      id: q.id,
      question: q.question,
      answer: answers[q.id]
    }));

    try {
      const res = await fetch('/api/hr-prep/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, answers: formattedAnswers })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to evaluate answers');

      // The API might not return the IDs correctly if we didn't pass them properly in the prompt,
      // but we mapped them in the prompt. Let's hope it maps them back.
      // Actually, my prompt didn't explicitly tell it to use the same IDs. Let's fix the API route to ensure IDs match.
      // Wait, I passed the answers array with questions and answers, but not the IDs to the prompt.
      // Let me update the evaluate API route to include IDs in the prompt.
      
      setEvaluations(data.evaluations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getEvaluationForQuestion = (id: string) => {
    // Sometimes the AI might return evaluations in order or with mismatched IDs.
    // Let's try to match by ID first, then by index.
    const evalById = evaluations.find(e => e.id === id);
    if (evalById) return evalById;
    
    const index = questions.findIndex(q => q.id === id);
    if (index >= 0 && evaluations[index]) return evaluations[index];
    
    return null;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/hr-prep" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to HR Prep
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Test Your Learning
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Select a target company to get tailored HR questions. Answer them and get instant feedback.
          </p>
        </div>

        {/* Company Selection */}
        {!questions.length && !isGenerating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Choose Your Target Company</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {companies.map(company => (
                <button
                  key={company}
                  onClick={() => {
                    setSelectedCompany(company);
                    setCustomCompany("");
                  }}
                  className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                    selectedCompany === company 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-500' 
                      : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {company}
                </button>
              ))}
              <button
                onClick={() => setSelectedCompany("Custom")}
                className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                  selectedCompany === "Custom" 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-500' 
                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600'
                }`}
              >
                Other
              </button>
            </div>

            {selectedCompany === "Custom" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Enter Company Name
                </label>
                <input
                  type="text"
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  placeholder="e.g. Stripe, Airbnb, Local Startup"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center gap-3 border border-rose-100 dark:border-rose-900/30">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!selectedCompany || (selectedCompany === "Custom" && !customCompany)}
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              Generate Questions
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">
              Analyzing {selectedCompany === "Custom" ? customCompany : selectedCompany} culture and generating questions...
            </p>
          </div>
        )}

        {/* Questions & Answers */}
        {questions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Target Company</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedCompany === "Custom" ? customCompany : selectedCompany}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setQuestions([]);
                  setEvaluations([]);
                  setAnswers({});
                }}
                className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Change
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center gap-3 border border-rose-100 dark:border-rose-900/30">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {questions.map((q, index) => {
                const evaluation = getEvaluationForQuestion(q.id);
                
                return (
                  <div key={q.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 font-bold text-slate-600 dark:text-slate-300">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{q.question}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl inline-block">
                          <span className="font-medium">Context:</span> {q.context}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Your Answer
                      </label>
                      <textarea
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        disabled={evaluations.length > 0 || isEvaluating}
                        placeholder="Type your answer here using the STAR method..."
                        className="w-full h-40 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none disabled:opacity-70 disabled:bg-slate-50 dark:disabled:bg-slate-800/50"
                      />
                    </div>

                    {/* Evaluation Results */}
                    <AnimatePresence>
                      {evaluation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                              evaluation.score >= 8 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                              evaluation.score >= 5 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                              'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                            }`}>
                              {evaluation.score}/10
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">Feedback</h4>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl">
                              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                {evaluation.feedback}
                              </p>
                            </div>
                            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                              <h5 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4" /> How to Improve
                              </h5>
                              <p className="text-indigo-900/80 dark:text-indigo-300/80 text-sm leading-relaxed">
                                {evaluation.improvement}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {!evaluations.length && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Evaluating Answers...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit for Evaluation
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
