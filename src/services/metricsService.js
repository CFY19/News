import { supabase } from './supabaseClient';

const STORAGE_KEY_PREFIX = 'fyware_metrics_';
const USER_ID_KEY = 'fyware_user_id';

/**
 * Gets or creates a unique user fingerprint
 */
const getUserId = () => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

/**
 * Tracks a view globally. Views increment on every unique session/page load.
 */
export const trackView = async (articleId) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase.rpc('increment_article_metric', {
      target_id: articleId,
      metric_name: 'view'
    });

    if (error) throw error;
    return data;
  } catch (err) {
    // Fallback logic for when DB is not connected
    const globalCounts = JSON.parse(localStorage.getItem('fyware_global_metrics') || '{}');
    if (!globalCounts[articleId]) globalCounts[articleId] = { views: 0, helpful: 0 };
    globalCounts[articleId].views += 1;
    localStorage.setItem('fyware_global_metrics', JSON.stringify(globalCounts));
    return globalCounts[articleId].views;
  }
};

/**
 * Toggles the 'Helpful' status for a user.
 * Increments if not liked, decrements if already liked.
 */
export const toggleHelpful = async (articleId) => {
  const userId = getUserId();
  const isCurrentlyLiked = hasVotedHelpful(articleId);

  try {
    if (!supabase) throw new Error('Supabase not configured');

    const rpcName = isCurrentlyLiked ? 'decrement_article_metric' : 'increment_article_metric';

    const { data, error } = await supabase.rpc(rpcName, {
      target_id: articleId,
      metric_name: 'helpful',
      user_fingerprint: userId
    });

    if (error) throw error;

    const state = { viewed: true, helpful: !isCurrentlyLiked };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${articleId}`, JSON.stringify(state));

    return data;
  } catch (err) {
    const globalCounts = JSON.parse(localStorage.getItem('fyware_global_metrics') || '{}');
    if (!globalCounts[articleId]) globalCounts[articleId] = { views: 0, helpful: 0 };

    if (isCurrentlyLiked) {
      globalCounts[articleId].helpful = Math.max(0, globalCounts[articleId].helpful - 1);
    } else {
      globalCounts[articleId].helpful += 1;
    }

    localStorage.setItem('fyware_global_metrics', JSON.stringify(globalCounts));

    const state = { viewed: true, helpful: !isCurrentlyLiked };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${articleId}`, JSON.stringify(state));

    return globalCounts[articleId].helpful;
  }
};

/**
 * Gets global metrics for a list of articles
 */
export const getMetricsForArticles = async (articleIds) => {
  try {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('article_metrics')
      .select('article_id, views, helpful')
      .in('article_id', articleIds);

    if (error) throw error;

    const results = {};
    data.forEach(row => {
      results[row.article_id] = { views: row.views, helpful: row.helpful };
    });

    articleIds.forEach(id => {
      if (!results[id]) results[id] = { views: 0, helpful: 0 };
    });

    return results;
  } catch (err) {
    const globalCounts = JSON.parse(localStorage.getItem('fyware_global_metrics') || '{}');
    const results = {};
    articleIds.forEach(id => {
      results[id] = globalCounts[id] || { views: 0, helpful: 0 };
    });
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

// Alias for compatibility
export const trackHelpful = toggleHelpful;
