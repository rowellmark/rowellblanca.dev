'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import { AnimatedButton } from '../buttons/animated-button';
import classes from "./header.module.scss";

import {
    IconPhone
} from "@tabler/icons-react";



export default function Header() {

    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollClass, setHeaderScrollClass] = useState('');
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.pageYOffset;
            setScrollPosition(position);

            // Add your condition here to determine when to apply the class
            if (position > 100) {
                setHeaderScrollClass(classes.header__sticky); // Apply the class from CSS module
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

    const toggleMobileNav = () => {
        setIsMobileNavOpen(!isMobileNavOpen);
    };

    const handleMovileMenuClick = () => {
        setIsMobileNavOpen(false);
    }
   
    return (
        <>
            <header className={`${scrollClass} ${classes.header} ${isMobileNavOpen ? classes.headerOpen : ''} fixed w-full z-[9999] transition-all duration-500 ease-in-out top-0 left-0`}>
                <div className="header__container flex justify-between items-center w-full px-8 max-sm:px-6">
                    <div className={`${classes.header__logo} transition-all duration-500`}>
                        <Link href="/">
                            <Image
                                src={logo}
                                className="mx-auto w-full h-auto"
                                alt="Rowell Mark Blanca"
                            ></Image>
                        </Link>
                    </div>
                    <div className={`${classes.mobile_menu} flex item-center hidden max-lg:flex`}>
                        <Link href="/contact">
                            <IconPhone size="29" className="mr-4"/>
                        </Link>
                        <div onClick={toggleMobileNav}
                            className={`
                                ${classes.menu_toggle}
                                ${isMobileNavOpen ? classes.nav_open : ''}
                            `}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div className={`${isMobileNavOpen ? classes.nav_open : ''} ${classes.nav} max-lg:invisible`}>
                        <ul className="flex items-center max-lg:flex-col">
                            {navs.map((nav, index) => (
                                <li key={index} className='px-4 max-lg:py-4 max-lg' onClick={handleMovileMenuClick}>
                                    <Link href={nav.link} className="uppercase transition-all duration-500 hover:text-accent-color">{nav.name}</Link>
                                </li>
                            ))}
                            <Link onClick={handleMovileMenuClick} href="/contact" className="
                            font-semibold text-black py-4 px-7 block rounded-md border border-black bg-accent-color text-neutarl-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 rounded-[40px]
                            ">Say Hello!</Link>
                            
                        </ul>
                    </div>
                </div>
            </header>
        </>
    );    
}