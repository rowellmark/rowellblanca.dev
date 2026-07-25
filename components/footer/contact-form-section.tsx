"use client";

import Contact from "../ui/contactForm";
import { IconBrandGithub, IconBrandLinkedin, IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";

export function ContactFormSection() {
    const socialMedia = [
        { title: 'GitHub', icon: IconBrandGithub, url: 'https://github.com/rowellmark' },
        { title: 'LinkedIn', icon: IconBrandLinkedin, url: 'https://www.linkedin.com/in/rowell-blanca/' },
        { title: 'Facebook', icon: IconBrandFacebook, url: 'https://www.facebook.com/itsmrrowrow' },
        { title: 'Instagram', icon: IconBrandInstagram, url: 'https://www.instagram.com/its.mr.row/' },
    ];

    return (
        <section className="py-24 bg-white border-t border-slate-200/80">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    <div className="space-y-6">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-amber bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                            Get In Touch
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight leading-snug">
                            Available for select contract & freelance opportunities
                        </h2>
                        <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
                            Have an exciting web app, custom WordPress plugin, or frontend engineering project? Send me a message and I'll get back to you within 24 hours.
                        </p>

                        <div className="pt-2 space-y-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Connect On Social</span>
                            <div className="flex items-center gap-2">
                                {socialMedia.map(({ title, icon: Icon, url }, index) => (
                                    <a
                                        key={index}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={title}
                                        className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-amber hover:border-amber-300 transition-all shadow-xs"
                                    >
                                        <Icon size="18" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 shadow-md">
                        <h3 className="text-xl font-extrabold text-brand-navy mb-4">Send a Message</h3>
                        <Contact />
                    </div>

                </div>
            </div>
        </section>
    );
}