import type { Metadata } from "next";
import React from "react";
import { UkLandingClient } from "./uk-landing-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rowellblanca.dev"),
  title: "Hire Senior React, Next.js & WordPress Developer UK | Rowell Mark Blanca",
  description:
    "Senior Full-Stack Engineer & WordPress Architect partnering with UK businesses & tech agencies. Proven results with UK clients like Towerfire and Macmanus. Full GMT/BST timezone overlap & GBP billing options.",
  keywords: [
    "Hire React Developer UK",
    "Next.js Engineer London",
    "WordPress Developer UK",
    "WordPress Architect UK",
    "Towerfire UK Client Developer",
    "Macmanus UK Client Developer",
    "Offshore React Engineer United Kingdom",
    "Headless CMS Developer UK",
    "Full-Stack Web Developer London",
  ],
  authors: [{ name: "Rowell Mark Blanca", url: "https://www.rowellblanca.dev" }],
  creator: "Rowell Mark Blanca",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.rowellblanca.dev/hire-uk-react-developer",
    title: "Hire Senior React, Next.js & WordPress Developer UK | Rowell Mark Blanca",
    description:
      "Senior Full-Stack Engineer & WordPress Architect partnering with UK businesses & agencies. Proven client results with Towerfire & Macmanus.",
    siteName: "Rowell Mark Blanca Portfolio",
    images: [
      {
        url: "https://www.rowellblanca.dev/opengraph-image1.jpg",
        width: 1200,
        height: 630,
        alt: "Hire Senior React, Next.js & WordPress Developer UK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Senior React, Next.js & WordPress Developer UK",
    description:
      "Senior Full-Stack Engineer & WordPress Architect partnering with UK businesses & agencies. Proven client results with Towerfire & Macmanus.",
    creator: "@itsmrrowrow",
  },
  alternates: {
    canonical: "https://www.rowellblanca.dev/hire-uk-react-developer",
    languages: {
      "en-GB": "https://www.rowellblanca.dev/hire-uk-react-developer",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://www.rowellblanca.dev/hire-uk-react-developer/#service",
      name: "Full-Stack React, Next.js & WordPress Engineering for UK Businesses",
      provider: {
        "@type": "Person",
        name: "Rowell Mark Blanca",
        url: "https://www.rowellblanca.dev",
        jobTitle: "Senior Full-Stack Software Engineer & WordPress Architect",
      },
      areaServed: {
        "@type": "Country",
        name: "United Kingdom",
        identifier: "GB",
      },
      serviceType: "Software Engineering & Custom Web Development",
      description:
        "High-performance React applications, Next.js 14 platforms, custom WordPress plugin & theme architecture, and API engineering for UK companies.",
      termsOfService: "https://www.rowellblanca.dev/contact",
    },
    {
      "@type": "WebPage",
      "@id": "https://www.rowellblanca.dev/hire-uk-react-developer/#webpage",
      url: "https://www.rowellblanca.dev/hire-uk-react-developer",
      name: "Hire Senior React, Next.js & WordPress Developer UK",
      isPartOf: {
        "@id": "https://www.rowellblanca.dev/#website",
      },
      about: [
        { "@type": "Thing", name: "Towerfire UK" },
        { "@type": "Thing", name: "Macmanus UK" },
        { "@type": "Thing", name: "React Development UK" },
        { "@type": "Thing", name: "WordPress Engineering UK" },
      ],
    },
  ],
};

export default function UkDeveloperPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UkLandingClient />
    </>
  );
}
