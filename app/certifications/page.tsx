'use client';

import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Shield, Cloud, Network, Database, Code, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';

const categories = [
  {
    name: "Cybersecurity",
    icon: <Shield size={20} />,
    certs: [
      "CompTIA Security+", "CISSP", "CISM", "CEH (Certified Ethical Hacker)", 
      "CISA", "CompTIA CySA+", "CompTIA PenTest+", "GIAC Security Essentials (GSEC)",
      "Offensive Security Certified Professional (OSCP)", "CCSP"
    ]
  },
  {
    name: "Cloud Computing",
    icon: <Cloud size={20} />,
    certs: [
      "AWS Certified Solutions Architect - Associate", "AWS Certified Cloud Practitioner",
      "AWS Certified Developer - Associate", "AWS Certified SysOps Administrator",
      "Microsoft Certified: Azure Fundamentals", "Microsoft Certified: Azure Administrator Associate",
      "Google Cloud Associate Cloud Engineer", "Google Cloud Professional Cloud Architect",
      "CompTIA Cloud+", "Certified Kubernetes Administrator (CKA)"
    ]
  },
  {
    name: "Networking",
    icon: <Network size={20} />,
    certs: [
      "Cisco CCNA", "Cisco CCNP Enterprise", "CompTIA Network+", "Juniper JNCIA-Junos",
      "Aruba Certified Mobility Associate (ACMA)", "Wireshark Certified Network Analyst (WCNA)"
    ]
  },
  {
    name: "IT Support & Infrastructure",
    icon: <Database size={20} />,
    certs: [
      "CompTIA A+", "CompTIA Server+", "CompTIA Linux+", "ITIL 4 Foundation",
      "Apple Certified Support Professional (ACSP)", "Red Hat Certified System Administrator (RHCSA)",
      "LPI Linux Essentials"
    ]
  },
  {
    name: "Development & DevOps",
    icon: <Code size={20} />,
    certs: [
      "Certified Kubernetes Application Developer (CKAD)", "Docker Certified Associate (DCA)",
      "HashiCorp Certified: Terraform Associate", "Certified Jenkins Engineer",
      "Oracle Certified Professional: Java SE 11 Developer", "Python Institute PCAP"
    ]
  },
  {
    name: "Project Management & Agile",
    icon: <Briefcase size={20} />,
    certs: [
      "PMP (Project Management Professional)", "CAPM (Certified Associate in Project Management)",
      "Certified ScrumMaster (CSM)", "PMI-ACP (Agile Certified Practitioner)",
      "CompTIA Project+", "PRINCE2 Foundation"
    ]
  }
];

export default function CertificationsPage() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const handleCertClick = (cert: string) => {
    if (!isSignedIn) {
      openSignIn();
    } else {
      router.push(`/search?q=${encodeURIComponent(cert)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">All Certifications</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Browse our comprehensive list of over 50+ IT certifications. Find the perfect certification to advance your career.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Filter certifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-16">
          {categories.map((category) => {
            const filteredCerts = category.certs.filter(c => c.toLowerCase().includes(search.toLowerCase()));
            
            if (filteredCerts.length === 0) return null;

            return (
              <div key={category.name}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{category.name}</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCerts.map((cert) => (
                    <button
                      key={cert}
                      onClick={() => handleCertClick(cert)}
                      className="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-left"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {cert}
                      </span>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
