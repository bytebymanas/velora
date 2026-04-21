import axios from "axios";
import { buildExcerpt, normalizeText, slugify, categoryFromText } from "../utils/helpers.js";

const GNEWS_BASE = "https://gnews.io/api/v4";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 min cache to save quota

const cache = new Map();

function getApiKey() {
    return process.env.GNEWS_API_KEY || "";
}

function normalizeGNewsArticle(article, index, region = "Global") {
    const title = normalizeText(article.title || "Untitled");
    const combinedText = `${title} ${article.description || ""}`;

    return {
        id: `gnews-${slugify(title)}-${index}`,
        title,
        excerpt: normalizeText(article.description || "").slice(0, 220) || "Open the story to read the full article.",
        content: normalizeText(article.content || article.description || ""),
        url: article.url,
        imageUrl: article.image || null,
        source: article.source?.name || "GNews",
        sourceId: `gnews-${slugify(article.source?.name || "gnews")}`,
        category: categoryFromText(combinedText, "Top Stories"),
        region,
        publishedAt: article.publishedAt || new Date().toISOString(),
        author: "Staff Reporter"
    };
}

async function fetchFromGNews(endpoint, params, cacheKey, region) {
    const apiKey = getApiKey();
    if (!apiKey) {
        return { items: [], error: null }; // Silently skip if no key
    }

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.updatedAt < CACHE_TTL_MS) {
        return { items: cached.items, error: null };
    }

    try {
        const response = await axios.get(`${GNEWS_BASE}/${endpoint}`, {
            params: { ...params, apikey: apiKey },
            timeout: 10000
        });

        const articles = (response.data?.articles || []).map((article, i) =>
            normalizeGNewsArticle(article, i, region)
        );

        cache.set(cacheKey, { items: articles, updatedAt: Date.now() });
        return { items: articles, error: null };
    } catch (error) {
        const msg = error.response?.data?.errors?.[0] || error.message;
        console.warn(`[GNews] ${endpoint} failed: ${msg} — falling back to RSS feeds`);

        // Serve stale cache if available, otherwise gracefully degrade
        if (cached) {
            console.info(`[GNews] Serving stale cache for ${cacheKey}`);
            return { items: cached.items, error: null };
        }

        return { items: [], error: `GNews API unavailable, using RSS feeds only` };
    }
}

export async function fetchIndiaHeadlines() {
    return fetchFromGNews(
        "top-headlines",
        { country: "in", lang: "en", max: 10 },
        "india-headlines",
        "India"
    );
}

export async function fetchGlobalHeadlines() {
    return fetchFromGNews(
        "top-headlines",
        { lang: "en", max: 10 },
        "global-headlines",
        "Global"
    );
}

export async function fetchTechNews() {
    return fetchFromGNews(
        "top-headlines",
        { topic: "technology", lang: "en", max: 10 },
        "tech-news",
        "Global"
    );
}

export async function fetchSportsNews() {
    return fetchFromGNews(
        "top-headlines",
        { topic: "sports", lang: "en", max: 10 },
        "sports-news",
        "Global"
    );
}

export async function searchGNews(query) {
    if (!query || query.trim().length < 2) {
        return { items: [], error: null };
    }
    return fetchFromGNews(
        "search",
        { q: query, lang: "en", max: 10 },
        `search-${query}`,
        "Global"
    );
}

export async function fetchAllGNews() {
    const apiKey = getApiKey();
    if (!apiKey) {
        return { items: [], errors: [] };
    }

    // Only make 2 requests to conserve the 100/day quota
    const [india, global] = await Promise.all([
        fetchIndiaHeadlines(),
        fetchGlobalHeadlines()
    ]);

    const items = [...india.items, ...global.items];
    const errors = [india.error, global.error].filter(Boolean);

    return { items, errors };
}

export function isGNewsConfigured() {
    return !!getApiKey();
}
