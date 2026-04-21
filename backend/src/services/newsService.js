import Parser from "rss-parser";
import { feedSources } from "../config/feedSources.js";
import { fetchAllGNews, isGNewsConfigured } from "./gnewsService.js";
import {
  buildExcerpt,
  categoryFromText,
  isIndiaContent,
  normalizeText,
  pickImage,
  slugify,
  uniqueByLink
} from "../utils/helpers.js";

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ["media:content", "media:content", { keepArray: false }],
      ["media:thumbnail", "media:thumbnail", { keepArray: false }],
      ["content:encoded", "content:encoded"]
    ]
  }
});

const CACHE_TTL_MS = 10 * 60 * 1000;

let cache = {
  items: [],
  updatedAt: 0,
  errors: []
};

async function fetchFeed(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return {
      source,
      items: (feed.items || []).map((item, index) => normalizeArticle(item, source, index))
    };
  } catch (error) {
    return {
      source,
      items: [],
      error: `${source.name}: ${error.message}`
    };
  }
}

function normalizeArticle(item, source, index) {
  const title = normalizeText(item.title || "Untitled story");
  const combinedText = `${title} ${item.contentSnippet || ""} ${item.summary || ""}`;
  const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();

  return {
    id: `${source.id}-${slugify(title)}-${index}`,
    title,
    excerpt: buildExcerpt(item),
    content: normalizeText(item["content:encoded"] || item.content || item.summary || ""),
    url: item.link,
    imageUrl: pickImage(item),
    source: source.name,
    sourceId: source.id,
    category: categoryFromText(combinedText, source.category),
    region: source.region,
    publishedAt,
    author: item.creator || item.author || "Staff Reporter"
  };
}

export async function getNews(options = {}) {
  const { forceRefresh = false } = options;
  const isFresh = Date.now() - cache.updatedAt < CACHE_TTL_MS;

  if (!forceRefresh && isFresh && cache.items.length > 0) {
    return cache;
  }

  // Fetch RSS feeds
  const rssResults = await Promise.all(feedSources.map(fetchFeed));
  let allItems = rssResults.flatMap((result) => result.items);
  let errors = rssResults.filter((r) => r.error).map((r) => r.error);

  // Merge GNews API results (if configured)
  if (isGNewsConfigured()) {
    const gnews = await fetchAllGNews();
    allItems = [...allItems, ...gnews.items];
    errors = [...errors, ...gnews.errors];
  }

  const items = uniqueByLink(allItems).sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  cache = {
    items,
    updatedAt: Date.now(),
    errors
  };

  return cache;
}

export async function listArticles(query) {
  const { items, updatedAt, errors } = await getNews({
    forceRefresh: query.refresh === "true"
  });

  const keyword = (query.keyword || "").toLowerCase();
  const category = query.category || "";
  const source = query.source || "";
  const region = query.region || "";
  const timeFilter = query.time || "";

  // Time boundaries
  const now = new Date();
  let timeStart = null;
  if (timeFilter === "today") {
    timeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (timeFilter === "3days") {
    timeStart = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  } else if (timeFilter === "week") {
    timeStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  const filtered = items.filter((article) => {
    const matchesKeyword =
      !keyword ||
      article.title.toLowerCase().includes(keyword) ||
      article.excerpt.toLowerCase().includes(keyword) ||
      article.content.toLowerCase().includes(keyword);
    const matchesCategory = !category || article.category === category;
    const matchesSource = !source || article.source === source;
    const matchesRegion =
      !region ||
      article.region === region ||
      (region === "India" && isIndiaContent(article));
    const matchesTime = !timeStart || new Date(article.publishedAt) >= timeStart;
    return matchesKeyword && matchesCategory && matchesSource && matchesRegion && matchesTime;
  });

  const page = Math.max(Number.parseInt(query.page || "1", 10), 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit || "12", 10), 1), 30);
  const start = (page - 1) * limit;
  const content = filtered.slice(start, start + limit);

  return {
    items: content,
    pagination: {
      page,
      limit,
      totalItems: filtered.length,
      totalPages: Math.max(Math.ceil(filtered.length / limit), 1)
    },
    meta: {
      updatedAt,
      categories: [...new Set(items.map((item) => item.category))],
      sources: [...new Set(items.map((item) => item.source))],
      regions: [...new Set(items.map((item) => item.region))],
      gnewsActive: isGNewsConfigured(),
      errors
    }
  };
}

export async function getHighlights() {
  const { items, updatedAt } = await getNews();
  const featured = items.slice(0, 5);
  const byCategory = ["Top Stories", "India", "Technology", "Business", "World", "Sports", "Culture"]
    .map((category) => ({
      category,
      items: items.filter((item) => item.category === category).slice(0, 4)
    }))
    .filter((section) => section.items.length > 0);

  return {
    updatedAt,
    featured,
    sections: byCategory
  };
}

export async function getTrending() {
  const { items, updatedAt } = await getNews();
  // Trending = most recent 10 articles with images
  const trending = items.filter((item) => item.imageUrl).slice(0, 10);
  return { updatedAt, items: trending };
}
