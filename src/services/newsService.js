const DEV_TO_API = 'https://dev.to/api/articles';
const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';
const REDDIT_API_UNITY = 'https://www.reddit.com/r/Unity3D/top.json?limit=20&t=week';
const REDDIT_API_VR = 'https://www.reddit.com/r/virtualreality/top.json?limit=20&t=week';

/**
 * Gets a placeholder image based on category if original is missing
 */
const getCategoryPlaceholder = (type, tags = []) => {
  const lowerTags = tags.map(t => t.toLowerCase());
  if (lowerTags.includes('ai') || lowerTags.includes('openai') || lowerTags.includes('gpt')) {
    return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop'; // AI Placeholder
  }
  if (lowerTags.includes('xr') || lowerTags.includes('vr') || lowerTags.includes('ar') || lowerTags.includes('mixedreality') || lowerTags.includes('unity')) {
    return 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1000&auto=format&fit=crop'; // XR Placeholder
  }
  if (type === 'Video') {
    return 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop'; // Video Placeholder
  }
  return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop'; // Tech/Dev Placeholder
};

/**
 * Extracts YouTube thumbnail if URL is a YouTube link
 */
const getThumbnail = (url, fallback, type, tags) => {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return fallback || getCategoryPlaceholder(type, tags);
};

/**
 * Assigns a priority score based on Fyware DNA
 * P1: Unity, VR, AR, 3D Modeling (Core) - Score 100
 * P2: AI, Dev Tools (Support) - Score 50
 * Others - Score 0
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
  const tags = article.tag_list;
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
  const tags = ['hacker-news', 'tech'];

  const title = item.title.toLowerCase();
  if (title.includes('ai') || title.includes('gpt')) tags.push('ai');
  if (title.includes('xr') || title.includes('vr') || title.includes('vision pro')) tags.push('xr');
  if (title.includes('unity')) tags.push('unity');

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
  const tags = [subreddit.toLowerCase(), 'reddit'];
  if (item.over_18) tags.push('nsfw');

  const type = item.is_video ? 'Video' : (item.url.includes('imgur.com') || item.url.match(/\.(jpg|jpeg|png|gif)$/) ? 'Post' : 'Article');

  return {
    id: `reddit-${item.id}`,
    title: item.title,
    description: item.selftext ? item.selftext.substring(0, 200) + '...' : `Posted in r/${subreddit} by ${item.author}`,
    imageUrl: item.thumbnail && item.thumbnail.startsWith('http') ? item.thumbnail : getCategoryPlaceholder(type, tags),
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
