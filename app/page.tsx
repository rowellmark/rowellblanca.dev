import type { Metadata } from "next";
import Home from "@/components/homepage/home-page";

// Title/description come from the root layout defaults (overridable from the admin
// Settings meta fields); the homepage only declares its canonical URL.
export const metadata: Metadata = {
    alternates: { canonical: "https://www.rowellblanca.dev" },
};

export default function HomePage() {
    return <Home />;
}
