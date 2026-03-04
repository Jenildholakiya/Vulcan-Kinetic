"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PROGRAMS = [
  {
    id: "01",
    title: "HYPERTROPHY",
    tagline: "MECHANICAL_TENSION",
    desc: "Strategic mass development focusing on high-order motor unit recruitment. Engineered for myofibrillar density and sarcoplasmic expansion.",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
    stats: { volume: 92, density: 85, tension: 78 },
    biometric: { bpm: "142", neural: "0.4ms", load: "880kg" }
  },
  {
    id: "02",
    title: "POWERLIFT",
    tagline: "CNS_ADAPTATION",
    desc: "Mastery of the Big Three. Optimizing neurological firing patterns and leverage mechanics to maximize absolute force production.",
    img: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=2070",
    stats: { torque: 98, load: 99, neural: 94 },
    biometric: { bpm: "168", neural: "0.1ms", load: "1200kg" }
  },
  {
    id: "03",
    title: "CALISTHENICS",
    tagline: "RELATIVE_STRENGTH",
    desc: "Absolute body control and high-skill gymnastics. Developing core-to-extremity power through advanced leverage and isometric holds.",
    img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2070",
    stats: { balance: 88, mobility: 90, core: 95 },
    biometric: { bpm: "135", neural: "0.2ms", load: "BODYWEIGHT" }
  },
  {
    id: "04",
    title: "METCON",
    tagline: "OXIDATIVE_THRESHOLD",
    desc: "High-intensity metabolic conditioning circuits. Elevating anaerobic threshold and cardiovascular durability through dense work intervals.",
    img: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?q=80&w=2070",
    stats: { bpm: 96, stamina: 89, recovery: 82 },
    biometric: { bpm: "185", neural: "0.6ms", load: "VO2_MAX" }
  },
];

export default function ProgramsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Fix Hydration: Memoize random heights once
  const barHeights = useMemo(() => Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 20), []);

  useEffect(() => {
    setMounted(true);
    const lenis = new Lenis({ duration: 1.5, smoothWheel: true });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // 1. HUD Fade Logic (Prevents footer overlap)
      ScrollTrigger.create({
        trigger: ".standalone-footer",
        start: "top bottom",
        onEnter: () => gsap.to(".fixed-hud-layer", { opacity: 0, duration: 0.4 }),
        onLeaveBack: () => gsap.to(".fixed-hud-layer", { opacity: 1, duration: 0.4 }),
      });

      // 2. 3D Tunnel Transition Logic
      PROGRAMS.forEach((_, i) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: `.prog-section-${i}`,
            start: "top top",
            end: "+=100%",
            scrub: true,
            pin: true,
            onEnter: () => setActiveIndex(i),
            onEnterBack: () => setActiveIndex(i),
          }
        });

        tl.to(`.content-wrap-${i}`, {
          scale: 1.2,
          opacity: 0,
          filter: "blur(20px)",
          y: -50,
          ease: "power2.in"
        })
        .to(`.img-bg-${i}`, {
          scale: 1.1,
          opacity: 0,
          ease: "none"
        }, 0);
      });
    }, containerRef);

    return () => { ctx.revert(); lenis.destroy(); };
  }, []);

  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <main ref={containerRef} className="relative bg-black text-white overflow-hidden selection:bg-orange-600 selection:text-black">

      {/* FIXED HUD LAYER: LEFT SIDE BRANDING */}
      <div className="fixed-hud-layer fixed top-10 left-10 z-[100] pointer-events-none transition-opacity duration-500">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />
          <span className="text-orange-600 font-mono text-[9px] tracking-[0.5em] uppercase">Uplink_Live</span>
        </div>
      </div>

      {/* FIXED HUD LAYER: RIGHT SIDE BIOMETRICS (Avoids Overriding via padding) */}
      <div className="fixed-hud-layer fixed top-0 right-0 w-[300px] h-screen z-[100] pointer-events-none hidden xl:flex flex-col justify-center p-10 text-right transition-opacity duration-500">
        <div className="space-y-12">
            <div key={activeIndex + 'bpm'} className="animate-in fade-in slide-in-from-right-4 duration-500">
                <span className="text-orange-600 font-mono text-[10px] tracking-[0.4em] uppercase opacity-40 italic block mb-2">Biometric_HR</span>
                <div className="text-6xl font-black italic">{PROGRAMS[activeIndex].biometric.bpm} <span className="text-xs not-italic opacity-20">BPM</span></div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">[NEURAL]</span>
                    <span className="text-sm font-black italic text-orange-600">{PROGRAMS[activeIndex].biometric.neural}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">[LOAD]</span>
                    <span className="text-sm font-black italic text-orange-600">{PROGRAMS[activeIndex].biometric.load}</span>
                </div>
            </div>

            {/* Hydration-safe EKG graph */}
            <div className="flex gap-1 justify-end h-12 items-end overflow-hidden">
                {barHeights.map((h, idx) => (
                    <div
                        key={idx}
                        className="w-[2px] bg-orange-600/30"
                        style={{
                            height: `${h}%`,
                            animationName: 'ekg-pulse',
                            animationDuration: '0.8s',
                            animationTimingFunction: 'ease-in-out',
                            animationIterationCount: 'infinite',
                            animationDirection: 'alternate',
                            animationDelay: `${idx * 0.05}s`
                        }}
                    />
                ))}
            </div>
        </div>
      </div>

      {/* HERO / LANDING */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.08)_0%,transparent_75%)]" />
        <h1 className="text-8xl md:text-[16vw] font-black italic uppercase tracking-tighter leading-none relative z-10 mix-blend-difference">
            KINETIC<span className="text-orange-600">.</span>OS
        </h1>
        <p className="max-w-xs mt-10 text-white/30 uppercase tracking-[0.6em] text-[8px] relative z-10">
            Scroll to deconstruct <br /> protocol stack
        </p>
      </section>

      {/* TUNNEL STACK (Prevents Override with col-span-7) */}
      {PROGRAMS.map((item, i) => (
        <section key={item.id} className={`prog-section-${i} relative h-screen w-full overflow-hidden flex items-center`}>
          <div className={`img-bg-${i} absolute inset-0 z-0`}>
            <Image src={item.img} alt={item.title} fill priority={i === 0} className="object-cover grayscale contrast-150 brightness-[0.25]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black lg:via-black/20" />
          </div>

          <div className={`content-wrap-${i} relative z-10 w-full max-w-[1600px] px-10 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center`}>
            {/* Limit content width to prevent collision with right biometrics */}
            <div className="lg:col-span-7 space-y-10">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-orange-600" />
                        <span className="text-orange-600 font-mono text-xs tracking-widest uppercase font-bold italic">{item.tagline}</span>
                    </div>
                    <h2 className="text-6xl md:text-[10vw] font-black italic uppercase tracking-tighter leading-[0.8]">{item.title}</h2>
                </div>
                <p className="text-white/40 text-sm md:text-xl max-w-xl leading-relaxed italic">&ldquo;{item.desc}&rdquo;</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
                    {Object.entries(item.stats).map(([k, v]) => (
                        <div key={k} className="space-y-4">
                            <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold italic">{k} // output</span>
                            <div className="text-3xl font-black italic text-orange-600">{v}%</div>
                            <div className="w-full h-[1px] bg-white/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-orange-600 transition-all duration-1000" style={{ width: `${v}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </section>
      ))}

      {/* STANDALONE FOOTER */}
      <section className="standalone-footer relative h-[100vh] flex flex-col items-center justify-center bg-[#000] z-[120] px-10 text-center border-t border-white/5">
        <div className="absolute top-0 w-full h-[1px] bg-orange-600 shadow-[0_0_20px_#ea580c] animate-pulse" />
        <div className="text-[28vw] font-black text-white/[0.02] absolute leading-none select-none italic tracking-tighter uppercase">VULCAN</div>

        <div className="relative z-10 space-y-12">
            <div className="space-y-4">
                <span className="text-orange-600 font-mono text-[10px] tracking-[1em] uppercase">Sequence_End</span>
                <h2 className="text-5xl md:text-[10vw] font-black uppercase tracking-tighter leading-none italic">
                  Join <span className="text-orange-600">The Faculty</span>?
                </h2>
            </div>

            <button className="group flex items-center gap-8 mx-auto bg-orange-600 px-12 py-7 rounded-full transition-all duration-500 hover:bg-white">
                <span className="text-black font-black uppercase tracking-[0.4em] text-sm">Deploy Phase 02</span>
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
        @keyframes ekg-pulse { from { opacity: 0.1; transform: scaleY(0.3); } to { opacity: 0.8; transform: scaleY(1); } }
      `}</style>
    </main>
  );
}