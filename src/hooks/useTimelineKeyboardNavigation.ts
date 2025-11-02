/**
 * Hook for handling keyboard navigation in timeline view
 * Provides arrow key controls for year-by-year navigation
 */

import { useEffect, useCallback } from 'react';
import { useViewportStore } from '../stores/viewportStore';
import { useProjectStore } from '../stores/projectStore';
import { findNextYear, findPreviousYear, calculateOptimalZoomForYear } from '../utils/timeline/yearNavigation';

interface UseTimelineKeyboardNavigationOptions {
  /** Whether keyboard navigation is enabled */
  enabled?: boolean;
}

/**
 * Custom hook for keyboard navigation when viewing timeline
 *
 * Features:
 * - Arrow Left (←): Navigate to previous year
 * - Arrow Right (→): Navigate to next year
 * - Only active when viewport is centered on timeline
 * - Automatically detects timeline position and events
 *
 * @param options - Configuration options for the hook
 *
 * @example
 * ```tsx
 * useTimelineKeyboardNavigation({
 *   enabled: true,
 * });
 * ```
 */
export function useTimelineKeyboardNavigation(
  options: UseTimelineKeyboardNavigationOptions = {}
) {
  const { enabled = true } = options;

  // Zustand stores
  const { x, y, zoom, setZoom, setPosition } = useViewportStore();
  const { currentBundle } = useProjectStore();

  /**
   * Check if viewport is centered on timeline
   * Uses same logic as Sidebar year navigation
   */
  const isViewingTimeline = useCallback((): boolean => {
    if (!currentBundle?.timeline) return false;

    // Timeline position in Canvas (from Canvas.tsx)
    const TIMELINE_Y = 800;
    const TIMELINE_Y_OFFSET = 80;
    const TRACK_HEIGHT = 100;

    // Calculate viewport center Y in world coordinates
    const centerY = -y / zoom + (window.innerHeight / 2 / zoom);

    // Calculate timeline center Y
    const timelineCenterY = TIMELINE_Y + TIMELINE_Y_OFFSET + (TRACK_HEIGHT / 2);

    // Check distance to timeline center
    const distanceToTimeline = Math.abs(centerY - timelineCenterY);

    return distanceToTimeline < 100; // Same threshold as Sidebar
  }, [y, zoom, currentBundle]);

  /**
   * Navigate to previous or next year
   */
  const navigateYear = useCallback(
    (direction: 'forward' | 'backward') => {
      const timeline = currentBundle?.timeline;
      if (!timeline) return;

      const events = timeline.events || [];
      if (events.length === 0) return;

      // Constants matching TimelineComponent.tsx
      const YEAR_SPACING = 280;
      const TRACK_HEIGHT = 100;
      const TIMELINE_Y_OFFSET = 80;
      const TRACK_LABEL_WIDTH = 120;

      // Timeline position in Canvas
      const TIMELINE_X = 100;
      const TIMELINE_Y = 800;

      // Calculate year positions from events
      const yearSet = new Set<number>();
      events.forEach(event => {
        const year = new Date(event.date).getFullYear();
        yearSet.add(year);
      });
      const years = Array.from(yearSet).sort((a, b) => a - b);

      const startDate = new Date(timeline.config?.startDate || years[0].toString());
      const yearPositions = new Map<number, number>();
      years.forEach(year => {
        const yearsSinceStart = year - startDate.getFullYear();
        yearPositions.set(year, yearsSinceStart * YEAR_SPACING);
      });

      // Find closest year to current viewport
      const centerX = -x / zoom + (window.innerWidth / 2 / zoom);
      const relativeX = centerX - TIMELINE_X - TRACK_LABEL_WIDTH;

      let closestYear = years[0];
      let minDistance = Infinity;

      years.forEach(year => {
        const yearPos = yearPositions.get(year) || 0;
        const distance = Math.abs(relativeX - yearPos);
        if (distance < minDistance) {
          minDistance = distance;
          closestYear = year;
        }
      });

      // Navigate to next/previous year
      const targetYear = direction === 'forward'
        ? findNextYear(closestYear, yearPositions)
        : findPreviousYear(closestYear, yearPositions);

      console.log(`[Timeline Navigation] Keyboard: ${direction} from ${closestYear} to ${targetYear}`);

      // Calculate optimal zoom for this year
      const rawZoom = calculateOptimalZoomForYear(
        targetYear,
        events,
        window.innerWidth,
        YEAR_SPACING
      );

      // Cap zoom to reasonable level (max 0.8x for better overview)
      const optimalZoom = Math.min(rawZoom, 0.8);

      // Calculate optimal camera position for the year
      const targetX = yearPositions.get(targetYear) || 0;
      const timelineEventX = TIMELINE_X + TRACK_LABEL_WIDTH + targetX;
      const targetCameraX = (window.innerWidth / 2) - (timelineEventX * optimalZoom);

      const timelineEventY = TIMELINE_Y + TIMELINE_Y_OFFSET + (TRACK_HEIGHT / 2);
      const targetCameraY = (window.innerHeight / 2) - (timelineEventY * optimalZoom);

      // Apply position and zoom
      setZoom(optimalZoom);
      setPosition(targetCameraX, targetCameraY);
    },
    [x, y, zoom, currentBundle, setZoom, setPosition]
  );

  /**
   * Handle arrow key press events for year navigation
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Only handle arrow keys
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

      // Only handle if viewing timeline
      if (!isViewingTimeline()) return;

      // Prevent default browser behavior and node expand/collapse
      event.preventDefault();
      event.stopPropagation();

      // Navigate year
      if (event.key === 'ArrowRight') {
        navigateYear('forward');
      } else if (event.key === 'ArrowLeft') {
        navigateYear('backward');
      }
    },
    [enabled, isViewingTimeline, navigateYear]
  );

  /**
   * Set up and clean up keyboard event listener
   */
  useEffect(() => {
    if (!enabled) return;

    // Use capture phase to handle event before useMindmapKeyboardNavigation
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [enabled, handleKeyDown]);
}
