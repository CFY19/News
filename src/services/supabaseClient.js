import { createClient } from '@supabase/supabase-js';

// placeholders for public access (ideally should be in .env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if credentials are provided, otherwise null for easy fallback detection
export const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

/**
 * SQL SCHEMA FOR GLOBAL METRICS (Execute in Supabase SQL Editor)
 *
 * -- 1. Article Metrics Table
 * CREATE TABLE article_metrics (
 *   article_id TEXT PRIMARY KEY,
 *   views INTEGER DEFAULT 0,
 *   helpful INTEGER DEFAULT 0,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- 2. User Likes Table (To prevent duplicate votes)
 * CREATE TABLE user_likes (
 *   id BIGSERIAL PRIMARY KEY,
 *   article_id TEXT NOT NULL,
 *   user_fingerprint TEXT NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   UNIQUE(article_id, user_fingerprint)
 * );
 *
 * -- 3. Global Increment RPC
 * CREATE OR REPLACE FUNCTION increment_article_metric(target_id TEXT, metric_name TEXT, user_fingerprint TEXT DEFAULT NULL)
 * RETURNS INTEGER AS $$
 * DECLARE
 *   new_val INTEGER;
 * BEGIN
 *   -- Tracking logic for Helpful votes
 *   IF metric_name = 'helpful' AND user_fingerprint IS NOT NULL THEN
 *     INSERT INTO user_likes (article_id, user_fingerprint)
 *     VALUES (target_id, user_fingerprint)
 *     ON CONFLICT DO NOTHING;
 *
 *     IF NOT FOUND THEN
 *        -- If record existed, we don't increment helpful again
 *        SELECT helpful INTO new_val FROM article_metrics WHERE article_id = target_id;
 *        RETURN COALESCE(new_val, 0);
 *     END IF;
 *   END IF;
 *
 *   -- Standard increment logic
 *   INSERT INTO article_metrics (article_id, views, helpful)
 *   VALUES (target_id,
 *     CASE WHEN metric_name = 'view' THEN 1 ELSE 0 END,
 *     CASE WHEN metric_name = 'helpful' THEN 1 ELSE 0 END)
 *   ON CONFLICT (article_id)
 *   DO UPDATE SET
 *     views = article_metrics.views + (CASE WHEN metric_name = 'view' THEN 1 ELSE 0 END),
 *     helpful = article_metrics.helpful + (CASE WHEN metric_name = 'helpful' THEN 1 ELSE 0 END),
 *     updated_at = NOW()
 *   RETURNING (CASE WHEN metric_name = 'view' THEN article_metrics.views ELSE article_metrics.helpful END) INTO new_val;
 *   RETURN new_val;
 * END;
 * $$ LANGUAGE plpgsql;
 *
 * -- 4. Global Decrement RPC (Only for Helpful)
 * CREATE OR REPLACE FUNCTION decrement_article_metric(target_id TEXT, metric_name TEXT, user_fingerprint TEXT DEFAULT NULL)
 * RETURNS INTEGER AS $$
 * DECLARE
 *   new_val INTEGER;
 * BEGIN
 *   IF metric_name = 'helpful' AND user_fingerprint IS NOT NULL THEN
 *     DELETE FROM user_likes WHERE article_id = target_id AND user_fingerprint = user_fingerprint;
 *   END IF;
 *
 *   UPDATE article_metrics SET
 *     helpful = GREATEST(0, article_metrics.helpful - 1),
 *     updated_at = NOW()
 *   WHERE article_id = target_id
 *   RETURNING article_metrics.helpful INTO new_val;
 *   RETURN COALESCE(new_val, 0);
 * END;
 * $$ LANGUAGE plpgsql;
 */
