-- FYWARE TOP FEED - SUPABASE SCHEMA
-- Execute this in your Supabase SQL Editor

-- 1. Article Metrics Table
-- Stores the global counters for each article
CREATE TABLE article_metrics (
  article_id TEXT PRIMARY KEY,
  views INTEGER DEFAULT 0,
  helpful INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Likes Table
-- Stores which user (by fingerprint) liked which article to allow toggling
CREATE TABLE user_likes (
  id BIGSERIAL PRIMARY KEY,
  article_id TEXT NOT NULL,
  user_fingerprint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, user_fingerprint)
);

-- 3. RPC: Global Increment
-- Handles atomic increments for views and helpful votes
CREATE OR REPLACE FUNCTION increment_article_metric(
  target_id TEXT,
  metric_name TEXT,
  user_fingerprint TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  new_val INTEGER;
BEGIN
  -- Tracking logic for Helpful votes (one per user)
  IF metric_name = 'helpful' AND user_fingerprint IS NOT NULL THEN
    INSERT INTO user_likes (article_id, user_fingerprint)
    VALUES (target_id, user_fingerprint)
    ON CONFLICT DO NOTHING;

    -- If no new row was inserted (already liked), just return current count
    IF NOT FOUND THEN
       SELECT helpful INTO new_val FROM article_metrics WHERE article_id = target_id;
       RETURN COALESCE(new_val, 0);
    END IF;
  END IF;

  -- Upsert the metric count
  INSERT INTO article_metrics (article_id, views, helpful)
  VALUES (target_id,
    CASE WHEN metric_name = 'view' THEN 1 ELSE 0 END,
    CASE WHEN metric_name = 'helpful' THEN 1 ELSE 0 END)
  ON CONFLICT (article_id)
  DO UPDATE SET
    views = article_metrics.views + (CASE WHEN metric_name = 'view' THEN 1 ELSE 0 END),
    helpful = article_metrics.helpful + (CASE WHEN metric_name = 'helpful' THEN 1 ELSE 0 END),
    updated_at = NOW()
  RETURNING (CASE WHEN metric_name = 'view' THEN article_metrics.views ELSE article_metrics.helpful END) INTO new_val;

  RETURN new_val;
END;
$$ LANGUAGE plpgsql;

-- 4. RPC: Global Decrement
-- Handles atomic decrement when a user un-likes an article
CREATE OR REPLACE FUNCTION decrement_article_metric(
  target_id TEXT,
  metric_name TEXT,
  user_fingerprint TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  new_val INTEGER;
BEGIN
  -- Remove the user association
  IF metric_name = 'helpful' AND user_fingerprint IS NOT NULL THEN
    DELETE FROM user_likes WHERE article_id = target_id AND user_fingerprint = user_fingerprint;
  END IF;

  -- Decrement the global counter
  UPDATE article_metrics SET
    helpful = GREATEST(0, article_metrics.helpful - 1),
    updated_at = NOW()
  WHERE article_id = target_id
  RETURNING article_metrics.helpful INTO new_val;

  RETURN COALESCE(new_val, 0);
END;
$$ LANGUAGE plpgsql;
