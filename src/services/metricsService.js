/**
 * Metrics Service for Fyware’s Top Feed
 * Handles persistence of user engagement.
 * Integrated with localStorage to simulate a database.
 */

const STORAGE_KEY_PREFIX = 'fyware_metrics_';
const GLOBAL_METRICS_KEY = 'fyware_global_metrics';

/**
 * Gets local metrics state for a specific article
 */
const getLocalState = (articleId) => {
  const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${articleId}`);
  return data ? JSON.parse(data) : { viewed: false, helpful: false };
};

/**
 * Saves local metrics state for a specific article
 */
const saveLocalState = (articleId, state) => {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${articleId}`, JSON.stringify(state));
};

/**
 * Tracks a view for an article. Increments by 1 every time it's called.
 * @returns {Promise<number>} The updated view count
 */
export const trackView = async (articleId) => {
  const globalCounts = JSON.parse(localStorage.getItem(GLOBAL_METRICS_KEY) || '{}');

  if (!globalCounts[articleId]) {
    globalCounts[articleId] = { views: 0, helpful: 0 };
  }

  // Increment views every time (as requested: "Cada vez que un usuario haga clic")
  globalCounts[articleId].views += 1;
  localStorage.setItem(GLOBAL_METRICS_KEY, JSON.stringify(globalCounts));

  // Update local state just to track that we've seen it at least once
  const localState = getLocalState(articleId);
  localState.viewed = true;
  saveLocalState(articleId, localState);

  return globalCounts[articleId].views;
};

/**
 * Tracks a 'Helpful' vote for an article.
 * @returns {Promise<number>} The updated helpful count
 */
export const trackHelpful = async (articleId) => {
  const localState = getLocalState(articleId);

  // We keep the "helpful" vote unique per user to maintain data integrity,
  // even though views increment every time.
  if (localState.helpful) {
    const globalCounts = JSON.parse(localStorage.getItem(GLOBAL_METRICS_KEY) || '{}');
    return globalCounts[articleId]?.helpful || 0;
  }

  const globalCounts = JSON.parse(localStorage.getItem(GLOBAL_METRICS_KEY) || '{}');
  if (!globalCounts[articleId]) {
    globalCounts[articleId] = { views: 0, helpful: 0 };
  }

  globalCounts[articleId].helpful += 1;
  localStorage.setItem(GLOBAL_METRICS_KEY, JSON.stringify(globalCounts));

  localState.helpful = true;
  saveLocalState(articleId, localState);

  return globalCounts[articleId].helpful;
};

/**
 * Gets all metrics for a list of articles
 */
export const getMetricsForArticles = async (articleIds) => {
  const globalCounts = JSON.parse(localStorage.getItem(GLOBAL_METRICS_KEY) || '{}');
  const results = {};

  articleIds.forEach(id => {
    if (!globalCounts[id]) {
      globalCounts[id] = { views: 0, helpful: 0 };
    }
    results[id] = globalCounts[id];
  });

  return results;
};

/**
 * Checks if user has already voted helpful
 */
export const hasVotedHelpful = (articleId) => {
  return getLocalState(articleId).helpful;
};

/**
 * SQL snippet for Supabase implementation:
 *
 * -- Table structure
 * CREATE TABLE article_metrics (
 *   article_id TEXT PRIMARY KEY,
 *   views INTEGER DEFAULT 0,
 *   helpful INTEGER DEFAULT 0,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Function to increment metrics
 * CREATE OR REPLACE FUNCTION increment_article_metric(target_id TEXT, metric_name TEXT)
 * RETURNS void AS $$
 * BEGIN
 *   INSERT INTO article_metrics (article_id, views, helpful)
 *   VALUES (target_id,
 *     CASE WHEN metric_name = 'view' THEN 1 ELSE 0 END,
 *     CASE WHEN metric_name = 'helpful' THEN 1 ELSE 0 END)
 *   ON CONFLICT (article_id)
 *   DO UPDATE SET
 *     views = article_metrics.views + (CASE WHEN metric_name = 'view' THEN 1 ELSE 0 END),
 *     helpful = article_metrics.helpful + (CASE WHEN metric_name = 'helpful' THEN 1 ELSE 0 END),
 *     updated_at = NOW();
 * END;
 * $$ LANGUAGE plpgsql;
 */
