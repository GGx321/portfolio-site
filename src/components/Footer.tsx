"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/i18n/context";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="inline-block font-mono text-xl sm:text-2xl font-bold mb-2"
            >
              {t.name}
            </Link>
            <p className="text-sm mb-2 text-muted-foreground">
              {t.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {t.footer.privacy}
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
