import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('news_admins')
      .select('password_hash')
      .eq('username', username)
      .single()

    if (error || !data) {
      return false
    }

    return await bcrypt.compare(password, data.password_hash)
  } catch (error) {
    console.error('인증 오류:', error)
    return false
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
} 