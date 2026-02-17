'use client';

import { useTranslations } from 'next-intl';
import styles from './Sections.module.css';

type Props = { onOrderClick: () => void };

export function Hero({ onOrderClick }: Props) {
  const t = useTranslations('home');

  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.heroContent}>
        <span className={styles.heroBadge}>{t('heroBadge')}</span>
        <h1 className={styles.heroHeadline}>{t('heroTitle')}</h1>
        <p className={styles.heroSub}>{t('heroSubtitle')}</p>
        <button type="button" onClick={onOrderClick} className={styles.heroCta}>
          {t('ctaButton')}
        </button>
      </div>
    </section>
  );
}
