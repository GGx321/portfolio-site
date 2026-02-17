"use client";

import { ArrowRight, Code, Layers, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCanvasAnimation } from "@/hooks/use-canvas-animation";
import { useI18n } from "@/i18n/context";
import { useOrderModal } from "@/components/order-modal-context";

export function HeroSection() {
  const canvasRef = useCanvasAnimation();
  const { t } = useI18n();
  const { openOrder } = useOrderModal();

  const featureIcons = [Code, Layers, Zap];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20"
    >
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "transparent" }}
        suppressHydrationWarning
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 animate-fade-in-up">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="px-4 py-1.5 border-primary/50 text-muted-foreground bg-background/50 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t.hero.badge}
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            {t.hero.title.split("\n").map((line, index) => (
              <span
                key={index}
                className={`block ${index === 1 ? "text-gradient" : ""}`}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            {t.hero.features.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {feature}
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              className="glow-green text-base px-8 h-[52px]"
              onClick={openOrder}
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              {t.hero.primaryCta}
            </Button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 sm:gap-16 pt-12">
            {t.hero.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary font-mono">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
