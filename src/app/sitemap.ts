import { supabase } from '@/lib/supabase'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://your-domain.com'

  // 모든 게시된 포스트 가져오기
  const { data: posts } = await supabase
    .from('news_posts')
    .select('id, updated_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  // 모든 카테고리 가져오기
  const { data: categories } = await supabase
    .from('news_categories')
    .select('id')
    .order('name', { ascending: true })

  // 정적 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ]

  // 포스트 페이지들
  const postPages = posts?.map((post) => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  // 카테고리 페이지들 (필요시)
  const categoryPages = categories?.map((category) => ({
    url: `${baseUrl}/?category=${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  })) || []

  return [...staticPages, ...postPages, ...categoryPages]
} 