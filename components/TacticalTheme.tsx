"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function TacticalTheme({ children }: { children: React.ReactNode }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Scanning Bar Animation
    gsap.to(".global-scan-bar", {
      top: "100%",
      duration: 6,
      repeat: -1,
      ease: "none",
    });

    const updateCoords = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateCoords);
    return () => window.removeEventListener("mousemove", updateCoords);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-orange-600 selection:text-black cursor-none">

      {/* SCANNING OVERLAY ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {/* Moving Scan Line */}
        <div className="global-scan-bar absolute top-0 left-0 w-full h-[1px] bg-orange-600/20 shadow-[0_0_15px_#ea580c]" />

        {/* Film Grain Noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />

        {/* CRT Scanline Effect (Static) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,4px_100%]" />
      </div>

      {/* GLOBAL HUD DATA (Sidebars) */}
      <div className="fixed left-6 bottom-10 z-50 pointer-events-none opacity-40 font-mono text-[8px] flex flex-col gap-2">
        <span>X_COORD: {coords.x}PX</span>
        <span>Y_COORD: {coords.y}PX</span>
        <div className="w-12 h-[1px] bg-orange-600" />
        <span className="text-orange-600 animate-pulse">VULCAN_OS_v4.0</span>
      </div>

      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}