export const FALLBACK_IMG =
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80";

const PILL_COLORS = {
    Technology: "pill-cyan",
    Business: "pill-amber",
    Sports: "pill-emerald",
    World: "pill-blue",
    Culture: "pill-rose",
    India: "pill-amber",
    "Top Stories": "pill-violet"
};

export function formatDate(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Latest";
    const now = new Date();
    const diffMs = now - d;
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffH < 1) return "Just now";
    if (diffH < 24) return `${diffH}h ago`;
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}

export function safe(val) {
    return Array.isArray(val) ? val : [];
}

export function getPillClass(category) {
    return PILL_COLORS[category] || "pill-blue";
}
