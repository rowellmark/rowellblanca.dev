'use client'
export default function MyExpertise() {
    return (
        <>
            <div className="myExpertise py-48 px-52 bg-primary-accent relative">
                <div className="myExpertise__container container mx-auto relative z-50">
                    <h2 className="text-white relative z-20 font-bold text-7xl text-center w-full">
                        <span className="block text-text-accent font-medium text-lg uppercase">My</span>
                        Expertise
                    </h2>


                    <div className="myExpertise__boxes flex px-12 mt-16">
                        <div className="myExpertise__box w-1/3 border-2 p-9">
                            <h2 className="text-4xl font-semibold pb-5">
                                <strong className="block relative font-semibold">Software</strong>
                                Development
                            </h2>

                            <div className="myExpertise__box--content">
                                <span className="block text-base text-slate-400">&lt;h3&gt;</span>
                                <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Experienced in both functional and OOP: PHP, JavaScript</p>
                                <span className="block text-base text-slate-400">&lt;&#47;h3&gt;</span>
                            </div>

                        </div>
                        <div className="myExpertise__box w-1/3 border-2 p-9 border-l-0">
                            <h2 className="text-4xl font-semibold pb-5">
                                <strong className="block relative font-semibold">Front-end</strong>
                                Devevelopment
                            </h2>
                            <div className="myExpertise__box--content">
                                <span className="block text-base text-slate-400">&lt;h3&gt;</span>
                                <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Passionate about UI/UX. Over 13 years of development experience in HTML, CSS, JavaScript, Sass, Less, React, NextJS, Figma, Photoshop.</p>
                                <span className="block text-base text-slate-400">&lt;&#47;h3&gt;</span>
                            </div>

                        </div>
                        <div className="myExpertise__box w-1/3 border-2 p-9 border-l-0">
                            <h2 className="text-4xl font-semibold pb-5">
                                <strong className="block relative font-semibold">WordPress</strong>
                                Development
                            </h2>
                            <div className="myExpertise__box--content">
                                <span className="block text-base text-slate-400">&lt;h3&gt;</span>
                                <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Over 13 years of development experience in Theme and Plugin Development</p>
                                <span className="block text-base text-slate-400">&lt;&#47;h3&gt;</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}