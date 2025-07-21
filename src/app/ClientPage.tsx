'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'

interface Post {
  id: number
  title: string
  content: string
  excerpt: string | null
  category_id: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  news_categories: { name: string }[] | null
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalPosts: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface ClientPageProps {
  initialPosts: Post[]
}

export default function ClientPage({ initialPosts }: ClientPageProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    // URL 파라미터에서 카테고리 확인
    const urlParams = new URLSearchParams(window.location.search)
    const categoryFromUrl = urlParams.get('category')
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
      fetchPosts(categoryFromUrl, 1)
    }
  }, [])

  const fetchPosts = async (categoryId: string, page: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        category: categoryId,
        page: page.toString(),
        limit: '50'
      })
      
      const response = await fetch(`/api/posts?${params}`)
      if (response.ok) {
        const data = await response.json() as { posts: Post[]; pagination: Pagination }
        setPosts(data.posts)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('포스트 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
    fetchPosts(categoryId, 1)
    // URL 업데이트
    const url = new URL(window.location.href)
    if (categoryId === 'all') {
      url.searchParams.delete('category')
    } else {
      url.searchParams.set('category', categoryId)
    }
    window.history.pushState({}, '', url.toString())
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchPosts(selectedCategory, page)
  }

  return (
    <Layout selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange}>
      {/* 히어로 섹션 */}
      <div className="text-center mb-12 lg:mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 lg:mb-6">
          최신 소식을 만나보세요
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
          기술, 일상, 리뷰 등 다양한 주제의 흥미로운 글들을 확인해보세요
        </p>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-16 lg:py-20">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-slate-600">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            포스트를 불러오는 중...
          </div>
        </div>
      )}

      {/* 포스트 그리드 */}
      {!loading && (
        <>
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {posts.map((post: Post) => (
              <article key={post.id} className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 hover:border-blue-200/50 transform hover:-translate-y-2">
                  <div className="p-6 md:p-8">
                    {/* 카테고리 및 날짜 */}
                    <div className="flex items-center text-sm text-slate-500 mb-4">
                      <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {post.news_categories && post.news_categories.length > 0 ? post.news_categories[0].name : '기타'}
                      </span>
                      <span className="mx-3 text-slate-300">•</span>
                      <time dateTime={post.published_at || post.created_at} className="font-medium">
                        {new Date(post.published_at || post.created_at).toLocaleDateString('ko-KR')}
                      </time>
                    </div>
                    
                    {/* 제목 */}
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      <Link href={`/post/${post.id}`} className="hover:no-underline">
                        {post.title}
                      </Link>
                    </h2>
                    
                    {/* 요약 */}
                    {post.excerpt && (
                      <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed text-sm md:text-base">
                        {post.excerpt}
                      </p>
                    )}
                    
                    {/* 더 보기 버튼 */}
                    <Link 
                      href={`/post/${post.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-1 transition-all duration-200 text-sm md:text-base"
                    >
                      더 보기
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 페이징 */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12 lg:mt-16 flex justify-center">
              <nav className="flex items-center space-x-1 md:space-x-2" aria-label="페이지 네비게이션">
                {/* 이전 페이지 */}
                {pagination.hasPrevPage && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="inline-flex items-center px-3 md:px-4 py-2 bg-white/70 backdrop-blur-sm text-slate-700 font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border border-white/50 text-sm md:text-base"
                    aria-label="이전 페이지"
                  >
                    <svg className="w-4 h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">이전</span>
                  </button>
                )}

                {/* 페이지 번호 */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 md:px-4 py-2 font-medium rounded-xl transition-all duration-200 text-sm md:text-base ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-white/70 backdrop-blur-sm text-slate-700 hover:bg-white/90 shadow-md hover:shadow-lg border border-white/50'
                        }`}
                        aria-label={`${pageNum} 페이지`}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                {/* 다음 페이지 */}
                {pagination.hasNextPage && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="inline-flex items-center px-3 md:px-4 py-2 bg-white/70 backdrop-blur-sm text-slate-700 font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border border-white/50 text-sm md:text-base"
                    aria-label="다음 페이지"
                  >
                    <span className="hidden sm:inline">다음</span>
                    <svg className="w-4 h-4 ml-1 md:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </nav>
            </div>
          )}

          {/* 빈 상태 */}
          {posts.length === 0 && !loading && (
            <div className="text-center py-16 lg:py-20">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 lg:w-12 lg:h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
                {selectedCategory === 'all' ? '아직 게시된 글이 없습니다' : '해당 카테고리의 글이 없습니다'}
              </h2>
              <p className="text-slate-600 mb-8 px-4">
                {selectedCategory === 'all' 
                  ? '관리자로 로그인하여 첫 번째 글을 작성해보세요!' 
                  : '다른 카테고리를 선택하거나 관리자로 로그인하여 글을 작성해보세요!'
                }
              </p>
            </div>
          )}
        </>
      )}
    </Layout>
  )
} 