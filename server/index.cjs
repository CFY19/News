const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { db, initDb } = require('./db.cjs');
const RSSParser = require('rss-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3001;
const parser = new RSSParser();

app.use(cors());
app.use(express.json());

// RSS Sources
const RSS_SOURCES = [
  { name: 'Road to VR', url: 'https://www.roadtovr.com/feed/', isXR: true, recommended: true },
  { name: 'UploadVR', url: 'https://www.uploadvr.com/rss/', isXR: true, recommended: true },
  { name: 'Next Reality', url: 'https://reality.news/rss/', isXR: true, recommended: true },
  { name: 'The Verge AI', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', isXR: false, recommended: false }
];

const TECH_KEYWORDS = ['sdk', 'api', 'hardware', 'launch', 'framework', 'unity', 'unreal', 'vision pro', 'quest 3'];

/**
 * Syncs RSS feeds with Database
 */
const syncRSS = async () => {
  console.log('Starting RSS sync...');
  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      const filtered = feed.items.filter(item => {
        const content = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
        return TECH_KEYWORDS.some(kw => content.includes(kw));
      }).slice(0, 4);

      for (const item of filtered) {
        const id = `rss-${Buffer.from(item.link).toString('base64').substring(0, 16)}`;
        const tags = source.isXR ? ['xr'] : [];
        if (item.title.toLowerCase().includes('ai')) tags.push('ai');

        // Extract image from content or enclosure
        let imageUrl = null;
        if (item.enclosure) imageUrl = item.enclosure.url;
        if (!imageUrl && item.content) {
          const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) imageUrl = imgMatch[1];
        }

        db.run(`
          INSERT INTO articles (id, title, description, image_url, source_url, author, published_at, tags, priority, source_name)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            image_url = excluded.image_url,
            source_url = excluded.source_url
        `, [
          id, item.title, item.contentSnippet || '', imageUrl, item.link, item.creator || source.name,
          new Date(item.pubDate).toISOString(), JSON.stringify(tags), source.recommended ? 100 : 0, source.name
        ], (err) => {
          if (err) console.error('SQL Error during sync:', err.message);
        });
      }
    } catch (err) {
      console.error(`Error syncing ${source.name}:`, err.message);
    }
  }
  console.log('RSS sync complete.');
};

// API Endpoints

// 1. GET /api/news - Get aggregated news
app.get('/api/news', async (req, res) => {
  db.all(`SELECT * FROM articles ORDER BY published_at DESC LIMIT 50`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const articles = rows.map(row => ({
      ...row,
      imageUrl: row.image_url,
      sourceUrl: row.source_url,
      date: row.published_at,
      tags: JSON.parse(row.tags || '[]'),
      type: 'Article'
    }));
    res.json(articles);
  });
});

// 2. GET /api/metrics - Get global counts
app.get('/api/metrics', (req, res) => {
  const { ids } = req.query;
  if (!ids) return res.json({});
  const idList = ids.split(',');
  const placeholders = idList.map(() => '?').join(',');

  db.all(`SELECT * FROM article_metrics WHERE article_id IN (${placeholders})`, idList, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const results = {};
    rows.forEach(row => {
      results[row.article_id] = { views: row.views, helpful: row.helpful };
    });
    // Ensure all requested IDs are in the response
    idList.forEach(id => {
      if (!results[id]) results[id] = { views: 0, helpful: 0 };
    });
    res.json(results);
  });
});

// 3. POST /api/views - Track view
app.post('/api/views', (req, res) => {
  const { articleId } = req.body;
  if (!articleId) return res.status(400).json({ error: 'Missing articleId' });

  db.run(`
    INSERT INTO article_metrics (article_id, views, helpful)
    VALUES (?, 1, 0)
    ON CONFLICT(article_id) DO UPDATE SET
      views = article_metrics.views + 1,
      updated_at = CURRENT_TIMESTAMP
  `, [articleId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get(`SELECT views FROM article_metrics WHERE article_id = ?`, [articleId], (err, row) => {
      res.json({ views: row ? row.views : 1 });
    });
  });
});

// 4. POST /api/likes - Toggle like (helpful)
app.post('/api/likes', (req, res) => {
  const { articleId, userFingerprint } = req.body;
  if (!articleId || !userFingerprint) return res.status(400).json({ error: 'Missing articleId or userFingerprint' });

  // Check if already liked
  db.get(`SELECT id FROM user_likes WHERE article_id = ? AND user_fingerprint = ?`, [articleId, userFingerprint], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) {
      // Unlike
      db.serialize(() => {
        db.run(`DELETE FROM user_likes WHERE id = ?`, [row.id]);
        db.run(`UPDATE article_metrics SET helpful = MAX(0, helpful - 1) WHERE article_id = ?`, [articleId]);
        db.get(`SELECT helpful FROM article_metrics WHERE article_id = ?`, [articleId], (err, result) => {
          res.json({ helpful: result ? result.helpful : 0, isLiked: false });
        });
      });
    } else {
      // Like
      db.serialize(() => {
        db.run(`INSERT INTO user_likes (article_id, user_fingerprint) VALUES (?, ?)`, [articleId, userFingerprint]);
        db.run(`
          INSERT INTO article_metrics (article_id, views, helpful)
          VALUES (?, 0, 1)
          ON CONFLICT(article_id) DO UPDATE SET
            helpful = article_metrics.helpful + 1,
            updated_at = CURRENT_TIMESTAMP
        `, [articleId]);
        db.get(`SELECT helpful FROM article_metrics WHERE article_id = ?`, [articleId], (err, result) => {
          res.json({ helpful: result ? result.helpful : 1, isLiked: true });
        });
      });
    }
  });
});

// Purge old articles (30 days)
const purgeOld = () => {
  db.run(`DELETE FROM articles WHERE published_at < datetime('now', '-30 days')`);
  console.log('Old articles purged.');
};

// Start Server
initDb().then(() => {
  app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
    // Initial sync
    syncRSS();
    // Schedule sync every hour
    setInterval(syncRSS, 60 * 60 * 1000);
    // Schedule purge once a day
    setInterval(purgeOld, 24 * 60 * 60 * 1000);
  });
});
