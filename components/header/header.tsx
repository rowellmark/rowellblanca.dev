import { FloatingNav } from "@/components/ui/floating-navbar";

export default function Header() {

    const nav = [
        { name: 'Home', link: '/' },
        { name: 'About', link: '/about' }
    ];

    return (
        <>
            <header className="header">

                <FloatingNav navItems={nav} />

                this is the header
            </header>
        </>
    );    
}