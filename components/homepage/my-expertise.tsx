'use client'
export default function MyExpertise() {
    return (
        <>
            <div className="myExpertise py-48 px-48  relative  max-sm:px-8 max-sm:py-32 max-xl:px-12">
                <div className="myExpertise__container container mx-auto relative z-50">
                    <h2 className="text-white relative z-20 font-bold text-7xl text-center w-full">
                        <span className="block text-text-accent font-medium text-lg uppercase">My</span>
                        Expertise
                    </h2>


                    <div className="myExpertise__boxes flex px-9 mt-16 max-lg:flex-col max-lg:px-0">
                        <div className="myExpertise__box w-1/3 border-2 p-9 max-lg:w-full">
                            <h2 className="text-4xl font-semibold pb-5 max-xl:text-3xl">
                                <strong className="block relative font-semibold">Software</strong>
                                Development
                            </h2>

                            <div className="myExpertise__box--content">
                                <span className="block text-base text-slate-400">&lt;p&gt;</span>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Backend: Node.js (Express.js), PHP (Laravel), WordPress – developing RESTful APIs, custom plugins, and server-side logic</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Database: MySQL, PostgreSQL, MongoDB, Redis – schema design, optimization, and data management</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Mobile: React Native, Flutter</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Security: JWT, OAuth</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">API Integration: REST, GraphQL, WebSockets</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Testing: Cypress, Playwright – end-to-end and unit testing</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Methodologies: Agile – collaborative and iterative development experience</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Tools & Platforms: Git (version control), Composer (PHP dependency management), Docker, CI/CD (GitHub Actions), Cloud (AWS, Azure, Vercel)</p>
                                <span className="block text-base text-slate-400">&lt;&#47;p&gt;</span>
                            </div>

                        </div>
                        <div className="myExpertise__box w-1/3 border-2 p-9 border-l-0 max-lg:w-full max-lg:border-l-2 max-lg:border-t-0">
                            <h2 className="text-4xl font-semibold pb-5 max-xl:text-3xl">
                                <strong className="block relative font-semibold">Front-end</strong>
                                Devevelopment
                            </h2>
                            <div className="myExpertise__box--content">
                                <span className="block text-base text-slate-400">&lt;p&gt;</span>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Core Technologies: HTML5, CSS3, JavaScript (ES6+), TypeScript</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Frameworks & Libraries: React.js, Next.js, Vue.js</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Styling: Tailwind CSS, SASS/SCSS – building responsive and interactive UIs</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Design Tools: Photoshop & Figma (UI/UX design)</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Analytics & SEO: SEO tools, Analytics (Google Analytics)</p>
                                <span className="block text-base text-slate-400">&lt;&#47;p&gt;</span>
                            </div>

                        </div>
                        <div className="myExpertise__box w-1/3 border-2 p-9 border-l-0 max-lg:w-full max-lg:border-l-2 max-lg:border-t-0">
                            <h2 className="text-4xl font-semibold pb-5 max-xl:text-3xl">
                                <strong className="block relative font-semibold">Automation &</strong>
                                Integration
                            </h2>
                            <div className="myExpertise__box--content">
                                <span className="block text-base text-slate-400">&lt;p&gt;</span>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">Workflow Automation: N8N, Dify – workflow automation and integration</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">AI Integration: ChatGPT, Gemini, Llama – leveraging AI for content generation and automation</p>
                                    <p className="border-l-2 border-slate-400 px-5 py-2 ml-5 text-base">CI/CD: GitHub Actions (also fits here for automation aspects)</p>
                                <span className="block text-base text-slate-400">&lt;&#47;p&gt;</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}