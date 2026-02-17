'use client';

import { useTranslations } from 'next-intl';
import styles from './Sections.module.css';

export function Services() {
  const t = useTranslations('home');

  return (
    <section id="services" className={styles.services} aria-labelledby="services-heading">
      <h2 id="services-heading" className={styles.sectionTitle}>
        {t('servicesTitle')}
      </h2>
      <p className={styles.servicesSub}>{t('servicesSub')}</p>
      <div className={styles.serviceGrid}>
        <div className={styles.serviceCard}>
          <h3 className={styles.serviceCardTitle}>{t('service1Title')}</h3>
          <p className={styles.serviceCardDesc}>{t('service1Desc')}</p>
        </div>
        <div className={styles.serviceCard}>
          <h3 className={styles.serviceCardTitle}>{t('service2Title')}</h3>
          <p className={styles.serviceCardDesc}>{t('service2Desc')}</p>
        </div>
        <div className={styles.serviceCard}>
          <h3 className={styles.serviceCardTitle}>{t('service3Title')}</h3>
          <p className={styles.serviceCardDesc}>{t('service3Desc')}</p>
        </div>
      </div>
    </section>
  );
}
