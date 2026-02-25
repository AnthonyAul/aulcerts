import type { NextConfig } from "next";

// We define the CSP as a variable to keep it clean and readable.
// This allows Clerk and Stripe to function while locking out malicious scripts.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.aulcerts.com https://*.clerk.com https://js.stripe.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self' https://js.stripe.com https://*.clerk.com https://challenges.cloudflare.com;
  connect-src 'self' https://*.clerk.com https://clerk.aulcerts.com https://api.stripe.com;
  worker-src 'self' blob:; 
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  // Removes the 'X-Powered-By: Next.js' header
  poweredByHeader: false,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            // Fixes the HSTS Medium Severity Issue
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // Fixes the Permissions-Policy missing header
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          {
            // Fixes the Server Information Disclosure (overrides "server: Vercel")
            key: 'Server',
            value: 'AulCerts',
          },
          {
            // Fixes the CSP Base URI, Object-src, and Script-src issues
            key: 'Content-Security-Policy',
            value: cspHeader,
          }
        ],
      },
    ];
  },
};

export default nextConfig;
