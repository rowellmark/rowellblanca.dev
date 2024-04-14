import PrimaryButton from "../buttons/primaryButton";

export default function ContactSection() {
    return (
        <>
            <div className="contactSection py-32 px-40">
                <div className="contactSection__container flex">

                    <div className="contactSection__col w-1/2">

                        <h2 className="text-white relative z-20 font-bold text-6xl">
                            <span className="block text-text-accent font-medium text-lg uppercase">Contact</span>
                            Any Type of Query <br/>
                            & Discussion.
                        </h2>
                        <p className="mt-2 text-neutral-300 relative z-20 leading-8 pt-6">Have an exciting project you need help with? <br />Send me an email or contact me via instant message!</p>
                        <PrimaryButton link="/about" label="Say Hello!" className="mt-20" />

                    </div>

                    <div className="contactSection__col w-1/2">
                        <h2 className="text-white relative z-20 font-bold text-6xl">
                            Tailored to meet <br />
                            specific needs.
                        </h2>
                        <p className="mt-2 text-neutral-300 relative z-20 leading-8 pt-6">A Full-Stack Engineer is a versatile architect, adept at blending frontend elegance with backend robustness to craft tailored digital solutions. Proficient in HTML, CSS, JavaScript for frontend design, and PHP with WordPress for backend development, they design captivating interfaces and build resilient server-side logic. Leveraging version control systems like Git and embracing agile methodologies, they ensure efficient collaboration and seamless project delivery. With technical prowess and creative problem-solving, they meet specific project needs with agility and precision.</p>


                    </div>

                </div>
            </div>
        </>
    )
}