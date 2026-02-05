/**
 * Metrics Service for Fyware’s Top Feed
 * Handles persistence of user engagement.
 * Integrated with localStorage for simulation in this environment.
 *
 * TO ENABLE SHARED DATABASE (SUPABASE):
 * 1. Install @supabase/supabase-js
 * 2. Configure your SUPABASE_URL and SUPABASE_KEY
 * 3. Uncomment the Supabase integration code below.
 */

// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const STORAGE_KEY_PREFIX = 'fyware_metrics_';
const GLOBAL_METRICS_KEY = 'fyware_global_metrics';

/**
 * Gets local metrics state (if THIS user has viewed/liked)
 */
const getLocalState = (articleId) => {
  const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${articleId}`);
  return data ? JSON.parse(data) : { viewed: false, helpful: false };
};

/**
 * Saves local metrics state
 */
const saveLocalState = (articleId, state) => {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${articleId}`, JSON.stringify(state));
};

/**
 * Tracks a view for an article.
 * Increments global total and tracks per-user view.
 */
export const trackView = async (articleId) => {
  // Update Global Counter (Simulated persistence)
  const globalCounts = JSON.parse(localStorage.getItem(GLOBAL_METRICS_KEY) || '{}');
  if (!globalCounts[articleId]) {
    globalCounts[articleId] = { views: 0, helpful: 0 };
  }
  globalCounts[articleId].views += 1;
  localStorage.setItem(GLOBAL_METRICS_KEY, JSON.stringify(globalCounts));

  // Update Per-User State
  const localState = getLocalState(articleId);
  if (!localState.viewed) {
    localState.viewed = true;
    saveLocalState(articleId, localState);

    // REAL DB CALL:
    // await supabase.rpc('increment_article_metric', { target_id: articleId, metric_name: 'view' });
  }

  return globalCounts[articleId].views;
};

/**
 * Tracks a 'Helpful' vote for an article.
 * One vote per user.
 */
export const trackHelpful = async (articleId) => {
  const localState = getLocalState(articleId);

  if (localState.helpful) {
    const globalCounts = JSON.parse(localStorage.getItem(GLOBAL_METRICS_KEY) || '{}');
    return globalCounts[articleId]?.helpful || 0;
  }

  // Update Global Counter
  const globalCounts = JSON.parse(localStorage.getItem(GLOBAL_METRICS_KEY) || '{}');
  if (!globalCounts[articleId]) {
    globalCounts[articleId] = { views: 0, helpful: 0 };
  }
  globalCounts[articleId].helpful += 1;
  localStorage.setItem(GLOBAL_METRICS_KEY, JSON.stringify(globalCounts));

  // Update Per-User State
  localState.helpful = true;
  saveLocalState(articleId, localState);

  // REAL DB CALL:
  // await supabase.rpc('increment_article_metric', { target_id: articleId, metric_name: 'helpful' });

  return globalCounts[articleId].helpful;
};

/**
 * Gets all metrics for a list of articles.
 * Fetches from the 'shared' source.
 */
export const getMetricsForArticles = async (articleIds) => {
  // REAL DB CALL:
  // const { data } = await supabase.from('article_metrics').select('*').in('article_id', articleIds);
  // ... process and return

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

export const hasVotedHelpful = (articleId) => {
  return getLocalState(articleId).helpful;
};
