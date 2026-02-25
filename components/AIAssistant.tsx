'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Loader2, ChevronDown, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { useCertStore } from '@/lib/store';

export default function AIAssistant() {
  const { isProLocal, openProModal } = useCertStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: "Hi! I'm your AI Study Advisor. Ask me about any IT certification, request a personalized study plan, or let me help you find more resources!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('ai_date');
    const storedCount = localStorage.getItem('ai_count');
    
    let count = 0;
    if (storedDate === today && storedCount) {
      count = parseInt(storedCount, 10);
    } else {
      localStorage.setItem('ai_date', today);
      localStorage.setItem('ai_count', '0');
    }
    
    const limit = isProLocal ? 20 : 5;
    setRemainingMessages(Math.max(0, limit - count));
  }, [isProLocal, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || remainingMessages <= 0) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, isPro: isProLocal }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      
      const newCount = (isProLocal ? 20 : 5) - remainingMessages + 1;
      localStorage.setItem('ai_count', newCount.toString());
      setRemainingMessages(prev => prev - 1);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the server. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center gap-3 transition-all hover:scale-105 z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={24} />
        <span className="font-bold hidden sm:block">AI Study Advisor</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] max-w-[calc(100vw-3rem)] bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col z-50 overflow-hidden"
          >
            <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold">AI Study Advisor</h3>
                  <p className="text-xs text-blue-100">Online and ready to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors p-2">
                <ChevronDown size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0a0a0a]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm'}`}>
                    {msg.role === 'model' ? (
                      <div className="markdown-body prose prose-sm dark:prose-invert max-w-none">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2">
              {remainingMessages <= 0 ? (
                <div className="text-center p-3 bg-gray-50 dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">You&apos;ve reached your daily message limit.</p>
                  {!isProLocal && (
                    <button onClick={openProModal} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 w-full">
                      <Lock size={14} /> Upgrade to Pro for more
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about a cert or study plan..."
                      className="flex-1 bg-gray-100 dark:bg-[#0a0a0a] border border-transparent focus:border-blue-500 dark:focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none text-gray-900 dark:text-white transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                    >
                      <Send size={18} className={input.trim() && !isLoading ? 'translate-x-0.5 -translate-y-0.5 transition-transform' : ''} />
                    </button>
                  </form>
                  <div className="text-xs text-center text-gray-500">
                    {remainingMessages} messages remaining today
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
