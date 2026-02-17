'use client';

import { useTranslations } from 'next-intl';
import styles from './Sections.module.css';

type Props = { onOrderClick: () => void };

export function OrderSection({ onOrderClick }: Props) {
  const t = useTranslations('home');

  return (
    <section id="order" className={styles.orderSection} aria-labelledby="order-heading">
      <h2 id="order-heading" className={styles.orderTitle}>
        {t('orderSectionTitle')}
      </h2>
      <p className={styles.orderSub}>{t('orderSectionSub')}</p>
      <button type="button" onClick={onOrderClick} className={styles.orderCta}>
        {t('ctaButton')}
      </button>
    </section>
  );
}
