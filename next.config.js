const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Google Search Console HTML-file verification: /googleXXXX.html -> API route.
    return [{ source: '/:file(google[^/]*\\.html)', destination: '/api/google-verification/:file' }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'cm2ehglniq10uctr.public.blob.vercel-storage.com',
      },
    ],
  },
};

module.exports = nextConfig;
