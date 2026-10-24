import type { Metadata } from 'next';
import React from 'react';
import { BlogClient } from './blog-client';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: "/blog",
  title: "Next.js & WordPress Development Blog",
  description:
    "Practical articles on Next.js performance, custom WordPress and Gutenberg development, AI chatbots and finance portals, drawn from real client projects.",
  keywords: ["Next.js blog", "WordPress development blog", "Gutenberg blocks", "Core Web Vitals", "RAG chatbot WordPress"],
});

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': 'https://www.rowellblanca.dev/blog/#blog',
  url: 'https://www.rowellblanca.dev/blog',
  name: 'Technical Blog & Engineering Insights | Rowell Mark Blanca',
  description:
    'Deep dives into React, Next.js 14 App Router, Custom WordPress Architecture, FinTech case studies, and AI RAG Plugin engineering by Senior Full-Stack Engineer Rowell Mark Blanca.',
  publisher: {
    '@type': 'Person',
    name: 'Rowell Mark Blanca',
    url: 'https://www.rowellblanca.dev',
  },
  inLanguage: 'en-GB',
};

export default function BlogHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogClient />
    </>
  );
}
