'use client';

import { useTranslations } from 'next-intl';
import styles from './Sections.module.css';

const STACK_ITEMS = ['React', 'Node.js', 'TypeScript', 'Solidity', 'PostgreSQL', 'Tailwind', 'Next.js', 'Web3'] as const;

export function Stack() {
  const t = useTranslations('home');

  return (
    <section id="stack" className={styles.stack} aria-labelledby="stack-heading">
      <h2 id="stack-heading" className={styles.sectionTitle}>
        {t('stackTitle')}
      </h2>
      <p className={styles.stackSub}>{t('stackSub')}</p>
      <div className={styles.stackRow}>
        {STACK_ITEMS.map((item) => (
          <span
            key={item}
            className={item === 'Web3' ? styles.stackPillAccent : styles.stackPill}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
