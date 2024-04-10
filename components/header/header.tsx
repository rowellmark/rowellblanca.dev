'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";


export default function Header() {

    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollClass, setScrollClass] = useState('');
    useEffect(() => {
        const handleScroll = () => {
            const position = window.pageYOffset;
            setScrollPosition(position);

            // Add your condition here to determine when to apply the class
            if (position > 100) {
                setScrollClass('bg-primary'); // Apply the class from CSS module
            } else {
                setScrollClass('');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const nav = [
        { name: 'Home', link: '/' },
        { name: 'About', link: '/about' }
    ];

    return (
        <>
            <header className={`${scrollClass} header fixed w-full z-[9999] transition-all duration-500 ease-in-out top-0 left-0`}>
                <div className="header__container flex justify-between items-center w-full px-8 py-5">
                    <div className="logo w-16">
                        <Link href="/">
                            <Image
                                src={logo}
                                className="mx-auto w-full h-auto"
                                alt="Rowell Mark Blanca"
                            ></Image>
                        </Link>
                    </div>
                    <div className="nav">
                        <ul className="flex items-center">
                            <li>
                                <Link href="/about">About Me</Link>
                            </li>
                            <li>
                                <Link href="/about">My Works</Link>
                            </li>
                            <li>
                                <Link href="/about">Hire Me!</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </>
    );    
}