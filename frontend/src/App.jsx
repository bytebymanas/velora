import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useTheme } from "./hooks/useTheme";
import { safe } from "./utils/helpers";
import { CustomCursor } from "./components/CustomCursor";
import { Navbar } from "./components/Navbar";
import { Ticker } from "./components/Ticker";
import { Tabs } from "./components/Tabs";
import { SearchBar } from "./components/SearchBar";
import { HeroSection } from "./components/HeroSection";
import { CategorySection } from "./components/CategorySection";
import { FeedGrid, Pagination, SkeletonHero } from "./components/FeedGrid";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";

const API = "http://localhost:8080/api";

const TABS = [
  { label: "All News", value: "" },
  { label: "Global", value: "Global", isRegion: true },
  { label: "India", value: "India", isRegion: true },
  { label: "Technology", value: "Technology" },
  { label: "Sports", value: "Sports" },
  { label: "Business", value: "Business" },
  { label: "World", value: "World" },
  { label: "Culture", value: "Culture" },
  { label: "Top Stories", value: "Top Stories" }
];

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [sections, setSections] = useState([]);
  const [sources, setSources] = useState([]);
  const [trending, setTrending] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [feedErrors, setFeedErrors] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [keyword, setKeyword] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  const searchTimeout = useRef(null);

  // ── Data loaders ───────────────────────────────────────
  const loadHighlights = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/highlights`);
      setFeatured(safe(res.data?.featured));
      setSections(safe(res.data?.sections));
    } catch {
      setFeatured([]);
      setSections([]);
    }
  }, []);

  const loadTrending = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/trending`);
      setTrending(safe(res.data?.items));
    } catch {
      setTrending([]);
    }
  }, []);

  const loadArticles = useCallback(
    async (pageNum = 1, refresh = false) => {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const params = { page: pageNum, limit: 12 };
      if (refresh) params.refresh = true;
      if (keyword) params.keyword = keyword;
      if (sourceFilter) params.source = sourceFilter;
      if (timeFilter) params.time = timeFilter;

      // Tab determines base filter
      if (activeTab.value) {
        if (activeTab.isRegion) {
          params.region = activeTab.value;
        } else {
          params.category = activeTab.value;
        }
      }

      // Region dropdown overrides/complements tab region
      if (regionFilter) {
        params.region = regionFilter;
      }

      try {
        const res = await axios.get(`${API}/articles`, { params });
        setArticles(safe(res.data?.items));
        setSources(safe(res.data?.meta?.sources));
        setFeedErrors(safe(res.data?.meta?.errors));
        setTotalPages(res.data?.pagination?.totalPages || 1);
        setTotalArticles(res.data?.pagination?.totalItems || 0);
        setError("");
      } catch {
        setError("Could not load the feed right now. Please try again.");
        setArticles([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activeTab, keyword, sourceFilter, regionFilter, timeFilter]
  );

  // ── Effects ────────────────────────────────────────────
  useEffect(() => {
    loadHighlights();
    loadTrending();
  }, [loadHighlights, loadTrending]);

  useEffect(() => {
    setPage(1);
    loadArticles(1);
  }, [activeTab, loadArticles]);

  useEffect(() => {
    if (page > 1) loadArticles(page);
  }, [page, loadArticles]);

  // ── Handlers ───────────────────────────────────────────
  function handleSearch(e) {
    const val = e.target.value;
    setKeyword(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      loadArticles(1);
    }, 400);
  }

  function handleSourceChange(e) {
    setSourceFilter(e.target.value);
    setPage(1);
  }

  function handleRegionChange(e) {
    setRegionFilter(e.target.value);
    setPage(1);
  }

  function handleTimeChange(e) {
    setTimeFilter(e.target.value);
    setPage(1);
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    // When switching tabs, reset sub-filters
    setRegionFilter("");
    setTimeFilter("");
    setSourceFilter("");
    setKeyword("");
  }

  async function refreshFeed() {
    setRefreshing(true);
    await loadArticles(page, true);
    await loadHighlights();
    await loadTrending();
  }

  return (
    <div className="app-shell">
      {/* Custom cursor */}
      <CustomCursor />

      {/* Ambient glow */}
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />
      <div className="ambient ambient-3" />

      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        refreshing={refreshing}
        onRefresh={refreshFeed}
      />

      {/* Status notices */}
      {error && <div className="status-banner error">Unable to load stories right now. Please try refreshing.</div>}
      {!error && feedErrors.length > 0 && (
        <div className="status-banner muted">
          Some sources are catching up — your feed is still live.
        </div>
      )}

      <Ticker items={trending} />

      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      <SearchBar
        keyword={keyword}
        onSearch={handleSearch}
        sourceFilter={sourceFilter}
        onSourceChange={handleSourceChange}
        sources={sources}
        regionFilter={regionFilter}
        onRegionChange={handleRegionChange}
        timeFilter={timeFilter}
        onTimeChange={handleTimeChange}
        hideRegion={activeTab.isRegion || activeTab.value === "World"}
      />

      {/* Hero (only on "All News" tab) */}
      {activeTab.value === "" && (
        loading ? <SkeletonHero /> : <HeroSection featured={featured} />
      )}

      {/* Category sections (only on "All News" tab) */}
      {activeTab.value === "" && safe(sections).map((section) => (
        <CategorySection key={section.category} section={section} />
      ))}

      {/* Main feed */}
      <section className="feed-section" id="feed">
        <div className="section-header">
          <div>
            <p className="section-kicker">
              {activeTab.value ? activeTab.label : "Live Feed"}
            </p>
            <h2 className="section-title">
              {activeTab.value ? `${activeTab.label} Stories` : "Everything in one stream"}
            </h2>
          </div>
          <span className="section-count">
            {loading ? "Loading..." : `${totalArticles} total stories`}
          </span>
        </div>

        <FeedGrid articles={articles} loading={loading} />

        {!loading && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </section>

      <Footer totalArticles={totalArticles} />
      <ScrollToTop />
    </div>
  );
}
