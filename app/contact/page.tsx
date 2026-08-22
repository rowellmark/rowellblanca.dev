import { Metadata } from "next";
import { ContactPageClient } from "./contact-page-client";

export const metadata: Metadata = {
    metadataBase: new URL("https://www.rowellblanca.dev"),
    title: "Contact & Hire Rowell Mark Blanca — Senior Full-Stack Engineer",
    description: "Get in touch with Senior Full-Stack Software Engineer Rowell Mark Blanca for Next.js web applications, custom WordPress engineering, and dedicated developer retainers.",
    keywords: [
        "Contact Rowell Mark Blanca",
        "Hire Next.js Developer",
        "Hire WordPress Developer UK US AU",
        "Senior Software Engineer Contact",
        "Book Discovery Call",
    ],
    openGraph: {
        type: "website",
        url: "https://www.rowellblanca.dev/contact",
        title: "Contact & Hire Rowell Mark Blanca — Senior Full-Stack Engineer",
        description: "Get in touch for custom React, Next.js, and WordPress engineering projects.",
        siteName: "Rowell Mark Blanca Portfolio",
    },
    alternates: {
        canonical: "https://www.rowellblanca.dev/contact",
    },
};

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
        email: "rowellblanca94@gmail.com",
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
