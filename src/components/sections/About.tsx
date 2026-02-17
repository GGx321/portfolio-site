"use client";

import { Code, Layers, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";

const iconMap = {
  Code,
  Layers,
  Zap,
};

export function AboutSection() {
  const { t } = useI18n();
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });

  return (
    <section id="about" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={ref}
          className={cn(
            "text-center max-w-3xl mx-auto mb-16 transition-all duration-700",
            isIntersecting
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          )}
        >
          <p className="text-primary font-mono text-sm font-semibold tracking-[2px] mb-4">
            {t.about.label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t.about.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t.about.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {t.about.items.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            return (
              <div
                key={index}
                className={cn(
                  "transition-all duration-700",
                  isIntersecting
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <Card className="h-full bg-card/50 border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
