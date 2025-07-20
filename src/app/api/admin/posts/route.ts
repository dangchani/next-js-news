import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 포스트 목록 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('news_posts')
      .select(`
        *,
        news_categories(name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('포스트 조회 오류:', error)
      return NextResponse.json(
        { error: '포스트 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('포스트 조회 오류:', error)
    return NextResponse.json(
      { error: '포스트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 새 포스트 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      title: string
      content: string
      excerpt?: string
      category_id?: string
      published?: boolean
    }

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    const postData = {
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      category_id: body.category_id || null,
      published: body.published || false,
      published_at: body.published ? new Date().toISOString() : null
    }

    const { data, error } = await supabase
      .from('news_posts')
      .insert([postData])
      .select()
      .single()

    if (error) {
      console.error('포스트 생성 오류:', error)

      return NextResponse.json(
        { error: '포스트 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('포스트 생성 오류:', error)
    return NextResponse.json(
      { error: '포스트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 