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

type NewsApiResponse = {
  articles: PostArticle[];
  [key: string]: unknown;
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
    const response = await fetch(NEWS_API_URL, {
      headers: {
        'User-Agent': 'NewsScraperBot/1.0 (+https://news.lob.kr/)',
        'Accept': 'application/json',
      }
    })
    const json = await response.json() as NewsApiResponse;
    console.log('NewsAPI response:', JSON.stringify(json, null, 2));

    if (!json.articles || !Array.isArray(json.articles)) {
      throw new Error('Invalid news data.')
    }

    // 아직 저장되지 않은 뉴스 1개만 찾아서 처리
    for (const article of json.articles) {
      const typedArticle: PostArticle = article;
      const { data: existing } = await supabase
        .from('news_posts')
        .select('id')
        .eq('title', typedArticle.title)
        .eq('published_at', typedArticle.publishedAt)
        .single();

      if (!existing) {
        const analysis = await analyzeArticle(typedArticle);
        const { error } = await supabase.from('news_posts').insert({
          title: typedArticle.title,
          content: typedArticle.content || typedArticle.description || '',
          excerpt: typedArticle.description || '',
          published: true,
          published_at: typedArticle.publishedAt || new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          analysis,
        });
        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        return NextResponse.json({
          success: true,
          message: `1 news article saved.`,
          title: typedArticle.title,
        });
      }
    }

    // 모두 이미 저장된 경우
    return NextResponse.json({
      success: true,
      message: 'No new articles to save.',
    });
  } catch (error) {
    console.error('News save error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 