"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Send, Loader2 } from "lucide-react";
import { trackContactForm } from "@/lib/analytics";

const Contact: React.FC = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: 'Full-Stack Web App Development',
        message: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [gdprConsent, setGdprConsent] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        // Validation
        const newErrors: { [key: string]: string } = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Valid email address is required";
        }
        if (!form.message.trim()) newErrors.message = "Message is required";
        if (!gdprConsent) newErrors.gdpr = "Consent to the Privacy Policy is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            // Post to API route (NeonDB DB record + email delivery)
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    company: form.company,
                    service: form.service,
                    subject: `Inquiry: ${form.service}`,
                    message: form.message,
                    gdprConsent: true,
                    gdprTimestamp: new Date().toISOString(),
                }),
            });
            const data = await response.json().catch(() => null);

            if (response.ok || data?.success) {
                trackContactForm("api_contact");
                router.push("/thank-you");
            } else {
                setErrors({ general: data?.error || "Unable to send message right now. Please email directly." });
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
                <label htmlFor="name" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Full Name *
                </label>
                <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. John Smith"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium"
                />
                {errors.name && <span className="text-xs text-rose-600 font-semibold mt-1 block">{errors.name}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="email" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium"
                    />
                    {errors.email && <span className="text-xs text-rose-600 font-semibold mt-1 block">{errors.email}</span>}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone / WhatsApp
                    </label>
                    <input
                        type="text"
                        id="phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="service" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                        Service Interest
                    </label>
                    <select
                        id="service"
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    >
                        <option value="Full-Stack Web App Development">Full-Stack Web App Development</option>
                        <option value="React / Next.js Web App">React / Next.js Web App</option>
                        <option value="Custom WordPress Engine / Plugin">Custom WordPress Engine / Plugin</option>
                        <option value="AI / Automation Workflow Integration">AI / Automation Workflow Integration</option>
                        <option value="Retainer / Ongoing Maintenance">Retainer / Ongoing Maintenance</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="company" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                    Company / Organization (Optional)
                </label>
                <input
                    type="text"
                    id="company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                    Project Details / Message *
                </label>
                <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Briefly describe your project requirements, timeline, or goals..."
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium"
                />
                {errors.message && <span className="text-xs text-rose-600 font-semibold mt-1 block">{errors.message}</span>}
            </div>

            {/* GDPR Consent Checkbox */}
            <div className="pt-1 space-y-1">
                <div className="flex items-start gap-2.5">
                    <input
                        type="checkbox"
                        id="gdprConsent"
                        checked={gdprConsent}
                        onChange={(e) => setGdprConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="gdprConsent" className="text-xs text-slate-600 leading-snug cursor-pointer">
                        I consent to the processing of my personal data in accordance with the{' '}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-navy underline font-extrabold hover:text-amber-600">
                            Privacy Policy
                        </a>.
                    </label>
                </div>
                {errors.gdpr && <span className="text-xs text-rose-600 font-semibold block">{errors.gdpr}</span>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-slate-900 text-slate-950 hover:text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...
                    </>
                ) : (
                    <>
                        Submit Inquiry <Send className="h-4 w-4" />
                    </>
                )}
            </button>
        </form>
    );
};

export default Contact;