'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './Footer.module.css';

const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL || '#';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <Link href="/" className={styles.logo}>
          Portfolio
        </Link>
        <nav className={styles.links} aria-label="Footer">
          <Link href="/#about">{t('about')}</Link>
          <Link href="/#reviews">{t('reviews')}</Link>
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
            {t('telegram')}
          </a>
        </nav>
      </div>
      <p className={styles.copyright}>
        {t('copyright', { year })}
      </p>
    </footer>
  );
}
