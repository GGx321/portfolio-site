import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-geist-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Portfolio', template: '%s' },
  description: 'Full-stack developer portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
