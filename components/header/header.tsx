'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import { AnimatedButton } from '../buttons/animated-button';


export default function Header() {

    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollClass, setHeaderScrollClass] = useState('');
    useEffect(() => {
        const handleScroll = () => {
            const position = window.pageYOffset;
            setScrollPosition(position);

            // Add your condition here to determine when to apply the class
            if (position > 100) {
                setHeaderScrollClass('header__sticky'); // Apply the class from CSS module
            } else {
                setHeaderScrollClass('');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navs = [
        { name: 'About', link: '/about' },
        { name: 'My Work', link: '/mywork' },

    ];

    return (
        <>
            <header className={`${scrollClass} header fixed w-full z-[9999] transition-all duration-500 ease-in-out top-0 left-0`}>
                <div className="header__container flex justify-between items-center w-full px-8 py-5 max-sm:px-3">
                    <div className="logo w-16 max-sm:w-12">
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

                            {navs.map((nav, index) => (
                                <li key={index} className='px-4 max-sm:hidden'>
                                    <Link href={nav.link} className="uppercase">{nav.name}</Link>
                                </li>
                            ))}
                            <AnimatedButton label="Say Hello!" link="/contact" className="ml-7"></AnimatedButton>
                        </ul>
                    </div>
                </div>
            </header>
        </>
    );    
}