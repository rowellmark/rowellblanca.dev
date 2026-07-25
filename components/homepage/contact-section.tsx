'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Clock, ShieldCheck, CheckCircle2, MessageSquare } from "lucide-react";
import { IconBrandGithub, IconBrandLinkedin, IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";
import { FuzzyText } from "../ui/fuzzy-text";
import { ContactModal } from "../ui/contact-modal";

export default function ContactSection() {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const socialMedia = [
        { title: 'GitHub', icon: IconBrandGithub, url: 'https://github.com/rowellmark' },
        { title: 'LinkedIn', icon: IconBrandLinkedin, url: 'https://www.linkedin.com/in/rowell-blanca/' },
        { title: 'Facebook', icon: IconBrandFacebook, url: 'https://www.facebook.com/itsmrrowrow' },
        { title: 'Instagram', icon: IconBrandInstagram, url: 'https://www.instagram.com/its.mr.row/' },
    ];

    const valueProps = [
        'Over 12 years of hands-on full-stack development experience',
        'Expertise across React, Next.js, Node.js, and WordPress custom plugins',
        'Proven track record with top-rated client reviews & 100% job success rate',
        'Seamless communication, fast response times, and ongoing post-launch support',
    ];

    return (
        <section className="py-24 bg-[#F8FAFC] border-t border-slate-200/80 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column — Marketing Pitch */}
                    <div className="space-y-6">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block">
                            Custom Web Development Services
                        </span>

                        {/* Headline using FuzzyText tightly aligned */}
                        <h2 className="sr-only">Have a Project in Mind? Let's Build It Together.</h2>
                        <div className="flex flex-col gap-0 -ml-3" aria-hidden="true">
                            <FuzzyText fontSize={36} fontWeight={900} color="#0F172A" align="left" baseIntensity={0.12} hoverIntensity={0.35}>
                                Have a Project in Mind?
                            </FuzzyText>
                            <FuzzyText fontSize={40} fontWeight={900} color="#F59E0B" align="left" baseIntensity={0.18} hoverIntensity={0.45}>
                                Let's Build It Together.
                            </FuzzyText>
                        </div>

                        <p className="text-base text-brand-slate leading-relaxed">
                            Whether you need a modern web application, custom WordPress architecture, or an automated workflow integration — I'm here to turn your vision into a scalable, high-converting digital product.
                        </p>

                        <div className="space-y-3 pt-2">
                            {valueProps.map((prop, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>{prop}</span>
                                </div>
                            ))}
                        </div>

                        {/* Direct Email Badge */}
                        <div className="pt-4 flex flex-wrap items-center gap-4">
                            <a
                                href="mailto:rowellblanca94@gmail.com"
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md text-brand-navy font-bold text-sm hover:border-brand-amber transition-all"
                            >
                                <Mail className="h-4 w-4 text-brand-amber" />
                                rowellblanca94@gmail.com
                            </a>

                            <div className="flex items-center gap-2">
                                {socialMedia.map(({ title, icon: Icon, url }, index) => (
                                    <a
                                        key={index}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={title}
                                        className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-amber hover:border-amber-300 shadow-xs transition-all"
                                    >
                                        <Icon size="20" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column — Availability & Offer Card */}
                    <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-xl space-y-6 relative">
                        <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 rounded-full bg-brand-amber text-brand-navy font-extrabold text-xs uppercase tracking-wider shadow-md">
                            Direct Inquiry
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-extrabold text-brand-navy">
                                Fast Turnaround & Dedicated Support
                            </h3>
                            <p className="text-sm text-brand-slate">
                                Open for new projects, custom feature development, and long-term retainer engagements.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-2">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
                                    <Clock className="h-4 w-4 text-brand-amber" /> Response Time
                                </div>
                                <p className="text-base font-extrabold text-brand-navy">Under 24 Hours</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> Availability
                                </div>
                                <p className="text-base font-extrabold text-brand-navy">Open for New Work</p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="w-full inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-amber-500 hover:bg-slate-900 text-slate-950 hover:text-white font-extrabold text-sm shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                            >
                                <MessageSquare className="h-4 w-4 text-slate-950 group-hover:text-amber-400 transition-colors" />
                                Send a Message or Request a Quote
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Popup Contact Modal */}
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </section>
    );
}