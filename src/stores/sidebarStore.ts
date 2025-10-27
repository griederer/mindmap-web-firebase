/**
 * Sidebar State Store
 * Manages sidebar collapse state and persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  // Collapse state
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;

  // Recent projects (for future use)
  recentProjects: string[];
  addRecentProject: (projectId: string) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      // Initial state
      isCollapsed: false,
      recentProjects: [],

      // Actions
      toggleCollapse: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),

      setCollapsed: (collapsed: boolean) =>
        set({ isCollapsed: collapsed }),

      addRecentProject: (projectId: string) =>
        set((state) => {
          const updated = [projectId, ...state.recentProjects.filter((id) => id !== projectId)];
          return {
            recentProjects: updated.slice(0, 5), // Keep max 5 recent projects
          };
        }),
    }),
    {
      name: 'sidebar-storage', // LocalStorage key
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        recentProjects: state.recentProjects,
      }),
    }
  )
);
