'use client';
import React from "react";

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
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" required placeholder="Your name" />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" required placeholder="email@example.com" />
                </div>
                <div>
                    <label htmlFor="message">Message</label>
                    <textarea name="message" required rows="3" placeholder="Enter Message"></textarea>
                </div>
                <button type="submit">Submit Form</button>
            </form>
        </>
    );
}
