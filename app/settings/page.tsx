'use client';

import { useState, useEffect, Suspense } from 'react';
import { useCertStore } from '@/lib/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Briefcase, Target, CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  // Pull our UI flags from the local store
  const { isProLocal, openProModal, upgradeToProLocal } = useCertStore();
  // Pull the REAL user securely from Clerk
  const { user, isLoaded: isClerkLoaded } = useUser();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [name, setName] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [desiredRole, setDesiredRole] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);

useEffect(() => {
    if (isClerkLoaded && !user) {
      router.push('/');
    } else if (user) {
      setName(user.fullName || '');
      
      // Fetch the roles from our Postgres DB!
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data) {
            setCurrentRole(data.currentRole || '');
            setDesiredRole(data.desiredRole || '');
          }
        })
        .catch(err => console.error("Failed to load profile", err));
    }
  }, [user, isClerkLoaded, router]);

  useEffect(() => {
    const verifyStripeSession = async (sessionId: string) => {
      try {
        setIsProcessingStripe(true);
        const res = await fetch(`/api/stripe/verify?session_id=${sessionId}`);
        const data = await res.json();
        
        if (data.paymentStatus === 'paid') {
          upgradeToProLocal();
          setMessage({ type: 'success', text: 'Successfully upgraded to Pro!' });
          // Clean up URL
          router.replace('/settings');
        } else {
          setMessage({ type: 'error', text: 'Payment verification failed.' });
        }
      } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'An error occurred while verifying payment.' });
      } finally {
        setIsProcessingStripe(false);
      }
    };

    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success && sessionId && !isProLocal) {
      verifyStripeSession(sessionId);
    } else if (canceled) {
      setMessage({ type: 'error', text: 'Payment was canceled.' });
    }
  }, [searchParams, isProLocal, router, upgradeToProLocal]);

const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // 1. Safely update the user's name in Clerk
      await user?.update({
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
      });

      // 2. Save the roles to our Postgres database
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRole, desiredRole })
      });

      setIsSaving(false);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setIsSaving(false);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleManageSubscription = async () => {
    setIsProcessingStripe(true);
    setMessage(null);

    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      
      const data = await res.json();
      
      if (data.url) {
        // Instantly redirect the user to their secure Stripe portal
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to load portal');
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Could not open subscription portal. Please contact support.' });
    } finally {
      setIsProcessingStripe(false);
    }
  };

  if (!isClerkLoaded || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-[#0a0a0a] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Account Settings</h1>

        {message && (
          <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
          <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Profile Information</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Update your personal details and career goals.</p>
          </div>
          
          <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input 
                type="email" 
                value={user?.primaryEmailAddress?.emailAddress || ''} 
                disabled 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-[#111] text-gray-500 dark:text-gray-500 cursor-not-allowed font-medium"
              />
              <p className="text-xs text-gray-500 mt-2">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Current Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Briefcase size={18} />
                </div>
                <input 
                  type="text" 
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Help Desk Technician"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Desired Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Target size={18} />
                </div>
                <input 
                  type="text" 
                  value={desiredRole}
                  onChange={(e) => setDesiredRole(e.target.value)}
                  placeholder="e.g. Cloud Architect"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Subscription</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your billing and plan.</p>
            </div>
            {isProLocal ? (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">Pro Plan</span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-full text-xs font-bold uppercase tracking-wider">Free Plan</span>
            )}
          </div>
          
          <div className="p-6 sm:p-8">
            {isProLocal ? (
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  You are currently subscribed to the Pro plan. You have access to unlimited certification tracking and priority AI features.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Note:</strong> If you cancel your subscription, you will still be able to use the Pro features until the end of your current billing cycle.
                  </p>
                </div>
                <button 
                  onClick={handleManageSubscription}
                  disabled={isProcessingStripe}
                  className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-[#222] transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isProcessingStripe ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                  Manage Subscription
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Upgrade to Pro to track unlimited certifications, get priority AI responses, and export your custom syllabus.
                </p>
                <button 
                  onClick={() => openProModal()}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Upgrade to Pro - $5/mo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
