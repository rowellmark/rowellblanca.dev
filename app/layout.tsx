import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export const metadata: Metadata = {
  title: "Rowell Mark Blanca - I build things for the web.",
  description: "I specialize in crafting innovative digital experiences on the web, leveraging cutting-edge technologies and creative design to build engaging and user-friendly websites and applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header /> 
        {children}
        <Footer />
        </body>
    </html>
  );
}
