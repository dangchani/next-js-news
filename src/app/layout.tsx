import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'News Blog - 최신 소식과 흥미로운 글들',
    template: '%s | News Blog'
  },
  description: '기술, 일상, 리뷰 등 다양한 주제의 흥미로운 글들을 확인해보세요. 최신 소식과 인사이트를 제공하는 개인 블로그입니다.',
  keywords: ['블로그', '기술', '일상', '리뷰', '소식', '인사이트', '개발', '프로그래밍'],
  authors: [{ name: 'News Blog' }],
  creator: 'News Blog',
  publisher: 'News Blog',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://your-domain.com',
    siteName: 'News Blog',
    title: 'News Blog - 최신 소식과 흥미로운 글들',
    description: '기술, 일상, 리뷰 등 다양한 주제의 흥미로운 글들을 확인해보세요.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'News Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@newsblog',
    creator: '@newsblog',
    title: 'News Blog - 최신 소식과 흥미로운 글들',
    description: '기술, 일상, 리뷰 등 다양한 주제의 흥미로운 글들을 확인해보세요.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'msapplication-TileColor': '#3b82f6',
    'theme-color': '#3b82f6',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        {/* 추가 메타 태그들 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="News Blog" />
        
        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 매니페스트 */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* DNS 프리페치 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* RSS 피드 */}
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
        
        {/* 구조화된 데이터 - 웹사이트 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'News Blog',
              url: 'https://your-domain.com',
              description: '기술, 일상, 리뷰 등 다양한 주제의 흥미로운 글들을 확인해보세요.',
              publisher: {
                '@type': 'Organization',
                name: 'News Blog',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://your-domain.com/logo.png',
                },
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://your-domain.com/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
