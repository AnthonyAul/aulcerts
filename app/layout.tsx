import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'AulCerts',
  description: 'Find free study guides, videos, and practice exams for IT certifications. Track your progress.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#2563eb', // Matches your Tailwind blue-600
          colorText: '#111827', // Matches gray-900
          colorBackground: '#ffffff',
          borderRadius: '0.75rem', // Matches your rounded-xl
        },
        elements: {
          card: 'shadow-xl border border-gray-200 rounded-2xl',
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm',
          footerActionLink: 'text-blue-600 hover:text-blue-700 font-bold',
        }
      }}
    >
      <html lang="en" className={inter.variable}>
        <body className="font-sans antialiased bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 min-h-screen flex flex-col" suppressHydrationWarning>
          <Navbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
          <AIAssistant />
        </body>
      </html>
    </ClerkProvider>
  );
}
