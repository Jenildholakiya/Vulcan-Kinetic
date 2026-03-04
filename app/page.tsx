"use client";
  import { useEffect, useRef, useState, useMemo } from "react";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import Image from "next/image";

  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  export default function HomePage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Fix Hydration Mismatch for visual HUD elements
    const signalBars = useMemo(() => Array.from({ length: 20 }, () => Math.floor(Math.random() * 80) + 20), []);

    useEffect(() => {
      setMounted(true);

      const ctx = gsap.context(() => {
        // 1. Cinematic Hero Entrance
        const heroTl = gsap.timeline();
        heroTl.from(".hero-title-char", {
          y: 150,
          opacity: 0,
          rotateX: -100,
          stagger: 0.04,
          duration: 1.8,
          ease: "expo.out",
        })
        .from(".hero-line", {
          scaleX: 0,
          duration: 1.5,
          ease: "power4.inOut"
        }, "-=1.2")
        .from(".hero-sub, .hero-btn", {
          opacity: 0,
          y: 30,
          stagger: 0.2,
          duration: 1.2,
          ease: "power3.out"
        }, "-=1");

        // 2. Parallax Zoom Effect
        gsap.to(".hero-bg-img", {
          scale: 1.4,
          filter: "blur(10px)",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });

        // 3. Image Reveal Scans
        gsap.from(".feature-image-wrap", {
          clipPath: "inset(0% 100% 0% 0%)",
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: ".feature-grid",
            start: "top 70%",
          }
        });

        // 4. Kinetic Card Reveal
        gsap.utils.toArray<HTMLElement>(".kinetic-card").forEach((card, i) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
            x: i % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
          });
        });

        // 5. HUD Element Float
        gsap.to(".hud-float", {
          y: "random(-20, 20)",
          x: "random(-10, 10)",
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

      }, containerRef);

      return () => ctx.revert();
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        rotateX: -y * 0.1,
        rotateY: x * 0.1,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      gsap.to(e.currentTarget, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)"
      });
    };

    if (!mounted) return <div className="bg-[#050505] min-h-screen" />;

    return (
      <main ref={containerRef} className="relative bg-[#050505] text-white overflow-hidden selection:bg-orange-600 selection:text-black">

        {/* PERSISTENT TACTICAL HUD */}
        <div className="fixed inset-0 pointer-events-none z-[60]">
          <div className="absolute top-10 left-10 flex items-center gap-4 hud-float">
            <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse shadow-[0_0_10px_#ea580c]" />
            <span className="text-orange-600 font-mono text-[9px] tracking-[0.5em] uppercase font-bold italic">VULCAN_OS // TERMINAL_ALPHA</span>
          </div>
          <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2">
              <span className="text-[8px] font-mono opacity-20 uppercase tracking-widest italic">Biometric_Signal</span>
              <div className="flex gap-1 h-8 items-end">
                  {signalBars.slice(0, 12).map((h, i) => (
                      <div key={i} className="w-[1px] bg-orange-600/50" style={{ height: `${h}%` }} />
                  ))}
              </div>
          </div>
        </div>

        {/* SECTION 1: HERO */}
        <section className="hero-section relative h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="hero-bg-img absolute inset-0 z-0 scale-110">
            <Image
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070"
              alt="Vulcan Athletics"
              fill
              className="object-cover brightness-[0.35] contrast-125 grayscale"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/90" />
          </div>

          <div className="relative z-10 text-center">
            <div className="hero-line w-24 h-[1px] bg-orange-600 mx-auto mb-10" />
            <h1 className="text-[15vw] font-black uppercase italic tracking-tighter leading-[0.75] perspective-1000">
              {"VULCAN".split("").map((char, i) => (
                <span key={i} className="hero-title-char inline-block">{char}</span>
              ))}
              <span className="hero-title-char text-orange-600 not-italic">.</span>
              <br />
              {"KINETICS".split("").map((char, i) => (
                <span key={i} className="hero-title-char inline-block">{char}</span>
              ))}
            </h1>
            <p className="hero-sub text-white/30 font-mono text-[10px] md:text-xs tracking-[0.8em] uppercase mt-8 italic">
              Engineered for biological dominance
            </p>

            <button
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="hero-btn group relative mt-16 px-16 py-6 overflow-hidden border border-white/10 hover:border-orange-600 transition-colors cursor-pointer outline-none"
            >
              <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.5em] group-hover:text-black transition-colors duration-300">Initiate Baseline</span>
              <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-[0.19,1,0.22,1]" />
            </button>
          </div>
        </section>

        {/* SECTION 2: MARQUEE */}
        <div className="py-24 border-y border-white/5 bg-zinc-950 overflow-hidden relative">
          <div className="flex whitespace-nowrap gap-10 animate-marquee-slow">
              {[1,2,3].map(i => (
                  <span key={i} className="text-9xl font-black italic uppercase text-white/5 tracking-tighter select-none">
                      Forge Your Elite Physique • Neural Mapping • Kinetic Load • Biological Dominance •
                  </span>
              ))}
          </div>
        </div>

        {/* SECTION 3: FEATURES GRID */}
        <section className="feature-grid py-48 px-6 md:px-20 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
              <div className="lg:col-span-5 space-y-12">
                  <div className="space-y-4">
                      <span className="text-orange-600 font-mono text-[10px] tracking-[1em] uppercase italic">01 // High Order</span>
                      <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">Built for <br /> <span className="text-zinc-800">Impact</span>.</h2>
                  </div>
                  <p className="text-white/40 text-lg md:text-xl leading-relaxed italic uppercase tracking-widest max-w-md">
                      We bridge the gap between cognitive intent and physical execution through advanced sensor-feedback loops.
                  </p>
                  <div className="grid grid-cols-2 gap-12">
                      {[
                          { label: "Absolute Power", val: "98%" },
                          { label: "CNS Latency", val: "0.2ms" }
                      ].map(stat => (
                          <div key={stat.label} className="border-l-2 border-orange-600 pl-8 py-2">
                              <span className="text-[10px] text-white/20 uppercase tracking-widest block mb-2 italic">{stat.label}</span>
                              <span className="text-4xl font-black italic">{stat.val}</span>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="lg:col-span-7 relative aspect-[4/3] feature-image-wrap overflow-hidden border border-white/5">
                  <Image
                      src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=2070"
                      alt="Tactical Training"
                      fill
                      className="object-cover object-[center_20%] grayscale brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent mix-blend-overlay" />
              </div>
          </div>
        </section>

        {/* SECTION 4: KINETIC CARDS */}
        <section className="py-48 bg-[#080808] px-6 md:px-20 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
          <div className="text-center mb-32 space-y-4">
              <span className="text-orange-600 font-mono text-[10px] tracking-[1.2em] uppercase">Nodes // Calibration</span>
              <h2 className="text-6xl md:text-[10vw] font-black uppercase italic tracking-tighter text-zinc-900">Protocols.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1700px] mx-auto relative z-10">
              {[
                  { id: "01", title: "KINETICS", desc: "Explosive force development through neurological synchronization." },
                  { id: "02", title: "METCON", desc: "High-density metabolic conditioning for oxidative threshold expansion." },
                  { id: "03", title: "DECOM", desc: "Structural integrity and joint decompression for movement economy." }
              ].map((card) => (
                  <div key={card.id} className="kinetic-card group relative p-16 bg-white/[0.01] border border-white/5 hover:border-orange-600/40 transition-all duration-1000 cursor-default">
                      <span className="text-5xl font-mono text-orange-600 font-black italic opacity-10 group-hover:opacity-100 transition-opacity">[{card.id}]</span>
                      <h3 className="text-5xl font-black uppercase italic tracking-tighter my-10">{card.title}</h3>
                      <p className="text-white/30 text-sm leading-loose uppercase tracking-[0.2em] italic">{card.desc}</p>
                      <div className="mt-16 w-full h-[1px] bg-white/10 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full bg-orange-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                      </div>
                  </div>
              ))}
          </div>
        </section>

        {/* SECTION 5: FINAL CALL */}
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          <div className="text-[35vw] font-black text-white/[0.01] absolute leading-none select-none italic uppercase tracking-tighter -bottom-20">
              VULCAN
          </div>
          <div className="relative z-10 space-y-16">
              <div className="space-y-4">
                  <span className="text-orange-600 font-mono text-xs tracking-[1.5em] uppercase">Signal_End</span>
                  <h2 className="text-7xl md:text-[12vw] font-black uppercase tracking-tighter leading-none italic">
                      Beyond <br /> <span className="text-orange-600 underline underline-offset-[20px] decoration-orange-600/20">Calibration</span>.
                  </h2>
              </div>
              <button
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group relative px-24 py-8 bg-orange-600 rounded-full hover:bg-white transition-all duration-700 hover:scale-110 cursor-pointer outline-none"
              >
                  <span className="relative z-10 text-black font-black uppercase tracking-[0.8em] text-xs transition-colors duration-500">Deploy Protocol</span>
              </button>
          </div>
        </section>

        <style jsx>{`
          .animate-marquee-slow { animation: marquee 80s linear infinite; }
          @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .perspective-1000 { perspective: 1000px; }
        `}</style>
      </main>
    );
  }