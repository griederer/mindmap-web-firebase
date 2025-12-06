/**
 * Theme Store
 * Manages the current theme for the mindmap canvas
 */

import { create } from 'zustand';
import { Theme, THEMES, DEFAULT_THEME } from '../types/theme';

interface ThemeState {
  currentTheme: Theme;
  availableThemes: Theme[];

  // Actions
  setTheme: (themeId: string) => void;
  getThemeById: (themeId: string) => Theme | undefined;
  getBranchColor: (branchIndex: number) => string;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: DEFAULT_THEME,
  availableThemes: THEMES,

  setTheme: (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (theme) {
      set({ currentTheme: theme });
    }
  },

  getThemeById: (themeId: string) => {
    return THEMES.find(t => t.id === themeId);
  },

  getBranchColor: (branchIndex: number) => {
    const { currentTheme } = get();
    const colors = currentTheme.colors.branchColors;
    return colors[branchIndex % colors.length];
  },
}));
