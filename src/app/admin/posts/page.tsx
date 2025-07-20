'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Post {
  id: number
  title: string
  published: boolean
  published_at: string | null
  created_at: string
  news_categories: { name: string } | null
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts')
      if (response.ok) {
        const data = await response.json() as Post[]
        setPosts(data)
      }
    } catch (error) {
      console.error('포스트 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async (id: number, currentPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/posts/${id}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentPublished })
      })

      if (response.ok) {
        fetchPosts()
      } else {
        const data = await response.json() as { error?: string }
        alert(data.error || '상태 변경 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('포스트 상태 변경 오류:', error)
      alert('상태 변경 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchPosts()
      } else {
        const data = await response.json() as { error?: string }
        alert(data.error || '삭제 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('포스트 삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">포스트 관리</h1>
            <div className="flex space-x-4">
              <Link
                href="/admin/posts/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                새 포스트 작성
              </Link>
              <Link
                href="/admin/dashboard"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                대시보드로
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">포스트 목록</h3>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{post.title}</h4>
                    <p className="text-sm text-gray-500">
                      {post.news_categories?.name} • {new Date(post.created_at).toLocaleDateString('ko-KR')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">ID: {post.id}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? '게시됨' : '임시저장'}
                    </span>
                    <button
                      onClick={() => handleTogglePublish(post.id, post.published)}
                      className={`text-sm px-3 py-1 rounded ${
                        post.published
                          ? 'text-orange-600 hover:text-orange-800'
                          : 'text-green-600 hover:text-green-800'
                      }`}
                    >
                      {post.published ? '임시저장' : '게시'}
                    </button>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      편집
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">아직 포스트가 없습니다.</p>
                <Link
                  href="/admin/posts/new"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  첫 번째 포스트를 작성해보세요!
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 