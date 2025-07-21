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

  // 날짜 고정 포맷 함수
  function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return '';
    return dateStr.slice(0, 10); // YYYY-MM-DD
  }

  // 분석 결과가 유효한지 체크
  function isValidAnalysis(analysis: string | null | undefined) {
    if (!analysis) return false;
    if (analysis.startsWith('Analysis failed:')) return false;
    if (analysis.startsWith('No analysis result.')) return false;
    return true;
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
      <Layout>
        {/* 포스트 헤더 */}
        <div className="mb-8 lg:mb-12">
          <article className="bg-white rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl overflow-hidden border border-slate-200">
            {/* 카테고리 및 날짜 */}
            <div className="p-6 md:p-8 lg:p-12 border-b border-slate-200/50">
              <div className="flex items-center text-sm text-slate-500 mb-4 lg:mb-6">
                <span className="inline-flex items-center px-3 md:px-4 py-1 md:py-2 bg-slate-100 text-slate-700 rounded-full text-xs md:text-sm font-semibold">
                  {formatDate(post.published_at || post.created_at)}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#222] mb-6 lg:mb-8 leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <div className="text-base md:text-lg text-[#222] italic border-l-4 border-blue-200 pl-4 md:pl-6 py-3 md:py-4 bg-slate-50 rounded-r-xl">
                  {post.excerpt}
                </div>
              )}
            </div>
            {/* 포스트 본문 */}
            <div className="p-6 md:p-8 lg:p-12">
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:text-[#222] prose-p:text-[#222] prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-[#222] prose-blockquote:border-l-blue-200 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
                <div style={{ color: '#222' }} dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>
          </article>

          {/* AI 분석 의견 */}
          {isValidAnalysis(post.analysis) && (
            <section className="mt-8 p-6 bg-white rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold mb-2 text-[#222]">AI Analysis</h3>
              <pre className="whitespace-pre-wrap text-[#222] text-base leading-relaxed">{post.analysis}</pre>
            </section>
          )}

          {/* 네비게이션 */}
          <div className="mt-8 lg:mt-12 text-center">
            <Link 
              href="/"
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-white/70 backdrop-blur-sm text-slate-700 font-semibold rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border border-white/50 hover:border-blue-200/50 text-sm md:text-base"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to List
            </Link>
          </div>
        </div>
      </Layout>
    </>
  )
} 