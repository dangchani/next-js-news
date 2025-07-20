import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin-session')
    
    if (sessionCookie && sessionCookie.value === 'authenticated') {
      return NextResponse.json({ isLoggedIn: true })
    }
    
    return NextResponse.json({ isLoggedIn: false })
  } catch (error) {
    console.error('세션 확인 오류:', error)
    return NextResponse.json({ isLoggedIn: false })
  }
} 