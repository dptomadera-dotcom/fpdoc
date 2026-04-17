'use client';

import { useEffect } from 'react';

const THEME_KEY = 'fpdoc_theme';

export function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function getSavedTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') ?? 'dark';
}

export default function ThemeProvider() {
  useEffect(() => {
    const theme = getSavedTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return null;
}
