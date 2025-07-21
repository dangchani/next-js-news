import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 최신 포스트 20개 가져오기
    const { data: posts } = await supabase
      .from('news_posts')
      .select(`
        id,
        title,
        content,
        excerpt,
        published_at,
        created_at,
        news_categories(name)
      `)
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(20)

    if (!posts) {
      return new NextResponse('포스트를 찾을 수 없습니다.', { status: 404 })
    }

    const baseUrl = 'https://your-domain.com'
    const currentDate = new Date().toUTCString()

    // RSS XML 생성
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>News Blog</title>
    <link>${baseUrl}</link>
    <description>기술, 일상, 리뷰 등 다양한 주제의 흥미로운 글들을 확인해보세요.</description>
    <language>ko-KR</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${posts.map(post => {
      const content = post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 300) + '...'
      const pubDate = new Date(post.published_at || post.created_at).toUTCString()
      const category = Array.isArray(post.news_categories) && post.news_categories.length > 0 
        ? post.news_categories[0].name 
        : '기타'
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/post/${post.id}</link>
      <guid>${baseUrl}/post/${post.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${category}</category>
      <description><![CDATA[${content}]]></description>
    </item>`
    }).join('')}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('RSS 피드 생성 오류:', error)
    return new NextResponse('서버 오류가 발생했습니다.', { status: 500 })
  }
} 