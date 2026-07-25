import { Metadata } from "next";
import Banner from "@/components/banner/banner";
import { ContactFormSection } from "@/components/footer/contact-form-section";

export const metadata: Metadata = {
    title: "Contact & Hire Me",
    description: "Get in touch with Rowell Mark Blanca for full-stack software development, React applications, and WordPress engineering projects.",
};

export default function ContactUs() {
    return (
        <div className="bg-brand-bg min-h-screen">
            <Banner title="Get In Touch" subtitle="Contact" />
            <div>
                <ContactFormSection />
            </div>
        </div>
    );
}
