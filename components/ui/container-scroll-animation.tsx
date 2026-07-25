"use client";
import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import Image from "next/image";

export const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= breakpoint);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, [breakpoint]);

    return isMobile;
};

export const ContainerScroll = ({
    titleComponent,
    children,
    mobileImgSrc,
}: {
    titleComponent: string | React.ReactNode;
    children: React.ReactNode;
    mobileImgSrc?: string;
}) => {
    const containerRef = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
    });
    const isMobile = useIsMobile();

    const scaleDimensions = () => {
        return isMobile ? [0.7, 0.9] : [1.05, 1];
    };

    const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
    const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <div
            className="h-[60rem] md:h-[70rem] flex items-center justify-center relative p-2 pt-0 max-sm:-mb-36 max-sm:h-[50rem]"
            ref={containerRef}
        >
            <div
                className="pb-10  w-full relative"
                style={{
                    perspective: "1000px",
                }}
            >
                <Header translate={translate} titleComponent={titleComponent} />
                <Card rotate={rotate} translate={translate} scale={scale} mobileImgSrc={mobileImgSrc} isMobile={isMobile}>
                    {children}
                </Card>
            </div>
        </div>
    );
};

export const Header = ({ translate, titleComponent }: any) => {
    return (
        <motion.div
            style={{
                translateY: translate,
            }}
            className="div max-w-5xl mx-auto text-center"
        >
            {titleComponent}
        </motion.div>
    );
};

function MobilePhoneSvgMockup({ imgSrc }: { imgSrc: string }) {
    const getInitialSrc = (src: string) => {
        if (!src || !src.trim() || src === 'null' || src === 'undefined' || src === 'placeholder-portfolio.jpg') {
            return '/no-image-placeholder.svg';
        }
        return src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;
    };

    const [resolvedSrc, setResolvedSrc] = useState(getInitialSrc(imgSrc));

    useEffect(() => {
        setResolvedSrc(getInitialSrc(imgSrc));
    }, [imgSrc]);

    return (
        <div className="relative w-48 md:w-56 h-[380px] md:h-[440px] drop-shadow-[0_25px_25px_rgba(0,0,0,0.75)] transition-transform hover:scale-105 duration-300">
            {/* Outer Phone Shell & Gradient Bezel */}
            <div className="absolute inset-0 rounded-[38px] bg-gradient-to-b from-[#444] via-[#1c1c1e] to-[#0a0a0a] p-[3px] border border-white/20 shadow-2xl">
                {/* Inner Screen Bezel */}
                <div className="relative w-full h-full rounded-[35px] bg-[#111] p-1.5 overflow-hidden flex flex-col justify-between">
                    
                    {/* Screen Viewport */}
                    <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-[#0a0a0a] flex flex-col">
                        {/* Status Bar */}
                        <div className="w-full px-5 pt-2.5 pb-1.5 flex items-center justify-between bg-[#141414] text-white text-[9px] font-mono pointer-events-none z-20 shrink-0 border-b border-white/10">
                            <span className="font-bold text-slate-200">9:41</span>
                            <div className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                <div className="w-3.5 h-2 rounded-[2px] border border-white/70 p-[0.5px]">
                                    <div className="h-full w-2 bg-white rounded-[1px]" />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Screenshot Container */}
                        <div className="relative flex-1 w-full overflow-hidden bg-[#0d0d0d] flex items-start justify-center">
                            <Image
                                src={resolvedSrc}
                                alt="Mobile Preview"
                                fill
                                className="object-contain object-top"
                                onError={() => setResolvedSrc('/no-image-placeholder.svg')}
                                draggable={false}
                                unoptimized
                            />
                        </div>
                    </div>

                    {/* Top Notch & Camera Island */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-3.5 w-20 rounded-full bg-black z-30 flex items-center justify-between px-2 pointer-events-none shadow-md border border-white/10">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#1a1a1a] border border-slate-700" />
                        <div className="h-1 w-6 rounded-full bg-[#1a1a1a]" />
                    </div>

                    {/* Bottom Home Indicator Bar */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 h-1 w-24 rounded-full bg-white/40 z-30 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}

export const Card = ({
    rotate,
    scale,
    children,
    mobileImgSrc,
    isMobile,
}: {
    rotate: MotionValue<number>;
    scale: MotionValue<number>;
    translate: MotionValue<number>;
    children: React.ReactNode;
    mobileImgSrc?: string;
    isMobile?: boolean;
}) => {
    const phoneImage = mobileImgSrc || '/macmanus-mobile.png';

    // Real phones get the dedicated mobile screenshot in a phone frame (full image, no crop)
    // instead of the desktop browser-card, which only fits the desktop screenshot correctly.
    if (isMobile) {
        return (
            <motion.div
                style={{ scale }}
                className="flex items-center justify-center -mt-8"
            >
                <MobilePhoneSvgMockup imgSrc={phoneImage} />
            </motion.div>
        );
    }

    return (
        <motion.div
            style={{
                rotateX: rotate,
                scale,
                boxShadow:
                    "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
            }}
            className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl relative"
        >
            <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl flex flex-col">
                {/* Browser Address Bar Header */}
                <div className="w-full bg-[#1e1e1e] px-4 py-2.5 flex items-center gap-3 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="flex-1 max-w-xs sm:max-w-sm mx-auto bg-[#121212] border border-white/10 rounded-md px-3 py-1 text-[11px] text-slate-300 font-mono truncate text-center shadow-inner">
                        rowellblanca.dev/spotlight
                    </div>
                </div>

                {/* Main Viewport Container */}
                <div className="relative flex-1 w-full overflow-hidden bg-[#0d0d0d]">
                    {children}
                </div>
            </div>

            {/* Floating Mobile Phone Mockup */}
            <div className="absolute z-30 bottom-[-5%] right-[-14%] hidden lg:block pointer-events-none">
                <MobilePhoneSvgMockup imgSrc={phoneImage} />
            </div>
        </motion.div>
    );
};