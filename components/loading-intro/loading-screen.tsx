"use client";
import React, { useState, useEffect } from "react";
import logo from "@/assets/images/logo.png";
import Image from "next/image";
import classes from "./loading-screen.module.scss";

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
        <div className={
            `${classes.introloading} 
            fixed z-[10001] w-full h-full bg-primary-accent flex flex-col justify-center items-center 
            ${loadingComplete ? classes.loaded : ''} 
            ${exitAnimation ? classes.exitAnimation : ''}`}
        >
            <div className={`${classes.loader}`}></div>

            <div className={`${classes.introloading__container} flex px-8`}>
                <div className={`${classes.introloading__logoIcon} w-32 max-sm:w-24`}>
                    <Image
                        src={logo}
                        className="mx-auto w-full h-auto"
                        alt="Rowell Mark Blanca"
                    />
                </div>
                <div className={`${classes.introloading__logoText} font-semibold uppercase overflow-hidden text-7xl ml-4 max-sm:text-5xl`}>
                    <div className={`${classes.introloading__logoTextwords } -mt-2 max-sm:mt-0`}>Rowell</div>
                    <div className={`${classes.introloading__logoTextwords}`}>Mark</div>
                </div>
            </div>
            <div className={`${classes.introloading__logoSlogan} font-normal text-2xl uppercase max-sm:text-xl`}>
                I Build Things for the Web
            </div>
        </div>
    );
}
