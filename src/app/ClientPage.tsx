'use client'

import { useState, useEffect } from 'react'
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
  analysis?: string | null
}

interface ClientPageProps {
  initialPosts: Post[]
}

const PAGE_SIZE = 18;

export default function ClientPage({ initialPosts }: ClientPageProps) {
  // id 내림차순 정렬
  const sortedPosts = [...initialPosts].sort((a, b) => b.id - a.id);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sortedPosts.length / PAGE_SIZE);

  const pagedPosts = sortedPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    // 페이지 변경 시 스크롤 맨 위로 이동
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <Layout>
      <div className="text-center mb-12 lg:mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 lg:mb-6">
          Latest News
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
          Discover interesting articles on technology, daily life, reviews, and more.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {pagedPosts.map((post) => (
          <article key={post.id} className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 hover:border-blue-200/50 transform hover:-translate-y-2">
              <div className="p-6 md:p-8">
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US') : ''}
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed text-sm md:text-base">
                    {post.excerpt}
                  </p>
                )}
                <a
                  href={`/post/${post.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-1 transition-all duration-200 text-sm md:text-base"
                >
                  Read More
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 font-medium rounded-xl transition-all duration-200 ${
                  currentPage === pageNum
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white/70 backdrop-blur-sm text-slate-700 hover:bg-white/90 shadow-md hover:shadow-lg border border-white/50'
                }`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            ))}
          </nav>
        </div>
      )}
    </Layout>
  );
} 