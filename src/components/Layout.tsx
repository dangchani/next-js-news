'use client'

import React from 'react'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent hover:text-gray-200 transition-colors duration-200 px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                News Blog
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/50 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600 text-sm">
          <div>126 3003room, Beolmal-ro, Dongan-gu, Anyang-si, Gyeonggi-do, Republic of Korea</div>
          <div className="mt-1">
            <a href="mailto:lob@lob.kr" className="hover:underline text-blue-600">lob@lob.kr</a>
          </div>
        </div>
      </footer>
    </div>
  )
} 