import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Script from "next/script";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flico Consultancy",

  other: {
    "stylesheet-icons":
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} data-scroll-behavior="smooth"
      data-theme="light"
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-grow pb-4">
          {children}
        </main>
        <Footer />
        {/*<Script*/}
        {/*  src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"*/}
        {/*  strategy="lazyOnload"*/}
        {/*/>*/}
      </body>
    </html>
  );
}
