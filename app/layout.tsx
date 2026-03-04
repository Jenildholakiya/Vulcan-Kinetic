"use client";
import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HudCursor from "@/components/HudCursor";
import TacticalTheme from "@/components/TacticalTheme";
import VulcanLoader from "@/components/VulcanLoader"; // Ensure this file exists

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  return (
    <html lang="en" className="bg-black text-white selection:bg-orange-600 selection:text-black">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* The Loader sits at the highest z-index to block Navbar/Content during boot */}
        {loading && <VulcanLoader onComplete={() => setLoading(false)} />}

        <TacticalTheme>
          <HudCursor />
          {/* We wrap the main content in a transition div to reveal it after loading */}
          <div className={loading ? "opacity-0 invisible h-screen overflow-hidden" : "opacity-100 visible transition-opacity duration-1000"}>
            <SmoothScroll>
              <Navbar />
              <main className="relative z-10">
                {children}
              </main>
              <Footer />
            </SmoothScroll>
          </div>
        </TacticalTheme>
      </body>
    </html>
  );
}