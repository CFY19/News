/**
 * Storage Service for Fyware’s Top Feed
 * Handles long-term persistence of articles and 30-day retention logic.
 */

const ARTICLES_STORAGE_KEY = 'fyware_articles_history';
const LAST_FETCH_KEY = 'fyware_last_fetch_timestamp';

/**
 * Saves articles to history, avoiding duplicates and enforcing 30-day retention.
 */
export const saveToHistory = (newArticles) => {
  const existing = getHistory();
  const existingIds = new Set(existing.map(a => a.id));

  // Only add articles we haven't seen before
  const toAdd = newArticles.filter(a => !existingIds.has(a.id));
  const combined = [...toAdd, ...existing];

  // Enforce 30-day purge
  const purged = purgeOldArticles(combined);

  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(purged));
  localStorage.setItem(LAST_FETCH_KEY, Date.now().toString());

  return purged;
};

/**
 * Retrieves all stored articles.
 */
export const getHistory = () => {
  try {
    const data = localStorage.getItem(ARTICLES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading history:', e);
    return [];
  }
};

/**
 * Removes articles older than 30 days.
 */
export const purgeOldArticles = (articles) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return articles.filter(article => {
    const articleDate = new Date(article.date);
    // If date is invalid, we keep it just in case, but usually they are valid ISO strings
    if (isNaN(articleDate.getTime())) return true;
    return articleDate >= thirtyDaysAgo;
  });
};

/**
 * Checks if we need to fetch new data (e.g., once a day or every few hours).
 */
export const shouldFetchNewData = () => {
  const lastFetch = localStorage.getItem(LAST_FETCH_KEY);
  if (!lastFetch) return true;

  const oneDayInMs = 24 * 60 * 60 * 1000;
  return (Date.now() - parseInt(lastFetch)) > oneDayInMs;
};
