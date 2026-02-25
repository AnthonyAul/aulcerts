'use client';

import { useState } from 'react';
import { useCertStore } from '@/lib/store';
import { BookOpen, CheckCircle, Circle, Trash2, ExternalLink, Search, LogIn, Trophy, Target, Clock, Settings, Download } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useUser, useClerk } from '@clerk/nextjs';

export default function Dashboard() {
  const { goals, isLoaded: isStoreLoaded, removeGoal, removeResource, toggleResourceStatus, openProModal, isProLocal } = useCertStore();
  const { user, isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const { openSignIn } = useClerk();
  
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleExport = (goal: any) => {
    // Check our local pro state
    if (!isProLocal) {
      openProModal();
      return;
    }

    let markdown = `# ${goal.name} - Study Plan\n\n`;
    markdown += `*Exported from AulCerts*\n\n`;
    
    const completed = goal.resources.filter((r: any) => r.status === 'completed');
    const learning = goal.resources.filter((r: any) => r.status === 'learning');

    markdown += `## Progress: ${completed.length} / ${goal.resources.length} Completed\n\n`;

    if (learning.length > 0) {
      markdown += `## To Study\n\n`;
      learning.forEach((r: any) => {
        markdown += `### [${r.title}](${r.url})\n`;
        markdown += `- **Type**: ${r.type}\n`;
        markdown += `- **Source**: ${r.source}\n`;
        markdown += `- **Summary**: ${r.snippet}\n\n`;
      });
    }

    if (completed.length > 0) {
      markdown += `## Completed\n\n`;
      completed.forEach((r: any) => {
        markdown += `### [${r.title}](${r.url})\n`;
        markdown += `- **Type**: ${r.type}\n`;
        markdown += `- **Source**: ${r.source}\n`;
        markdown += `- **Summary**: ${r.snippet}\n\n`;
      });
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${goal.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_study_plan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isStoreLoaded || !isClerkLoaded) return <div className="flex-1 flex justify-center items-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!isSignedIn) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="w-20 h-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
          <LogIn size={36} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Your Study Hub Awaits</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">Sign in to build your custom syllabus, track your progress, and master your next certification.</p>
        <button 
          onClick={() => openSignIn()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm"
        >
          Sign In to Continue
        </button>
      </div>
    );
  }

  // If activeGoalId is not set or invalid, default to the first goal
  const activeGoal = goals.find(g => g.id === activeGoalId) || goals[0];

  // Calculate overall stats
  const totalCerts = goals.length;
  const totalResources = goals.reduce((acc, goal) => acc + goal.resources.length, 0);
  const totalCompleted = goals.reduce((acc, goal) => acc + goal.resources.filter(r => r.status === 'completed').length, 0);

  return (
    <div className="flex-1 w-full bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Top Stats Row */}
      <div className="bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.firstName || 'Student'}</h1>
            <Link href="/settings" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold transition-colors shadow-sm border border-gray-200 dark:border-gray-800">
              <Settings size={16} /> Settings
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Target size={24} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Trackers</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalCerts}</div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Saved Resources</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalResources}</div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Trophy size={24} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Items</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalCompleted}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar - Goals List */}
        <div className="w-full md:w-80 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">My Syllabuses</h2>
          </div>
          
          {goals.length === 0 ? (
            <div className="p-6 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-sm">
              <BookOpen size={32} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">You aren&apos;t tracking any certifications yet.</p>
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors">
                <Search size={16} /> Find Resources
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map(goal => {
                const completedCount = goal.resources.filter(r => r.status === 'completed').length;
                const totalCount = goal.resources.length;
                const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
                const isActive = activeGoal?.id === goal.id;
                
                return (
                  <button
                    key={goal.id}
                    onClick={() => setActiveGoalId(goal.id)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all ${isActive ? 'bg-white dark:bg-[#1a1a1a] border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow-sm'}`}
                  >
                    <div className={`text-lg font-bold truncate mb-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {goal.name}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 font-bold uppercase tracking-wide">
                      <span>{completedCount} of {totalCount} Done</span>
                      <span className={progress === 100 ? 'text-emerald-500' : ''}>{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Content - Resources */}
        <div className="flex-1">
          {activeGoal ? (
            <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1a1a]/50">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{activeGoal.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400">Your personalized curriculum. Complete all items to be exam-ready.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleExport(activeGoal)}
                      className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#333] px-4 py-2 rounded-xl transition-colors font-bold shadow-sm"
                      title={isProLocal ? "Export to Markdown" : "Pro Feature: Export to Markdown"}
                    >
                      <Download size={16} /> Export
                    </button>
                    <Link 
                      href={`/search?q=${encodeURIComponent(activeGoal.name)}`}
                      className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#333] px-4 py-2 rounded-xl transition-colors font-bold shadow-sm"
                    >
                      <Search size={16} /> Add More
                    </Link>
                    {confirmDeleteId === activeGoal.id ? (
                      <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-xl border border-red-200 dark:border-red-800">
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">Sure?</span>
                        <button 
                          onClick={() => {
                            removeGoal(activeGoal.id);
                            setActiveGoalId(null);
                            setConfirmDeleteId(null);
                          }}
                          className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg transition-colors"
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs font-bold bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-lg transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setConfirmDeleteId(activeGoal.id)}
                        className="inline-flex items-center justify-center text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 w-10 h-10 rounded-xl transition-colors"
                        title="Delete Tracker"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {activeGoal.resources.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-gray-800 border-dashed">
                    <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your syllabus is empty</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">Search for {activeGoal.name} resources and bookmark them to build your study plan.</p>
                    <Link href={`/search?q=${encodeURIComponent(activeGoal.name)}`} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm">
                      <Search size={18} /> Find Resources
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeGoal.resources.map((resource, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={resource.url}
                        className={`p-5 rounded-2xl border transition-all flex gap-4 sm:gap-6 items-start group ${resource.status === 'completed' ? 'bg-gray-50 dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100' : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md'}`}
                      >
                        <button 
                          onClick={() => toggleResourceStatus(activeGoal.id, resource.url)}
                          className={`shrink-0 mt-1 transition-colors ${resource.status === 'completed' ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600 hover:text-emerald-500'}`}
                          title={resource.status === 'completed' ? "Mark as Learning" : "Mark as Completed"}
                        >
                          {resource.status === 'completed' ? <CheckCircle size={28} className="fill-emerald-50" /> : <Circle size={28} />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              {resource.type}
                            </span>
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 truncate">{resource.source}</span>
                          </div>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 text-lg font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2 ${resource.status === 'completed' ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                            {resource.title} <ExternalLink size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{resource.snippet}</p>
                        </div>

                        <button 
                          onClick={() => removeResource(activeGoal.id, resource.url)}
                          className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-red-500 p-2 self-start transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove Resource"
                        >
                          <Trash2 size={20} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
