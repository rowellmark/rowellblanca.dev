import type { Metadata } from "next";
import Head from "next/head"; // Import Head component from next/head
import { ReactNode } from "react"; // Import ReactNode type
import "./globals.css";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";


export const metadata: Metadata & { metadataBase: URL } = {
  title: "Rowell Mark Blanca - I build things for the web.",
  description: "I specialize in crafting innovative digital experiences on the web, leveraging cutting-edge technologies and creative design to build engaging and user-friendly websites and applications.",
  metadataBase: new URL("https://www.rowellblanca.dev")
};

interface RootLayoutProps {
  children: ReactNode; // Specify children prop as ReactNode type
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <Head>
        {/* Set the meta tags for title, description, and image */}
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
        <meta property="og:title" content={metadata.title as string} />
        <meta property="og:description" content={metadata.description as string} />
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />
        <meta name="twitter:image" content="<generated>" />
        <meta name="twitter:image:type" content="<generated>" />
        <meta name="twitter:image:width" content="<generated>" />
        <meta name="twitter:image:height" content="<generated>" />
      </Head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
