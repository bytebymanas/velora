import { Globe, Flag, Monitor, Trophy, Briefcase, Earth, Clapperboard, Newspaper, LayoutGrid } from "lucide-react";

const TAB_ICONS = {
    "": LayoutGrid,
    "Global": Globe,
    "India": Flag,
    "Technology": Monitor,
    "Sports": Trophy,
    "Business": Briefcase,
    "World": Earth,
    "Culture": Clapperboard,
    "Top Stories": Newspaper
};

export function Tabs({ tabs, activeTab, onTabChange }) {
    return (
        <div className="tabs-section" id="tabs">
            <div className="tabs-row">
                {tabs.map((tab) => {
                    const Icon = TAB_ICONS[tab.value] || Newspaper;
                    return (
                        <button
                            key={tab.value || "all"}
                            className={`tab ${activeTab.value === tab.value ? "active" : ""}`}
                            onClick={() => onTabChange(tab)}
                        >
                            <Icon size={14} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
