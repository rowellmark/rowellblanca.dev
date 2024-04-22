import PrimaryButton from "@/components/buttons/primaryButton";
import rowellPic from "@/assets/images/mypicture.jpg";
import Image from "next/image";
import facebook from "@/assets/images/facebook.png";
import instagram from "@/assets/images/instagram.png";
import linkedin from "@/assets/images/linkedin.png";
import git from "@/assets/images/git.png";
import Link from "next/link";

import {
    IconDownload,
    IconCornerUpLeft
} from "@tabler/icons-react";
import Banner from "@/components/banner/banner";

export default function AboutPage() {


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
            <Banner title="About Me"/>
            <div className="w-full pb-48 pt-6 aboutPage max-sm:px-8">
                <div className="aboutPage__container container mx-auto">
                    
                    <div className="back-button flex items-start pb-6 max-lg:px-5">
                        <Link href="/" className="flex items-center px-4 py-2 uppercase font-semibold rounded-md border border-neutral-300 bg-neutral-100 text-primary text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md">
                            <IconCornerUpLeft></IconCornerUpLeft> Back
                        </Link>
                    </div>
                  
                    <div className="aboutPage__header flex items-center max-lg:flex-col-reverse">
                        
                        <div className="aboutPage_info w-full text-base leading-7">
                            <h2 className="text-7xl font-semibold pb-9 max-lg:text-6xl">
                                I'm <span className="text-accent-color">Rowell</span> <br />
                                <span>Software Engineer</span>
                            </h2>
                            <ul>
                                <li>
                                    <strong className="text-accent-color">Address: </strong>
                                    <span className="max-sm:text-sm">Ynares 2 Street Calumpang Binangonan Rizal</span>
                                </li>
                                <li>
                                    <strong className="text-accent-color">Email: </strong>
                                    <span>rowellblanca94@gmail.com</span>
                                </li>
                                <li>
                                    <strong className="text-accent-color">Phone: </strong>
                                    <span>+639688900418</span>
                                </li>
                            </ul>

                            <h2 className="mt-5 text-xl font-semibold text-accent-color">Key Technologies</h2>
                            <ul className="mt-2 list-disc ml-4">
                                <li>Frontend: HTML5, CSS3, JavaScript (ES6+), React.js, Next.js</li>
                                <li>Backend: Node.js, PHP, Wordpress.</li>
                                <li>Database: MySQL</li >
                                <li>Tools & Platforms: Git, Photoshop, Figma, Composer</li >
                            </ul>

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
                            <div className="aboutPage__buttons flex pt-4">
                                <Link href="/contact" className="text-black py-4 px-7 block rounded-md border border-black bg-accent-color text-neutarl-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 rounded-3xl">Say Hello!</Link>
                                <Link href="/rowell-resume.pdf" target="_blank" className="flex items-center ml-3 text-black py-4 px-7 block rounded-md border border-black bg-accent-color text-neutarl-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 rounded-3xl">Download CV <IconDownload className="ml-1"></IconDownload></Link>
                            </div>
                        </div>

                        <div className="aboutPage_image w-[40%] relative shrink-0 max-lg:w-full max-lg:mb-5">
                            <canvas width="480" height="480" className="block w-full"></canvas>
                            <Image src={rowellPic} alt="Rowell Mark M Blanca" className="w-full block h-full absolute left-0 top-0 object-cover object-center"/>
                        </div>
                    </div>
                    <div className="blog-content text-base leading-7 py-7">
                        <p>As a seasoned Full-stack Engineer with over a decade of experience, I've had the privilege of collaborating with clients across diverse industries and countries. With a solid foundation in WordPress spanning 13 years, I've honed my skills in architecting robust and scalable frontend solutions that prioritize exceptional user experiences. My passion lies in crafting digital experiences that seamlessly blend creativity with functionality. With a meticulous attention to detail and an unwavering commitment to excellence, I endeavor to deliver solutions that not only meet but surpass client expectations.</p>
                    </div>
                </div>
            </div>
        </>
    )
} 

