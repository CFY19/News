const DEV_TO_API = 'https://dev.to/api/articles';
const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

// Specialized XR Sources
const REDDIT_SOURCES = [
  { subreddit: 'Unity3D', query: 'top.json?limit=15&t=week' },
  { subreddit: 'virtualreality', query: 'top.json?limit=15&t=week' },
  { subreddit: 'Oculus', query: 'top.json?limit=10&t=week' },
  { subreddit: 'augmentedreality', query: 'top.json?limit=10&t=week' },
  { subreddit: 'mixedreality', query: 'top.json?limit=10&t=week' }
];

/**
 * Gets a branded Fyware placeholder image based on category if original is missing.
 */
const getFywarePlaceholder = (type, tags = []) => {
  const lowerTags = tags.map(t => t.toLowerCase());
  let color = '4F46E5'; // Default Indigo
  let text = 'Fyware+Tech';

  if (lowerTags.includes('ai') || lowerTags.includes('openai') || lowerTags.includes('gpt')) {
    color = '4F46E5';
    text = 'Fyware+AI';
  } else if (lowerTags.includes('xr') || lowerTags.includes('vr') || lowerTags.includes('ar') || lowerTags.includes('unity')) {
    color = '0D9488'; // Brand Teal
    text = 'Fyware+XR';
  } else if (type === 'Video') {
    color = 'F43F5E'; // Rose
    text = 'Fyware+Video';
  }

  return `https://placehold.co/600x400/${color}/FFFFFF?text=${text}`;
};

/**
 * Normalizes tags based on Fyware consolidation logic.
 * - Group VirtualReality/AugmentedReality/Oculus/MixedReality under XR
 * - Remove Reddit tag
 */
const normalizeTags = (tags) => {
  if (!tags) return [];

  let processed = tags.map(tag => tag.toLowerCase());

  // Consolidate XR
  const xrKeywords = ['virtualreality', 'augmentedreality', 'vr', 'ar', 'mixedreality', 'spatialcomputing', 'oculus', 'unity3d', 'unity'];
  let hasXR = processed.some(tag => xrKeywords.includes(tag));

  processed = processed.filter(tag => !xrKeywords.includes(tag) && tag !== 'reddit');

  if (hasXR) {
    processed = ['xr', ...processed.filter(t => t !== 'xr')];
  }

  return processed;
};

/**
 * Adjusts image URL to request higher resolution if possible.
 */
const getHighResImage = (url) => {
  if (!url) return url;

  let highRes = url;

  // Replace low-res params as requested
  highRes = highRes.replace(/&t=small/g, '&t=large');
  highRes = highRes.replace(/width=100/g, 'width=1000');
  highRes = highRes.replace(/height=100/g, 'height=1000');

  // Reddit decoding
  if (url.includes('preview.redd.it')) {
    highRes = url.replace(/&amp;/g, '&');
  }

  return highRes;
};

/**
 * Extracts high-quality thumbnail
 */
const getThumbnail = (url, fallback, type, tags) => {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }

  if (url.includes('linkedin.com') || url.includes('instagram.com')) {
    return getFywarePlaceholder(type, tags);
  }

  return getHighResImage(fallback) || getFywarePlaceholder(type, tags);
};

/**
 * Assigns a priority score based on Fyware DNA
 */
const calculatePriority = (title, tags) => {
  const t = title.toLowerCase();
  const ts = tags.map(tag => tag.toLowerCase());

  const isXR = t.includes('unity') || t.includes('vr') || t.includes('ar') || t.includes('3d') || t.includes('modeling') || t.includes('xr') || t.includes('spatial') || t.includes('oculus') || t.includes('mixed reality') ||
               ts.some(tag => ['unity', 'vr', 'ar', '3d', 'xr', 'spatialcomputing', 'mixedreality'].includes(tag));

  if (isXR) return 100; // Priority 1 (Recommended)

  const isAI = t.includes('ai') || t.includes('gpt') || t.includes('llm') || t.includes('tool') ||
               ts.some(tag => ['ai', 'openai', 'gpt', 'tool', 'opensource'].includes(tag));

  if (isAI) return 50;

  return 0;
};

/**
 * Normalizes a Dev.to article
 */
const normalizeDevTo = (article) => {
  const type = determineType(article.title, article.tag_list, article.url);
  const tags = normalizeTags(article.tag_list);
  const imageUrl = getThumbnail(article.url, article.cover_image || article.social_image, type, tags);

  return {
    id: `devto-${article.id}`,
    title: article.title,
    description: article.description,
    imageUrl: imageUrl,
    author: article.user.name,
    authorImage: article.user.profile_image_90,
    date: article.published_at,
    readTime: `${article.reading_time_minutes} min read`,
    tags: tags,
    type: type,
    sourceUrl: article.url,
    priority: calculatePriority(article.title, tags),
    fullContent: {
      title: article.title,
      author: article.user.name,
      date: new Date(article.published_at).toLocaleDateString(),
      readTime: `${article.reading_time_minutes} min read`,
      authorImage: article.user.profile_image_90,
      tldr: [article.description],
      tags: tags,
      paragraphs: [article.description],
      quote: null
    }
  };
};

/**
 * Normalizes a Hacker News item
 */
const normalizeHN = (item) => {
  const date = new Date(item.time * 1000).toISOString();
  const type = determineType(item.title, [], item.url || '');
  let tags = ['hacker-news', 'tech'];

  const titleText = item.title.toLowerCase();
  if (titleText.includes('ai') || titleText.includes('gpt')) tags.push('ai');
  if (titleText.includes('xr') || titleText.includes('vr') || titleText.includes('ar') || titleText.includes('vision pro')) tags.push('xr');
  if (titleText.includes('unity')) tags.push('unity');

  tags = normalizeTags(tags);
  const imageUrl = getThumbnail(item.url || '', null, type, tags);

  return {
    id: `hn-${item.id}`,
    title: item.title,
    description: `Trending on Hacker News. Discussion with ${item.score} points.`,
    imageUrl: imageUrl,
    author: item.by,
    authorImage: `https://ui-avatars.com/api/?name=${item.by}&background=random`,
    date: date,
    readTime: '3 min read',
    tags: tags,
    type: type,
    sourceUrl: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
    priority: calculatePriority(item.title, tags),
    fullContent: {
      title: item.title,
      author: item.by,
      date: new Date(date).toLocaleDateString(),
      readTime: '3 min read',
      authorImage: `https://ui-avatars.com/api/?name=${item.by}&background=random`,
      tldr: [`Discussion with ${item.score} points.`],
      tags: tags,
      paragraphs: [`Join the conversation on Hacker News regarding "${item.title}".`],
      quote: null
    }
  };
};

/**
 * Normalizes a Reddit item
 */
const normalizeReddit = (child, subreddit) => {
  const item = child.data;
  const date = new Date(item.created_utc * 1000).toISOString();
  let tags = [subreddit.toLowerCase(), 'reddit'];
  if (item.over_18) tags.push('nsfw');

  tags = normalizeTags(tags);
  const type = item.is_video ? 'Video' : (item.url.includes('imgur.com') || item.url.match(/\.(jpg|jpeg|png|gif)$/) ? 'Post' : 'Article');

  let redditImage = null;
  if (item.preview && item.preview.images && item.preview.images[0]) {
    redditImage = item.preview.images[0].source.url;
  } else if (item.thumbnail && item.thumbnail.startsWith('http')) {
    redditImage = item.thumbnail;
  } else if (item.url && item.url.match(/\.(jpg|jpeg|png|gif)$/)) {
    redditImage = item.url;
  }

  return {
    id: `reddit-${item.id}`,
    title: item.title,
    description: item.selftext ? item.selftext.substring(0, 200) + '...' : `Posted in r/${subreddit} by ${item.author}`,
    imageUrl: getThumbnail(item.url, redditImage, type, tags),
    author: item.author,
    authorImage: `https://ui-avatars.com/api/?name=${item.author}&background=random`,
    date: date,
    readTime: '4 min read',
    tags: tags,
    type: type,
    sourceUrl: `https://reddit.com${item.permalink}`,
    priority: calculatePriority(item.title, tags),
    fullContent: {
      title: item.title,
      author: item.author,
      date: new Date(date).toLocaleDateString(),
      readTime: '4 min read',
      authorImage: `https://ui-avatars.com/api/?name=${item.author}&background=random`,
      tldr: [item.title],
      tags: tags,
      paragraphs: [item.selftext || "Check out this discussion on Reddit."],
      quote: null
    }
  };
};

/**
 * Heuristically determines content type
 */
const determineType = (title, tags, url) => {
  const lowerTitle = title.toLowerCase();
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || tags.includes('video')) return 'Video';
  if (lowerUrl.includes('tiktok.com') || lowerUrl.includes('instagram.com/reels')) return 'Reel';
  if (lowerTitle.includes('tool') || lowerTitle.includes('library') || tags.includes('opensource') || tags.includes('github')) return 'Tool';
  return 'Article';
};

/**
 * Fetches from Reddit
 */
export const fetchReddit = async (subreddit, query) => {
  try {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/${query}`);
    if (!response.ok) throw new Error(`Failed to fetch from r/${subreddit}`);
    const data = await response.json();
    return data.data.children.map(child => normalizeReddit(child, subreddit));
  } catch (error) {
    console.error(`Error fetching Reddit r/${subreddit}:`, error);
    return [];
  }
};

/**
 * Aggregates all news sources
 */
export const fetchAllNews = async () => {
  const devToPromise = fetch(`${DEV_TO_API}?per_page=40&tags=javascript,ai,xr,react,rust,unity3d`)
    .then(res => res.json())
    .then(data => data.map(normalizeDevTo))
    .catch(() => []);

  const hnPromise = fetch(`${HN_API_BASE}/topstories.json`)
    .then(res => res.json())
    .then(ids => Promise.all(ids.slice(0, 40).map(id => fetch(`${HN_API_BASE}/item/${id}.json`).then(r => r.json()))))
    .then(items => items.filter(i => i && i.title).map(normalizeHN))
    .catch(() => []);

  const redditPromises = REDDIT_SOURCES.map(source => fetchReddit(source.subreddit, source.query));

  const allResults = await Promise.all([devToPromise, hnPromise, ...redditPromises]);
  const combined = allResults.flat();

  return combined.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return new Date(b.date) - new Date(a.date);
  });
};
