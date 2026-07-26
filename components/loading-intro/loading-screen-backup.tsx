"use client";

import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import Image from "next/image";

/**
 * Backup of WelcomeLoading intro screen component.
 * To re-enable in the future, copy this content into loading-screen.tsx
 * or import WelcomeLoading from './loading-screen-backup'.
 */
export function WelcomeLoadingBackup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const fadeTimer = setTimeout(() => {
            setIsFadingOut(true);
        }, 1300);

        const removeTimer = setTimeout(() => {
            setIsVisible(false);
        }, 1700);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    const handleDismiss = () => {
        setIsFadingOut(true);
        setTimeout(() => setIsVisible(false), 250);
    };

    if (!isVisible) return null;

    return (
        <div
            onClick={handleDismiss}
            style={{
                transition: "opacity 0.4s ease, transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)",
            }}
            className={`fixed inset-0 z-[10001] w-full h-full bg-[#0B172A] text-white flex flex-col justify-center items-center overflow-hidden cursor-pointer select-none ${isFadingOut ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0 pointer-events-auto"
                }`}
        >
            <div className="flex flex-col items-center gap-6 px-6 pointer-events-none">

                {/* Logo Entrance */}
                <div className="w-16 sm:w-20 shrink-0 relative aspect-square animate-in zoom-in-75 duration-500">
                    <Image
                        src={logo}
                        className="object-contain"
                        alt="Rowell Mark Blanca"
                        fill
                        priority
                    />
                </div>

                {/* Name & Intro Headline */}
                <div className="text-center space-y-2">
                    <h2 className="font-black text-2xl sm:text-4xl text-white tracking-tight uppercase animate-in slide-in-from-bottom-4 duration-500">
                        Rowell Mark <span className="text-brand-amber">Blanca</span>
                    </h2>

                    <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 animate-in slide-in-from-bottom-6 duration-700">
                        Full-Stack Software Engineer
                    </p>
                </div>

                {/* Loading Line Progress */}
                <div className="w-36 h-1 rounded-full bg-gradient-to-r from-brand-amber to-amber-500 mt-2 overflow-hidden">
                    <div className="h-full bg-amber-400 animate-pulse w-full" />
                </div>
            </div>
        </div>
    );
}
