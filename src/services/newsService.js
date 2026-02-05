const DEV_TO_API = 'https://dev.to/api/articles';
const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

// Specialized XR Sources (Reddit still fetched on-the-fly for variety, but we could move it too)
const REDDIT_SOURCES = [
  { subreddit: 'Unity3D', query: 'top.json?limit=15&t=week' },
  { subreddit: 'virtualreality', query: 'top.json?limit=15&t=week' },
  { subreddit: 'Oculus', query: 'top.json?limit=10&t=week' },
  { subreddit: 'augmentedreality', query: 'top.json?limit=10&t=week' },
  { subreddit: 'mixedreality', query: 'top.json?limit=10&t=week' }
];

const RECOMMENDED_KEYWORDS = [
  'unity', 'vr', 'ar', 'xr', 'mixed reality', '3d modeling', 'spatial computing',
  'virtual reality', 'augmented reality', 'spatialcomputing', 'mixedreality', '3dmodeling'
];

/**
 * Normalizes tags
 */
const normalizeTags = (tags) => {
  if (!tags) return [];
  let processed = tags.map(tag => tag.toLowerCase());
  const xrKeywords = ['virtualreality', 'augmentedreality', 'vr', 'ar', 'mixedreality', 'spatialcomputing', 'oculus', 'unity3d', 'unity'];
  let hasXR = processed.some(tag => xrKeywords.includes(tag));
  processed = processed.filter(tag => !xrKeywords.includes(tag) && tag !== 'reddit');
  if (hasXR) processed = ['xr', ...processed.filter(t => t !== 'xr')];
  return processed;
};

/**
 * Assigns a priority score
 */
const calculatePriority = (title, tags) => {
  const t = title.toLowerCase();
  const ts = tags.map(tag => tag.toLowerCase());
  const matchesStrict = RECOMMENDED_KEYWORDS.some(kw => t.includes(kw) || ts.some(tag => tag.includes(kw.replace(' ', ''))));
  if (matchesStrict) return 100;
  if (t.includes('ai') || t.includes('gpt') || t.includes('llm') || ts.some(tag => ['ai', 'openai', 'gpt'].includes(tag))) return 50;
  return 0;
};

/**
 * Normalizes Reddit item
 */
const normalizeReddit = (child, subreddit) => {
  const item = child.data;
  const date = new Date(item.created_utc * 1000).toISOString();
  let tags = normalizeTags([subreddit.toLowerCase(), 'reddit']);
  let redditImage = null;
  if (item.preview && item.preview.images && item.preview.images[0]) redditImage = item.preview.images[0].source.url;
  else if (item.thumbnail && item.thumbnail.startsWith('http')) redditImage = item.thumbnail;

  return {
    id: `reddit-${item.id}`,
    title: item.title,
    description: item.selftext ? item.selftext.substring(0, 200) + '...' : `Posted in r/${subreddit} by ${item.author}`,
    imageUrl: redditImage,
    author: item.author,
    authorImage: `https://ui-avatars.com/api/?name=${item.author}&background=random`,
    date,
    readTime: '4 min read',
    tags,
    type: 'Article',
    sourceUrl: `https://reddit.com${item.permalink}`,
    priority: calculatePriority(item.title, tags)
  };
};

/**
 * Aggregates all news sources
 */
export const fetchAllNews = async () => {
  try {
    const backendPromise = fetch('/api/news').then(res => res.json()).catch(() => []);

    const devToPromise = fetch(`${DEV_TO_API}?per_page=40&tags=javascript,ai,xr,react,rust,unity3d`)
      .then(res => res.json())
      .then(data => data.map(article => ({
        id: `devto-${article.id}`,
        title: article.title,
        description: article.description,
        imageUrl: article.cover_image || article.social_image,
        author: article.user.name,
        authorImage: article.user.profile_image_90,
        date: article.published_at,
        readTime: `${article.reading_time_minutes} min read`,
        tags: normalizeTags(article.tag_list),
        type: 'Article',
        sourceUrl: article.url,
        priority: calculatePriority(article.title, article.tag_list)
      })))
      .catch(() => []);

    const redditPromises = REDDIT_SOURCES.map(source =>
      fetch(`https://www.reddit.com/r/${source.subreddit}/${source.query}`)
        .then(res => res.json())
        .then(data => data.data.children.map(child => normalizeReddit(child, source.subreddit)))
        .catch(() => [])
    );

    const allResults = await Promise.all([backendPromise, devToPromise, ...redditPromises]);
    const combined = allResults.flat();

    // Dedup
    const seen = new Set();
    const deduped = combined.filter(item => {
      if (seen.has(item.sourceUrl)) return false;
      seen.add(item.sourceUrl);
      return true;
    });

    return deduped.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return new Date(b.date) - new Date(a.date);
    });
  } catch (err) {
    console.error('Fetch all news failed:', err);
    return [];
  }
};
