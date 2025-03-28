import PrimaryButton from "../buttons/primaryButton";
import facebook from "@/assets/images/facebook.png";
import instagram from "@/assets/images/instagram.png";
import linkedin from "@/assets/images/linkedin.png";
import git from "@/assets/images/git.png";
import searchImage from "@/assets/images/contact-section-bg-1.png"
import Image from "next/image";
import Link from "next/link";

export default function ContactSection() {

    const socialMedia = [
        {
            'title' : 'facebook',
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
            <div className="contactSection py-32 px-52 max-xl:px-8 max-sm:py-12 bg-primary-accent">
                <div className="contactSection__container container flex mx-auto max-lg:flex-col max-sm:flex-col-reverse">

                    <div className="contactSection__col w-1/2 max-lg:w-full max-sm:pt-10">
                        <h2 className="text-white relative z-20 font-bold text-6xl max-xl:text-4xl">
                            <span className="block text-text-accent font-medium text-lg uppercase">Contact</span>
                            Any Type of Query <br/>
                            & Discussion.
                        </h2>
                        <p className="mt-2 text-neutral-300 relative z-20 leading-8 pt-6">Have an exciting project you need help with? <br />Send me an email  <Link href="mailto:rowellblanca94@gmail.com">rowellblanca94@gmail.com</Link> or hit say hello!</p>
                        <ul className="flex -mx-1 pt-5 pb-7">
                            {socialMedia.map( (social, index) => (
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
                        <div className="bg-img relative w-36 pt-8">
                            <Image src={searchImage} priority alt="search"/>
                        </div>
                    </div>

                    <div className="contactSection__col w-1/2 max-lg:w-full max-lg:pt-5">
                        <h2 className="text-white relative z-20 font-bold text-6xl max-xl:text-4xl">
                            Tailored to meet <br />
                            specific needs.
                        </h2>
                        
                        <p className="mt-2 text-neutral-300 relative z-20 leading-8 pt-6">A Full-Stack Engineer is a versatile architect, adept at blending frontend elegance with backend robustness to craft tailored digital solutions. Proficient in HTML, CSS, JavaScript, React, Nextjs for frontend design, and PHP with WordPress, Shopify, they design captivating interfaces and build resilient server-side logic. Leveraging version control systems like Git and embracing agile methodologies, they ensure efficient collaboration and seamless project delivery. With technical prowess and creative problem-solving, they meet specific project needs with agility and precision.</p>
                        <PrimaryButton link="/about" label="Say Hello!" className=" mt-7" />

                    </div>

                </div>
            </div>
        </>
    )
}