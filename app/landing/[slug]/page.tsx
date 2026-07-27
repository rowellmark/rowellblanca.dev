import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DynamicLandingPageClient } from './dynamic-landing-client';

interface DynamicLandingPageProps {
  params: {
    slug: string;
  };
}

async function getLandingPageData(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/landing-pages?slug=${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success && data.page ? data.page : null;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: DynamicLandingPageProps): Promise<Metadata> {
  const page = await getLandingPageData(params.slug);
  const title = page?.metaTitle || page?.heroTitle || 'Hire Senior Full-Stack Software Engineer';
  const description = page?.metaDescription || page?.heroSubtitle || 'Bespoke web development and software engineering.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.rowellblanca.dev/landing/${params.slug}`,
    },
    alternates: {
      canonical: `https://www.rowellblanca.dev/landing/${params.slug}`,
    },
  };
}

export default async function DynamicLandingPage({ params }: DynamicLandingPageProps) {
  const page = await getLandingPageData(params.slug);

  if (!page) {
    return notFound();
  }

  return <DynamicLandingPageClient page={page} />;
}
