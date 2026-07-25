"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Send, Loader2 } from "lucide-react";

const Contact: React.FC = () => {
    const router = useRouter();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const message = formData.get("message") as string;
        const honeypot = formData.get("honeypot") as string;

        // Validation
        const newErrors: { [key: string]: string } = {};
        if (!name?.trim()) newErrors.name = "Name is required";
        if (!email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Valid email address is required";
        }
        if (!message?.trim()) newErrors.message = "Message is required";

        if (honeypot) {
            console.log("Spam submission blocked");
            setIsSubmitting(false);
            return;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            // Post to our API route (NeonDB DB record + Mailtrap Email)
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            if (response.ok) {
                router.push("/thank-you");
            } else {
                // Fallback to Web3Forms if API route encounters unexpected error
                const web3Res = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
                        name,
                        email,
                        message,
                    }),
                });
                if (web3Res.ok) {
                    router.push("/thank-you");
                } else {
                    setErrors({ general: "Unable to send message right now. Please email directly." });
                }
            }
        } catch (err) {
            console.error("Submission error:", err);
            setErrors({ general: "An error occurred. Please email rowellblanca94@gmail.com directly." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
                <div className="p-3.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                    {errors.general}
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Name
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-all"
                />
                {errors.name && <span className="text-xs text-rose-600 font-semibold mt-1 block">{errors.name}</span>}
            </div>

            <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-all"
                />
                {errors.email && <span className="text-xs text-rose-600 font-semibold mt-1 block">{errors.email}</span>}
            </div>

            <div>
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Project Details / Message
                </label>
                <textarea
                    name="message"
                    id="message"
                    rows={4}
                    placeholder="Tell me about your project, timeline, or requirements..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-all"
                />
                {errors.message && <span className="text-xs text-rose-600 font-semibold mt-1 block">{errors.message}</span>}
            </div>

            {/* Honeypot field */}
            <div style={{ display: 'none' }}>
                <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-brand-amber hover:bg-brand-amber-h text-brand-navy font-extrabold text-sm uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                    </>
                ) : (
                    <>
                        Send Message <Send className="h-4 w-4" />
                    </>
                )}
            </button>
        </form>
    );
};

export default Contact;