const express = require('express');
const cors = require('cors');

const titles = require('./data/titles.json');
const opportunities = require('./data/opportunities.json');
const users = require('./data/users.json');
const fs = require('fs');
const PUBLISHED_PATH = './data/published.json';

const loadPublished = () => {
  try {
    return JSON.parse(fs.readFileSync(PUBLISHED_PATH, 'utf8'));
  } catch {
    return {};
  }
};

const savePublished = (data) => {
  fs.writeFileSync(PUBLISHED_PATH, JSON.stringify(data, null, 2));
};

const titleIdsWithOpportunities = new Set(opportunities.map((opp) => opp.title_id));
const hasOpportunitiesForTitle = (titleId) => titleIdsWithOpportunities.has(titleId);
const HERO_FALLBACK = '/assets/images/default-card.svg';
const pickHeroImage = (title) => {
  const art = title.marketing_assets.find((asset) => asset.type === 'image');
  return art ? art.url : HERO_FALLBACK;
};

const PORT = process.env.PORT || 4000;
const DEFAULT_ROLE = 'Viewer';

const ROLE_RULES = {
  Admin: { showInvestment: true, showSensitive: true, showOpportunities: true, canPublish: true },
  Marketing: { showInvestment: true, showSensitive: false, showOpportunities: true, canPublish: true },
  Sales: { showInvestment: true, showSensitive: false, showOpportunities: true, canPublish: false },
  Viewer: { showInvestment: false, showSensitive: false, showOpportunities: false, canPublish: false }
};

const app = express();
app.use(cors());
app.use(express.json());

const getRole = (roleParam = '') => {
  const roleKey = roleParam.trim();
  return ROLE_RULES[roleKey] ? roleKey : DEFAULT_ROLE;
};

const sanitizeInvestment = (investment, rules) => {
  if (!rules.showInvestment || !investment) {
    return undefined;
  }
  if (rules.showSensitive) {
    return investment;
  }
  const { sensitive, ...rest } = investment;
  return rest;
};

const sanitizeTitle = (title, role) => {
  const rules = ROLE_RULES[role] || ROLE_RULES[DEFAULT_ROLE];
  const published = loadPublished();
  const pubInfo = published[title.title_id] || { published: false, sales_url: null, published_at: null, published_by: null };
  return {
    ...title,
    hero_image: pickHeroImage(title),
    investment: sanitizeInvestment(title.investment, rules),
    published: pubInfo.published || false,
    sales_url: pubInfo.sales_url || null,
    published_at: pubInfo.published_at || null,
    published_by: pubInfo.published_by || null
  };
};

const buildTitleSummary = (title, role) => {
  const rules = ROLE_RULES[role] || ROLE_RULES[DEFAULT_ROLE];
  const published = loadPublished();
  const pubInfo = published[title.title_id] || { published: false, sales_url: null };
  return {
    title_id: title.title_id,
    title_name: title.title_name,
    synopsis: title.synopsis,
    tx_date: title.tx_date || null,
    episode_count: title.episodes.length,
    has_assets: title.marketing_assets.length > 0,
    has_opportunities: rules.showOpportunities ? hasOpportunitiesForTitle(title.title_id) : false,
    hero_image: pickHeroImage(title),
    investment: sanitizeInvestment(title.investment, rules),
    published: pubInfo.published || false,
    sales_url: pubInfo.sales_url || null
  };
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/roles', (req, res) => {
  res.json(users);
});

app.get('/api/titles', (req, res) => {
  const role = getRole(req.query.role);
  const search = (req.query.search || '').toLowerCase();
  const pageParam = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const sizeInput = parseInt(req.query.pageSize, 10);
  const pageSize = Math.min(Math.max(sizeInput || 20, 1), 50);
  const hasAssetsFilter = req.query.hasAssets === 'true';
  const hasOpportunitiesFilter = req.query.hasOpportunities === 'true';
  const sort = req.query.sort || 'alpha';

  const filtered = titles.filter((title) => {
    const matchesSearch = title.title_name.toLowerCase().includes(search);
    const matchesAssets = !hasAssetsFilter || title.marketing_assets.length > 0;
    const matchesOpps = !hasOpportunitiesFilter || hasOpportunitiesForTitle(title.title_id);
    return matchesSearch && matchesAssets && matchesOpps;
  });

  let withAssets = 0;
  let withOpportunities = 0;
  let readyEpisodes = 0;

  filtered.forEach((title) => {
    if (title.marketing_assets.length > 0) {
      withAssets += 1;
    }
    if (hasOpportunitiesForTitle(title.title_id)) {
      withOpportunities += 1;
    }
    readyEpisodes += title.episodes.filter((episode) => episode.availability === 'Ready').length;
  });

  const total = filtered.length;
  const totalPages = total === 0 ? 1 : Math.ceil(total / pageSize);
  const safePage = Math.min(pageParam, totalPages);

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'episodes_desc':
        return b.episodes.length - a.episodes.length || a.title_name.localeCompare(b.title_name);
      case 'tx_date_desc':
        const dateA = a.tx_date || '';
        const dateB = b.tx_date || '';
        return dateB.localeCompare(dateA) || a.title_name.localeCompare(b.title_name);
      case 'tx_date_asc':
        const dateA2 = a.tx_date || '';
        const dateB2 = b.tx_date || '';
        return dateA2.localeCompare(dateB2) || a.title_name.localeCompare(b.title_name);
      case 'recent':
        return b.title_id.localeCompare(a.title_id);
      default:
        return a.title_name.localeCompare(b.title_name);
    }
  });

  const start = (safePage - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);
  const results = pageItems.map((title) => buildTitleSummary(title, role));

  res.json({
    role,
    page: safePage,
    pageSize,
    total,
    totalPages,
    aggregates: {
      withAssets,
      withOpportunities,
      readyEpisodes
    },
    results
  });
});

app.get('/api/titles/:titleId', (req, res) => {
  const role = getRole(req.query.role);
  const rules = ROLE_RULES[role];
  const title = titles.find((item) => item.title_id === req.params.titleId);

  if (!title) {
    return res.status(404).json({ error: 'Title not found' });
  }

  const sanitized = sanitizeTitle(title, role);
  const titleOpps = rules.showOpportunities
    ? opportunities.filter((opp) => opp.title_id === title.title_id)
    : [];

  res.json({ ...sanitized, opportunities: titleOpps });
});

const generateSalesUrl = (titleId, titleName) => {
  const slug = titleName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `https://sales.example.com/titles/${slug}`;
};

app.post('/api/titles/:titleId/publish', (req, res) => {
  const role = getRole(req.query.role);
  const rules = ROLE_RULES[role] || ROLE_RULES[DEFAULT_ROLE];
  
  if (!rules.canPublish) {
    return res.status(403).json({ error: 'You do not have permission to publish titles' });
  }

  const title = titles.find((item) => item.title_id === req.params.titleId);
  if (!title) {
    return res.status(404).json({ error: 'Title not found' });
  }

  const published = loadPublished();
  const salesUrl = generateSalesUrl(title.title_id, title.title_name);
  
  published[title.title_id] = {
    published: true,
    published_at: new Date().toISOString(),
    published_by: role,
    sales_url: salesUrl
  };
  
  savePublished(published);
  res.json({ success: true, sales_url: salesUrl, ...published[title.title_id] });
});

app.post('/api/titles/:titleId/unpublish', (req, res) => {
  const role = getRole(req.query.role);
  const rules = ROLE_RULES[role] || ROLE_RULES[DEFAULT_ROLE];
  
  if (!rules.canPublish) {
    return res.status(403).json({ error: 'You do not have permission to unpublish titles' });
  }

  const title = titles.find((item) => item.title_id === req.params.titleId);
  if (!title) {
    return res.status(404).json({ error: 'Title not found' });
  }

  const published = loadPublished();
  published[title.title_id] = {
    published: false,
    published_at: null,
    published_by: null,
    sales_url: null
  };
  
  savePublished(published);
  res.json({ success: true, published: false });
});

app.listen(PORT, () => {
  console.log(`Mock API listening on port ${PORT}`);
});
