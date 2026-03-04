"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HudCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    // Set initial state to hidden to prevent jump
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2, // Slight lag for tactical feel
        opacity: 1,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hud-cursor fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
    >
      {/* Ping Animation Ring */}
      <div className="absolute inset-0 border border-orange-600/50 rounded-full animate-ping" />

      {/* Crosshair Horizontal Line */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-orange-600" />

      {/* Crosshair Vertical Line */}
      <div className="absolute left-1/2 top-0 w-[1px] h-full bg-orange-600" />

      {/* Center Point */}
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </div>
  );
}