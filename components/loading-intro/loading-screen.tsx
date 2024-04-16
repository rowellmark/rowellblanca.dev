"use client";
import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import Image from "next/image";

export function WelcomeLoading() {

    const [loadingComplete, setLoadingComplete] = useState(false);
    const [exitAnimation, setExitAnimation] = useState(false);

    useEffect(() => {
        // Set loadingComplete to true after a delay of 2500 milliseconds
        const loadingTimeout = setTimeout(() => {
            setLoadingComplete(true);
        }, 100);

        // Hide the loading component after 3 seconds (3000 milliseconds)
        const hideTimeout = setTimeout(() => {
            setExitAnimation(true);
        }, 3000);

        // Clear the timeouts to avoid memory leaks
        return () => {
            clearTimeout(loadingTimeout);
            clearTimeout(hideTimeout);
        };
    }, []);


    return (
        <div className={`introLoading fixed z-[10001] w-full h-full bg-primary-accent flex flex-col justify-center items-center  ${loadingComplete ? 'loaded' : ''} ${exitAnimation ? 'exitAnimation' : ''}`}>
            <div className="introLoading__container flex">
                <div className="introLoading__logoIcon w-32">
                    <Image
                        src={logo}
                        className="mx-auto w-full h-auto"
                        alt="Rowell Mark Blanca"
                    />
                </div>
                <div className="introLoading__logoText font-semibold uppercase overflow-hidden text-7xl ml-4">
                    <div className="introLoading__logoText--text1 -mt-2">Rowell</div>
                    <div className="introLoading__logoText--text2">Mark</div>
                </div>
            </div>
            <div className="font-normal text-2xl introLoading__logoSlogan">
                Build Things for the Web
            </div>
        </div>
    );
}
