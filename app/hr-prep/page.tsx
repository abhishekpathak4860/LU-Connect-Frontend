'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, BookOpen, Target, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const hrQuestions = [
  {
    question: "Tell me about yourself.",
    scenario: "The classic icebreaker. They want to know your professional journey, not your life story.",
    dos: ["Focus on your professional background", "Highlight relevant skills", "Keep it under 2 minutes"],
    donts: ["Recite your resume word-for-word", "Share overly personal details", "Ramble without structure"],
    sample: "I'm a computer science senior with a passion for full-stack development. Over the past year, I've built several web applications using React and Node.js, including a project management tool that improved my team's workflow by 20%. I'm looking to bring my technical skills and problem-solving mindset to a dynamic engineering team."
  },
  {
    question: "Why do you want to work for this company?",
    scenario: "Testing your research and genuine interest in the role and company culture.",
    dos: ["Mention specific products or recent news", "Align your values with the company's mission", "Show enthusiasm"],
    donts: ["Give generic answers like 'It's a good company'", "Focus only on perks or salary", "Show lack of research"],
    sample: "I've been following your recent work in cloud infrastructure, and I was really impressed by the open-source tool your team released last month. I'm passionate about building scalable systems, and I admire your company's commitment to open-source and continuous learning. I'd love to contribute to a team that values innovation so highly."
  },
  {
    question: "What is your greatest weakness?",
    scenario: "Testing your self-awareness and willingness to improve.",
    dos: ["Choose a real but non-fatal weakness", "Show how you are actively working on it", "Be honest"],
    donts: ["Say 'I work too hard' or 'I'm a perfectionist'", "Choose a weakness critical to the role", "Say you have no weaknesses"],
    sample: "I sometimes struggle with delegating tasks because I like to ensure things are done a certain way. However, I've realized this isn't scalable, so in my recent group project, I actively practiced breaking down the project and trusting my teammates with specific modules. It actually resulted in us finishing ahead of schedule."
  },
  {
    question: "Describe a time you faced a conflict with a team member.",
    scenario: "Assessing your emotional intelligence and conflict resolution skills.",
    dos: ["Use the STAR method", "Focus on the resolution", "Maintain a professional tone"],
    donts: ["Blame the other person", "Get defensive", "Choose an unresolved conflict"],
    sample: "In my junior year capstone, a teammate and I disagreed on the database architecture. Instead of arguing, I suggested we both build quick prototypes of our approaches. We reviewed the pros and cons together with our professor, and ultimately combined the best parts of both designs. We learned to communicate better and delivered a stronger project."
  },
  {
    question: "Tell me about a time you failed.",
    scenario: "Evaluating your resilience, accountability, and ability to learn from mistakes.",
    dos: ["Own the mistake", "Focus on what you learned", "Explain the steps you took to prevent it from happening again"],
    donts: ["Blame others or external factors", "Choose a catastrophic failure", "Say you've never failed"],
    sample: "During my internship, I deployed a feature without fully testing it in the staging environment, which caused a minor bug in production. I immediately rolled back the change, informed my manager, and worked late to fix the issue. After that, I created a comprehensive testing checklist for myself and the team to ensure it wouldn't happen again. It taught me the critical importance of rigorous QA processes."
  },
  {
    question: "Where do you see yourself in 5 years?",
    scenario: "Gauging your ambition, career goals, and whether they align with the company's trajectory.",
    dos: ["Show ambition but be realistic", "Connect your goals to the role you're applying for", "Emphasize growth and learning"],
    donts: ["Say you want the interviewer's job", "Mention starting your own competing business", "Say you don't know"],
    sample: "In five years, I see myself as a senior developer who has deep expertise in distributed systems. I hope to have taken on leadership responsibilities, perhaps mentoring junior engineers or leading a specific product initiative. I'm excited about the growth opportunities here and believe this role is the perfect starting point for that journey."
  }
];

export default function HRPrep() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 font-display">
              HR Interview Preparation
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Master the behavioral interview. Learn the STAR method and practice common scenarios.
            </p>
            
            <Link href="/hr-prep/test">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm">
                Test your Learning
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* STAR Method Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">The STAR Method</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { letter: 'S', title: 'Situation', desc: 'Set the scene and give the necessary details of your example.' },
              { letter: 'T', title: 'Task', desc: 'Describe what your responsibility was in that situation.' },
              { letter: 'A', title: 'Action', desc: 'Explain exactly what steps you took to address it.' },
              { letter: 'R', title: 'Result', desc: 'Share what outcomes your actions achieved.' }
            ].map((item, i) => (
              <div key={item.letter} className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <div className="text-3xl font-black text-indigo-600/20 dark:text-indigo-400/20 mb-2">{item.letter}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Pro Tips Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Body Language & Delivery
            </h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                Maintain good eye contact, especially when answering directly.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                Use hand gestures naturally to emphasize points, but avoid fidgeting.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                Speak clearly and at a moderate pace. It&apos;s okay to pause and think.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                Smile genuinely. It shows enthusiasm and approachability.
              </li>
            </ul>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              Common Pitfalls
            </h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                Badmouthing previous employers or colleagues.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                Giving overly rehearsed, robotic answers.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                Failing to ask insightful questions at the end of the interview.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                Not tailoring your answers to the specific company&apos;s culture.
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Questions Accordion */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-6">Common HR Questions</h2>
          {hrQuestions.map((q, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              key={index}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <span className="font-semibold text-slate-900 dark:text-white text-lg">{q.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">The Scenario</h4>
                        <p className="text-slate-700 dark:text-slate-300">{q.scenario}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
                          <h4 className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold mb-3">
                            <CheckCircle className="w-4 h-4" /> Do&apos;s
                          </h4>
                          <ul className="space-y-2">
                            {q.dos.map((item, i) => (
                              <li key={i} className="text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-rose-50 dark:bg-rose-900/10 rounded-xl p-4 border border-rose-100 dark:border-rose-900/30">
                          <h4 className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold mb-3">
                            <XCircle className="w-4 h-4" /> Don&apos;ts
                          </h4>
                          <ul className="space-y-2">
                            {q.donts.map((item, i) => (
                              <li key={i} className="text-sm text-rose-800 dark:text-rose-300 flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50">
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Sample Answer</h4>
                        <p className="text-slate-700 dark:text-slate-300 italic">&quot;{q.sample}&quot;</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
