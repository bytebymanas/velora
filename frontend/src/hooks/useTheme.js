import { useState, useEffect } from "react";

const THEME_KEY = "velora-theme";

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(THEME_KEY) || "dark";
        }
        return "dark";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    function toggleTheme() {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }

    return { theme, toggleTheme };
}
