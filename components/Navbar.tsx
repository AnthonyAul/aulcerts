'use client';
import Link from 'next/link';
import { useCertStore } from '@/lib/store';
import { LayoutDashboard, Lock, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';

export default function Navbar() {
  const { isLoaded: isStoreLoaded, isProModalOpen, closeProModal, upgradeToProLocal, init } = useCertStore();
  const { isSignedIn, user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'STRIPE_SUCCESS') {
        try {
          const res = await fetch(`/api/stripe/verify?session_id=${event.data.sessionId}`);
          const data = await res.json();
          if (data.paymentStatus === 'paid') {
            upgradeToProLocal();
          }
        } catch (e) {
          console.error('Failed to verify payment', e);
        }
        closeProModal();
        setIsProcessingPayment(false);
      } else if (event.data?.type === 'STRIPE_CANCEL') {
        setIsProcessingPayment(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [upgradeToProLocal, closeProModal]);

  if (!isStoreLoaded || !isClerkLoaded) return <div className="h-16 border-b border-gray-100 dark:border-gray-800"></div>;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* BRANDING: Updated Logo here! */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-8 h-8 drop-shadow-sm group-hover:scale-105 transition-transform duration-200">
                <path fill="#2563eb" d="M256 32l192 48v176c0 148.6-80.4 213.6-192 256-111.6-42.4-192-107.4-192-256V80l192-48z"/>
                <path fill="#ffffff" d="M256 136L150 380h60l24-64h100l16 64h60L312 136h-56zm-24 128l32-88 24 88h-56z"/>
                <circle cx="370" cy="360" r="80" fill="#10b981" stroke="#2563eb" strokeWidth="16"/>
                <path fill="none" stroke="#ffffff" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" d="M330 360l25 25 50-50"/>
              </svg>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">AulCerts</span>
            </Link>
            
            <div className="flex items-center gap-4 sm:gap-6">
              {isSignedIn ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 text-sm font-bold transition-colors">
                    <LayoutDashboard size={18} /> <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <UserButton afterSignOutUrl="/" /> 
                </>
              ) : (
                <SignInButton mode="modal">
                  <button className="bg-gray-900 hover:bg-blue-600 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Pro Upgrade Modal */}
      {isProModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Special Offer
            </div>
            
            {/* BRANDING: Updated Logo here too! */}
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-16 h-16 drop-shadow-md">
                <path fill="#2563eb" d="M256 32l192 48v176c0 148.6-80.4 213.6-192 256-111.6-42.4-192-107.4-192-256V80l192-48z"/>
                <path fill="#ffffff" d="M256 136L150 380h60l24-64h100l16 64h60L312 136h-56zm-24 128l32-88 24 88h-56z"/>
                <circle cx="370" cy="360" r="80" fill="#10b981" stroke="#2563eb" strokeWidth="16"/>
                <path fill="none" stroke="#ffffff" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" d="M330 360l25 25 50-50"/>
              </svg>
            </div>

            <h2 className="text-2xl font-extrabold mb-2 text-gray-900 dark:text-white">Upgrade to Pro</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Unlock unlimited certification tracking, priority AI features, and more for just $5/month.
            </p>
            
            <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-xl p-4 mb-8 text-left border border-gray-200 dark:border-gray-800">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Track unlimited certifications
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Priority AI response times
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Export syllabus to PDF/Notion
                </li>
              </ul>
            </div>

            {isProcessingPayment ? (
              <div className="py-4 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Processing payment securely...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
               <button 
                  onClick={async () => {
                    if (!isSignedIn) {
                      alert("Please sign in first!");
                      return;
                    }
                    setIsProcessingPayment(true);
                    try {
                      const res = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: clerkUser?.primaryEmailAddress?.emailAddress }), 
                      });
                      const data = await res.json();
                      if (data.url) {
                        // Redirects the current tab, allowing Apple Pay & Google Pay to work natively
                        window.location.href = data.url;
                      } else {
                        throw new Error(data.error || 'Failed to create checkout session');
                      }
                    } catch (error) {
                      console.error(error);
                      alert('Failed to initiate payment. Please ensure Stripe is configured.');
                      setIsProcessingPayment(false);
                    }
                  }} 
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Lock size={16} /> Pay $5.00 / month
                </button>
                <button onClick={closeProModal} className="w-full py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
                  Continue with Free Plan
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-4">Secure payment powered by Stripe. Cancel anytime.</p>
          </div>
        </div>
      )}
    </>
  );
}
