'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useOrderModal } from '@/components/OrderModalContext';
import { routing } from '@/i18n/routing';
import styles from './Header.module.css';

const navKeys = ['about', 'reviews'] as const;
const pathMap: Record<(typeof navKeys)[number], string> = {
  about: '/#about',
  reviews: '/#reviews',
};

export function Header() {
  const t = useTranslations('nav');
  const tTheme = useTranslations('theme');
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const { openOrder } = useOrderModal();

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          Portfolio
        </Link>
        <nav className={styles.nav} aria-label="Main">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={pathMap[key]}
              className={styles.navLink}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={openOrder}
            className={styles.ctaButton}
          >
            {t('orderProject')}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className={styles.themeButton}
            title={theme === 'light' ? tTheme('dark') : tTheme('light')}
            aria-label={theme === 'light' ? tTheme('dark') : tTheme('light')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <LocaleSwitcher />
        </div>
        <button
          type="button"
          className={styles.burger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      {menuOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-label="Mobile menu">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={pathMap[key]}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {t(key)}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openOrder();
            }}
            className={styles.mobileCta}
          >
            {t('orderProject')}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className={styles.mobileLink}
          >
            {theme === 'light' ? tTheme('dark') : tTheme('light')}
          </button>
          <LocaleSwitcher className={styles.mobileLink} onSelect={() => setMenuOpen(false)} />
        </div>
      )}
    </>
  );
}

function LocaleSwitcher({
  className,
  onSelect,
}: { className?: string; onSelect?: () => void } = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const locales = routing.locales;
  const currentLocale = pathname.split('/')[1] ?? 'en';

  const switchLocale = (loc: string) => {
    const path = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    router.replace(path as '/' | '/portfolio' | '/about' | '/contact', { locale: loc });
    onSelect?.();
  };

  return (
    <div className={className} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {locales.map((loc) => {
        const isActive = currentLocale === loc;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchLocale(loc)}
            style={{
              padding: '4px 8px',
              fontWeight: isActive ? 600 : 400,
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              color: 'var(--color-text)',
              fontSize: '0.875rem',
            }}
            aria-current={isActive ? 'true' : undefined}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
