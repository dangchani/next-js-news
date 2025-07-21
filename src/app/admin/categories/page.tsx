'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  description: string | null
  created_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json() as Category[]
        setCategories(data)
      }
    } catch (error) {
      console.error('카테고리 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories'
      
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setEditingCategory(null)
        setFormData({ name: '', description: '' })
        fetchCategories()
      } else {
        const data = await response.json() as { error?: string }
        alert(data.error || '오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('카테고리 저장 오류:', error)
      alert('오류가 발생했습니다.')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({ 
      name: category.name, 
      description: category.description || '' 
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchCategories()
      } else {
        const data = await response.json() as { error?: string }
        alert(data.error || '삭제 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('카테고리 삭제 오류:', error)
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
            <h1 className="text-3xl font-bold text-gray-900">카테고리 관리</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowForm(true)
                  setEditingCategory(null)
                  setFormData({ name: '', description: '' })
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                새 카테고리
              </button>
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
        {/* 카테고리 폼 */}
        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? '카테고리 수정' : '새 카테고리 추가'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  카테고리명
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  설명
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingCategory ? '수정' : '추가'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCategory(null)
                    setFormData({ name: '', description: '' })
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 카테고리 목록 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">카테고리 목록</h3>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{category.name}</h4>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      생성일: {new Date(category.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      편집
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 