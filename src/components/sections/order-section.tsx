"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useI18n } from "@/i18n/context";
import { useOrderModal } from "@/components/order-modal-context";
import { cn } from "@/lib/utils";

export function OrderSection() {
  const { t } = useI18n();
  const { openOrder } = useOrderModal();
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="order" className="py-20 sm:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-2xl mx-auto transition-all duration-700",
            isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <p className="text-primary font-mono text-sm font-semibold tracking-[2px] mb-4">
            {t.order.label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t.order.title}
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t.order.subtitle}
          </p>
          <Button
            size="lg"
            className="glow-green text-base px-8 h-[52px]"
            onClick={openOrder}
          >
            <ArrowRight className="mr-2 h-5 w-5" />
            {t.order.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
