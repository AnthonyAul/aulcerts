'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, Target, Award, ArrowRight, CheckCircle2, Shield, Zap, Users, Bot, Database, BrainCircuit, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useCertStore } from '@/lib/store';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { openProModal } = useCertStore();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const popularCerts = [
    { name: "AWS Solutions Architect", category: "Cloud" },
    { name: "CompTIA Security+", category: "Cybersecurity" },
    { name: "CISSP", category: "Cybersecurity" },
    { name: "PMP", category: "Project Management" },
    { name: "Cisco CCNA", category: "Networking" },
    { name: "CISM", category: "Cybersecurity" }
  ];

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-[#0a0a0a]">
      {/* Premium Grid Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24 relative z-10 w-full">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-8 border border-blue-200 dark:border-blue-800/50 shadow-sm"
          >
            <Award size={16} className="text-blue-600 dark:text-blue-400" />
            <span>The #1 Free IT Study Platform</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]"
          >
            Pass your next IT exam <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">without spending a dime.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Stop paying for expensive courses. Our AI curates the highest-quality free videos, study guides, and practice exams from across the web. Build your custom syllabus today.
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch} 
            className="max-w-2xl mx-auto relative mb-8"
          >
            <div className="relative flex items-center w-full h-16 sm:h-20 rounded-2xl bg-white dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-gray-800 focus-within:border-blue-500 dark:focus-within:border-blue-500 shadow-xl hover:shadow-2xl transition-all px-4 sm:px-6 overflow-hidden group">
              <Search className="text-gray-400 group-focus-within:text-blue-500 transition-colors shrink-0" size={28} />
              <input
                className="flex-1 h-full outline-none text-lg sm:text-xl text-gray-900 dark:text-white bg-transparent px-4 placeholder:text-gray-400 font-medium"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. CompTIA Security+, AWS Cloud Practitioner..."
                autoFocus
              />
              <button type="submit" className="bg-gray-900 hover:bg-blue-600 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-colors shrink-0 flex items-center gap-2 text-sm sm:text-base shadow-md">
                Find Resources <ArrowRight size={18} className="hidden sm:block" />
              </button>
            </div>
          </motion.form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 100% Free Forever</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> AI-Curated Quality</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Progress Tracking</div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 dark:bg-[#111] py-24 border-y border-gray-200 dark:border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Everything you need to get certified</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">We&apos;ve built the ultimate tool for self-taught IT professionals. Organize your study materials and stay on track.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Instant Discovery</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Stop digging through Reddit and forums. Our AI instantly finds the highest-rated free courses, practice exams, and study guides.</p>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Custom Syllabus</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Bookmark the resources that fit your learning style. Build a personalized curriculum for any certification you want to tackle.</p>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Mark resources as completed, watch your progress bar fill up, and stay motivated until you&apos;re ready to ace the exam.</p>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                <Bot size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI Study Advisor</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Ask our built-in AI assistant to clarify complex topics, build a personalized study schedule, or recommend specific resources.</p>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <Database size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Massive Free Library</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">We scour YouTube, GitHub, Reddit, and official vendors to bring you the absolute maximum amount of free knowledge available.</p>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Curriculum</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Mix and match videos, text guides, and practice tests to create a learning path that perfectly fits your unique learning style.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 bg-gray-50 dark:bg-[#111] relative z-10 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Start for free and upgrade when you need to track multiple certifications at once.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Perfect for your first certification.</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$0</span>
                <span className="text-gray-500 dark:text-gray-400">/forever</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Check size={20} className="text-emerald-500 shrink-0" />
                  <span>Track <strong>1</strong> active certification</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Check size={20} className="text-emerald-500 shrink-0" />
                  <span>Unlimited resource searches</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Check size={20} className="text-emerald-500 shrink-0" />
                  <span>Custom syllabus builder</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Check size={20} className="text-emerald-500 shrink-0" />
                  <span>Basic progress tracking</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Check size={20} className="text-emerald-500 shrink-0" />
                  <span>AI Study Advisor</span>
                </li>
              </ul>
              <button onClick={() => document.querySelector('input')?.focus()} className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                Start for free
              </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-gray-900 dark:bg-[#222] p-8 rounded-3xl border border-gray-800 dark:border-gray-700 shadow-xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-gray-400 text-sm">For serious IT professionals.</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">$5</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-200">
                  <Check size={20} className="text-blue-400 shrink-0" />
                  <span>Track <strong>unlimited</strong> certifications</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <Check size={20} className="text-blue-400 shrink-0" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <Check size={20} className="text-blue-400 shrink-0" />
                  <span>Priority AI response times</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <Check size={20} className="text-blue-400 shrink-0" />
                  <span>Export syllabus to PDF/Notion</span>
                </li>
              </ul>
              <button onClick={() => {
                if (!isSignedIn) {
                  openSignIn();
                } else {
                  openProModal();
                }
              }} className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-md">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Certs Section */}
      <div className="py-24 bg-white dark:bg-[#0a0a0a] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Trending Certifications</h2>
              <p className="text-gray-600 dark:text-gray-400">What other students are studying right now.</p>
            </div>
            <Link href="/certifications" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-2">
              Search all 50+ certifications <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularCerts.map((cert, i) => (
              <button 
                key={cert.name}
                onClick={() => {
                  if (!isSignedIn) {
                    openSignIn();
                  } else {
                    router.push(`/search?q=${encodeURIComponent(cert.name)}`);
                  }
                }}
                className="group flex items-center justify-between p-6 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-[#1a1a1a] hover:shadow-md transition-all text-left"
              >
                <div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{cert.category}</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cert.name}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                  <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
