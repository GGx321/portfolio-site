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
    title: t('contactTitle'),
    description: t('contactDescription'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('title')}</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        {t('description')}
      </p>
      <p style={{ fontSize: '0.9375rem' }}>
        Use the &quot;{t('orderProject')}&quot; button in the header to open the project order form.
      </p>
    </div>
  );
}
