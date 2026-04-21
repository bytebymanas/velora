import { AlertCircle } from "lucide-react";

export function Ticker({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="ticker-wrapper" id="ticker">
            <div className="ticker-label">
                <AlertCircle size={12} />
                <span>BREAKING</span>
            </div>
            <div className="ticker-track">
                {[...items, ...items].map((item, i) => (
                    <a
                        className="ticker-item"
                        key={`t-${i}`}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <strong>{item.source}</strong> — {item.title}
                    </a>
                ))}
            </div>
        </div>
    );
}
