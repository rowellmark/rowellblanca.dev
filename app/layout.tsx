import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import LayoutShell from "@/components/layout/layout-shell";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { CookieBanner } from "@/components/ui/cookie-banner";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rowellblanca.dev"),
  title: {
    default: "Creative Software Engineer | Rowell Mark Blanca",
    template: "%s | Rowell Mark Blanca",
  },
  description:
    "Rowell Mark Blanca is a creative software engineer building scalable React and Next.js applications, custom WordPress platforms, and digital solutions that help businesses grow.",
  keywords: [
    "Rowell Mark Blanca",
    "Creative Software Engineer",
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
    title: "Creative Software Engineer | Rowell Mark Blanca",
    description:
      "Rowell Mark Blanca is a creative software engineer building scalable React and Next.js applications, custom WordPress platforms, and digital solutions that help businesses grow.",
    siteName: "Rowell Mark Blanca Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Software Engineer | Rowell Mark Blanca",
    description:
      "Rowell Mark Blanca is a creative software engineer building scalable React and Next.js applications, custom WordPress platforms, and digital solutions that help businesses grow.",
    creator: "@itsmrrowrow",
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.rowellblanca.dev/#person",
      name: "Rowell Mark Blanca",
      url: "https://www.rowellblanca.dev",
      jobTitle: "Creative Software Engineer",
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
      description: "Portfolio of Rowell Mark Blanca — Creative Software Engineer specializing in React, Next.js, & WordPress.",
      publisher: {
        "@id": "https://www.rowellblanca.dev/#person",
      },
    },
  ],
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
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


