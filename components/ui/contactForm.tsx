import React, { useState } from "react";
import { useRouter } from 'next/navigation';

import {
    IconBrandTelegram
} from "@tabler/icons-react";

const Contact: React.FC = () => {
    const router = useRouter(); // Initialize router for redirection
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // State to hold form validation errors

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {
            access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
            // Add honeypot field
            honeypot: formData.get("honeypot"), // Get honeypot value
        };

        // Simple form validation
        const errors: { [key: string]: string } = {};
        if (!data.name) {
            errors.name = "Name is required";
        }
        if (!data.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(data.email as string)) {
            errors.email = "Email address is invalid";
        }
        if (!data.message) {
            errors.message = "Message is required";
        }
        // Check honeypot field
        if (data.honeypot) {
            // If honeypot field is filled, it's likely spam
            console.log("Spam detected!");
            // You can handle spam submissions here, such as logging or blocking
            return;
        }

        if (Object.keys(errors).length > 0) {
            // If there are errors, set them in state and return
            setErrors(errors);
            return;
        }

        // If no errors, proceed with form submission
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.success) {
            console.log(result);
            // Redirect to thank you page upon successful submission
            router.push("/thank-you");
        } else {
            // If submission failed, handle errors
            console.error("Submission failed:", result);
            // You can handle errors here, such as displaying an error message to the user
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="text-black">
                <div className="pt-2">
                    <label htmlFor="name" className="hidden">Name</label>
                    <input type="text" name="name" placeholder="Name" className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10" />
                    {errors.name && <span className="text-red-500 block py-2">{errors.name}</span>}
                </div>
                <div className="pt-2">
                    <label htmlFor="email" className="hidden">Email</label>
                    <input type="email" name="email" placeholder="email@example.com" className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10" />
                    {errors.email && <span className="text-red-500 block py-2">{errors.email}</span>}
                </div>
                <div className="pt-2">
                    <label htmlFor="message" className="hidden">Message</label>
                    <textarea name="message" placeholder="Enter Message" className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48"></textarea>
                    {errors.message && <span className="text-red-500 block py-2">{errors.message}</span>}
                </div>
                {/* Honeypot field */}
                <div className="pt-2" style={{ display: 'none' }}>
                    <label htmlFor="honeypot" className="hidden">Do not fill this out if you are human</label>
                    <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
                </div>
                {/* Submit button */}
                <button type="submit" className="mx-auto mt-6 py-4 px-7 block rounded-md border border-black bg-accent-color text-primary-accent text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 rounded-3xl flex items-center">Send <IconBrandTelegram className="ml-3" /></button>
            </form>
        </>
    );
}

export default Contact; 