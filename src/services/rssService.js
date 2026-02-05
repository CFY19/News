import { supabase } from './supabaseClient';

const RSS_SOURCES = [
  {
    name: 'Road to VR',
    url: 'https://www.roadtovr.com/feed/',
    isXR: true,
    recommended: true
  },
  {
    name: 'UploadVR',
    url: 'https://www.uploadvr.com/rss/',
    isXR: true,
    recommended: true
  },
  {
    name: 'Next Reality',
    url: 'https://reality.news/rss/',
    isXR: true,
    recommended: true
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
    isXR: false,
    recommended: false
  }
];

const TECH_KEYWORDS = ['sdk', 'api', 'hardware', 'launch', 'framework', 'unity', 'unreal', 'vision pro', 'quest 3'];

const PROXY_URL = 'https://api.allorigins.win/raw?url=';

/**
 * Fetches and parses an RSS feed
 */
const fetchFeed = async (source) => {
  try {
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(source.url)}`);
    if (!response.ok) throw new Error(`Failed to fetch ${source.name}`);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const items = Array.from(xml.querySelectorAll('item'));

    return items.map(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || item.querySelector('pubdate')?.textContent || new Date().toISOString();
      const creator = item.querySelector('dc\\:creator, creator')?.textContent || source.name;

      // Image extraction logic
      let imageUrl = null;

      // Try media:content
      const mediaContent = item.getElementsByTagName('media:content')[0];
      if (mediaContent) imageUrl = mediaContent.getAttribute('url');

      // Try enclosure
      if (!imageUrl) {
        const enclosure = item.querySelector('enclosure');
        if (enclosure) imageUrl = enclosure.getAttribute('url');
      }

      // Try extracting from description (common in some WordPress feeds)
      if (!imageUrl && description) {
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      // Clean description from HTML
      const cleanDescription = description.replace(/<[^>]*>?/gm, '').substring(0, 300) + '...';

      const tags = source.isXR ? ['xr'] : [];
      if (title.toLowerCase().includes('ai')) tags.push('ai');

      return {
        id: `rss-${btoa(link).substring(0, 16)}`,
        title,
        description: cleanDescription,
        image_url: imageUrl,
        source_url: link,
        author: creator,
        published_at: new Date(pubDate).toISOString(),
        tags,
        priority: source.recommended ? 100 : 0,
        source_name: source.name
      };
    });
  } catch (error) {
    console.error(`Error fetching feed ${source.name}:`, error);
    return [];
  }
};

/**
 * Filters articles by relevance keywords
 */
const filterArticles = (articles) => {
  return articles.filter(article => {
    const content = (article.title + ' ' + article.description).toLowerCase();
    return TECH_KEYWORDS.some(kw => content.includes(kw));
  });
};

/**
 * Syncs RSS articles to Supabase
 */
export const syncRSSWithSupabase = async () => {
  if (!supabase) return;

  console.log('Starting RSS sync...');
  let allArticles = [];

  for (const source of RSS_SOURCES) {
    const articles = await fetchFeed(source);
    const filtered = filterArticles(articles);
    // Limit to 4 most recent per source per sync as requested
    allArticles = [...allArticles, ...filtered.slice(0, 4)];
  }

  if (allArticles.length === 0) return;

  const { error } = await supabase
    .from('articles')
    .upsert(allArticles, { onConflict: 'source_url' });

  if (error) {
    console.error('Error upserting articles:', error);
  } else {
    console.log(`Successfully synced ${allArticles.length} articles.`);
  }
};

/**
 * Fetches persisted articles from Supabase
 */
export const getPersistedArticles = async () => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching persisted articles:', error);
    return [];
  }

  // Map to the format expected by the UI
  return data.map(article => ({
    id: article.id,
    title: article.title,
    description: article.description,
    imageUrl: article.image_url,
    author: article.author,
    authorImage: `https://ui-avatars.com/api/?name=${article.author}&background=random`,
    date: article.published_at,
    readTime: '5 min read',
    tags: article.tags,
    type: 'Article',
    sourceUrl: article.source_url,
    priority: article.priority,
    sourceName: article.source_name,
    fullContent: {
      title: article.title,
      author: article.author,
      date: new Date(article.published_at).toLocaleDateString(),
      readTime: '5 min read',
      authorImage: `https://ui-avatars.com/api/?name=${article.author}&background=random`,
      tldr: [article.description],
      tags: article.tags,
      paragraphs: [article.description],
      quote: null
    }
  }));
};
