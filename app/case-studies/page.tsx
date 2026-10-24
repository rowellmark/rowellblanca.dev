import type { Metadata } from 'next';
import React from 'react';
import { CaseStudiesClient } from './case-studies-client';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: "/case-studies",
  title: "Case Studies: Web Apps & WordPress Builds",
  description:
    "Case studies of production builds: FCA-regulated finance portals, SaaS platforms, luxury real estate sites and WordPress plugins, with stack and results.",
  keywords: ["web development case studies", "Next.js case study", "WordPress case study", "finance portal development"],
});

const caseStudiesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://www.rowellblanca.dev/case-studies/#collection',
  url: 'https://www.rowellblanca.dev/case-studies',
  name: 'Production Case Studies & Targeted Solutions | Rowell Mark Blanca',
  description:
    'Explore production case studies, targeted SEO service landing pages, and technical engineering solutions built for UK and global enterprises.',
  publisher: {
    '@type': 'Person',
    name: 'Rowell Mark Blanca',
    url: 'https://www.rowellblanca.dev',
  },
  inLanguage: 'en-GB',
};

export default function CaseStudiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudiesJsonLd) }}
      />
      <CaseStudiesClient />
    </>
  );
}
