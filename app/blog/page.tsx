import type { Metadata } from 'next';
import React from 'react';
import { BlogClient } from './blog-client';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.rowellblanca.dev'),
  title: 'Technical Blog & Engineering Insights | Rowell Mark Blanca',
  description:
    'Deep dives into React, Next.js 14 App Router, Custom WordPress Architecture, FinTech case studies, and AI RAG Plugin engineering by Senior Full-Stack Engineer Rowell Mark Blanca.',
  keywords: [
    'Rowell Mark Blanca Blog',
    'Next.js 14 Architecture',
    'WordPress Developer Blog',
    'Custom Gutenberg Engineering',
    'FinTech Software Case Studies',
    'AI RAG Plugin WordPress',
  ],
  openGraph: {
    type: 'website',
    url: 'https://www.rowellblanca.dev/blog',
    title: 'Technical Blog & Engineering Insights | Rowell Mark Blanca',
    description:
      'Explore articles on full-stack web architecture, bespoke WordPress engines, and enterprise software engineering.',
    siteName: 'Rowell Mark Blanca Portfolio',
  },
};

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
