import type { Metadata } from "next";
import React from "react";
import { UkLandingClient } from "./uk-landing-client";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/hire-uk-react-developer",
  title: "Hire a React & Next.js Developer in the UK",
  description:
    "Senior React and Next.js developer for UK businesses and agencies: web apps, SaaS portals and headless builds, with GMT/BST overlap and GBP billing.",
  keywords: ["hire React developer UK", "hire Next.js developer UK", "freelance React developer UK", "Next.js developer London", "headless CMS developer UK"],
});

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
