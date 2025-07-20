import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('카테고리 조회 오류:', error)
    return NextResponse.json(
      { error: '카테고리 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 