/**
 * Hook for handling keyboard navigation in timeline view
 * Provides arrow key navigation (← →) for year-by-year movement
 */

import { useEffect, useCallback } from 'react';
import { useViewportStore } from '../stores/viewportStore';
import { useProjectStore } from '../stores/projectStore';
import { TimelineEvent } from '../types/project';
import {
  calculateYearPositions,
  findNearestYear,
  findNextYear,
  findPreviousYear,
  calculateOptimalZoomForYear,
} from '../utils/timeline/yearNavigation';
import Konva from 'konva';
import { AnimationQueue } from '../utils/performance/animationThrottle';
import {
  disableShadowsDuringAnimation,
  enableShadowsAfterAnimation,
} from '../utils/performance/canvasOptimizer';

interface UseKeyboardNavigationOptions {
  /** Whether keyboard navigation is enabled */
  enabled?: boolean;
  /** Animation duration in milliseconds (default: 400) */
  animationDuration?: number;
  /** Easing function for animations */
  easing?: (t: number) => number;
  /** Reference to the Konva stage for animations */
  stageRef?: React.RefObject<Konva.Stage>;
  /** Reference to the Konva layer for shadow management */
  layerRef?: React.RefObject<Konva.Layer>;
  /** Animation queue for smooth, conflict-free transitions */
  animationQueue?: AnimationQueue;
  /** Spacing between years in pixels (default: 150) */
  yearSpacing?: number;
}

/**
 * Custom hook for keyboard navigation in timeline view
 *
 * Features:
 * - Arrow Left (←): Navigate to previous year
 * - Arrow Right (→): Navigate to next year
 * - Auto-zoom to optimal level for viewing year's events
 * - Smooth camera pan animation
 * - Prevents navigation during ongoing animations
 *
 * @param options - Configuration options for the hook
 *
 * @example
 * ```tsx
 * const stageRef = useRef<Konva.Stage>(null);
 *
 * useKeyboardNavigation({
 *   enabled: true,
 *   stageRef,
 *   animationDuration: 400,
 *   yearSpacing: 150,
 * });
 * ```
 */
export function useKeyboardNavigation(
  options: UseKeyboardNavigationOptions = {}
) {
  const {
    enabled = true,
    animationDuration = 400,
    // easing option is reserved for future use
    stageRef,
    layerRef,
    animationQueue,
    yearSpacing = 150,
  } = options;

  // Zustand stores
  const { x, y, zoom, setPosition, setZoom, animationInProgress } = useViewportStore();
  const { currentBundle } = useProjectStore();

  /**
   * Navigate to a specific year with smooth GPU-accelerated animation
   */
  const navigateToYear = useCallback(
    (targetYear: number) => {
      if (!currentBundle || !stageRef?.current || animationInProgress) {
        return;
      }

      const stage = stageRef.current;
      const layer = layerRef?.current;
      const viewport = stage.size();
      if (!viewport) return;

      // Get timeline range from project events
      const events = currentBundle.timeline?.events || [];
      if (events.length === 0) return;

      // Calculate year positions
      const years = events.map((e: TimelineEvent) => new Date(e.date).getFullYear());
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      const yearPositions = calculateYearPositions(minYear, maxYear, yearSpacing);

      // Get target position
      const targetX = yearPositions.get(targetYear);
      if (targetX === undefined) return;

      // Calculate optimal zoom for this year
      const optimalZoom = calculateOptimalZoomForYear(
        targetYear,
        events,
        viewport.width,
        yearSpacing
      );

      // Calculate target position (center the year in viewport)
      const targetX_pos = viewport.width / 2 - targetX * optimalZoom;
      const targetY_pos = y; // Keep same Y position

      // Disable shadows for performance boost during animation
      if (layer) {
        disableShadowsDuringAnimation(layer);
      }

      // Use AnimationQueue for smooth, conflict-free transitions
      if (animationQueue) {
        console.log('[useKeyboardNavigation] Using AnimationQueue for smooth animation');
        animationQueue.add({
          stage: stage,
          target: {
            x: targetX_pos,
            y: targetY_pos,
            scaleX: optimalZoom,
            scaleY: optimalZoom,
          },
          duration: animationDuration / 1000, // Convert to seconds
          easing: Konva.Easings.EaseInOut,
          priority: 10,
        }).then(() => {
          // Re-enable shadows after animation
          if (layer) {
            enableShadowsAfterAnimation(layer);
          }
          setPosition(targetX_pos, targetY_pos);
          setZoom(optimalZoom);
        }).catch((err) => {
          console.warn('[useKeyboardNavigation] Animation cancelled:', err);
        });
      } else {
        // Fallback to direct Tween if no AnimationQueue provided
        console.warn('[useKeyboardNavigation] No AnimationQueue provided, using fallback Tween (slower)');
        useViewportStore.setState({ animationInProgress: true });

        const tween = new Konva.Tween({
          node: stage,
          duration: animationDuration / 1000,
          x: targetX_pos,
          y: targetY_pos,
          scaleX: optimalZoom,
          scaleY: optimalZoom,
          easing: Konva.Easings.EaseInOut,
          onUpdate: () => {
            const newX = stage.x();
            const newY = stage.y();
            const newScale = stage.scaleX();
            setPosition(newX, newY);
            setZoom(newScale);
          },
          onFinish: () => {
            if (layer) {
              enableShadowsAfterAnimation(layer);
            }
            useViewportStore.setState({ animationInProgress: false });
          },
        });

        tween.play();
      }
    },
    [
      currentBundle,
      stageRef,
      layerRef,
      animationQueue,
      animationInProgress,
      animationDuration,
      yearSpacing,
      y,
      setPosition,
      setZoom,
    ]
  );

  /**
   * Handle arrow key press events
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || animationInProgress) return;

      // Only handle arrow keys
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

      // Prevent default browser behavior (scrolling)
      event.preventDefault();

      if (!currentBundle || !stageRef?.current) return;

      const stage = stageRef.current;
      const viewport = stage.size();
      if (!viewport) return;

      // Get timeline range
      const events = currentBundle.timeline?.events || [];
      if (events.length === 0) return;

      const years = events.map((e: TimelineEvent) => new Date(e.date).getFullYear());
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      const yearPositions = calculateYearPositions(minYear, maxYear, yearSpacing);

      // Find current year based on camera position
      const currentX_pos = -x / zoom;
      const currentYear = findNearestYear(currentX_pos, yearPositions);

      // Calculate target year
      let targetYear: number;
      if (event.key === 'ArrowRight') {
        targetYear = findNextYear(currentYear, yearPositions);
      } else {
        targetYear = findPreviousYear(currentYear, yearPositions);
      }

      // Navigate to target year
      navigateToYear(targetYear);
    },
    [
      enabled,
      animationInProgress,
      currentBundle,
      stageRef,
      x,
      zoom,
      yearSpacing,
      navigateToYear,
    ]
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

  return {
    navigateToYear,
  };
}
