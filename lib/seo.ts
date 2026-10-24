import type { Metadata } from 'next';

export const SITE_URL = 'https://www.rowellblanca.dev';
export const DEFAULT_AUTHOR = 'Rowell Mark Blanca';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

/**
 * A full page title that fits Google's ~60 character display: appends the
 * longest brand suffix that still fits (or none). Returned as `absolute` so the
 * root layout's "%s | Rowell Mark Blanca" template doesn't add the name twice.
 */
export function seoTitle(main: string, max = 60): { absolute: string } {
  for (const suffix of [' | Rowell Mark Blanca', ' | Rowell Blanca', '']) {
    if ((main + suffix).length <= max) return { absolute: main + suffix };
  }
  return { absolute: main };
}

/** Meta description trimmed to ~155 characters at a word boundary. */
export function seoDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:—–-]+$/, '')}…`;
}

export interface CaseStudySeoProps {
  title: string;
  description: string;
  permalink: string;
  image?: string;
  publishedAt?: string;
  category?: string;
  technologies?: string[];
}

/**
 * Generates Next.js 14 App Router Metadata object for Case Studies & Blog Posts
 */
export function generateCaseStudyMetadata({
  title,
  description,
  permalink,
  image,
  publishedAt,
  category,
  technologies = [],
}: CaseStudySeoProps): Metadata {
  const url = `${SITE_URL}/mywork/${permalink}`;
  const ogImageUrl = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}/${image.replace(/^\/+/, '')}`
    : `${SITE_URL}/og-default.jpg`;

  // Keep "— Case Study" only when it still fits Google's ~60 character title.
  const pageTitle = seoTitle(`${title} — Case Study`.length <= 60 ? `${title} — Case Study` : title);
  const metaTitle = pageTitle.absolute;
  const metaDescription = seoDescription(
    description || `Explore the architecture, technical breakdown, and key metrics for ${title} built by ${DEFAULT_AUTHOR}.`
  );

  return {
    metadataBase: new URL(SITE_URL),
    title: pageTitle,
    description: metaDescription,
    keywords: [
      title,
      category || 'Case Study',
      ...technologies,
      'Full-Stack Case Study',
      'Rowell Mark Blanca',
      'React Next.js Portfolio',
      'WordPress Developer UK',
      'UK Web Engineering',
    ],
    authors: [{ name: DEFAULT_AUTHOR, url: SITE_URL }],
    creator: DEFAULT_AUTHOR,
    publisher: DEFAULT_AUTHOR,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url,
      siteName: 'Rowell Mark Blanca Portfolio',
      locale: 'en_GB',
      type: 'article',
      publishedTime: publishedAt || new Date().toISOString(),
      authors: [DEFAULT_AUTHOR],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} Case Study Preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      creator: '@its_mr_row',
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

/**
 * Generates Schema.org JSON-LD Structured Data for Case Study Articles
 */
export function generateCaseStudyJsonLd({
  title,
  description,
  permalink,
  image,
  publishedAt,
  category,
  technologies = [],
}: CaseStudySeoProps) {
  const url = `${SITE_URL}/mywork/${permalink}`;
  const ogImageUrl = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}/${image.replace(/^\/+/, '')}`
    : `${SITE_URL}/og-default.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: description,
    url: url,
    image: [ogImageUrl],
    datePublished: publishedAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: DEFAULT_AUTHOR,
      url: SITE_URL,
      jobTitle: 'Senior Full-Stack Software Engineer',
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_AUTHOR,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.png`,
      },
    },
    articleSection: category || 'Web Development',
    keywords: technologies.join(', '),
  };
}

export interface TestimonialSchemaItem {
  id?: number;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  rating?: number;
}

/**
 * Generates Schema.org JSON-LD Structured Data for Client Testimonials & Star Ratings
 */
export function generateTestimonialsJsonLd(testimonials: TestimonialSchemaItem[]) {
  if (!testimonials || testimonials.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Rowell Mark Blanca - Senior Software Engineering Services',
    url: SITE_URL,
    image: `${SITE_URL}/og-default.jpg`,
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: testimonials.length.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: t.name,
        jobTitle: t.role || undefined,
        worksFor: t.company ? { '@type': 'Organization', name: t.company } : undefined,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: (t.rating || 5).toString(),
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: t.quote,
    })),
  };
}

interface PageMetadataProps {
  /** Route path, e.g. "/about". */
  path: string;
  /** Page title without the brand; the brand suffix is added when it fits. */
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
}

/** Standard metadata for a public page: length-safe title/description, canonical, OG/Twitter cards. */
export function pageMetadata({ path, title, description, keywords, image = DEFAULT_OG_IMAGE, type = 'website' }: PageMetadataProps): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  const fullTitle = seoTitle(title);
  const desc = seoDescription(description);
  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description: desc,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: fullTitle.absolute,
      description: desc,
      siteName: 'Rowell Mark Blanca',
      locale: 'en_GB',
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle.absolute }],
    },
    twitter: { card: 'summary_large_image', title: fullTitle.absolute, description: desc, images: [image] },
  };
}
