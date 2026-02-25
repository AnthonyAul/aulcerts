import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-[#0a0a0a] py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#111]/50">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Terms of Service</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="p-8 sm:p-12 prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500">
            <p>
              By viewing or using this website, which can be accessed at aulcerts.com, you are agreeing to be bound by these website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.
            </p>

            <h2>1. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on AulCerts&apos;s Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose or for any public display;</li>
              <li>attempt to reverse engineer any software contained on AulCerts&apos;s Website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transferring the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
            </ul>
            <p>
              This will let AulCerts to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format.
            </p>

            <h2>2. Disclaimer</h2>
            <p>
              All the materials on AulCerts&apos;s Website are provided &quot;as is&quot;. AulCerts makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, AulCerts does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.
            </p>

            <h2>3. Limitations</h2>
            <p>
              AulCerts or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on AulCerts&apos;s Website, even if AulCerts or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.
            </p>

            <h2>4. Revisions and Errata</h2>
            <p>
              The materials appearing on AulCerts&apos;s Website may include technical, typographical, or photographic errors. AulCerts will not promise that any of the materials in this Website are accurate, complete, or current. AulCerts may change the materials contained on its Website at any time without notice. AulCerts does not make any commitment to update the materials.
            </p>

            <h2>5. Links</h2>
            <p>
              AulCerts has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by AulCerts of the site. The use of any linked website is at the user&apos;s own risk.
            </p>

            <h2>6. Site Terms of Use Modifications</h2>
            <p>
              AulCerts may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.
            </p>

            <h2>7. Governing Law</h2>
            <p>
              Any claim related to AulCerts&apos;s Website shall be governed by the laws of our jurisdiction without regards to its conflict of law provisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
