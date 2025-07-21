-- 블로그 데이터베이스 스키마

-- 카테고리 테이블
CREATE TABLE news_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 관리자 테이블
CREATE TABLE news_admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 블로그 포스트 테이블
CREATE TABLE news_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category_id UUID REFERENCES news_categories(id) ON DELETE SET NULL,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analysis TEXT -- AI 분석 결과
);

-- LOB API 스크랩핑 데이터 테이블
CREATE TABLE news_lob (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500),
    content TEXT,
    url VARCHAR(1000),
    author VARCHAR(200),
    published_at TIMESTAMP WITH TIME ZONE,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_news_posts_category_id ON news_posts(category_id);
CREATE INDEX idx_news_posts_published ON news_posts(published);
CREATE INDEX idx_news_posts_published_at ON news_posts(published_at);
CREATE INDEX idx_news_lob_scraped_at ON news_lob(scraped_at);
CREATE INDEX idx_news_lob_published_at ON news_lob(published_at);

-- 초기 관리자 계정 생성 (비밀번호: gksmftkfkd!@)
INSERT INTO news_admins (username, password_hash) 
VALUES ('admin', '$2b$10$kxO/mLk6RjSuwc/xDM51b.IcDH5CQUoX6JIn50Vjlg4/tkSfniCGa');

-- 샘플 카테고리 생성
INSERT INTO news_categories (name, description) VALUES 
('기술', '프로그래밍과 기술 관련 글'),
('일상', '일상적인 이야기'),
('리뷰', '책, 영화, 제품 리뷰'); 