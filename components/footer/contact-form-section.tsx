"use client";

import Contact from "../ui/contactForm";
import facebook from "@/assets/images/facebook.png";
import instagram from "@/assets/images/instagram.png";
import linkedin from "@/assets/images/linkedin.png";
import git from "@/assets/images/git.png";
import Image from "next/image";

export function ContactFormSection() {


    const socialMedia = [
        {
            'title': 'facebook',
            'icon': facebook,
            'url': 'https://www.facebook.com/itsmrrowrow',
        },
        {
            'title': 'instagram',
            'icon': instagram,
            'url': 'https://www.instagram.com/its.mr.row/',
        },
        {
            'title': 'linkedin',
            'icon': linkedin,
            'url': 'https://www.linkedin.com/in/rowell-blanca/',
        },
        {
            'title': 'git',
            'icon': git,
            'url': 'https://github.com/rowellmark',
        }
    ];

    return (
        <>
            

            <div className="contactformContainer py-28">
                <div className="container mx-auto flex px-48 max-sm:flex-col max-sm:px-8">

                    <div className="contact_info w-1/2 max-sm:w-full">
                        <h2 className="text-white relative z-20 font-bold text-3xl w-full pb-6">
                            Available for select <br /> freelance opportunities
                        </h2>
                        <p className="text-base">Have an exciting project you need help with?</p>
                        <ul className="flex -mx-1 pt-5 pb-7">
                            {socialMedia.map((social, index) => (
                                <li
                                    key={index}
                                    className="px-1"
                                >
                                    <a href={social.url} className="block relative w-7" target="_blank">
                                        <Image src={social.icon} alt={social.title} priority />
                                        <span className="hidden">{social.title}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                   
                    <div className="formFiels w-1/2 max-sm:w-full">
                        <Contact />
                    </div>
                </div>

            </div>
     
        </>
    )
}