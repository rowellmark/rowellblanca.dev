import type { Metadata } from 'next';
import React from 'react';
import { CaseStudiesClient } from './case-studies-client';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.rowellblanca.dev'),
  title: 'Production Case Studies & Targeted Solutions | Rowell Mark Blanca',
  description:
    'Explore production case studies, targeted SEO service landing pages, and technical engineering solutions built for UK and global enterprises.',
  keywords: [
    'Rowell Mark Blanca Case Studies',
    'React Case Studies UK',
    'WordPress Case Studies UK',
    'FinTech Web App Architecture',
    'Specialized Software Solutions',
    'Senior Developer Portfolio',
  ],
  openGraph: {
    type: 'website',
    url: 'https://www.rowellblanca.dev/case-studies',
    title: 'Production Case Studies & Targeted Solutions | Rowell Mark Blanca',
    description:
      'Explore production case studies, targeted SEO service landing pages, and technical engineering solutions.',
    siteName: 'Rowell Mark Blanca Portfolio',
  },
  alternates: {
    canonical: 'https://www.rowellblanca.dev/case-studies',
  },
};

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
