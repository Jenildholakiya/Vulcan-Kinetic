"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const tiers = [
  {
    level: "Tier 01",
    name: "Initiate",
    price: "49",
    code: "ALPHA-01",
    features: ["Basic Neural Mapping", "Standard Kinetic Training", "Community Access", "Weekly Tactical Briefs"],
    description: "Foundation level access for those beginning their optimization journey.",
    details: "Focuses on fundamental baseline establishment and initial conditioning."
  },
  {
    level: "Tier 02",
    name: "Operator",
    price: "99",
    code: "BETA-02",
    features: ["Advanced Bio-Hacking", "Personalized Performance Rec", "Priority Faculty Access", "Full System Integration"],
    description: "Standard field clearance. Includes advanced biometrics and direct faculty lines.",
    details: "Intermediate synchronization designed for active performance enhancement."
  },
  {
    level: "Tier 03",
    name: "Elite",
    price: "199",
    code: "GAMMA-03",
    features: ["Neural Feedback Loop", "24/7 Strategic Support", "On-Site Tactical Training", "Classified Protocol Access"],
    description: "Full sovereign access. Maximum priority and classified methodology deployment.",
    details: "Absolute system dominance. Every metric is hyper-optimized by senior faculty."
  },
];

export default function MembershipPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Hero Reveal
      const tl = gsap.timeline();
      tl.from(".header-line", { width: 0, duration: 1.5, ease: "power4.inOut" })
        .from(".header-text", { y: 100, opacity: 0, stagger: 0.1, duration: 1.2, ease: "expo.out" }, "-=0.8");

      // 2. Section Reveal on Scroll
      gsap.from(".comparison-row", {
        scrollTrigger: {
          trigger: ".comparison-container",
          start: "top 80%",
        },
        x: -50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out"
      });

      // 3. Floating UI Elements
      gsap.to(".bg-orb", {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    gsap.to(card, { rotateX, rotateY, duration: 0.5, ease: "power2.out" });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#0a0a0a] text-white pt-40 pb-32 px-6 md:px-16 overflow-hidden">

      {/* PERSISTENT UI */}
      <div className="grid-bg absolute inset-0 opacity-10 pointer-events-none"
           style={{ backgroundImage: `radial-gradient(circle, #ffffff10 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* HEADER */}
      <div className="relative z-10 max-w-[1600px] mx-auto mb-32">
        <div className="flex items-center gap-6 mb-8">
          <div className="header-line w-24 h-[1px] bg-orange-600" />
          <span className="header-text text-orange-600 uppercase tracking-[0.8em] text-[10px] font-black">Contract Status: Awaiting Signature</span>
        </div>
        <h1 className="header-text text-7xl md:text-[11vw] font-black uppercase tracking-tighter leading-[0.85] italic mb-10">
          Access <span className="text-orange-600">Protocol</span>.
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <p className="header-text max-w-xl text-white/40 uppercase tracking-[0.2em] text-[11px] font-medium leading-relaxed">
            Deployment of Vulcan systems requires a clear directive. Select your operational depth carefully.
            Higher tiers grant access to redacted datasets and direct neural uplink channels.
          </p>
          <div className="header-text flex flex-col items-end justify-end">
             <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Latency: 4ms // Secure</span>
             <span className="text-[10px] font-mono text-orange-600 uppercase tracking-widest">Node: Vulcan_Prime_01</span>
          </div>
        </div>
      </div>

      {/* MEMBERSHIP CARDS */}
      <div className="card-grid max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 mb-64">
        {tiers.map((tier, idx) => (
          <div
            key={tier.level}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="membership-card group relative p-1 bg-white/5 flex flex-col perspective-1000 cursor-default"
          >
            <div className="relative p-10 bg-[#0d0d0d] flex-1 flex flex-col justify-between transition-all duration-500 group-hover:bg-[#111111] border border-transparent group-hover:border-orange-600/30">

              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-mono text-white">REDACTED // REDACTED</span>
              </div>

              <div>
                <div className="flex justify-between items-start mb-16">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-orange-600 tracking-widest uppercase mb-1">{tier.level}</span>
                    <span className="text-[8px] font-mono text-white/20 tracking-widest">{tier.code}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${idx === 1 ? 'bg-orange-600 shadow-[0_0_15px_#ea580c] animate-pulse' : 'border border-white/20'}`} />
                </div>

                <h3 className="text-6xl font-black uppercase tracking-tighter italic mb-4">{tier.name}</h3>
                <p className="text-[11px] text-white/60 font-medium leading-relaxed mb-12 italic">{tier.details}</p>

                <div className="flex items-baseline gap-2 mb-16 border-b border-white/5 pb-8">
                  <span className="text-xl font-black text-orange-600 tracking-tighter">$</span>
                  <span className="text-8xl font-black tracking-tighter leading-none">{tier.price}</span>
                  <span className="text-[10px] text-white/20 uppercase tracking-widest ml-2">/ month</span>
                </div>

                <div className="space-y-6">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-5 group/item">
                      <div className="w-1.5 h-1.5 bg-orange-600 rotate-45" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="cursor-pointer relative w-full py-6 mt-20 overflow-hidden border border-white/10 transition-colors duration-500 hover:border-orange-600 group/btn">
                <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-expo" />
                <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.5em] text-white group-hover/btn:text-black transition-colors">
                  Join Protocol
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* COMPARISON MODULE (Lengthy Content) */}
      <div className="comparison-container max-w-[1600px] mx-auto py-32 border-t border-white/5">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-20 text-orange-600">Cross-Clearance Comparison</h2>
        <div className="space-y-4">
          {["System Uptime", "Faculty Mentorship", "Biometric Tracking", "Neural Uplink", "Physical Optimization"].map((spec) => (
            <div key={spec} className="comparison-row grid grid-cols-1 md:grid-cols-4 p-8 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <span className="text-xs uppercase tracking-widest font-black text-white/60 mb-4 md:mb-0">{spec}</span>
              <span className="text-[10px] font-mono text-white/20">99.9% / Standard</span>
              <span className="text-[10px] font-mono text-orange-600/80">99.9% / Dedicated</span>
              <span className="text-[10px] font-mono text-white font-bold tracking-widest">100% / Real-Time Sovereign</span>
            </div>
          ))}
        </div>
      </div>

      {/* MARQUEE */}
      <div className="absolute bottom-10 left-0 w-full opacity-5 pointer-events-none overflow-hidden">
        <div className="flex whitespace-nowrap gap-20 animate-marquee">
          {[1,2,3].map(i => (
            <span key={i} className="text-[15vw] font-black uppercase tracking-tighter italic">VULCAN ACCESS GRANTED • SYSTEM ONLINE • NO RETREAT • </span>
          ))}
        </div>
      </div>

      {/* DECORATIVE ORBS */}
      <div className="bg-orb fixed top-1/4 -right-40 w-[600px] h-[600px] bg-orange-600/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="bg-orb fixed bottom-1/4 -left-40 w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full pointer-events-none" />

      <style jsx>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 60s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </main>
  );
}