import type { Metadata } from "next";
import React from "react";
import { UkWpLandingClient } from "./uk-wp-client";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/hire-uk-wordpress-developer",
  title: "Hire a WordPress Developer in the UK",
  description:
    "Senior WordPress developer for UK businesses and agencies: custom Gutenberg themes, plugins, WooCommerce and speed fixes. GMT/BST overlap and GBP billing.",
  keywords: ["hire WordPress developer UK", "freelance WordPress developer UK", "custom Gutenberg development", "WordPress plugin developer UK", "WooCommerce developer UK"],
});

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
