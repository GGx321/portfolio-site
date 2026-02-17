'use client';

import { useTranslations } from 'next-intl';
import styles from './Sections.module.css';

export function Reviews() {
  const t = useTranslations('home');

  return (
    <section id="reviews" className={styles.reviews} aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className={styles.sectionTitle}>
        {t('reviewsTitle')}
      </h2>
      <div className={styles.reviewsGrid}>
        <div className={styles.reviewCard}>
          <p className={styles.reviewQuote}>{t('review1Quote')}</p>
          <span className={styles.reviewAuthor}>{t('review1Author')}</span>
        </div>
        <div className={styles.reviewCard}>
          <p className={styles.reviewQuote}>{t('review2Quote')}</p>
          <span className={styles.reviewAuthor}>{t('review2Author')}</span>
        </div>
        <div className={styles.reviewCard}>
          <p className={styles.reviewQuote}>{t('review3Quote')}</p>
          <span className={styles.reviewAuthor}>{t('review3Author')}</span>
        </div>
      </div>
    </section>
  );
}
