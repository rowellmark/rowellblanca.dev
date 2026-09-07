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
import { ArrowRight, Sparkles, ShieldCheck, Clock, ArrowUpRight } from "lucide-react";
import { resolveValidImageSrc } from "@/lib/image-utils";
import { FuzzyText } from "@/components/ui/fuzzy-text";

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

            {/* Foreground Floating Trust & Showcase Overlay */}
            <div className="relative z-20 max-w-4xl mx-auto px-6">
                <div className="p-6 sm:p-9 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl text-center space-y-5">
                    {/* Eyebrow */}
                    <div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30 inline-block shadow-2xs">
                            Trusted by UK, US & Australian Businesses for Mission-Critical Engineering
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-1.5">
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            Interactive Portfolio Showcase
                        </h2>
                        <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-2xl mx-auto leading-relaxed">
                            High-concurrency Next.js web applications, custom multi-tenant SaaS portals, and enterprise WordPress engines engineered for sub-second performance.
                        </p>
                    </div>

                    {/* Trust & Client Pillars Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-left">
                        <Link
                            href="/mywork/macmanus-portal"
                            className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 transition-all group"
                        >
                            <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-amber-400">
                                <span className="truncate">MacManus Finance</span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-amber-400 shrink-0" />
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">UK Asset Finance</span>
                            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-800/50 inline-block mt-1">
                                98/100 Web Vitals
                            </span>
                        </Link>

                        <Link
                            href="/mywork/buildforuser"
                            className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 transition-all group"
                        >
                            <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-amber-400">
                                <span className="truncate">BuildForUser SaaS</span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-amber-400 shrink-0" />
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Multi-Tenant Platform</span>
                            <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-950/70 px-1.5 py-0.5 rounded border border-blue-800/50 inline-block mt-1">
                                Next.js & NeonDB
                            </span>
                        </Link>

                        <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
                            <div className="flex items-center gap-1 text-xs font-bold text-white">
                                <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                <span className="truncate">Timezone Overlap</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">UK, US & AU Overlap</span>
                            <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-950/70 px-1.5 py-0.5 rounded border border-indigo-800/50 inline-block mt-1">
                                Daily Standups
                            </span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
                            <div className="flex items-center gap-1 text-xs font-bold text-white">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate">Senior Dev Access</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">12+ Yrs Experience</span>
                            <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-800/50 inline-block mt-1">
                                Zero Delegation
                            </span>
                        </div>
                    </div>

                    {/* Stats strip & CTA */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4 sm:gap-6 text-left">
                            <div>
                                <span className="text-sm sm:text-base font-black text-white">12+ Yrs</span>
                                <span className="block text-[9px] font-mono text-slate-400 uppercase">Production</span>
                            </div>
                            <div>
                                <span className="text-sm sm:text-base font-black text-white">50+ Apps</span>
                                <span className="block text-[9px] font-mono text-slate-400 uppercase">Shipped</span>
                            </div>
                            <div>
                                <span className="text-sm sm:text-base font-black text-amber-400">Sub-Second</span>
                                <span className="block text-[9px] font-mono text-slate-400 uppercase">Web Vitals</span>
                            </div>
                            <div>
                                <span className="text-sm sm:text-base font-black text-emerald-400">100%</span>
                                <span className="block text-[9px] font-mono text-slate-400 uppercase">Top Rated</span>
                            </div>
                        </div>

                        <Link
                            href="/mywork"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-white text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <span>Explore All 50+ Projects</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
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
            className="group/product h-56 w-[22rem] relative shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800"
        >
            <Link
                href={`/mywork/${product.permalink}`}
                className="block opacity-80 group-hover/product:opacity-100 h-full w-full relative"
            >
                <Image
                    src={imgSrc}
                    fill
                    className="object-cover object-left-top absolute inset-0 h-full w-full"
                    alt={product.sitename}
                    onError={() => setImgSrc('/no-image-placeholder.svg')}
                    unoptimized
                />
            </Link>

            <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 z-20">
                <h3 className="font-extrabold text-white text-sm leading-snug">
                    {product.sitename}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1.5">
                    {product.technologies?.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-amber text-brand-navy">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};