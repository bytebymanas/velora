import { ArrowRight } from "lucide-react";
import { formatDate, getPillClass } from "../utils/helpers";

export function CategorySection({ section }) {
    const items = Array.isArray(section.items) ? section.items : [];
    if (items.length === 0) return null;

    return (
        <section className="category-section animate-in">
            <div className="section-header">
                <div>
                    <p className="section-kicker">Curated</p>
                    <h2 className="section-title">{section.category}</h2>
                </div>
                <span className="section-count">{items.length} stories</span>
            </div>
            <div className="category-grid">
                {items.map((story) => (
                    <article className="story-card glass" key={story.id}>
                        <div>
                            <span className={`pill ${getPillClass(story.category)}`}>{story.category}</span>
                            <h3>{story.title}</h3>
                            <p>{story.excerpt}</p>
                        </div>
                        <div>
                            <div className="story-meta">
                                <span>{story.source}</span>
                                <span className="dot" />
                                <span>{formatDate(story.publishedAt)}</span>
                            </div>
                            <a className="story-link" href={story.url} target="_blank" rel="noreferrer">
                                Read story <ArrowRight size={13} />
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
