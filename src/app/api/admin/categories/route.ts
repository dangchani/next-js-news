import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 카테고리 목록 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('news_categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('카테고리 조회 오류:', error)
      return NextResponse.json(
        { error: '카테고리 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('카테고리 조회 오류:', error)
    return NextResponse.json(
      { error: '카테고리 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 새 카테고리 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { name: string; description?: string }

    if (!body.name) {
      return NextResponse.json(
        { error: '카테고리명은 필수입니다.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('news_categories')
      .insert([{ name: body.name, description: body.description }])
      .select()
      .single()

    if (error) {
      console.error('카테고리 생성 오류:', error)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: '이미 존재하는 카테고리명입니다.' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: '카테고리 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('카테고리 생성 오류:', error)
    return NextResponse.json(
      { error: '카테고리 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 