import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { HomeContent } from '@/components/sections/HomeContent';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }, { locale: 'de' }];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const metadata: {
    title: string;
    description: string;
    alternates?: { canonical: string; languages: Record<string, string> };
  } = {
    title: t('homeTitle'),
    description: t('homeDescription'),
  };
  if (BASE_URL) {
    const path = locale === 'en' ? '' : `/${locale}`;
    metadata.alternates = {
      canonical: `${BASE_URL}${path || ''}`,
      languages: { en: BASE_URL, ru: `${BASE_URL}/ru`, de: `${BASE_URL}/de` },
    };
  }
  return metadata;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations('home');

  return <HomeContent />;
}
