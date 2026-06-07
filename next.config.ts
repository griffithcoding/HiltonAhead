import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/photos/**' },
    ],
  },
  async rewrites() {
    const rewrites: Array<{ source: string; destination: string }> = [];

    // Google Search Console HTML-file verification.
    // Token lives only in env var (GOOGLE_SITE_VERIFICATION_FILE), never in git.
    // Set it in Vercel project env vars to the filename Google gave you,
    // e.g. `google741f91a51ccaff7d` (no extension). The rewrite will serve
    // the canonical content at /<token>.html.
    const gsvToken = process.env.GOOGLE_SITE_VERIFICATION_FILE;
    if (gsvToken) {
      rewrites.push({
        source: `/${gsvToken}.html`,
        destination: '/api/google-site-verification',
      });
    }

    return rewrites;
  },
  async redirects() {
    return [
      // Cannibalization cleanup: /blog/best-time-to-visit-hilton-head and
      // /best-time-to-visit-hilton-head were two pages targeting the same
      // primary keyword. The top-level URL is the canonical (matches the
      // site nav, footer, and sitemap convention); the blog post 301s in.
      {
        source: '/blog/best-time-to-visit-hilton-head',
        destination: '/best-time-to-visit-hilton-head',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
