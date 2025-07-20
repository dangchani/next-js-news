import Link from 'next/link'
import { supabase } from '@/lib/supabase'

async function getStats() {
  const [postsResult, categoriesResult] = await Promise.all([
    supabase.from('news_posts').select('*', { count: 'exact' }),
    supabase.from('news_categories').select('*', { count: 'exact' })
  ])

  const publishedPostsResult = await supabase
    .from('news_posts')
    .select('*', { count: 'exact' })
    .eq('published', true)

  return {
    totalPosts: postsResult.count || 0,
    publishedPosts: publishedPostsResult.count || 0,
    totalCategories: categoriesResult.count || 0
  }
}

async function getRecentPosts() {
  const { data, error } = await supabase
    .from('news_posts')
    .select(`
      *,
      news_categories(name)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('최근 포스트 조회 오류:', error)
    return []
  }

  return data || []
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentPosts = await getRecentPosts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                관리자 대시보드
              </h1>
            </div>
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-sm text-slate-700 font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border border-white/50 hover:border-blue-200/50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              블로그로
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">전체 포스트</dt>
                    <dd className="text-3xl font-bold text-slate-900">{stats.totalPosts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">게시된 포스트</dt>
                    <dd className="text-3xl font-bold text-slate-900">{stats.publishedPosts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">카테고리</dt>
                    <dd className="text-3xl font-bold text-slate-900">{stats.totalCategories}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link
            href="/admin/posts/new"
            className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 border border-blue-500/20"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">새 포스트</h3>
                <p className="text-blue-100 text-sm">글 작성하기</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/posts"
            className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 border border-green-500/20"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">포스트 관리</h3>
                <p className="text-green-100 text-sm">글 관리하기</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="group bg-gradient-to-r from-purple-600 to-violet-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 border border-purple-500/20"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">카테고리</h3>
                <p className="text-purple-100 text-sm">분류 관리</p>
              </div>
            </div>
          </Link>

          <Link
            href="/api/admin/logout"
            className="group bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 border border-red-500/20"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">로그아웃</h3>
                <p className="text-red-100 text-sm">세션 종료</p>
              </div>
            </div>
          </Link>
        </div>

        {/* 최근 포스트 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50">
          <div className="px-8 py-6 border-b border-slate-200/50">
            <h3 className="text-xl font-bold text-slate-900">최근 포스트</h3>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {recentPosts.map((post: any) => (
                <div key={post.id} className="flex items-center justify-between p-6 bg-white/50 rounded-xl border border-white/50 hover:bg-white/70 transition-all duration-200">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h4>
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mr-3">
                        {post.news_categories?.name}
                      </span>
                      <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-4 py-2 text-sm font-medium rounded-full ${
                      post.published 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.published ? '게시됨' : '임시저장'}
                    </span>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      편집
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {recentPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-600">아직 포스트가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 