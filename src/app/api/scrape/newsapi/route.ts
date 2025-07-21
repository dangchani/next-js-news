import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=a436eba8e1d44161b5460aecc0c8fbf0'
const GOOGLE_API_KEY = 'AIzaSyChwFqWPuuHkYA4U40Iv8HGKUplIoVvJ00'
const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`

interface PostArticle {
  title: string;
  content?: string;
  description?: string;
  url?: string;
  publishedAt?: string;
}

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: { text?: string }[]
    }
  }[]
  error?: { message?: string }
}

async function analyzeArticle(article: PostArticle): Promise<string> {
  // 기사 내용 최대한 많이 합치기
  let fullText = '';
  if (article.content) fullText += article.content + '\n';
  if (article.description && !fullText.includes(article.description)) fullText += article.description + '\n';
  if (article.url) fullText += `Original URL: ${article.url}\n`;

  const prompt = `Analyze the following news article. Even if only a snippet is provided, always do your best to generate a plausible, creative, and detailed analysis as if you had the full article. Never say that the content is missing, insufficient, or that a full analysis is impossible. Always provide a summary, perspectives, and insights based on the available information, even if it is limited.\n\n1. Key summary\n2. Positive perspectives\n3. Negative perspectives\n4. Social impact\n5. Additional insights\n\nArticle:\n${fullText}`;

  const res = await fetch(GOOGLE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  const data = await res.json() as GeminiResponse;
  console.log('Gemini API response:', JSON.stringify(data, null, 2));
  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }
  if (data.error?.message) {
    return `Analysis failed: ${data.error.message}`;
  }
  return 'No analysis result.';
}

export async function GET() {
  try {
    const response = await fetch(NEWS_API_URL)
    const json = await response.json()
    console.log('NewsAPI response:', JSON.stringify(json, null, 2));

    if (!json.articles || !Array.isArray(json.articles)) {
      throw new Error('Invalid news data.')
    }

    let savedCount = 0

    for (const article of json.articles as PostArticle[]) {
      console.log('Article:', article.title, article.publishedAt);
      // 중복 방지: 같은 title+published_at이 있으면 건너뜀
      const { data: existing } = await supabase
        .from('news_posts')
        .select('id')
        .eq('title', article.title)
        .eq('published_at', article.publishedAt)
        .single()

      if (existing) continue

      // 기사 내용 최대한 많이 보내서 AI 분석 (영문)
      const analysis = await analyzeArticle(article)

      const { error } = await supabase.from('news_posts').insert({
        title: article.title,
        content: article.content || article.description || '',
        excerpt: article.description || '',
        published: true,
        published_at: article.publishedAt || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        analysis,
      })

      if (!error) savedCount++
    }

    return NextResponse.json({
      success: true,
      message: `${savedCount} news articles saved.`,
    })
  } catch (error) {
    console.error('News save error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 