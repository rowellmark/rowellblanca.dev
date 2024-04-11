import PrimaryButton from "@/components/buttons/primaryButton";

export default function AboutPage() {
    return (
        <>
            <div className="container mx-auto py-48">
                <div className="max-w-3xl mx-auto  overflow-hidden">

                    <div className="p-6">
                        <h1 className="text-3xl font-semibold text-white-800 mb-4">Who is me?..</h1>

                        <div className="blog-content text-base">

                            <p>As a seasoned Full-stack Engineer with over a decade of experience, I've had the privilege of working with clients across diverse industries and countries. My passion lies in crafting robust and scalable frontend products that prioritize exceptional user experiences. With a keen eye for detail and a commitment to excellence, I strive to deliver solutions that not only meet but exceed client expectations.</p>

                            <h2>Key Technologies</h2>

                            <ul className="pt-16">
                                <li> Frontend: HTML5, CSS3, JavaScript (ES6+), React.js, Next.js</li>
                                <li> Backend: Node.js, PHP.</li>
                                <li>Database: MySQL</li >
                                <li>Tools & Platforms: Git, Docker, Composer</li >
                            </ul>


                            <PrimaryButton label="< Back" link="/" className="mt-10"></PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
}