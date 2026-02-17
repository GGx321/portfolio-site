"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorOuter = cursorOuterRef.current;
    if (!cursor || !cursorOuter) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let outerX = 0;
    let outerY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea");

      setIsHovering(!!isInteractive);
    };

    const animate = () => {
      // Inner dot - instant follow
      cursorX = mouseX;
      cursorY = mouseY;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

      // Outer ring - slower follow
      const odx = mouseX - outerX;
      const ody = mouseY - outerY;
      outerX += odx * 0.1;
      outerY += ody * 0.1;
      cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px)`;

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleElementHover);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleElementHover);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <>
      {/* Inner dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-9999 mix-blend-difference"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          className="rounded-full bg-white transition-all duration-200 ease-out"
          style={{
            width: isHovering ? 40 : 8,
            height: isHovering ? 40 : 8,
            marginLeft: isHovering ? -20 : -4,
            marginTop: isHovering ? -20 : -4,
          }}
        />
      </div>

      {/* Outer ring */}
      <div
        ref={cursorOuterRef}
        className="fixed top-0 left-0 pointer-events-none z-9998"
        style={{
          opacity: isVisible && !isHovering ? 0.5 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          className="rounded-full border border-primary"
          style={{
            width: 32,
            height: 32,
            marginLeft: -16,
            marginTop: -16,
          }}
        />
      </div>
    </>
  );
}
