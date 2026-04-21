import { Search } from "lucide-react";

export function SearchBar({
    keyword,
    onSearch,
    sourceFilter,
    onSourceChange,
    sources,
    regionFilter,
    onRegionChange,
    timeFilter,
    onTimeChange,
    hideRegion,
}) {
    return (
        <div className="search-bar">
            <div className="search-input-wrap">
                <Search size={15} className="search-icon" />
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search headlines, topics, companies..."
                    value={keyword}
                    onChange={onSearch}
                    id="search-input"
                />
            </div>
            {!hideRegion && (
                <select
                    className="filter-select"
                    value={regionFilter}
                    onChange={onRegionChange}
                    id="region-filter"
                >
                    <option value="">All regions</option>
                    <option value="India">India</option>
                    <option value="Global">Global</option>
                </select>
            )}
            <select
                className="filter-select"
                value={timeFilter}
                onChange={onTimeChange}
                id="time-filter"
            >
                <option value="">All time</option>
                <option value="today">Today</option>
                <option value="3days">Last 3 days</option>
                <option value="week">This week</option>
            </select>
            <select
                className="filter-select"
                value={sourceFilter}
                onChange={onSourceChange}
                id="source-filter"
            >
                <option value="">All sources</option>
                {sources.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>
        </div>
    );
}
