'use client';

import { useTranslations } from 'next-intl';
import styles from './Sections.module.css';

export function About() {
  const t = useTranslations('home');

  return (
    <section id="about" className={styles.about} aria-labelledby="about-heading">
      <h2 id="about-heading" className={styles.sectionTitle}>
        {t('aboutTitle')}
      </h2>
      <p className={styles.aboutDesc}>{t('aboutDesc')}</p>
    </section>
  );
}
