import React from "react";
import { PageHero } from "@/components/ui/page-hero";

interface BannerOption {
    title: string;
    subtitle?: string;
    lead?: string;
}

// Simple page header (About, Privacy, Thank-you…) on the shared dark editorial hero.
export default function Banner({ title, subtitle, lead }: BannerOption) {
    return <PageHero label={subtitle ?? title} titleLines={[`${title}`]} lead={lead} />;
}
