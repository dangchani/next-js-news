import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 카테고리 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json() as { name: string; description?: string }

    if (!body.name) {
      return NextResponse.json(
        { error: '카테고리명은 필수입니다.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('news_categories')
      .update({ 
        name: body.name, 
        description: body.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', resolvedParams.id)
      .select()
      .single()

    if (error) {
      console.error('카테고리 수정 오류:', error)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: '이미 존재하는 카테고리명입니다.' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: '카테고리 수정 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('카테고리 수정 오류:', error)
    return NextResponse.json(
      { error: '카테고리 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 카테고리 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    // 해당 카테고리를 사용하는 포스트가 있는지 확인
    const { data: posts, error: postsError } = await supabase
      .from('news_posts')
      .select('id')
      .eq('category_id', resolvedParams.id)
      .limit(1)

    if (postsError) {
      console.error('포스트 조회 오류:', postsError)
      return NextResponse.json(
        { error: '카테고리 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    if (posts && posts.length > 0) {
      return NextResponse.json(
        { error: '이 카테고리를 사용하는 포스트가 있어 삭제할 수 없습니다.' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('news_categories')
      .delete()
      .eq('id', resolvedParams.id)

    if (error) {
      console.error('카테고리 삭제 오류:', error)
      return NextResponse.json(
        { error: '카테고리 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('카테고리 삭제 오류:', error)
    return NextResponse.json(
      { error: '카테고리 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 