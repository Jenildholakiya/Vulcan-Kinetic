"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const links = [
  { name: "Systems", href: "/programs", code: "01" },
  { name: "Faculty", href: "/trainers", code: "02" },
  { name: "Access", href: "/membership", code: "03" },
  { name: "Contact", href: "/contact", code: "04" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Hide/Show on Scroll Logic
    const showAnim = gsap.from(navRef.current, {
      yPercent: -100,
      paused: true,
      duration: 0.4,
      ease: "power2.out"
    }).progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        setIsScrolled(self.scroll() > 50);
        self.direction === -1 ? showAnim.play() : showAnim.reverse();
      }
    });
  }, []);

  // 2. Mobile Menu Animation (Clip Path Reveal)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scroll when menu open
      gsap.to(menuRef.current, { clipPath: "circle(150% at 100% 0%)", duration: 0.8, ease: "power4.inOut" });
      gsap.fromTo(".menu-link",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power4.out", delay: 0.3 }
      );
    } else {
      document.body.style.overflow = "unset";
      gsap.to(menuRef.current, { clipPath: "circle(0% at 100% 0%)", duration: 0.6, ease: "power4.inOut" });
    }
  }, [isOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>, speed = 0.3) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * speed;
    const y = (clientY - (top + height / 2)) * speed;
    gsap.to(currentTarget, { x, y, duration: 0.3, ease: "power3.out" });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-[110] transition-all duration-500 px-6 md:px-12 py-4 ${
          isScrolled || isOpen ? "bg-black/80 backdrop-blur-xl border-b border-white/10 py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="group flex items-center gap-3 relative z-[120]">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 border border-orange-600 rotate-45 group-hover:rotate-90 transition-transform duration-700" />
              <div className="w-2 h-2 bg-white group-hover:bg-orange-600 transition-colors" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-[0.2em] uppercase">VULCAN<span className="text-orange-600">.</span>K</span>
              <span className="text-[7px] tracking-[0.5em] text-white/40 uppercase">Advanced Tactics</span>
            </div>
          </Link>

          {/* DESKTOP LINKS - Hidden on Mobile */}
          <div className="hidden lg:flex items-center gap-12">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onMouseMove={(e) => handleMouseMove(e)}
                onMouseLeave={handleMouseLeave}
                className="group relative py-2"
              >
                <div className="flex items-start gap-1">
                  <span className="text-[8px] font-bold text-orange-600 mt-1">{link.code}</span>
                  <div className="relative overflow-hidden">
                    <span className="block text-[11px] font-black uppercase tracking-[0.3em] transition-transform duration-500 group-hover:-translate-y-full">{link.name}</span>
                    <span className="absolute top-0 left-0 block text-[11px] font-black uppercase tracking-[0.3em] text-orange-600 transition-transform duration-500 translate-y-full group-hover:translate-y-0">{link.name}</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-600 transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE: CTA + MOBILE TOGGLE */}
          <div className="flex items-center gap-8 relative z-[120]">
            <Link href="/contact" className="hidden sm:block group relative px-6 py-3 overflow-hidden bg-white">
              <div className="absolute inset-0 bg-orange-600 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-black group-hover:text-white">Establish Connection</span>
            </Link>

            {/* HAMBURGER TOGGLE - Hidden on Desktop (lg:hidden) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex lg:hidden flex-col gap-1.5 justify-center items-center w-10 h-10 group"
            >
              <div className={`h-[2px] w-8 bg-white transition-all duration-500 ${isOpen ? "rotate-45 translate-y-[8px] bg-orange-600" : ""}`} />
              <div className={`h-[2px] w-8 bg-white transition-all duration-500 ${isOpen ? "opacity-0" : "opacity-100"}`} />
              <div className={`h-[2px] w-8 bg-white transition-all duration-500 ${isOpen ? "-rotate-45 -translate-y-[8px] bg-orange-600" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY MENU - Only functional when triggered by hamburger */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-black z-[105] flex flex-col justify-center px-8 md:px-24"
        style={{ clipPath: "circle(0% at 100% 0%)" }}
      >
        <div className="flex flex-col gap-6">
          <span className="text-orange-600 text-xs font-black uppercase tracking-[0.5em] mb-4 opacity-50">Menu Navigation</span>
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="menu-link group flex items-baseline gap-4"
            >
              <span className="text-sm font-bold text-orange-600/40">{link.code}</span>
              <span className="text-5xl md:text-8xl font-black uppercase tracking-tighter transition-all group-hover:italic group-hover:pl-4 group-hover:text-orange-600">
                {link.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Decorative Background Element */}
        <div className="absolute bottom-10 right-10 pointer-events-none opacity-10 text-right">
          <span className="text-[10vw] font-black uppercase leading-none block">NODE</span>
          <span className="text-[10vw] font-black uppercase leading-none block text-orange-600">04</span>
        </div>
      </div>
    </>
  );
}