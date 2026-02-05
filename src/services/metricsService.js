const STORAGE_KEY_PREFIX = 'fyware_metrics_';
const USER_ID_KEY = 'fyware_user_id';

/**
 * Gets or creates a unique user fingerprint
 */
export const getUserId = () => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

/**
 * Tracks a view globally.
 */
export const trackView = async (articleId) => {
  try {
    const response = await fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId })
    });
    const data = await response.json();
    return data.views;
  } catch (err) {
    console.error('Error tracking view:', err);
    return 0;
  }
};

/**
 * Toggles the 'Helpful' status for a user.
 */
export const toggleHelpful = async (articleId) => {
  const userId = getUserId();
  try {
    const response = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, userFingerprint: userId })
    });
    const data = await response.json();

    // Update local state for immediate checks
    const state = { viewed: true, helpful: data.isLiked };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${articleId}`, JSON.stringify(state));

    return data.helpful;
  } catch (err) {
    console.error('Error toggling helpful:', err);
    return 0;
  }
};

/**
 * Gets global metrics for a list of articles
 */
export const getMetricsForArticles = async (articleIds) => {
  try {
    const response = await fetch(`/api/metrics?ids=${articleIds.join(',')}`);
    return await response.json();
  } catch (err) {
    console.error('Error fetching metrics:', err);
    const results = {};
    articleIds.forEach(id => results[id] = { views: 0, helpful: 0 });
    return results;
  }
};

/**
 * Checks if THIS user has voted helpful
 */
export const hasVotedHelpful = (articleId) => {
  const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${articleId}`);
  return data ? JSON.parse(data).helpful : false;
};

export const trackHelpful = toggleHelpful;
