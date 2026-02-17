"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/i18n/context";
import { useOrderModal } from "@/components/order-modal-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { key: "order", href: "#order" },
  { key: "about", href: "#about" },
  { key: "faq", href: "#faq" },
] as const;

export function Header() {
  const { t } = useI18n();
  const { openOrder } = useOrderModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-xl sm:text-2xl font-bold"
          >
            {t.name}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="group relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                {t.navigation[item.key]}
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA & Language */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Button className="glow-green-sm font-semibold" onClick={openOrder}>
              {t.navigation.cta}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">{t.mobileMenu.open}</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-80 bg-background/95 backdrop-blur-xl border-l border-border px-8 pt-16"
              >
                {/* Close Button */}
                <SheetClose className="absolute right-6 top-6 rounded-sm opacity-70 hover:opacity-100 transition-opacity">
                  <X className="h-6 w-6" />
                  <span className="sr-only">{t.mobileMenu.close}</span>
                </SheetClose>

                {/* Logo */}
                <div className="mb-10">
                  <Link
                    href="/"
                    onClick={handleNavClick}
                    className="font-mono text-2xl font-bold"
                  >
                    {t.name}
                  </Link>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                  {NAV_LINKS.map((item, index) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={handleNavClick}
                      className="text-xl font-medium py-3 px-4 -mx-4 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {t.navigation[item.key]}
                    </Link>
                  ))}
                </nav>

                {/* CTA Button */}
                <div className="mt-10 pt-8 border-t border-border">
                  <Button
                    size="lg"
                    className="w-full glow-green-sm font-semibold h-14 text-base"
                    onClick={() => { handleNavClick(); openOrder(); }}
                  >
                    {t.navigation.cta}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
