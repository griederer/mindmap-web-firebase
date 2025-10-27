/**
 * Theme Toggle Component
 * Button to switch between light and dark mode
 */

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-obsidian-card transition-colors duration-150"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon size={18} strokeWidth={1.5} className="text-gray-600 dark:text-obsidian-text" />
      ) : (
        <Sun size={18} strokeWidth={1.5} className="text-obsidian-text" />
      )}
    </button>
  );
}
