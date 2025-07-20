import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as { published: boolean }
    
    const updateData = {
      published: body.published,
      published_at: body.published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('news_posts')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('포스트 상태 변경 오류:', error)
      return NextResponse.json(
        { error: '포스트 상태 변경 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('포스트 상태 변경 오류:', error)
    return NextResponse.json(
      { error: '포스트 상태 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 