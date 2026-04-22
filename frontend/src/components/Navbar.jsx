import { useState, useEffect } from "react";
import { Sun, Moon, RefreshCw, TrendingUp, Bookmark, Clock } from "lucide-react";

function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const date = now.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="nav-clock">
      <Clock size={13} className="clock-icon" />
      <span className="clock-time">{time}</span>
      <span className="clock-divider">·</span>
      <span className="clock-date">{date}</span>
    </div>
  );
}

export function Navbar({ theme, toggleTheme, refreshing, onRefresh, onScrollToFeed, onScrollToTop }) {
  return (
    <nav className="navbar" id="navbar">
      <div className="nav-left">
        <div className="brand" onClick={onScrollToTop} role="button" tabIndex={0}>
          <div className="brand-icon">V</div>
          <span className="brand-name">Velora</span>
        </div>
        <div className="nav-links">
          <button className="nav-link" onClick={onScrollToTop}>
            <TrendingUp size={14} />
            <span>Trending</span>
          </button>
          <button className="nav-link" onClick={onScrollToFeed}>
            <Bookmark size={14} />
            <span>Feed</span>
          </button>
        </div>
      </div>
      <div className="nav-right">
        <LiveClock />
        <div className="nav-actions">
          <button
            className="btn btn-icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="btn" onClick={onRefresh} disabled={refreshing} id="refresh-btn">
            <RefreshCw size={14} className={refreshing ? "spin" : ""} />
            {refreshing ? "Updating..." : "Refresh"}
          </button>
        </div>
      </div>
    </nav>
  );
}
