import Banner from "@/components/banner/banner";
import { ContactFormSection } from "@/components/footer/contact-form-section";

export default function ContactUs() {
    return (
        <>
            <Banner title="Hello" />
            <div className="py-7">
                <ContactFormSection />
            </div>
        </>
    )
} 

