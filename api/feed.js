const Parser = require('rss-parser');
const parser = new Parser();

const FEEDS = [
  {
    url: 'https://speeches.byu.edu/feed/',
    source: 'BYU Speeches',
    type: 'devotional',
    topic: ['Faith', 'Discipleship'],
  },
  {
    url: 'https://interpreterfoundation.org/feed/',
    source: 'Interpreter Foundation',
    type: 'article',
    topic: ['Gospel Scholarship', 'Apologetics'],
  },
  {
    url: 'https://www.fairlatterdaysaints.org/feed/',
    source: 'FAIR',
    type: 'article',
    topic: ['Apologetics', 'Church History'],
  },
  {
    url: 'https://byustudies.byu.edu/feed/',
    source: 'BYU Studies',
    type: 'studies',
    topic: ['Gospel Scholarship', 'Church History'],
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
        const items = parsed.items.slice(0, 15).map((item, i) => ({
          id: `${feed.source}-${i}-${Date.now()}`,
          uid: `${feed.source}-${i}-${Date.now()}`,
          type: feed.type,
          source: feed.source,
          title: item.title || 'Untitled',
          author: item.creator || item.author || parsed.title || feed.source,
          date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '',
          topic: feed.topic,
          url: item.link || '',
          excerpt: item.contentSnippet
            ? item.contentSnippet.slice(0, 180).trim() + '...'
            : item.content
            ? item.content.replace(/<[^>]*>/g, '').slice(0, 180).trim() + '...'
            : 'Click to read the full article.',
          isNew: i < 3,
          saved: false,
        }));
        allItems.push(...items);
      } catch (feedError) {
        console.error(`Failed to fetch ${feed.source}:`, feedError.message);
      }
    }

    // Shuffle
    for (let i = allItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }

    res.status(200).json({ items: allItems });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feeds', items: [] });
  }
};