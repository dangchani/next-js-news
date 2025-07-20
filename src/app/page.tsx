import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Layout from '@/components/Layout'
import { Metadata } from 'next'
import ClientPage from './ClientPage'

interface Post {
  id: number
  title: string
  content: string
  excerpt: string | null
  category_id: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  news_categories: { name: string } | null
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalPosts: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// SEO 메타데이터
export const metadata: Metadata = {
  title: 'News Blog - 최신 소식과 흥미로운 글들',
  description: '기술, 일상, 리뷰 등 다양한 주제의 흥미로운 글들을 확인해보세요. 최신 소식과 인사이트를 제공하는 개인 블로그입니다.',
  keywords: ['블로그', '기술', '일상', '리뷰', '소식', '인사이트'],
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
    title: 'News Blog - 최신 소식과 흥미로운 글들',
    description: '기술, 일상, 리뷰 등 다양한 주제의 흥미로운 글들을 확인해보세요.',
    url: 'https://your-domain.com',
    siteName: 'News Blog',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'News Blog',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
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
}

// 서버 사이드에서 초기 데이터 가져오기
async function getInitialPosts() {
  try {
    const { data: posts } = await supabase
      .from('news_posts')
      .select(`
        id,
        title,
        content,
        excerpt,
        category_id,
        published,
        published_at,
        created_at,
        updated_at,
        news_categories(name)
      `)
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(50)

    return posts || []
  } catch (error) {
    console.error('초기 포스트 조회 오류:', error)
    return []
  }
}

export default async function Home() {
  const initialPosts = await getInitialPosts()

  return <ClientPage initialPosts={initialPosts} />
}
