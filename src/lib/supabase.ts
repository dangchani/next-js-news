import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dniaztcipvixjvgiquvq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaWF6dGNpcHZpeGp2Z2lxdXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzczNDgsImV4cCI6MjA2ODA1MzM0OH0.CA_yKi2Vde1CT-0wuu80izi-ZmcMPduJESuuB-VPOwo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 타입 정의
export interface Category {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string | null
  slug: string
  category_id: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  username: string
  password_hash: string
  created_at: string
  updated_at: string
} 