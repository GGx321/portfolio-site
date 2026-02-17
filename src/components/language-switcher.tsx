"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale } = useI18n();
  const pathname = usePathname();

  // Get the path without the locale prefix
  const pathWithoutLocale = pathname.replace(/^\/(en|ru)/, "") || "/";

  return (
    <div className={cn("flex items-center gap-1 text-sm font-medium", className)}>
      <Link
        href={`/en${pathWithoutLocale}`}
        className={cn(
          "px-2 py-1 rounded transition-colors",
          locale === "en"
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </Link>
      <span className="text-muted-foreground">/</span>
      <Link
        href={`/ru${pathWithoutLocale}`}
        className={cn(
          "px-2 py-1 rounded transition-colors",
          locale === "ru"
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        RU
      </Link>
    </div>
  );
}
