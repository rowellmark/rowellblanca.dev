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
import { ArrowRight, Sparkles } from "lucide-react";
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

            {/* Foreground Floating Header Overlay */}
            <div className="relative z-20 max-w-3xl mx-auto px-6">
                <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 shadow-2xl text-center space-y-5">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-brand-amber bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30 inline-block shadow-xs">
                        Interactive Showcase
                    </span>
                    <div className="flex justify-center py-1">
                        <FuzzyText
                            fontSize={38}
                            fontWeight={900}
                            color="#F59E0B"
                            align="center"
                            baseIntensity={0.15}
                            hoverIntensity={0.4}
                        >
                            Featured Projects & Digital Platforms
                        </FuzzyText>
                    </div>
                    <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
                        Explore high-impact Next.js web applications, custom SaaS portals, and enterprise client platforms engineered for high performance, scale, and conversion.
                    </p>
                    <div className="pt-2 flex justify-center">
                        <Link
                            href="/mywork"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-slate-900 text-slate-950 hover:text-white font-extrabold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
                        >
                            <Sparkles className="h-4 w-4 text-slate-950 group-hover:text-amber-400 transition-colors" />
                            <span>Explore All Projects</span>
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