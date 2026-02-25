'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, BookOpen, Video, FileText, MessageSquare, ExternalLink, BookmarkPlus, Check, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useCertStore } from '@/lib/store';
import { useUser, useClerk } from '@clerk/nextjs';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Notice we renamed isLoaded to isStoreLoaded to prevent naming conflicts with Clerk
  const { saveResource, goals, isLoaded: isStoreLoaded, openProModal, isProLocal } = useCertStore();
  const { isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (query) {
      fetchResults(query);
    }
  }, [query]);

  // Using the secure backend API route we set up earlier!
  const fetchResults = async (searchQuery: string) => {
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) {
        throw new Error('Failed to connect to search API');
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResults(data.results);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && searchInput !== query) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  const getTypeIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('video')) return <Video size={16} className="text-red-500" />;
    if (t.includes('guide') || t.includes('book') || t.includes('course')) return <BookOpen size={16} className="text-blue-500" />;
    if (t.includes('exam') || t.includes('practice') || t.includes('test')) return <FileText size={16} className="text-green-500" />;
    if (t.includes('forum') || t.includes('community')) return <MessageSquare size={16} className="text-purple-500" />;
    return <BookOpen size={16} className="text-gray-500" />;
  };

  const filteredResults = results.filter((result) => {
    if (activeTab === 'all') return true;
    const t = result.type.toLowerCase();
    if (activeTab === 'videos') return t.includes('video');
    if (activeTab === 'guides') return t.includes('guide') || t.includes('book') || t.includes('course');
    if (activeTab === 'practice') return t.includes('exam') || t.includes('practice') || t.includes('test');
    return true;
  });

  const handleBookmark = (resource: any) => {
    // Replaced the fake user check with Clerk!
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    const isNewCert = !goals.find(g => g.name.toLowerCase() === query.toLowerCase());
    // Use isProLocal from our updated store instead of user.isPro
    if (isNewCert && goals.length >= 1 && !isProLocal) {
      openProModal();
      return;
    }

    saveResource(query, resource);
  };

  const isSaved = (url: string) => {
    if (!isStoreLoaded) return false;
    const goal = goals.find(g => g.name.toLowerCase() === query.toLowerCase());
    if (!goal) return false;
    return goal.resources.some(r => r.url === url);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-3xl">
          <div className="relative flex items-center w-full h-14 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 focus-within:border-blue-500 dark:focus-within:border-blue-500 shadow-sm transition-all px-4">
            <Search className="text-gray-400 shrink-0" size={20} />
            <input
              className="flex-1 h-full outline-none text-base text-gray-900 dark:text-white bg-transparent px-4"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
              Search
            </button>
          </div>
        </form>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8 border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 pb-3 border-b-2 whitespace-nowrap transition-colors ${activeTab === 'all' ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-medium' : 'border-transparent hover:text-gray-900 dark:hover:text-gray-200'}`}
        >
          <Search size={16} /> All Resources
        </button>
        <button 
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 pb-3 border-b-2 whitespace-nowrap transition-colors ${activeTab === 'videos' ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-medium' : 'border-transparent hover:text-gray-900 dark:hover:text-gray-200'}`}
        >
          <Video size={16} /> Videos
        </button>
        <button 
          onClick={() => setActiveTab('guides')}
          className={`flex items-center gap-2 pb-3 border-b-2 whitespace-nowrap transition-colors ${activeTab === 'guides' ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-medium' : 'border-transparent hover:text-gray-900 dark:hover:text-gray-200'}`}
        >
          <BookOpen size={16} /> Guides
        </button>
        <button 
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-2 pb-3 border-b-2 whitespace-nowrap transition-colors ${activeTab === 'practice' ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-medium' : 'border-transparent hover:text-gray-900 dark:hover:text-gray-200'}`}
        >
          <FileText size={16} /> Practice Tests
        </button>
      </div>

      {/* Main Content */}
      <main>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                  <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="w-full h-6 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 max-w-3xl">
            {error}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Found {filteredResults.length} free resources for <span className="font-semibold text-gray-900 dark:text-white">&quot;{query}&quot;</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((result, idx) => {
                const saved = isSaved(result.url);
                
                // Determine card accent color based on type
                const t = result.type.toLowerCase();
                let accentColor = 'bg-gray-500';
                let lightAccent = 'bg-gray-50 dark:bg-gray-900/20';
                let textAccent = 'text-gray-600 dark:text-gray-400';
                
                if (t.includes('video')) {
                  accentColor = 'bg-red-500';
                  lightAccent = 'bg-red-50 dark:bg-red-900/10';
                  textAccent = 'text-red-600 dark:text-red-400';
                } else if (t.includes('guide') || t.includes('book') || t.includes('course')) {
                  accentColor = 'bg-blue-500';
                  lightAccent = 'bg-blue-50 dark:bg-blue-900/10';
                  textAccent = 'text-blue-600 dark:text-blue-400';
                } else if (t.includes('exam') || t.includes('practice') || t.includes('test')) {
                  accentColor = 'bg-emerald-500';
                  lightAccent = 'bg-emerald-50 dark:bg-emerald-900/10';
                  textAccent = 'text-emerald-600 dark:text-emerald-400';
                } else if (t.includes('forum') || t.includes('community')) {
                  accentColor = 'bg-purple-500';
                  lightAccent = 'bg-purple-50 dark:bg-purple-900/10';
                  textAccent = 'text-purple-600 dark:text-purple-400';
                }

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx} 
                    className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group overflow-hidden relative"
                  >
                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${accentColor}`}></div>
                    
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${lightAccent} ${textAccent} text-xs font-bold uppercase tracking-wider`}>
                          {getTypeIcon(result.type)}
                          {result.type}
                        </div>
                        <button 
                          onClick={() => handleBookmark(result)}
                          disabled={saved}
                          className={`p-2 rounded-full transition-all ${saved ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 cursor-default' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 bg-gray-50 dark:bg-[#222]'}`}
                          title={saved ? "Saved to Tracker" : "Save to Tracker"}
                        >
                          {saved ? <Check size={18} /> : <BookmarkPlus size={18} />}
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                          {result.source.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{result.source}</span>
                      </div>

                      <a href={result.url} target="_blank" rel="noopener noreferrer" className="block flex-1 mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2 leading-tight">
                          {result.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                          {result.snippet}
                        </p>
                      </a>

                      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto flex items-center justify-between">
                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          Access Resource <ExternalLink size={14} />
                        </a>
                        {saved && <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">Saved</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredResults.length === 0 && !loading && !error && (
              <div className="text-center py-16 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800">
                <Search size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No resources found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  We couldn&apos;t find any free resources matching your search. Try adjusting your keywords or selecting a different tab.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <SearchResults />
    </Suspense>
  );
}
