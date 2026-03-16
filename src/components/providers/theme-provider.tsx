'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { themes, DEFAULT_THEME, type ThemeId } from '@/styles/themes';

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
  themes: typeof themes;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(initialTheme?: ThemeId): ThemeId {
  if (typeof window === 'undefined') return initialTheme ?? DEFAULT_THEME;
  const stored = localStorage.getItem('dd-theme') as ThemeId | null;
  return initialTheme ?? stored ?? DEFAULT_THEME;
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme?: ThemeId;
}) {
  const [theme, setThemeState] = useState<ThemeId>(() => getInitialTheme(initialTheme));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = (id: ThemeId) => {
    setThemeState(id);
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem('dd-theme', id);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
