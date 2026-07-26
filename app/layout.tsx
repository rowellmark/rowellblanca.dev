import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import LayoutShell from "@/components/layout/layout-shell";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { prisma } from "@/lib/prisma";

const DEFAULT_TITLE = "Full-Stack Software Engineer | Rowell Mark Blanca";
const DEFAULT_DESCRIPTION =
  "Rowell Mark Blanca is a full-stack software engineer building scalable React and Next.js applications, custom WordPress platforms, and digital solutions that help businesses grow.";

async function getSiteSettings() {
  const settings = { googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '', metaTitle: '', metaDescription: '', ogImage: '' };
  try {
    const rows = await (prisma as any).setting.findMany();
    if (Array.isArray(rows)) {
      const map = new Map(rows.map((s: { key: string; value: string }) => [s.key, s.value]));
      if (map.get('google_verification')) settings.googleVerification = map.get('google_verification') as string;
      if (map.get('meta_title')) settings.metaTitle = map.get('meta_title') as string;
      if (map.get('meta_description')) settings.metaDescription = map.get('meta_description') as string;
      if (map.get('og_image')) settings.ogImage = map.get('og_image') as string;
    }
  } catch {}

  if (settings.googleVerification.includes('content=')) {
    const match = settings.googleVerification.match(/content=["']([^"']+)["']/);
    if (match && match[1]) settings.googleVerification = match[1];
  }
  settings.googleVerification = settings.googleVerification.trim();

  return settings;
}

export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle, metaDescription, ogImage, googleVerification } = await getSiteSettings();

  const title = metaTitle || DEFAULT_TITLE;
  const description = metaDescription || DEFAULT_DESCRIPTION;

  return {
    metadataBase: new URL("https://www.rowellblanca.dev"),
    title: {
      default: title,
      template: "%s | Rowell Mark Blanca",
    },
    description,
    keywords: [
      "Rowell Mark Blanca",
      "Full-Stack Software Engineer",
      "Software Engineer Philippines",
      "React Developer",
      "Next.js Developer",
      "WordPress Architect",
      "Frontend Engineer",
      "Node.js Developer",
      "Full-Stack Engineer",
    ],
    authors: [{ name: "Rowell Mark Blanca", url: "https://www.rowellblanca.dev" }],
    creator: "Rowell Mark Blanca",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://www.rowellblanca.dev",
      title,
      description,
      siteName: "Rowell Mark Blanca Portfolio",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@itsmrrowrow",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "https://www.rowellblanca.dev",
    },
    verification: {
      google: googleVerification,
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.rowellblanca.dev/#person",
      name: "Rowell Mark Blanca",
      url: "https://www.rowellblanca.dev",
      jobTitle: "Full-Stack Software Engineer",
      sameAs: [
        "https://github.com/rowellmark",
        "https://www.linkedin.com/in/rowell-blanca/",
        "https://www.facebook.com/itsmrrowrow",
        "https://www.instagram.com/its.mr.row/",
      ],
      knowsAbout: [
        "Software Engineering",
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "PHP",
        "WordPress",
        "Tailwind CSS",
        "AI Integrations",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.rowellblanca.dev/#website",
      url: "https://www.rowellblanca.dev",
      name: "Rowell Mark Blanca Portfolio",
      description: "Portfolio of Rowell Mark Blanca — Full-Stack Software Engineer specializing in React, Next.js, & WordPress.",
      publisher: {
        "@id": "https://www.rowellblanca.dev/#person",
      },
    },
  ],
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GoogleAnalytics />
      </head>
      <body className="bg-brand-bg text-brand-navy antialiased">
        <LayoutShell>{children}</LayoutShell>
        <CookieBanner />
      </body>
    </html>
  );
}


