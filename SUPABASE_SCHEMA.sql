-- FYWARE TOP FEED - SUPABASE SCHEMA
-- Execute this in your Supabase SQL Editor

-- 1. Article Metrics Table
-- Stores the global counters for each article
CREATE TABLE IF NOT EXISTS article_metrics (
  article_id TEXT PRIMARY KEY,
  views INTEGER DEFAULT 0,
  helpful INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Likes Table
-- Stores which user (by fingerprint) liked which article to allow toggling
CREATE TABLE IF NOT EXISTS user_likes (
  id BIGSERIAL PRIMARY KEY,
  article_id TEXT NOT NULL,
  user_fingerprint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, user_fingerprint)
);

-- 3. Persistent Articles Table
-- Stores curated news from RSS feeds
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  source_url TEXT UNIQUE NOT NULL,
  author TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  priority INTEGER DEFAULT 0,
  source_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RPC: Global Increment
-- Handles atomic increments for views and helpful votes
CREATE OR REPLACE FUNCTION increment_article_metric(
  p_target_id TEXT,
  p_metric_name TEXT,
  p_user_fingerprint TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  new_val INTEGER;
BEGIN
  -- Tracking logic for Helpful votes (one per user)
  IF p_metric_name = 'helpful' AND p_user_fingerprint IS NOT NULL THEN
    INSERT INTO user_likes (article_id, user_fingerprint)
    VALUES (p_target_id, p_user_fingerprint)
    ON CONFLICT DO NOTHING;

    -- If no new row was inserted (already liked), just return current count
    IF NOT FOUND THEN
       SELECT helpful INTO new_val FROM article_metrics WHERE article_id = p_target_id;
       RETURN COALESCE(new_val, 0);
    END IF;
  END IF;

  -- Upsert the metric count
  INSERT INTO article_metrics (article_id, views, helpful)
  VALUES (p_target_id,
    CASE WHEN p_metric_name = 'view' THEN 1 ELSE 0 END,
    CASE WHEN p_metric_name = 'helpful' THEN 1 ELSE 0 END)
  ON CONFLICT (article_id)
  DO UPDATE SET
    views = article_metrics.views + (CASE WHEN p_metric_name = 'view' THEN 1 ELSE 0 END),
    helpful = article_metrics.helpful + (CASE WHEN p_metric_name = 'helpful' THEN 1 ELSE 0 END),
    updated_at = NOW()
  RETURNING (CASE WHEN p_metric_name = 'view' THEN article_metrics.views ELSE article_metrics.helpful END) INTO new_val;

  RETURN new_val;
END;
$$ LANGUAGE plpgsql;

-- 5. RPC: Global Decrement
-- Handles atomic decrement when a user un-likes an article
CREATE OR REPLACE FUNCTION decrement_article_metric(
  p_target_id TEXT,
  p_metric_name TEXT,
  p_user_fingerprint TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  new_val INTEGER;
BEGIN
  -- Remove the user association
  IF p_metric_name = 'helpful' AND p_user_fingerprint IS NOT NULL THEN
    DELETE FROM user_likes
    WHERE article_id = p_target_id
    AND user_fingerprint = p_user_fingerprint;
  END IF;

  -- Decrement the global counter
  UPDATE article_metrics SET
    helpful = GREATEST(0, article_metrics.helpful - 1),
    updated_at = NOW()
  WHERE article_id = p_target_id
  RETURNING article_metrics.helpful INTO new_val;

  RETURN COALESCE(new_val, 0);
END;
$$ LANGUAGE plpgsql;

-- 6. Maintenance: Purge Old Articles
-- Deletes articles older than 30 days
CREATE OR REPLACE FUNCTION purge_old_articles()
RETURNS void AS $$
BEGIN
  -- Delete metrics and likes associated with old articles (optional, keeping for cleanup)
  DELETE FROM user_likes WHERE article_id IN (SELECT id FROM articles WHERE published_at < NOW() - INTERVAL '30 days');
  DELETE FROM article_metrics WHERE article_id IN (SELECT id FROM articles WHERE published_at < NOW() - INTERVAL '30 days');
  -- Delete the articles themselves
  DELETE FROM articles WHERE published_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- To schedule this (requires pg_cron enabled in Supabase):
-- SELECT cron.schedule('0 0 * * *', 'SELECT purge_old_articles();');
