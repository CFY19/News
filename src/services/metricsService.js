/**
 * Metrics Service for Fyware’s Top Feed
 * Handles local persistence of user engagement to avoid double counting
 * and simulates/integrates with backend metrics.
 */

const STORAGE_KEY_PREFIX = 'fyware_metrics_';

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
 * Tracks a view for an article
 * @returns {Promise<number>} The updated view count (simulated or real)
 */
export const trackView = async (articleId) => {
  const localState = getLocalState(articleId);

  // Get current counts from global storage (simulating a DB)
  const globalCounts = JSON.parse(localStorage.getItem('fyware_global_metrics') || '{}');
  if (!globalCounts[articleId]) {
    globalCounts[articleId] = { views: Math.floor(Math.random() * 50) + 10, helpful: Math.floor(Math.random() * 10) + 2 };
  }

  if (!localState.viewed) {
    localState.viewed = true;
    saveLocalState(articleId, localState);
    globalCounts[articleId].views += 1;
    localStorage.setItem('fyware_global_metrics', JSON.stringify(globalCounts));

    // Here we would call the Supabase RPC:
    // await supabase.rpc('increment_metric', { target_id: articleId, metric_name: 'view' });
  }

  return globalCounts[articleId].views;
};

/**
 * Tracks a 'Helpful' vote for an article
 * @returns {Promise<number>} The updated helpful count
 */
export const trackHelpful = async (articleId) => {
  const localState = getLocalState(articleId);

  const globalCounts = JSON.parse(localStorage.getItem('fyware_global_metrics') || '{}');
  if (!globalCounts[articleId]) {
    globalCounts[articleId] = { views: 20, helpful: 5 };
  }

  if (!localState.helpful) {
    localState.helpful = true;
    saveLocalState(articleId, localState);
    globalCounts[articleId].helpful += 1;
    localStorage.setItem('fyware_global_metrics', JSON.stringify(globalCounts));

    // await supabase.rpc('increment_metric', { target_id: articleId, metric_name: 'helpful' });
  }

  return globalCounts[articleId].helpful;
};

/**
 * Gets all metrics for a list of articles
 */
export const getMetricsForArticles = async (articleIds) => {
  const globalCounts = JSON.parse(localStorage.getItem('fyware_global_metrics') || '{}');
  const results = {};

  articleIds.forEach(id => {
    if (!globalCounts[id]) {
      // Seed with random data if not exists for demo purposes
      globalCounts[id] = {
        views: Math.floor(Math.random() * 100) + 20,
        helpful: Math.floor(Math.random() * 30) + 5
      };
    }
    results[id] = globalCounts[id];
  });

  localStorage.setItem('fyware_global_metrics', JSON.stringify(globalCounts));
  return results;
};

/**
 * Checks if user has already voted helpful
 */
export const hasVotedHelpful = (articleId) => {
  return getLocalState(articleId).helpful;
};
