"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";

export default function VulcanLoader({ onComplete }: { onComplete: () => void }) {
  const [counter, setCounter] = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Memoize grid points to prevent hydration mismatch
  const gridPoints = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  useEffect(() => {
    const counterObj = { value: 0 };

    // 1. Core Loading Logic
    gsap.to(counterObj, {
      value: 100,
      duration: 3.5,
      ease: "power3.inOut",
      onUpdate: () => setCounter(Math.floor(counterObj.value)),
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Final geometric dissolution
          const exitTl = gsap.timeline({ onComplete });
          exitTl.to(".mask-panel", {
            width: 0,
            stagger: { amount: 0.5, from: "center" },
            duration: 1,
            ease: "expo.inOut"
          })
          .to(loaderRef.current, { opacity: 0, duration: 0.3 }, "-=0.5");
        }
      });

      // 2. Entrance Sequence: Wireframe & Text
      tl.from(".core-ring", {
        scale: 0,
        rotate: -180,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.75)"
      })
      .from(".tech-line", {
        scaleX: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.inOut"
      }, "-=1")
      .from(".data-bit", {
        opacity: 0,
        y: 10,
        stagger: { amount: 0.8 },
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.5");

      // 3. Constant Glitch Loop
      gsap.to(".glitch-text", {
        skewX: "random(-20, 20)",
        opacity: "random(0.5, 1)",
        duration: 0.1,
        repeat: -1,
        repeatRefresh: true,
        ease: "none"
      });

    }, loaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[9999] overflow-hidden bg-black flex items-center justify-center font-mono">

      {/* GEOMETRIC SHROUD PANELS: These physically block the Navbar */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mask-panel h-full w-1/6 bg-black border-x border-orange-600/5 relative z-50" />
        ))}
      </div>

      {/* BACKGROUND MATRIX GRID */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ea580c_1px,transparent_1px),linear-gradient(to_bottom,#ea580c_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* CENTRAL CORE INTERFACE */}
      <div className="relative z-[60] flex flex-col items-center">

        {/* 3D CORE WIREFRAME */}
        <div className="core-ring relative w-64 h-64 border border-orange-600/20 rounded-full flex items-center justify-center mb-12">
            <div className="absolute inset-0 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-4 border border-orange-600/10 rounded-full animate-spin-reverse" style={{ animationDuration: '5s' }} />

            <div className="text-center">
                <span className="text-[10px] text-orange-600 tracking-[0.5em] uppercase block mb-2 opacity-50">Syncing</span>
                <div className="text-7xl font-black italic text-white tracking-tighter glitch-text">
                    {counter}<span className="text-orange-600">%</span>
                </div>
            </div>
        </div>

        {/* TECH METADATA LOGS */}
        <div className="w-80 space-y-4">
            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                <span className="text-[9px] text-orange-600 uppercase font-bold tracking-widest">Protocol: VULCAN_ALPHA</span>
                <span className="text-[8px] text-white/20">NODE_RAJKOT_IN</span>
            </div>

            <div className="h-20 overflow-hidden">
                {["INITIALIZING_CORE", "CNS_CALIBRATION_ACTIVE", "MAPPING_NEURAL_NODES", "BYPASSING_RESTRICTIONS"].map((text, i) => (
                    <div key={i} className="data-bit text-[10px] text-white/40 uppercase tracking-widest mb-1 flex items-center gap-3">
                        <span className="w-1 h-1 bg-orange-600 rounded-full animate-pulse" />
                        {text}
                    </div>
                ))}
            </div>

            {/* PROGRESS STACK */}
            <div className="flex gap-1 h-1 justify-between">
                {gridPoints.map((i) => (
                    <div
                        key={i}
                        className={`flex-1 transition-colors duration-300 ${counter > (i * 8.3) ? 'bg-orange-600 shadow-[0_0_10px_#ea580c]' : 'bg-white/5'}`}
                    />
                ))}
            </div>
        </div>
      </div>

      {/* PERIMETER DECORATIONS */}
      <div className="absolute bottom-10 left-10 text-white/10 text-[8px] tracking-[1em] uppercase">
        Terminal_Session_4.00
      </div>
      <div className="absolute top-10 right-10 text-white/10 text-[8px] tracking-[1em] uppercase">
        Authorization_Required
      </div>

      <style jsx>{`
        .animate-spin-reverse { animation: spin-rev linear infinite; }
        @keyframes spin-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </div>
  );
}