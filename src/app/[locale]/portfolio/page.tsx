import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }, { locale: 'de' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('portfolioTitle'),
    description: t('portfolioDescription'),
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('portfolio');

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{t('title')}</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>{t('noProjects')}</p>
    </div>
  );
}
