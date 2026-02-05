const DEV_TO_API = 'https://dev.to/api/articles';
const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';
const REDDIT_API_UNITY = 'https://www.reddit.com/r/Unity3D/top.json?limit=20&t=week';
const REDDIT_API_VR = 'https://www.reddit.com/r/virtualreality/top.json?limit=20&t=week';

/**
 * Gets a branded Fyware placeholder image based on category if original is missing.
 * Colors: Unity/XR -> Brand Teal (#0D9488), AI/Tech -> Indigo (#4F46E5), Video -> Rose (#F43F5E)
 */
const getFywarePlaceholder = (type, tags = []) => {
  const lowerTags = tags.map(t => t.toLowerCase());
  let color = '4F46E5'; // Default Indigo
  let text = 'Fyware+Tech';

  if (lowerTags.includes('ai') || lowerTags.includes('openai') || lowerTags.includes('gpt')) {
    color = '4F46E5';
    text = 'Fyware+AI';
  } else if (lowerTags.includes('xr') || lowerTags.includes('vr') || lowerTags.includes('ar') || lowerTags.includes('mixedreality') || lowerTags.includes('unity')) {
    color = '0D9488'; // Brand Teal
    text = 'Fyware+XR';
  } else if (type === 'Video') {
    color = 'F43F5E'; // Rose
    text = 'Fyware+Video';
  } else if (type === 'Tool') {
    color = '111827'; // Deep Charcoal
    text = 'Fyware+Tool';
  }

  return `https://placehold.co/600x400/${color}/FFFFFF?text=${text}`;
};

/**
 * Normalizes tags based on Fyware consolidation logic.
 * - Group VirtualReality/AugmentedReality under XR
 * - Remove Reddit tag
 */
const normalizeTags = (tags) => {
  if (!tags) return [];

  let processed = tags.map(tag => tag.toLowerCase());

  // Consolidate XR
  const xrKeywords = ['virtualreality', 'augmentedreality', 'vr', 'ar', 'mixedreality', 'spatialcomputing'];
  let hasXR = processed.some(tag => xrKeywords.includes(tag));

  processed = processed.filter(tag => !xrKeywords.includes(tag) && tag !== 'reddit');

  if (hasXR && !processed.includes('xr')) {
    processed.unshift('xr');
  } else if (hasXR && processed.includes('xr')) {
    // Already has xr, just ensure it's at the front
    processed = ['xr', ...processed.filter(t => t !== 'xr')];
  }

  return processed;
};

/**
 * Adjusts image URL to request higher resolution if possible.
 */
const getHighResImage = (url) => {
  if (!url) return url;

  // Handle common small-image parameters
  let highRes = url;

  // LinkedIn/Social thumb patterns
  highRes = highRes.replace(/&t=small/g, '&t=large');
  highRes = highRes.replace(/width=100/g, 'width=1000');
  highRes = highRes.replace(/height=100/g, 'height=1000');
  highRes = highRes.replace(/_thumb\./g, '_large.');
  highRes = highRes.replace(/\/small\//g, '/large/');

  // Reddit specific preview decoding
  if (url.includes('preview.redd.it')) {
    highRes = url.replace(/&amp;/g, '&');
  }

  return highRes;
};

/**
 * Extracts YouTube thumbnail if URL is a YouTube link
 */
const getThumbnail = (url, fallback, type, tags) => {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }

  // LinkedIn/Instagram specific fallback detection (fetching OG is blocked by CORS)
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

  const isP1 = t.includes('unity') || t.includes('vr') || t.includes('ar') || t.includes('3d') || t.includes('modeling') || t.includes('xr') || t.includes('spatial') ||
               ts.some(tag => ['unity', 'vr', 'ar', '3d', 'xr', 'spatialcomputing', 'mixedreality'].includes(tag));

  if (isP1) return 100;

  const isP2 = t.includes('ai') || t.includes('gpt') || t.includes('llm') || t.includes('tool') || t.includes('library') ||
               ts.some(tag => ['ai', 'openai', 'gpt', 'tool', 'opensource'].includes(tag));

  if (isP2) return 50;

  return 0;
};

/**
 * Normalizes a Dev.to article
 */
const normalizeDevTo = (article) => {
  const type = determineType(article.title, article.tag_list, article.url);
  const tags = normalizeTags(article.tag_list);

  // Dev.to usually provides good cover images
  const fallbackImg = article.cover_image || article.social_image;
  const imageUrl = getThumbnail(article.url, fallbackImg, type, tags);

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
      paragraphs: [article.description, "Click the link below to read the full article on Dev.to."],
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
  if (titleText.includes('xr') || titleText.includes('vr') || titleText.includes('vision pro')) tags.push('xr');
  if (titleText.includes('unity')) tags.push('unity');

  tags = normalizeTags(tags);

  const imageUrl = getThumbnail(item.url || '', null, type, tags);

  return {
    id: `hn-${item.id}`,
    title: item.title,
    description: `Discussion on Hacker News with ${item.score} points.`,
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
      paragraphs: [`This story is trending on Hacker News. Join the conversation.`],
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

  // Reddit image extraction improvement
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
 * Heuristically determines the content type
 */
const determineType = (title, tags, url) => {
  const lowerTitle = title.toLowerCase();
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || tags.includes('video')) return 'Video';
  if (lowerUrl.includes('tiktok.com') || lowerUrl.includes('instagram.com/reels')) return 'Reel';
  if (lowerTitle.includes('tool') || lowerTitle.includes('library') || tags.includes('opensource') || tags.includes('github')) return 'Tool';
  if (tags.includes('discuss') || tags.includes('showhn')) return 'Post';

  return 'Article';
};

/**
 * Fetches articles from Dev.to
 */
export const fetchDevToArticles = async () => {
  try {
    const tags = ['javascript', 'ai', 'xr', 'mixedreality', 'vr', 'ar', 'spatialcomputing', 'react', 'rust', 'unity3d', 'threejs'];
    const response = await fetch(`${DEV_TO_API}?per_page=40&tags=${tags.join(',')}`);
    if (!response.ok) throw new Error('Failed to fetch from Dev.to');
    const data = await response.json();
    return data.map(normalizeDevTo);
  } catch (error) {
    console.error('Error fetching Dev.to:', error);
    return [];
  }
};

/**
 * Fetches from Hacker News
 */
export const fetchHackerNews = async () => {
  try {
    const response = await fetch(`${HN_API_BASE}/topstories.json`);
    if (!response.ok) throw new Error('Failed to fetch HN top stories');
    const ids = await response.json();

    const items = await Promise.all(
      ids.slice(0, 40).map(async (id) => {
        try {
          const itemRes = await fetch(`${HN_API_BASE}/item/${id}.json`);
          return itemRes.json();
        } catch (e) {
          return null;
        }
      })
    );

    const techKeywords = ['ai', 'software', 'programming', 'code', 'rust', 'react', 'engine', 'tech', 'web', 'dev', 'tool', 'xr', 'vr', 'ar', 'mixed reality', 'spatial', 'unity', '3d', 'modeling', 'vision pro'];
    return items
      .filter(item => item && item.title && !item.dead && !item.deleted)
      .filter(item => {
        const title = item.title.toLowerCase();
        return techKeywords.some(kw => title.includes(kw));
      })
      .map(normalizeHN);
  } catch (error) {
    console.error('Error fetching HN:', error);
    return [];
  }
};

/**
 * Fetches from Reddit
 */
export const fetchReddit = async (url, subreddit) => {
  try {
    const response = await fetch(url);
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
  const [devTo, hn, redditUnity, redditVR] = await Promise.all([
    fetchDevToArticles(),
    fetchHackerNews(),
    fetchReddit(REDDIT_API_UNITY, 'Unity3D'),
    fetchReddit(REDDIT_API_VR, 'virtualreality')
  ]);

  const combined = [...devTo, ...hn, ...redditUnity, ...redditVR];

  // Sort by priority first, then by date
  return combined.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return new Date(b.date) - new Date(a.date);
  });
};
