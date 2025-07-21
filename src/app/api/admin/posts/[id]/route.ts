import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 개별 포스트 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .eq('id', resolvedParams.id)
      .single()

    if (error) {
      console.error('포스트 조회 오류:', error)
      return NextResponse.json(
        { error: '포스트를 찾을 수 없습니다.' },
        { status: 404 }
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

// 포스트 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
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
      published_at: body.published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('news_posts')
      .update(postData)
      .eq('id', resolvedParams.id)
      .select()
      .single()

    if (error) {
      console.error('포스트 수정 오류:', error)

      return NextResponse.json(
        { error: '포스트 수정 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('포스트 수정 오류:', error)
    return NextResponse.json(
      { error: '포스트 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 포스트 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { error } = await supabase
      .from('news_posts')
      .delete()
      .eq('id', resolvedParams.id)

    if (error) {
      console.error('포스트 삭제 오류:', error)
      return NextResponse.json(
        { error: '포스트 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('포스트 삭제 오류:', error)
    return NextResponse.json(
      { error: '포스트 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 