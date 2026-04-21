import { Sun, Moon, RefreshCw } from "lucide-react";

export function Navbar({ theme, toggleTheme, refreshing, onRefresh }) {
    return (
        <nav className="navbar" id="navbar">
            <div className="brand">
                <div className="brand-icon">V</div>
                <span className="brand-name">Velora</span>
            </div>
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
        </nav>
    );
}
