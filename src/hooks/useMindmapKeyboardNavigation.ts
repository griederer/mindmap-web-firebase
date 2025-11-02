/**
 * Hook for handling keyboard navigation in mindmap view
 * Provides arrow key controls for node expansion/collapse
 */

import { useEffect, useCallback } from 'react';
import { useUIStore } from '../stores/uiStore';
import { useProjectStore } from '../stores/projectStore';

interface UseMindmapKeyboardNavigationOptions {
  /** Whether keyboard navigation is enabled */
  enabled?: boolean;
}

/**
 * Custom hook for keyboard navigation in mindmap view
 *
 * Features:
 * - Arrow Left (←): Collapse selected node
 * - Arrow Right (→): Expand selected node
 * - Only works when a node is selected
 * - Only active in mindmap view
 *
 * @param options - Configuration options for the hook
 *
 * @example
 * ```tsx
 * useMindmapKeyboardNavigation({
 *   enabled: currentView === 'mindmap',
 * });
 * ```
 */
export function useMindmapKeyboardNavigation(
  options: UseMindmapKeyboardNavigationOptions = {}
) {
  const { enabled = true } = options;

  // Zustand stores
  const { selectedNodeId } = useUIStore();
  const { toggleNodeExpansion, currentProject } = useProjectStore();

  /**
   * Handle arrow key press events for node expansion/collapse
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Only handle arrow keys
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

      // Must have a selected node
      if (!selectedNodeId) return;

      // Get the selected node
      const node = currentProject?.nodes[selectedNodeId];
      if (!node) return;

      // Must have children to expand/collapse
      if (!node.children || node.children.length === 0) return;

      // Prevent default browser behavior (scrolling)
      event.preventDefault();

      // Arrow Right: Expand node
      if (event.key === 'ArrowRight') {
        if (!node.isExpanded) {
          toggleNodeExpansion(selectedNodeId);
          console.log(`[Mindmap Navigation] Expanding node: ${node.title}`);
        }
      }
      // Arrow Left: Collapse node
      else if (event.key === 'ArrowLeft') {
        if (node.isExpanded) {
          toggleNodeExpansion(selectedNodeId);
          console.log(`[Mindmap Navigation] Collapsing node: ${node.title}`);
        }
      }
    },
    [enabled, selectedNodeId, currentProject, toggleNodeExpansion]
  );

  /**
   * Set up and clean up keyboard event listener
   */
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}
