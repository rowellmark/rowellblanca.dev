import logo from "@/assets/images/logo.png";
import Image from "next/image";

export default function Footer() {
    return (
        <>
            <footer className="footer text-white flex flex-col justify-center items-center w-full py-10">
                <div className="footer__logo w-16">
                    <Image
                        src={logo}
                        className="mx-auto w-full h-auto"
                        alt="Rowell Mark Blanca"
                        ></Image>
                </div>
                <p className="text-lg uppercase pt-5">© {(new Date().getFullYear())} Crafted by Me.</p>
            </footer>
        </>
    );
}