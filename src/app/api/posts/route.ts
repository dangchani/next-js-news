import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    let query = supabase
      .from('news_posts')
      .select(`
        *,
        news_categories(name)
      `, { count: 'exact' })
      .eq('published', true)
      .order('published_at', { ascending: false })

    // 카테고리 필터 적용
    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId)
    }

    // 페이징 적용
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('포스트 조회 오류:', error)
      return NextResponse.json(
        { error: '포스트 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      posts: data || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: count || 0,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('포스트 조회 오류:', error)
    return NextResponse.json(
      { error: '포스트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 