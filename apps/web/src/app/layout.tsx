import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GoMath - Visual Learning 수학 플랫폼',
  description: '기출문제와 시각적 학습을 통한 수학 학습 플랫폼',
  keywords: ['수학', '기출문제', '시각적 학습', 'Visual Learning', 'Mathematics'],
  authors: [{ name: 'GoMath Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <div id="root" className="h-full">
          {children}
        </div>
      </body>
    </html>
  );
}