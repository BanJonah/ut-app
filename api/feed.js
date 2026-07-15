const Parser = require('rss-parser');
const parser = new Parser();

const FEEDS = [
  {
    url: 'https://www.omnycontent.com/d/playlist/0c331867-ade6-4f54-a1a9-aa5d00345817/b0d8b123-6f8f-49b4-ad69-aa70011ce971/379d3bbf-05e6-46c1-921e-aa70011ce976/podcast.rss',
    source: 'BYU Speeches',
    type: 'devotional',
    topic: ['Faith', 'Discipleship'],
    urlBase: 'https://speeches.byu.edu',
  },
  {
    url: 'https://interpreterfoundation.org/feed/',
    source: 'Interpreter Foundation',
    type: 'article',
    topic: ['Gospel Scholarship', 'Apologetics'],
    urlBase: 'https://interpreterfoundation.org',
  },
  {
    url: 'https://www.fairlatterdaysaints.org/feed/',
    source: 'FAIR',
    type: 'article',
    topic: ['Apologetics', 'Church History'],
    urlBase: 'https://www.fairlatterdaysaints.org',
  },
  {
    url: 'https://byustudies.byu.edu/feed/',
    source: 'BYU Studies',
    type: 'studies',
    topic: ['Gospel Scholarship', 'Church History'],
    urlBase: 'https://byustudies.byu.edu',
  },
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  try {
    const allItems = [];

    for (const feed of FEEDS) {
      try {
        const parsed = await parser.parseURL(feed.url);
        const items = parsed.items.slice(0, 15).map((item, i) => {
          // Clean up excerpt — strip HTML tags
          const rawExcerpt = item.contentSnippet || item.content || item.summary || '';
          const cleanExcerpt = rawExcerpt.replace(/<[^>]*>/g, '').trim();
          const excerpt = cleanExcerpt.length > 0
            ? cleanExcerpt.slice(0, 200).trim() + (cleanExcerpt.length > 200 ? '...' : '')
            : 'Click to read the full article.';

          // Get the best URL
          const url = item.link || item.guid || feed.urlBase;

          // Get the best author
          const author = item.creator || item['dc:creator'] || item.author || parsed.title || feed.source;

          // Format date
          const date = item.pubDate
            ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : '';

          return {
            id: `live-${feed.source}-${i}`,
            uid: `live-${feed.source}-${i}-${Date.now()}`,
            type: feed.type,
            source: feed.source,
            title: item.title ? item.title.replace(/<[^>]*>/g, '').trim() : 'Untitled',
            author,
            date,
            topic: feed.topic,
            url,
            excerpt,
            isNew: i < 3,
            saved: false,
          };
        });
        allItems.push(...items);
      } catch (feedError) {
        console.error(`Failed to fetch ${feed.source}:`, feedError.message);
      }
    }

    // Shuffle the results
    for (let i = allItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }

    res.status(200).json({ items: allItems, count: allItems.length });
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({ error: 'Failed to fetch feeds', items: [] });
  }
};