import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(new URL('/admin/login', 'http://localhost:3000'))
  
  // 세션 쿠키 삭제
  response.cookies.set('admin-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0
  })

  return response
} 