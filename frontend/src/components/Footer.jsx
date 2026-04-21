import { Rss, Activity, Radio, Code2 } from "lucide-react";

export function Footer({ totalArticles }) {
    return (
        <footer className="site-footer">
            <div className="footer-grid">
                <div className="footer-brand">
                    <div className="brand">
                        <div className="brand-icon">V</div>
                        <span className="brand-name">Velora</span>
                    </div>
                    <p className="footer-desc">
                        Your personal live news dashboard. Global and Indian coverage across all categories, updated in real-time.
                    </p>
                </div>
                <div className="footer-stats">
                    <div className="stat-item">
                        <Rss size={16} />
                        <span className="stat-value">20+</span>
                        <span className="stat-label">Sources</span>
                    </div>
                    <div className="stat-item">
                        <Activity size={16} />
                        <span className="stat-value">{totalArticles || "—"}</span>
                        <span className="stat-label">Articles</span>
                    </div>
                    <div className="stat-item">
                        <Radio size={16} />
                        <span className="stat-value">Live</span>
                        <span className="stat-label">Updates</span>
                    </div>
                </div>
                <div className="footer-links">
                    <span className="footer-category-label">Categories</span>
                    <div className="footer-tags">
                        <span className="footer-tag">Global</span>
                        <span className="footer-tag">India</span>
                        <span className="footer-tag">Technology</span>
                        <span className="footer-tag">Sports</span>
                        <span className="footer-tag">Business</span>
                        <span className="footer-tag">Culture</span>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <span className="footer-credit">
                    <Code2 size={13} />
                    Designed & developed by <strong className="brand-text">bytebymanas</strong>
                </span>
                <span className="footer-divider">·</span>
                <span>Velora News Dashboard</span>
            </div>
        </footer>
    );
}
