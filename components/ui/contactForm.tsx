'use client';
import React from "react";

import {
    IconBrandTelegram
} from "@tabler/icons-react";

export default async function Contact() {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_key: "b9fe178c-c566-40f8-bec2-39bb41fb27a7",
                name: formData.get("name"),
                email: formData.get("email"),
                message: formData.get("message"),
            }),
        });
        const result = await response.json();
        if (result.success) {
            console.log(result);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="text-black">
                <div className="pt-2">
                    <label htmlFor="name" className="hidden">Name</label>
                    <input type="text" name="name" required placeholder="Name" className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10"/>
                </div>
                <div className="pt-2">
                    <label htmlFor="email" className="hidden">Email</label>
                    <input type="email" name="email" required placeholder="email@example.com" className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10" />
                </div>
                <div className="pt-2">
                    <label htmlFor="message" className="hidden">Message</label>
                    <textarea name="message" required placeholder="Enter Message" className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48"></textarea>
                </div>
                <button type="submit" className="mx-auto mt-6 text-black py-4 px-7 block rounded-md border border-black bg-accent-color text-neutarl-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 rounded-3xl flex items-center">Send <IconBrandTelegram className="ml-3"/></button>
            </form>
        </>
    );
}
