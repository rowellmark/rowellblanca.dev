"use client";
import React, { useState } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    type MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, ArrowUpRight } from "lucide-react";
import { resolveValidImageSrc, canOptimizeImage } from "@/lib/image-utils";

export const HeroParallax = ({
    products,
}: {
    products: {
        key?: number;
        id?: number;
        url: string;
        image: string;
        permalink: string;
        sitename: string;
        technologies: string[];
    }[];
}) => {
    const filteredProducts = React.useMemo(() => {
        if (!products || !Array.isArray(products)) return [];
        return products.filter((product) => {
            const isPluginTech = product.technologies?.some((tech) =>
                tech.toLowerCase().includes("plugin")
            );
            const isPluginTitle = product.sitename?.toLowerCase().includes("plugin");
            const isPluginPermalink = product.permalink?.toLowerCase().includes("plugin");
            const isPluginUrl = product.url?.startsWith("wp-content");
            return !isPluginTech && !isPluginTitle && !isPluginPermalink && !isPluginUrl;
        });
    }, [products]);

    const displayProducts = React.useMemo(() => {
        if (!filteredProducts.length) return [];
        const cardsPerRow = 10;
        const totalNeeded = cardsPerRow * 3;
        const repeated = [];
        for (let i = 0; i < totalNeeded; i++) {
            repeated.push(filteredProducts[i % filteredProducts.length]);
        }
        return repeated;
    }, [filteredProducts]);

    const firstRow = displayProducts.slice(0, 10);
    const secondRow = displayProducts.slice(10, 20);
    const thirdRow = displayProducts.slice(20, 30);

    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

    const translateX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, 800]),
        springConfig
    );
    const translateXReverse = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -800]),
        springConfig
    );
    const rotateX = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [15, 0]),
        springConfig
    );
    const opacity = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [0.3, 0.85]),
        springConfig
    );
    const rotateZ = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [15, 0]),
        springConfig
    );
    const translateY = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [-300, 0]),
        springConfig
    );

    return (
        <section
            ref={ref}
            className="py-28 overflow-hidden antialiased relative min-h-[85vh] flex flex-col items-center justify-center [perspective:1000px] [transform-style:preserve-3d] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-y border-slate-800 text-white"
        >
            {/* Background Dynamic Parallax Scrolling Rows */}
            <div className="absolute inset-0 flex flex-col justify-center opacity-60 pointer-events-auto">
                <motion.div
                    style={{
                        rotateX,
                        rotateZ,
                        translateY,
                        opacity,
                    }}
                >
                    <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 mb-8">
                        {firstRow.map((product, idx) => (
                            <ProductCard
                                product={product}
                                translate={translateX}
                                key={`row1-${product.permalink || product.sitename || idx}-${idx}`}
                            />
                        ))}
                    </motion.div>
                    <motion.div className="flex flex-row mb-8 space-x-8">
                        {secondRow.map((product, idx) => (
                            <ProductCard
                                product={product}
                                translate={translateXReverse}
                                key={`row2-${product.permalink || product.sitename || idx}-${idx}`}
                            />
                        ))}
                    </motion.div>
                    <motion.div className="flex flex-row-reverse space-x-reverse space-x-8">
                        {thirdRow.map((product, idx) => (
                            <ProductCard
                                product={product}
                                translate={translateX}
                                key={`row3-${product.permalink || product.sitename || idx}-${idx}`}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Vignette: pushes the busy screenshot rows back behind the panel */}
            <div
                aria-hidden="true"
                className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(2,6,23,0.92)_0%,rgba(2,6,23,0.6)_55%,rgba(2,6,23,0)_100%)]"
            />

            {/* Foreground Floating Trust & Showcase Overlay */}
            <div className="relative z-20 w-full max-w-[1040px] mx-auto px-4 sm:px-6">
                <div className="motion-reveal rounded-[28px] bg-brand-ink/80 backdrop-blur-2xl border border-white/10 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] p-6 sm:p-10 lg:p-12 flex flex-col gap-10">
                    {/* Header: label, headline, CTA */}
                    <div className="flex flex-wrap items-end justify-between gap-8">
                        <div className="flex flex-col gap-4 max-w-[540px]">
                            <span className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.08em] text-slate-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                                Trusted by UK, US &amp; Australian businesses
                            </span>
                            <h2 className="m-0 font-extrabold tracking-[-0.04em] leading-[0.98] text-white text-[clamp(34px,4.4vw,60px)]">
                                Interactive portfolio showcase
                            </h2>
                            <p className="m-0 text-slate-300 text-base sm:text-[17px] leading-relaxed">
                                High-concurrency Next.js web applications, custom multi-tenant SaaS portals, and enterprise
                                WordPress engines engineered for sub-second performance.
                            </p>
                        </div>
                        <Link
                            href="/mywork"
                            className="motion-btn motion-magnetic inline-flex items-center gap-3 min-h-[56px] px-7 rounded-full bg-amber-500 hover:bg-amber-400 text-brand-ink font-bold"
                        >
                            Explore all 50+ projects
                            <ArrowRight className="motion-arrow w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>

                    {/* Trust pillars: one quiet grid with hairline dividers */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-white/10 border border-white/10">
                        <Link href="/mywork/macmanus-portal" className="group bg-brand-ink-2 hover:bg-[#1A2238] transition-colors p-4 sm:p-5 flex flex-col gap-3">
                            <span className="flex items-start justify-between gap-3">
                                <span className="flex flex-col gap-1">
                                    <span className="text-white font-bold">MacManus Finance</span>
                                    <span className="text-sm text-slate-400">UK asset finance</span>
                                </span>
                                <ArrowUpRight className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-amber-400 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                            </span>
                            <span className="mt-auto inline-flex items-center gap-2 font-mono text-xs text-slate-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                                98/100 Web Vitals
                            </span>
                        </Link>
                        <Link href="/mywork/buildforuser" className="group bg-brand-ink-2 hover:bg-[#1A2238] transition-colors p-4 sm:p-5 flex flex-col gap-3">
                            <span className="flex items-start justify-between gap-3">
                                <span className="flex flex-col gap-1">
                                    <span className="text-white font-bold">BuildForUser SaaS</span>
                                    <span className="text-sm text-slate-400">Multi-tenant platform</span>
                                </span>
                                <ArrowUpRight className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-amber-400 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                            </span>
                            <span className="mt-auto inline-flex items-center gap-2 font-mono text-xs text-slate-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden="true" />
                                Next.js &amp; NeonDB
                            </span>
                        </Link>
                        <div className="bg-brand-ink-2 p-4 sm:p-5 flex flex-col gap-3">
                            <span className="flex items-start justify-between gap-3">
                                <span className="flex flex-col gap-1">
                                    <span className="text-white font-bold">Timezone overlap</span>
                                    <span className="text-sm text-slate-400">UK, US &amp; AU</span>
                                </span>
                                <Clock className="w-4 h-4 shrink-0 text-slate-500" aria-hidden="true" />
                            </span>
                            <span className="mt-auto inline-flex items-center gap-2 font-mono text-xs text-slate-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" aria-hidden="true" />
                                Daily standups
                            </span>
                        </div>
                        <div className="bg-brand-ink-2 p-4 sm:p-5 flex flex-col gap-3">
                            <span className="flex items-start justify-between gap-3">
                                <span className="flex flex-col gap-1">
                                    <span className="text-white font-bold">Senior dev access</span>
                                    <span className="text-sm text-slate-400">12+ yrs experience</span>
                                </span>
                                <ShieldCheck className="w-4 h-4 shrink-0 text-slate-500" aria-hidden="true" />
                            </span>
                            <span className="mt-auto inline-flex items-center gap-2 font-mono text-xs text-slate-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
                                Zero delegation
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <dl className="m-0 grid grid-cols-2 lg:grid-cols-4 gap-y-6">
                        {[
                            { value: "12+ yrs", label: "In production", tone: "text-white" },
                            { value: "50+", label: "Apps shipped", tone: "text-white" },
                            { value: "<1s", label: "Web Vitals", tone: "text-amber-400" },
                            { value: "100%", label: "Top rated", tone: "text-emerald-400" },
                        ].map((stat, i) => (
                            <div
                                key={stat.label}
                                className={`flex flex-col-reverse gap-1.5 ${i % 2 === 1 ? "pl-6 border-l border-white/10" : ""} ${i > 0 ? "lg:pl-6 lg:border-l lg:border-white/10" : ""}`}
                            >
                                <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-400">{stat.label}</dt>
                                <dd className={`m-0 font-extrabold tracking-[-0.04em] leading-none text-[clamp(28px,3vw,40px)] ${stat.tone}`}>
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
};

function resolveImgSrc(src?: string | null) {
    return resolveValidImageSrc(src);
}

export const ProductCard = ({
    product,
    translate,
}: {
    product: {
        key?: number;
        id?: number;
        url: string;
        image: string;
        permalink: string;
        sitename: string;
        technologies: string[];
    };
    translate: MotionValue<number>;
}) => {
    const [imgSrc, setImgSrc] = useState(resolveImgSrc(product.image));

    return (
        <motion.div
            style={{
                x: translate,
            }}
            whileHover={{
                y: -10,
                scale: 1.03,
            }}
            data-cursor="view"
            className="group/product h-56 w-[22rem] relative shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800"
        >
            <Link
                href={`/mywork/${product.permalink}`}
                className="block opacity-80 group-hover/product:opacity-100 h-full w-full relative"
            >
                <Image
                    src={imgSrc}
                    fill
                    sizes="(max-width: 768px) 70vw, 480px"
                    className="object-cover object-left-top absolute inset-0 h-full w-full"
                    alt={product.sitename}
                    onError={() => setImgSrc('/no-image-placeholder.svg')}
                    unoptimized={!canOptimizeImage(imgSrc)}
                />
            </Link>

            <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                <p className="m-0 font-extrabold text-white text-sm leading-snug">
                    {product.sitename}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                    {product.technologies?.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-amber text-brand-navy">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};