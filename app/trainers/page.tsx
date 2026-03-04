"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const trainers = [
  {
    id: "01",
    name: "Viktor Vance",
    role: "Lead Systems Architect",
    specialty: "Neural Integration",
    experience: "15+ Years Special Ops",
    origin: "Berlin, DE",
    bio: "Pioneer in neural-link feedback loops. Vance specializes in bridging the gap between cognitive intent and physical execution.",
    stats: { kinetic: 92, neural: 99, tactical: 95 },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "02",
    name: "Elena Rossi",
    role: "Combat Instructor",
    specialty: "Kinetic Response",
    experience: "Ex-Italian Special Forces",
    origin: "Rome, IT",
    bio: "An expert in high-intensity close-quarters engagement. Rossi focuses on reactive mechanics and explosive movement patterns.",
    stats: { kinetic: 98, neural: 88, tactical: 91 },
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "03",
    name: "Marcus Thorne",
    role: "Strategic Analyst",
    specialty: "High-Stress Ops",
    experience: "Defense Intelligence Agency",
    origin: "London, UK",
    bio: "Specializes in the psychology of stress. Thorne trains the mind to remain analytical when the body is under extreme duress.",
    stats: { kinetic: 85, neural: 94, tactical: 99 },
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "04",
    name: "Sarah Jenkins",
    role: "Bio-Hacking Expert",
    specialty: "Performance Recovery",
    experience: "Olympic Performance Lead",
    origin: "Sydney, AU",
    bio: "Focuses on the biological foundation of performance. Jenkins optimizes recovery windows through advanced metabolic tracking.",
    stats: { kinetic: 89, neural: 96, tactical: 82 },
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function TrainersPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Text Entrance - Slowed down to 2.5s
      gsap.from(".title-char", {
        y: 140,
        rotate: 10,
        opacity: 0,
        stagger: 0.08, // Increased stagger for "letter by letter" feel
        duration: 2.5,
        ease: "expo.out",
      });

      // 2. Skew Card on Scroll - Slowed velocity response
      let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".trainer-card", "skewY", "deg"),
        clamp = gsap.utils.clamp(-15, 15);

      ScrollTrigger.create({
        onUpdate: (self) => {
          let skew = clamp(self.getVelocity() / -600); // Divided by higher number to reduce sensitivity
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 1.2, // Lingers 50% longer
              ease: "power3",
              overwrite: true,
              onUpdate: () => skewSetter(proxy.skew),
            });
          }
        },
      });

      // 3. Image Reveal (Mask Scaling) - Slower transition
      gsap.utils.toArray<HTMLElement>(".image-mask").forEach((mask) => {
        gsap.to(mask, {
          scrollTrigger: {
            trigger: mask,
            start: "top 90%", // Starts slightly later
            toggleActions: "play none none reverse",
          },
          scaleY: 0,
          duration: 2.5, // Much slower reveal
          ease: "expo.inOut",
        });
      });

      // 4. Horizontal Scrolling Text (Marquee) - SLOWED SIGNIFICANTLY
      gsap.to(".marquee-inner", {
        scrollTrigger: {
          trigger: ".horizontal-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 4, // Increased from 1.5 to 4. Higher = More lag/Slower
        },
        xPercent: -30, // Reduced travel distance to slow it down further
        ease: "none",
      });

      // 5. Stat Bar Entrance
      gsap.utils.toArray<HTMLElement>(".stat-bar").forEach((bar) => {
        const width = bar.dataset.width;
        gsap.to(bar, {
          scrollTrigger: {
            trigger: bar,
            start: "top 95%",
          },
          width: `${width}%`,
          duration: 3, // Slower filling of bars
          ease: "expo.out",
        });
      });

      // 6. Tactical Magnetic Card Hover - Smoother tracking
      const cards = gsap.utils.toArray<HTMLElement>(".trainer-card");
      cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.10; // Reduced multiplier
          const y = (e.clientY - rect.top - rect.height / 2) * 0.10;

          gsap.to(card, {
            x,
            y,
            rotateX: -y * 0.3, // Subtle tilt
            rotateY: x * 0.3,
            duration: 1.2, // Slower follow
            ease: "power3.out"
          });

          gsap.to(card.querySelector(".trainer-image"), {
            scale: 1.12,
            duration: 1.5 // Slower zoom
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 1.5, ease: "power3.out" });
          gsap.to(card.querySelector(".trainer-image"), { scale: 1.1, duration: 1.5 });
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative bg-[#0a0a0a] text-white overflow-x-hidden">
        {/* Rest of the component JSX remains the same */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />

        <section className="min-h-[80vh] pt-40 px-6 md:px-16 flex flex-col justify-center">
            <div className="max-w-[1600px] mx-auto w-full text-center">
                <div className="flex items-center justify-center gap-6 mb-8">
                <div className="w-20 h-[1px] bg-orange-600 animate-expand-line" />
                <span className="text-orange-600 uppercase tracking-[0.8em] text-[10px] font-black">
                    Faculty Dossier // Vulcan Alpha
                </span>
                <div className="w-20 h-[1px] bg-orange-600 animate-expand-line" />
                </div>
                <h1 className="text-7xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.75] italic">
                {"Faculty".split("").map((char, i) => (
                    <span key={i} className="title-char inline-block">{char}</span>
                ))}
                <span className="title-char text-orange-600 not-italic">.</span>
                </h1>
            </div>
        </section>

        <section className="py-20 px-6 md:px-16">
            <div className="trainer-grid max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-48">
                {trainers.map((trainer) => (
                <div key={trainer.id} className="trainer-card group perspective-1000 relative">
                    <div className="relative aspect-[4/5] mb-12 overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
                    <div className="image-mask absolute inset-0 bg-orange-600 z-20 origin-top" />
                    <Image
                        src={trainer.image}
                        alt={trainer.name}
                        fill
                        className="trainer-image object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-110"
                    />
                    <div className="absolute top-6 left-6 z-30 flex gap-2">
                        <span className="text-[10px] font-mono text-black bg-orange-600 px-3 py-1 font-bold tracking-tighter">ELITE_RANK</span>
                        <span className="text-[10px] font-mono text-orange-600 bg-black/80 px-3 py-1 border border-orange-600/30">ID_{trainer.id}</span>
                    </div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-orange-600 m-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="space-y-8">
                    <div className="flex flex-col gap-2 border-l-2 border-orange-600 pl-6 relative">
                        <h3 className="text-6xl font-black uppercase tracking-tighter italic leading-none group-hover:text-orange-600 transition-colors duration-300">
                        {trainer.name}
                        </h3>
                        <span className="text-white/40 font-mono text-[10px] tracking-[0.4em] uppercase">{trainer.role}</span>
                    </div>

                    <p className="text-white/50 text-sm leading-relaxed max-w-lg font-medium italic">
                        &ldquo;{trainer.bio}&rdquo;
                    </p>

                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                        {Object.entries(trainer.stats).map(([label, value]) => (
                        <div key={label} className="space-y-3">
                            <span className="text-[9px] uppercase tracking-widest text-orange-600 font-black">{label}</span>
                            <div className="h-[2px] w-full bg-white/5 relative">
                            <div data-width={value} className="stat-bar absolute h-full bg-orange-600 w-0 transition-all duration-1000" />
                            </div>
                            <span className="text-xs font-mono">{value}%</span>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
                ))}
            </div>
        </section>

        <section className="horizontal-section py-40 overflow-hidden border-y border-white/10 bg-white flex items-center min-h-[50vh]">
            <div className="marquee-inner whitespace-nowrap flex items-center gap-20 will-change-transform">
                {[1, 2, 3].map((i) => (
                <span key={i} className="text-[20vw] font-black uppercase tracking-tighter italic text-black leading-none flex items-center gap-10">
                    PRECISION IS NOT <span className="w-16 h-16 md:w-32 md:h-32 bg-orange-600 rounded-full" /> OPTIONAL
                    <span className="text-orange-600">•</span>
                    TACTICAL SUPERIORITY
                    <span className="text-orange-600">•</span>
                </span>
                ))}
            </div>
        </section>

        <section className="py-60 px-6 md:px-16 max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                <div className="space-y-12">
                <h2 className="text-8xl font-black uppercase leading-[0.85] tracking-tighter italic">
                    The <span className="text-orange-600">VULCAN</span> <br /> Methodology
                </h2>
                <div className="grid gap-12">
                    <div className="group border-b border-white/5 pb-8 hover:border-orange-600 transition-colors duration-500 cursor-pointer">
                    <h4 className="text-orange-600 font-black text-xs tracking-widest uppercase mb-4">01. Neural Mapping</h4>
                    <p className="text-white/40 text-lg leading-relaxed group-hover:text-white transition-colors">Every operator undergoes deep neural profiling to identify cognitive bottlenecks and reaction lag. We reprogram instinct.</p>
                    </div>
                    <div className="group border-b border-white/5 pb-8 hover:border-orange-600 transition-colors duration-500 cursor-pointer">
                    <h4 className="text-orange-600 font-black text-xs tracking-widest uppercase mb-4">02. Kinetic Calibration</h4>
                    <p className="text-white/40 text-lg leading-relaxed group-hover:text-white transition-colors">Refining movement mechanics through high-fidelity sensor arrays and predictive AI modeling. Efficiency is our only metric.</p>
                    </div>
                </div>
                </div>
                <div className="relative aspect-square flex items-center justify-center">
                <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow" />
                <div className="absolute inset-20 border border-orange-600/20 rounded-full animate-reverse-spin" />
                <span className="text-[12vw] font-black text-white italic opacity-10">V.K</span>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-600 rounded-full blur-md animate-pulse" />
                </div>
            </div>
        </section>

        <footer className="py-40 text-center border-t border-white/5">
            <div className="mb-10 opacity-20 hover:opacity-100 transition-opacity">
            <span className="text-[10vw] font-black italic uppercase tracking-tighter">VULCAN.K</span>
            </div>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[1.5em]">
            End of Dossier // Unauthorized access prohibited
            </p>
        </footer>
    </main>
  );
}