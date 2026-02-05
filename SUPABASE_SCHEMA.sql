-- Supabase Schema for Fyware’s Top Feed Metrics

-- Table for tracking article metrics
CREATE TABLE IF NOT EXISTS article_metrics (
    article_id TEXT PRIMARY KEY, -- Using the normalized ID (e.g., 'devto-123', 'hn-456')
    helpful_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to increment metrics
CREATE OR REPLACE FUNCTION increment_metric(target_id TEXT, metric_name TEXT)
RETURNS VOID AS $$
BEGIN
    IF metric_name = 'view' THEN
        INSERT INTO article_metrics (article_id, view_count)
        VALUES (target_id, 1)
        ON CONFLICT (article_id)
        DO UPDATE SET view_count = article_metrics.view_count + 1, updated_at = NOW();
    ELSIF metric_name = 'helpful' THEN
        INSERT INTO article_metrics (article_id, helpful_count)
        VALUES (target_id, 1)
        ON CONFLICT (article_id)
        DO UPDATE SET helpful_count = article_metrics.helpful_count + 1, updated_at = NOW();
    END IF;
END;
$$ LANGUAGE plpgsql;
