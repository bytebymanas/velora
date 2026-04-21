import { ArrowRight, Flag } from "lucide-react";
import { formatDate, getPillClass, FALLBACK_IMG } from "../utils/helpers";

export function HeroSection({ featured }) {
    const hero = featured[0];
    const sides = featured.slice(1, 4);

    if (!hero) return null;

    return (
        <section className="hero-section animate-in" id="hero">
            <a className="hero-main glass" href={hero.url} target="_blank" rel="noreferrer">
                <img
                    src={hero.imageUrl || FALLBACK_IMG}
                    alt={hero.title}
                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />
                <div className="hero-overlay" />
                <div className="hero-content">
                    <span className={`pill ${getPillClass(hero.category)}`}>{hero.category}</span>
                    <h2>{hero.title}</h2>
                    <p>{hero.excerpt}</p>
                    <div className="hero-meta">
                        <span>{hero.source}</span>
                        <span>•</span>
                        <span>{formatDate(hero.publishedAt)}</span>
                        {hero.region === "India" && (
                            <span className="pill pill-amber region-chip">
                                <Flag size={10} /> India
                            </span>
                        )}
                    </div>
                    <span className="hero-link">Read full story <ArrowRight size={14} /></span>
                </div>
            </a>

            <div className="hero-sidebar">
                {sides.map((story) => (
                    <a className="hero-side-card glass" key={story.id} href={story.url} target="_blank" rel="noreferrer">
                        <div>
                            <span className={`pill ${getPillClass(story.category)}`}>{story.category}</span>
                            <h3>{story.title}</h3>
                            <p>{story.excerpt}</p>
                        </div>
                        <div className="story-meta">
                            <span>{story.source}</span>
                            <span className="dot" />
                            <span>{formatDate(story.publishedAt)}</span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
