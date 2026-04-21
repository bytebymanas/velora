import { ExternalLink, Flag, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, getPillClass, FALLBACK_IMG } from "../utils/helpers";

export function FeedGrid({ articles, loading }) {
    if (loading) return <SkeletonGrid count={6} />;

    if (articles.length === 0) {
        return (
            <div className="empty-state glass">
                <Inbox size={40} strokeWidth={1.5} />
                <h3>No stories found</h3>
                <p>Try a different search or category.</p>
            </div>
        );
    }

    return (
        <div className="feed-grid">
            {articles.map((article) => (
                <article className="feed-card glass animate-in" key={article.id}>
                    <div className="feed-image-wrap">
                        <img
                            src={article.imageUrl || FALLBACK_IMG}
                            alt={article.title}
                            loading="lazy"
                            onError={(e) => { e.target.src = FALLBACK_IMG; }}
                        />
                    </div>
                    <div className="feed-copy">
                        <div className="feed-tags">
                            <span className={`pill ${getPillClass(article.category)}`}>{article.category}</span>
                            {article.region === "India" && (
                                <span className="pill pill-amber region-chip"><Flag size={10} /></span>
                            )}
                        </div>
                        <h3>{article.title}</h3>
                        <p>{article.excerpt}</p>
                        <div className="feed-footer">
                            <span>{article.source} · {formatDate(article.publishedAt)}</span>
                            <a href={article.url} target="_blank" rel="noreferrer">
                                Open <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

export function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination glass" id="pagination">
            <button className="btn" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
                <ChevronLeft size={14} /> Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button className="btn" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
                Next <ChevronRight size={14} />
            </button>
        </div>
    );
}

function SkeletonGrid({ count }) {
    return (
        <div className="skeleton-grid">
            {Array.from({ length: count }).map((_, i) => (
                <div className="skeleton skeleton-card" key={i} />
            ))}
        </div>
    );
}

export function SkeletonHero() {
    return (
        <div className="hero-section">
            <div className="skeleton skeleton-hero" />
            <div className="hero-sidebar">
                <div className="skeleton skeleton-side" />
                <div className="skeleton skeleton-side" />
                <div className="skeleton skeleton-side" />
            </div>
        </div>
    );
}
