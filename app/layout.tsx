import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NBTI职场人格测试 - 测测你是哪种打工人 | SBTI2.0',
  description: '基于SBTI2.0的职场人格测试，34道题测出你的职场人格类型。卷王附体、职场懂王、摸鱼大师...你是哪一种？已有数万人参与测试，快来测测！',
  keywords: ['职场人格测试', 'NBTI', 'SBTI', 'MBTI', '职场性格', '打工人', '职业测试'],
  authors: [{ name: 'Fone' }],
  openGraph: {
    title: 'NBTI职场人格测试 - 测测你是哪种打工人',
    description: '34道题测出你的职场人格类型，卷王附体、职场懂王、摸鱼大师...你是哪一种？',
    type: 'website',
    locale: 'zh_CN',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NBTI职场人格测试 - 测测你是哪种打工人',
    description: '34道题测出你的职场人格类型',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://nbittest.com',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
