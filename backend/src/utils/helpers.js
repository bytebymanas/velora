export function normalizeText(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function pickImage(item) {
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  if (item["media:content"]?.$?.url) {
    return item["media:content"].$.url;
  }

  if (item["media:thumbnail"]?.$?.url) {
    return item["media:thumbnail"].$.url;
  }

  const content = item["content:encoded"] || item.content || "";
  const match = content.match(/<img[^>]+src="([^"]+)"/i);
  return match ? match[1] : null;
}

export function categoryFromText(text, fallbackCategory) {
  const normalized = text.toLowerCase();

  if (/\b(ai|startup|software|chip|iphone|android|tech)\b/.test(normalized)) {
    return "Technology";
  }
  if (/\b(market|stock|bank|economy|business|trade|finance)\b/.test(normalized)) {
    return "Business";
  }
  if (/\b(match|league|cup|sport|goal|cricket|football|nba|nfl|nhl|mlb|tennis|game|playoff|draft|coach)\b/.test(normalized)) {
    return "Sports";
  }
  if (/\b(movie|music|celebrity|entertainment|festival|album|series)\b/.test(normalized)) {
    return "Culture";
  }
  if (/\b(election|policy|war|world|government|diplomacy)\b/.test(normalized)) {
    return "World";
  }

  return fallbackCategory || "Top Stories";
}

const INDIA_KEYWORDS =
  /\b(india|indian|delhi|mumbai|bangalore|bengaluru|hyderabad|chennai|kolkata|pune|ahmedabad|jaipur|lucknow|modi|bjp|congress|aap|rahul|gandhi|kejriwal|supreme court of india|rbi|sensex|nifty|bse|nse|rupee|ipl|bcci|cricbuzz|isro|iit|iim|aadhaar|upi|neet|jee|lok sabha|rajya sabha|panchayat|pradhan mantri|swachh|ayodhya|kashmir|assam|kerala|tamil nadu|maharashtra|karnataka|gujarat|rajasthan|uttar pradesh|madhya pradesh|gadkari|adani|ambani|tata|infosys|wipro|tcs)\b/i;

export function isIndiaContent(article) {
  const text = `${article.title} ${article.excerpt || ""}`;
  return INDIA_KEYWORDS.test(text);
}

export function buildExcerpt(item) {
  const candidate = item.contentSnippet || item.summary || item.content || "";
  const normalized = normalizeText(candidate);
  return normalized.slice(0, 220) || "Open the story to read the full article.";
}

export function uniqueByLink(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item.url || seen.has(item.url)) {
      return false;
    }
    seen.add(item.url);
    return true;
  });
}
