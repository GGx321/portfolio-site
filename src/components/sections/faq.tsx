"use client";

import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function FaqSection() {
  const { t } = useI18n();
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-32">
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
            {t.faq.label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t.faq.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t.faq.subtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {t.faq.items.map((item, index) => (
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
              <Card 
                className={cn(
                  "bg-card/50 border-border cursor-pointer transition-colors hover:border-primary/50",
                  openIndex === index && "border-primary/50"
                )}
                onClick={() => toggleFaq(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold flex-1">
                      {item.question}
                    </h3>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 mt-1",
                        openIndex === index && "rotate-180 text-primary"
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      openIndex === index
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
