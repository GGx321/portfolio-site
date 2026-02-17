"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

interface GeometricShape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: "square" | "triangle" | "circle";
  color: string;
}

export function useCanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shapesRef = useRef<GeometricShape[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.floor((width * height) / 15000);
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.7 ? "#228b62" : "#ffffff",
    }));
  }, []);

  const initShapes = useCallback((width: number, height: number) => {
    const shapeCount = 6;
    const types: Array<"square" | "triangle" | "circle"> = [
      "square",
      "triangle",
      "circle",
    ];
    
    shapesRef.current = Array.from({ length: shapeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 60 + 40,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      opacity: Math.random() * 0.15 + 0.05,
      type: types[Math.floor(Math.random() * types.length)],
      color: "#228b62",
    }));
  }, []);

  const drawShape = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      shape: GeometricShape
    ) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = shape.opacity;

      switch (shape.type) {
        case "square":
          ctx.strokeRect(
            -shape.size / 2,
            -shape.size / 2,
            shape.size,
            shape.size
          );
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(shape.size / 2, shape.size / 2);
          ctx.lineTo(-shape.size / 2, shape.size / 2);
          ctx.closePath();
          ctx.stroke();
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          ctx.stroke();
          break;
      }

      ctx.restore();
    },
    []
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw cursor glow effect
    if (mouseRef.current.x && mouseRef.current.y) {
      const cursorGradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        0,
        mouseRef.current.x,
        mouseRef.current.y,
        300
      );
      cursorGradient.addColorStop(0, "rgba(239, 68, 68, 0.35)");
      cursorGradient.addColorStop(0.3, "rgba(239, 68, 68, 0.15)");
      cursorGradient.addColorStop(0.6, "rgba(239, 68, 68, 0.05)");
      cursorGradient.addColorStop(1, "transparent");
      ctx.fillStyle = cursorGradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw ambient background glow
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width * 0.7
    );
    gradient.addColorStop(0, "rgba(239, 68, 68, 0.08)");
    gradient.addColorStop(0.5, "rgba(239, 68, 68, 0.02)");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Update and draw shapes
    shapesRef.current.forEach((shape) => {
      shape.rotation += shape.rotationSpeed;
      drawShape(ctx, shape);
    });

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around screen
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
    });

    // Draw connections between nearby particles
    ctx.globalAlpha = 1;
    particlesRef.current.forEach((p1, i) => {
      particlesRef.current.slice(i + 1).forEach((p2) => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.1 * (1 - distance / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [drawShape]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
      initShapes(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initParticles, initShapes]);

  return canvasRef;
}
