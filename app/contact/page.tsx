"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  // Memoize random bars for the HUD to prevent hydration mismatch
  const barHeights = useMemo(() => Array.from({ length: 15 }, () => Math.floor(Math.random() * 80) + 20), []);

  useEffect(() => {
    setMounted(true);
    const lenis = new Lenis({ duration: 1.5, smoothWheel: true });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // 1. Initial Scanning Reveal
      const tl = gsap.timeline();
      tl.from(".laser-line", { scaleX: 0, duration: 1.5, ease: "power4.inOut", stagger: 0.1 })
        .from(".terminal-text", { opacity: 0, y: 20, duration: 0.8, stagger: 0.05, ease: "expo.out" }, "-=0.5");

      // 2. Hide HUD on Final Footer entry
      ScrollTrigger.create({
        trigger: ".standalone-footer",
        start: "top bottom",
        onEnter: () => gsap.to(".fixed-hud", { opacity: 0, duration: 0.4 }),
        onLeaveBack: () => gsap.to(".fixed-hud", { opacity: 1, duration: 0.4 }),
      });

      // 3. Constant Background Scan
      gsap.to(".scan-bar", { top: "100%", duration: 4, repeat: -1, ease: "none" });

      // 4. Cursor HUD Follow
      const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        gsap.to(".hud-cursor", { x: e.clientX, y: e.clientY, duration: 0.1 });
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => { ctx.revert(); lenis.destroy(); };
  }, []);

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);
    gsap.to(".terminal-container", {
      x: "random(-5, 5)",
      y: "random(-5, 5)",
      duration: 0.1,
      repeat: 10,
      yoyo: true,
      onComplete: () => setIsTransmitting(false)
    });
  };

  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <main ref={containerRef} className="relative bg-black text-white cursor-none overflow-x-hidden selection:bg-orange-600 selection:text-black">

      {/* HUD ELEMENTS - Hidden on footer scroll */}
      <div className="fixed-hud fixed inset-0 pointer-events-none z-[100] transition-opacity duration-500">
        {/* HUD CURSOR */}
        <div className="hud-cursor fixed top-0 left-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="absolute inset-0 border border-orange-600/30 rounded-full animate-ping" />
          <div className="absolute w-full h-[1px] bg-orange-600/40" />
          <div className="absolute h-full w-[1px] bg-orange-600/40" />
          <span className="absolute -bottom-6 left-6 text-[8px] font-mono text-orange-600 uppercase whitespace-nowrap">
            LOC_DATA: {mousePos.x}PX / {mousePos.y}PX
          </span>
        </div>

        {/* SCAN BAR */}
        <div className="scan-bar absolute top-0 left-0 w-full h-[2px] bg-orange-600/20 z-10 shadow-[0_0_15px_#ea580c]" />

        {/* SIDEBAR DATA */}
        <div className="fixed left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-10 opacity-30">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col gap-2">
              <span className="text-[8px] font-mono rotate-90 origin-left tracking-[0.5em]">UPLINK_STREAM_0{i}</span>
              <div className="w-[1px] h-12 bg-white" />
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="terminal-container relative z-20 pt-48 pb-20 px-6 md:px-24 max-w-[1800px] mx-auto min-h-screen flex flex-col justify-center">
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="laser-line w-16 h-[2px] bg-orange-600 origin-left" />
            <span className="terminal-text text-[10px] font-mono text-orange-600 uppercase tracking-[0.8em]">Secure Uplink // Initialized</span>
          </div>
          <h1 className="terminal-text text-[8vw] font-black uppercase tracking-tighter leading-[0.8] italic">
            Establish <br /> <span className="text-orange-600">Contact</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* LEFT: SYSTEM LOGS */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-4 border-l border-orange-600 pl-6">
              <span className="terminal-text block text-[9px] text-white/40 uppercase tracking-widest">Protocol Diagnostic</span>
              <p className="terminal-text text-sm font-medium text-white/60 leading-relaxed uppercase tracking-widest italic">
                State your mission objectives. Encrypted packets are routed through Vulcan High Command nodes with zero-latency priority.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["NODE_RAJKOT", "X_TACTICAL", "FREQ_88.4", "AES_256"].map(item => (
                <div key={item} className="border border-white/10 p-4 text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  {item}
                </div>
              ))}
            </div>

            {/* Live Signal Visualizer */}
            <div className="flex gap-1 h-12 items-end">
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  className="w-[2px] bg-orange-600/40"
                  style={{
                    height: `${h}%`,
                    animationName: 'ekg-pulse',
                    animationDuration: '0.8s',
                    animationIterationCount: 'infinite',
                    animationDirection: 'alternate',
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: FORM */}
          <form onSubmit={handleTransmit} className="lg:col-span-8 space-y-16">
            <div className="group relative">
              <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white group-focus-within:text-orange-600 block mb-2">01 // CALLSIGN</label>
              <input required type="text" placeholder="IDENTIFY OPERATOR" className="w-full bg-transparent border-none py-4 text-4xl md:text-5xl font-black uppercase tracking-tighter focus:outline-none placeholder:text-white/5 italic" />
              <div className="laser-line absolute bottom-0 left-0 w-full h-[1px] bg-white/10 origin-left" />
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-600 group-focus-within:w-full transition-all duration-700" />
            </div>

            <div className="group relative">
              <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white group-focus-within:text-orange-600 block mb-2">02 // SIGNAL_PATH</label>
              <input required type="email" placeholder="SECURE_UPLINK@HOST.COM" className="w-full bg-transparent border-none py-4 text-4xl md:text-5xl font-black uppercase tracking-tighter focus:outline-none placeholder:text-white/5 italic" />
              <div className="laser-line absolute bottom-0 left-0 w-full h-[1px] bg-white/10 origin-left" />
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-600 group-focus-within:w-full transition-all duration-700" />
            </div>

            <div className="group relative">
              <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white group-focus-within:text-orange-600 block mb-2">03 // DIRECTIVE</label>
              <textarea required rows={2} placeholder="STATE OBJECTIVES..." className="w-full bg-transparent border-none py-4 text-2xl md:text-3xl font-black uppercase tracking-tighter focus:outline-none placeholder:text-white/5 italic resize-none" />
              <div className="laser-line absolute bottom-0 left-0 w-full h-[1px] bg-white/10 origin-left" />
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-600 group-focus-within:w-full transition-all duration-700" />
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={isTransmitting} className="group relative px-16 py-8 border-2 border-orange-600 overflow-hidden transition-all cursor-pointer hover:shadow-[0_0_40px_rgba(234,88,12,0.3)]">
                <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
                <span className="relative z-10 text-[10px] font-black uppercase tracking-[1em] text-white group-hover:text-black transition-colors">
                  {isTransmitting ? "TRANSMITTING..." : "EXECUTE_COMMAND"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* STANDALONE FOOTER - Separated from HUD logic */}
      <section className="standalone-footer relative h-[100vh] flex flex-col items-center justify-center bg-zinc-950 z-[120] px-10 text-center border-t border-white/5">
        <div className="absolute top-0 w-full h-[1px] bg-orange-600 shadow-[0_0_20px_#ea580c] animate-pulse" />
        <div className="text-[25vw] font-black text-white/[0.02] absolute leading-none select-none italic tracking-tighter uppercase">VULCAN</div>
        <div className="relative z-10 space-y-12">
            <div className="space-y-4">
                <span className="text-orange-600 font-mono text-[10px] tracking-[1em] uppercase">Communication_End</span>
                <h2 className="text-5xl md:text-[10vw] font-black uppercase tracking-tighter leading-none italic">
                  Ready to <br /> <span className="text-orange-600">Forge</span>?
                </h2>
            </div>
            <button className="group flex items-center gap-8 mx-auto bg-orange-600 px-12 py-7 rounded-full transition-all duration-500 hover:bg-white cursor-pointer">
                <span className="text-black font-black uppercase tracking-[0.4em] text-sm">Deploy Protocol</span>
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                    <span className="text-orange-600 text-2xl">→</span>
                </div>
            </button>
            <div className="pt-24 opacity-20 font-mono text-[9px] uppercase tracking-[1em]">
                System_Node // 2026 // VULCAN_KINETICS
            </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes ekg-pulse { from { opacity: 0.1; transform: scaleY(0.4); } to { opacity: 0.8; transform: scaleY(1); } }
      `}</style>
    </main>
  );
}