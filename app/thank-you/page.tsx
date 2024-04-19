import { ContactFormSection } from "@/components/footer/contact-form-section";
import Link from "next/link";

export default function ContactUs() {
    return (
        <>
            <div className="thankYou__page h-[80vh] flex justify-center items-center flex-col text-center">
                <h1 className="text-8xl">Hello!</h1>
                <p className="text-lg py-10">Thanks for reaching out! I'm looking forward to connecting with you soon. <br />Feel free to drop me a line whenever you're ready to discuss your project further.</p>

                <Link href="/" className="text-black py-4 px-7 block rounded-md border border-black bg-accent-color text-neutarl-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 rounded-3xl">Go Back</Link>

            </div>
        </>
    )
} 

