import Link from "next/link";

export default function PrimaryButton({ label, link, className }) {
    return (
        <>
            <Link href={link} className={`${className} inline-block px-12 py-4 rounded-full bg-accent-color font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-accent-color-slate transition-colors duration-200`}>
                {label}
            </Link>
        </>
    );
}