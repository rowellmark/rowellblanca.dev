import { Metadata } from "next";
import { MyWork } from "@/components/homepage/my-work";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import Banner from "@/components/banner/banner";

export const metadata: Metadata = {
    title: "My Work & Projects Portfolio",
    description: "Explore selected full-stack projects, React web apps, custom WordPress plugins, and digital builds by Rowell Mark Blanca.",
};

export default function MyWorkPage() {
    return (
        <div className="bg-brand-bg min-h-screen">
            <Banner title="Selected Work" subtitle="Portfolio" />
            <div className="py-12">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex items-start pb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 uppercase font-extrabold text-xs tracking-wider rounded-xl bg-white border border-slate-200 text-brand-navy hover:border-brand-amber transition-all shadow-xs hover:shadow-sm"
                        >
                            <IconArrowLeft className="mr-2 h-4 w-4 text-brand-amber" /> Back to Home
                        </Link>
                    </div>
                    <MyWork notitle="true" />
                </div>
            </div>
        </div>
    );
}
