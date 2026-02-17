import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, JetBrains_Mono } from "next/font/google";
import { CustomCursor } from "@/components/custom-cursor";
import { OrderModalProvider } from "@/components/order-modal-context";
import { I18nProvider } from "@/i18n/context";
import { type Locale, locales, isValidLocale, getTranslations } from "@/i18n";
import { siteConfig } from "@/config/env";
import "../globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : "en";
  const t = getTranslations(locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} | ${t.title}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: t.description,
    keywords: [
      "fullstack developer",
      "portfolio",
      "websites",
      "Telegram bot",
      "Mini App",
      "Web3",
      "React",
      "Next.js",
      "TypeScript",
      "turnkey development",
    ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        en: `${siteConfig.url}/en`,
        ru: `${siteConfig.url}/ru`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      url: `${siteConfig.url}/${locale}`,
      title: siteConfig.name,
      description: t.description,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: t.description,
      images: [`${siteConfig.url}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: localeParam } = await params;
  
  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const t = getTranslations(locale);

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="alternate" hrefLang="en" href={`${siteConfig.url}/en`} />
        <link rel="alternate" hrefLang="ru" href={`${siteConfig.url}/ru`} />
        <link rel="alternate" hrefLang="x-default" href={`${siteConfig.url}/en`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              description: t.description,
              knowsAbout: [
                "Full-stack development",
                "Websites",
                "Telegram bots",
                "Mini App",
                "Web3",
                "React",
                "Next.js",
                "TypeScript",
              ],
              sameAs: [],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <I18nProvider locale={locale}>
          <OrderModalProvider>
            <CustomCursor />
            {children}
          </OrderModalProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
