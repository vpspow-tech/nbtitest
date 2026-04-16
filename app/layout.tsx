import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NBTI 职场人格测试',
  description: '职场人格 Hunters，NBTI来了。',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
