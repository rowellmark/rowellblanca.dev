"use client";

import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import Image from "next/image";
import classes from "./loading-screen.module.scss";
import { motion, AnimatePresence } from "framer-motion";

export function WelcomeLoading() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
            const lastShownDate = localStorage.getItem('intro_shown_date');

            // Play intro animation only once per day per visitor
            if (lastShownDate !== today) {
                setIsVisible(true);
                localStorage.setItem('intro_shown_date', today);

                const hideTimeout = setTimeout(() => {
                    setIsVisible(false);
                }, 2200);

                return () => clearTimeout(hideTimeout);
            }
        } catch (e) {
            // Fallback for SSR / restricted localStorage
            setIsVisible(false);
        }
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1, y: "0%" }}
                    exit={{ opacity: 0, y: "-100%" }}
                    transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[10001] w-full h-full bg-[#0B172A] text-white flex flex-col justify-center items-center overflow-hidden"
                >
                    <div className="flex flex-col items-center gap-6 px-6">
                        
                        {/* Smooth Logo Entrance */}
                        <motion.div
                            initial={{ scale: 0.6, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="w-16 sm:w-20 shrink-0 relative aspect-square"
                        >
                            <Image
                                src={logo}
                                className="object-contain"
                                alt="Rowell Mark Blanca"
                                fill
                                priority
                            />
                        </motion.div>

                        {/* Name & Intro Headline */}
                        <div className="text-center space-y-2">
                            <motion.h2
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="font-black text-2xl sm:text-4xl text-white tracking-tight uppercase"
                            >
                                Rowell Mark <span className="text-brand-amber">Blanca</span>
                            </motion.h2>

                            <motion.p
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400"
                            >
                                Creative Software Engineer
                            </motion.p>
                        </div>

                        {/* Loading Line Progress */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "140px" }}
                            transition={{ duration: 1.8, ease: "easeInOut" }}
                            className="h-1 rounded-full bg-gradient-to-r from-brand-amber to-amber-500 mt-2"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
