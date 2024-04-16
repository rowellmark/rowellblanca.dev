"use client";
import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import Image from "next/image";

export function WelcomeLoading() {
    const [showLogo, setShowLogo] = useState(false);
    const [text1, setText1] = useState(false);
    const [text2, setText2] = useState(false);
    const [slogan, setSlogan] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Set show to true after a delay of 500 milliseconds
        const logoTimeout = setTimeout(() => {
            setShowLogo(true);
        }, 500);

        const text1Timeout = setTimeout(() => {
            setText1(true);
        }, 700);

        const text2Timeout = setTimeout(() => {
            setText2(true);
        }, 800);

        const sloganTimeout = setTimeout(() => {
            setSlogan(true);
        }, 800);


        const loadingTimeout = setTimeout(() => {
            setLoading(true);
        }, 2000);

        // Clear the timeouts to avoid memory leaks
        return () => {
            clearTimeout(logoTimeout);
            clearTimeout(text1Timeout);
            clearTimeout(text2Timeout);
            clearTimeout(sloganTimeout);
            clearTimeout(loadingTimeout);
        };
    }, []);

    return (
        <div className={`introLoading fixed z-[10001] w-full h-full bg-primary-accent flex flex-col justify-center items-center ${loading ? 'hideSlogan' : ''}`}>
            <div className="introLoading__container flex">
                <div className={`${showLogo ? 'show-logo' : ''} introLoading__logoIcon w-32`}>
                    <Image
                        src={logo}
                        className="mx-auto w-full h-auto"
                        alt="Rowell Mark Blanca"
                    />
                </div>
                <div className="introLoading__logoText font-semibold uppercase overflow-hidden text-7xl ml-4">
                    <div className={`introLoading__logoText--text1 ${text1 ? 'show-text' : ''} -mt-2`}>Rowell</div>
                    <div className={`introLoading__logoText--text2 ${text2 ? 'show-text' : ''}`}>Mark</div>
                </div>
            </div>
            <div className={`${slogan ? 'show-text' : ''} font-normal text-2xl introLoading__logoSlogan`}>
                Build Things for the Web
            </div>
        </div>
    );
}
