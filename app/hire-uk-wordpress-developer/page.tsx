import type { Metadata } from "next";
import React from "react";
import { UkWpLandingClient } from "./uk-wp-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rowellblanca.dev"),
  title: "Hire Senior WordPress Developer & Architect UK | Rowell Mark Blanca",
  description:
    "Senior WordPress Developer & Architect partnering with UK businesses, agencies, and e-commerce brands. Custom WordPress themes, plugins, Headless WP + Next.js, and Core Web Vitals tuning. Full GMT/BST overlap.",
  keywords: [
    "Hire WordPress Developer UK",
    "WordPress Architect London",
    "Custom WordPress Theme Developer UK",
    "Headless WordPress Next.js UK",
    "WooCommerce Developer UK",
    "Freelance WordPress Engineer United Kingdom",
    "Towerfire UK Client Developer",
    "Macmanus UK Client Developer",
  ],
  authors: [{ name: "Rowell Mark Blanca", url: "https://www.rowellblanca.dev" }],
  creator: "Rowell Mark Blanca",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.rowellblanca.dev/hire-uk-wordpress-developer",
    title: "Hire Senior WordPress Developer & Architect UK | Rowell Mark Blanca",
    description:
      "Senior WordPress Developer & Architect partnering with UK companies. Bespoke themes, plugins, Headless WP, and performance optimization. Proven UK client results with Towerfire & Macmanus.",
    siteName: "Rowell Mark Blanca Portfolio",
    images: [
      {
        url: "https://www.rowellblanca.dev/opengraph-image1.jpg",
        width: 1200,
        height: 630,
        alt: "Hire Senior WordPress Developer & Architect UK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Senior WordPress Developer & Architect UK",
    description:
      "Senior WordPress Developer & Architect partnering with UK companies. Bespoke themes, plugins, Headless WP, and performance optimization.",
    creator: "@itsmrrowrow",
  },
  alternates: {
    canonical: "https://www.rowellblanca.dev/hire-uk-wordpress-developer",
    languages: {
      "en-GB": "https://www.rowellblanca.dev/hire-uk-wordpress-developer",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://www.rowellblanca.dev/hire-uk-wordpress-developer/#service",
      name: "Custom WordPress Engineering & Architecture for UK Businesses",
      provider: {
        "@type": "Person",
        name: "Rowell Mark Blanca",
        url: "https://www.rowellblanca.dev",
        jobTitle: "Senior WordPress Architect & Full-Stack Engineer",
      },
      areaServed: {
        "@type": "Country",
        name: "United Kingdom",
        identifier: "GB",
      },
      serviceType: "Custom WordPress Development & Headless CMS Architecture",
      description:
        "Custom WordPress themes, bespoke plugin engineering, WooCommerce setup, Headless WP + Next.js frontend, and Core Web Vitals speed optimization for UK companies.",
      termsOfService: "https://www.rowellblanca.dev/contact",
    },
    {
      "@type": "WebPage",
      "@id": "https://www.rowellblanca.dev/hire-uk-wordpress-developer/#webpage",
      url: "https://www.rowellblanca.dev/hire-uk-wordpress-developer",
      name: "Hire Senior WordPress Developer & Architect UK",
      isPartOf: {
        "@id": "https://www.rowellblanca.dev/#website",
      },
      about: [
        { "@type": "Thing", name: "WordPress Development UK" },
        { "@type": "Thing", name: "Headless WordPress UK" },
        { "@type": "Thing", name: "Towerfire UK" },
        { "@type": "Thing", name: "Macmanus UK" },
      ],
    },
  ],
};

export default function UkWordPressDeveloperPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UkWpLandingClient />
    </>
  );
}
