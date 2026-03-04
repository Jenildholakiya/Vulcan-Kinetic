"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Parallax reveal effect
    gsap.fromTo(containerRef.current,
      { y: -200, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true
        }
      }
    );
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full min-h-screen bg-zinc-950 overflow-hidden flex flex-col justify-end"
    >
      <div ref={containerRef} className="w-full px-10 pb-10">

        {/* Massive Background Text */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none opacity-[0.03]">
          <h2 className="text-[21vw] font-black leading-none uppercase italic italic tracking-tighter">
            VULCAN
          </h2>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">

          {/* Column 1: Mission */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.9]">
              Building the <br /> <span className="text-orange-600 underline underline-offset-8">Human Machine</span>
            </h3>
            <p className="text-zinc-500 max-w-md text-sm uppercase tracking-widest leading-relaxed">
              Vulcan Kinetics is a digital-first physical performance brand. Our methodology combines structural engineering with biological optimization.
            </p>
            <div className="flex gap-4">
               {['IG', 'TW', 'YT'].map((social) => (
                 <div key={social} className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full hover:border-orange-600 hover:text-orange-600 transition-all cursor-pointer font-black text-[10px]">
                   {social}
                 </div>
               ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 space-y-6">
            <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.3em]">Directory</p>
            <ul className="space-y-4">
              {['Programs', 'Faculty', 'Equipment', 'Science', 'Privacy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-xl font-bold uppercase hover:text-orange-600 transition-colors inline-block group">
                    {item} <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Newsletter Architecture */}
          <div className="lg:col-span-4 space-y-6">
            <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.3em]">Stay Optimized</p>
            <div className="relative group">
              <input
                type="text"
                placeholder="ENTER EMAIL"
                className="w-full bg-transparent border-b-2 border-zinc-800 py-4 text-2xl font-black uppercase outline-none focus:border-orange-600 transition-colors placeholder:text-zinc-800"
              />
              <button className="absolute right-0 bottom-4 font-black uppercase text-xs tracking-widest hover:text-orange-600 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
              By subscribing, you agree to our data protocol.
            </p>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] text-zinc-700 font-black tracking-[0.5em] uppercase">
            VertexWeb Architectural Demo © 2026
          </div>
          <div className="flex gap-10">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Rajkot / IN</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest italic">13:42 GMT+5:30</span>
          </div>
        </div>
      </div>
    </footer>
  );
}