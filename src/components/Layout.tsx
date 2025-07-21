'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  description: string | null
}

interface LayoutProps {
  children: React.ReactNode
  selectedCategory?: string
  onCategoryChange?: (categoryId: string) => void
  showSidebar?: boolean
}

export default function Layout({ 
  children, 
  selectedCategory = 'all', 
  onCategoryChange,
  showSidebar = true 
}: LayoutProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pagination, setPagination] = useState<{
    currentPage: number
    totalPages: number
    totalPosts: number
    hasNextPage: boolean
    hasPrevPage: boolean
  } | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
    checkAuthStatus()
    if (showSidebar) {
      fetchPostCount()
    }
  }, [showSidebar])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json() as Category[]
        setCategories(data)
      }
    } catch (error) {
      console.error('카테고리 조회 오류:', error)
    }
  }

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      if (response.ok) {
        const data = await response.json() as { isLoggedIn: boolean }
        setIsLoggedIn(data.isLoggedIn)
      }
    } catch (error) {
      console.error('인증 상태 확인 오류:', error)
    }
  }

  const fetchPostCount = async () => {
    try {
      const response = await fetch('/api/posts?limit=1')
      if (response.ok) {
        const data = await response.json() as { 
          pagination: {
            currentPage: number
            totalPages: number
            totalPosts: number
            hasNextPage: boolean
            hasPrevPage: boolean
          }
        }
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('포스트 수 조회 오류:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      setIsLoggedIn(false)
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId)
    } else {
      // 기본 동작: 홈페이지로 이동
      window.location.href = `/?category=${categoryId}`
    }
    // 모바일 메뉴 닫기
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                News Blog
              </h1>
            </div>
            
            {/* 모바일 햄버거 메뉴 버튼 */}
            {showSidebar && (
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl bg-white/70 backdrop-blur-sm text-slate-700 hover:bg-white/90 transition-all duration-200 border border-white/50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 모바일 카테고리 메뉴 오버레이 */}
      {isMobileMenuOpen && showSidebar && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* 모바일 메뉴 */}
          <div className="absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="p-6 h-full overflow-y-auto">
              {/* 헤더 */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  카테고리
                </h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* 카테고리 목록 */}
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white/50 text-slate-700 hover:bg-white/80 hover:shadow-md border border-white/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>전체</span>
                    <span className="text-sm opacity-75">
                      {pagination?.totalPosts || 0}
                    </span>
                  </div>
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-white/50 text-slate-700 hover:bg-white/80 hover:shadow-md border border-white/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-sm opacity-75">
                        {/* 카테고리별 포스트 수는 나중에 추가 가능 */}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* 카테고리 설명 */}
              {selectedCategory !== 'all' && categories.find(c => c.id === selectedCategory)?.description && (
                <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
                  <p className="text-sm text-slate-600">
                    {categories.find(c => c.id === selectedCategory)?.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* 왼쪽 사이드바 - 카테고리 메뉴 (데스크톱만) */}
          {showSidebar && (
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    카테고리
                  </h3>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        selectedCategory === 'all'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-white/50 text-slate-700 hover:bg-white/80 hover:shadow-md border border-white/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>전체</span>
                        <span className="text-sm opacity-75">
                          {pagination?.totalPosts || 0}
                        </span>
                      </div>
                    </button>
                    
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-white/50 text-slate-700 hover:bg-white/80 hover:shadow-md border border-white/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <span className="text-sm opacity-75">
                            {/* 카테고리별 포스트 수는 나중에 추가 가능 */}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* 카테고리 설명 */}
                  {selectedCategory !== 'all' && categories.find(c => c.id === selectedCategory)?.description && (
                    <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
                      <p className="text-sm text-slate-600">
                        {categories.find(c => c.id === selectedCategory)?.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          )}

          {/* 메인 콘텐츠 영역 */}
          <main className={`${showSidebar ? 'flex-1' : 'w-full'}`}>
            {children}
          </main>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-slate-600 text-center sm:text-left">
              © 2024 News Blog. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    대시보드
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-slate-600 hover:text-red-600 transition-colors duration-200 font-medium"
                  >
                    logout
                  </button>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  login
                </Link>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 