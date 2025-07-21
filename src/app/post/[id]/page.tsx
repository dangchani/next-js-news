import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Layout from '@/components/Layout'
import { Metadata } from 'next'



async function getPost(id: string) {
  const { data, error } = await supabase
    .from('news_posts')
    .select(`
      *,
      news_categories(name)
    `)
    .eq('id', parseInt(id))
    .eq('published', true)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.id)
  
  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다',
      description: '요청하신 포스트를 찾을 수 없습니다.',
    }
  }

  const description = post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
  const publishedDate = post.published_at || post.created_at
  const modifiedDate = post.updated_at

  return {
    title: `${post.title} - News Blog`,
    description: description,
    keywords: [post.news_categories?.name || '기타', '블로그', '기술', '일상', '리뷰'],
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
      canonical: `/post/${post.id}`,
    },
    openGraph: {
      title: post.title,
      description: description,
      url: `https://your-domain.com/post/${post.id}`,
      siteName: 'News Blog',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'ko_KR',
      type: 'article',
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: ['News Blog'],
      section: post.news_categories?.name || '기타',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
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
    other: {
      'article:published_time': publishedDate,
      'article:modified_time': modifiedDate,
      'article:section': post.news_categories?.name || '기타',
      'article:author': 'News Blog',
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.id)

  if (!post) {
    notFound()
  }

  // 구조화된 데이터 (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 160),
    author: {
      '@type': 'Person',
      name: 'News Blog',
    },
    publisher: {
      '@type': 'Organization',
      name: 'News Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://your-domain.com/logo.png',
      },
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://your-domain.com/post/${post.id}`,
    },
    image: {
      '@type': 'ImageObject',
      url: 'https://your-domain.com/og-image.jpg',
      width: 1200,
      height: 630,
    },
    articleSection: post.news_categories?.name || '기타',
    keywords: [post.news_categories?.name || '기타', '블로그', '기술', '일상', '리뷰'],
  }

  return (
    <>
      {/* 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Layout selectedCategory={post.category_id || 'all'} showSidebar={true}>
        {/* 포스트 헤더 */}
        <div className="mb-8 lg:mb-12">
          <article className="bg-white/70 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl overflow-hidden border border-white/50">
            {/* 포스트 헤더 */}
            <div className="p-6 md:p-8 lg:p-12 border-b border-slate-200/50">
              {/* 카테고리 및 날짜 */}
              <div className="flex items-center text-sm text-slate-500 mb-4 lg:mb-6">
                <span className="inline-flex items-center px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs md:text-sm font-semibold">
                  {post.news_categories?.name}
                </span>
                <span className="mx-3 text-slate-300">•</span>
                <time 
                  dateTime={post.published_at || post.created_at} 
                  className="font-medium"
                >
                  {new Date(post.published_at || post.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              
              {/* 제목 */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-6 lg:mb-8 leading-tight">
                {post.title}
              </h1>
              
              {/* 요약 */}
              {post.excerpt && (
                <div className="text-lg md:text-xl text-slate-600 italic border-l-4 border-gradient-to-b from-blue-500 to-indigo-500 pl-4 md:pl-6 py-3 md:py-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-r-xl">
                  {post.excerpt}
                </div>
              )}
            </div>

            {/* 포스트 본문 */}
            <div className="p-6 md:p-8 lg:p-12">
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>
          </article>

          {/* 네비게이션 */}
          <div className="mt-8 lg:mt-12 text-center">
            <Link 
              href="/"
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-white/70 backdrop-blur-sm text-slate-700 font-semibold rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border border-white/50 hover:border-blue-200/50 text-sm md:text-base"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </Layout>
    </>
  )
} 