import { Metadata } from "next";
import { ContactPageClient } from "./contact-page-client";
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact — Hire a Next.js & WordPress Developer",
  description:
    "Book a free discovery call or send a project brief. Senior Next.js, React and WordPress developer for UK, US and Australian teams. Replies within 24h.",
  keywords: ["hire Next.js developer", "hire WordPress developer", "freelance developer UK", "contact"],
});

const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://www.rowellblanca.dev/contact/#contact",
    url: "https://www.rowellblanca.dev/contact",
    name: "Contact & Hire Rowell Mark Blanca",
    description: "Get in touch with Senior Full-Stack Software Engineer Rowell Mark Blanca for Next.js web applications and WordPress engineering.",
    mainEntity: {
        "@type": "Person",
        name: "Rowell Mark Blanca",
        jobTitle: "Senior Full-Stack Engineer",
        email: "hello@rowellblanca.dev",
        url: "https://www.rowellblanca.dev",
    },
};

export default function ContactPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
            />
            <ContactPageClient />
        </>
    );
}
