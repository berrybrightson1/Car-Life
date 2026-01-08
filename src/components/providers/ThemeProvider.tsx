"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MockDB } from "@/lib/mock-db";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initial load
        const stored = MockDB.getSettings().appearance?.theme || "light";
        setThemeState(stored as Theme);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.add(systemDark ? "dark" : "light");
        } else if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.add("light");
        }
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        // Persist
        const settings = MockDB.getSettings();
        if (!settings.appearance) settings.appearance = { theme: 'light', compactMode: false };
        settings.appearance.theme = newTheme;
        MockDB.saveSettings(settings); // This saves to localStorage

        // Dispatch event for other tabs or legacy listeners
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('theme-change'));
        }
    };

    // Listen for cross-tab changes and existing event triggers
    useEffect(() => {
        const handleStorage = () => {
            const stored = MockDB.getSettings().appearance?.theme || "light";
            setThemeState(stored as Theme);
        };
        window.addEventListener('storage', handleStorage);
        window.addEventListener('theme-change', handleStorage);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('theme-change', handleStorage);
        };
    }, []);



    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};
