import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }, { locale: 'de' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('aboutTitle'),
    description: t('aboutDescription'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tNav = await getTranslations('nav');

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{t('title')}</h1>
      <p style={{ marginBottom: '1rem' }}>{t('body')}</p>
      <Link
        href="/contact"
        style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: 'var(--color-accent)',
          color: 'white',
          borderRadius: 6,
          fontWeight: 500,
        }}
      >
        {tNav('contact')}
      </Link>
    </div>
  );
}
