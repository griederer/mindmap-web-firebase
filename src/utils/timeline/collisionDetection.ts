/**
 * Collision Detection for Timeline Event Labels
 * Prevents text overlap by adjusting label positions dynamically
 */

import { TimelineEvent } from '../../types/project';

/**
 * Bounding box for collision detection
 */
interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Label position with connector line indicator
 */
export interface LabelPosition {
  x: number;
  y: number;
  needsConnector: boolean;
}

/**
 * Configuration for label positioning
 */
interface LabelConfig {
  /**
   * Base height for each label (px)
   * @default 20
   */
  labelHeight?: number;

  /**
   * Character width for calculating label width (px)
   * @default 7
   */
  charWidth?: number;

  /**
   * Vertical spacing between adjusted labels (px)
   * @default 25
   */
  adjustmentStep?: number;

  /**
   * Minimum distance from base position to show connector (px)
   * @default 5
   */
  connectorThreshold?: number;

  /**
   * Maximum adjustment attempts per label
   * @default 10
   */
  maxAttempts?: number;
}

const DEFAULT_CONFIG: Required<LabelConfig> = {
  labelHeight: 20,
  charWidth: 7,
  adjustmentStep: 25,
  connectorThreshold: 5,
  maxAttempts: 10,
};

/**
 * Check if two bounding boxes overlap
 */
export function hasCollision(box1: BoundingBox, box2: BoundingBox): boolean {
  return !(
    box1.x + box1.width < box2.x || // box1 is left of box2
    box1.x > box2.x + box2.width || // box1 is right of box2
    box1.y + box1.height < box2.y || // box1 is above box2
    box1.y > box2.y + box2.height // box1 is below box2
  );
}

/**
 * Calculate non-overlapping positions for timeline event labels
 *
 * Simple Deterministic Algorithm:
 * 1. Group events by track
 * 2. Sort events chronologically within each track
 * 3. Alternate label positions: baseline, up, down, up more, down more, etc.
 * 4. No collision detection - guaranteed separation by design
 * 5. Mark needsConnector if label moved from baseline
 *
 * @param events - Timeline events to position
 * @param tracks - Track definitions (not used in current implementation but kept for API consistency)
 * @param getEventX - Function to calculate X position from date
 * @param getEventY - Function to calculate Y position from track ID
 * @param config - Optional configuration for label positioning
 * @returns Map of event ID to label position
 */
export function calculateLabelPositions(
  events: TimelineEvent[],
  _tracks: unknown[], // Intentionally unused - kept for API consistency
  getEventX: (date: string) => number,
  getEventY: (trackId: string) => number,
  config: LabelConfig = {}
): Map<string, LabelPosition> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const positions = new Map<string, LabelPosition>();

  // Handle empty events
  if (events.length === 0) {
    return positions;
  }

  // Group events by track
  const eventsByTrack = new Map<string, TimelineEvent[]>();
  for (const event of events) {
    const trackEvents = eventsByTrack.get(event.track) || [];
    trackEvents.push(event);
    eventsByTrack.set(event.track, trackEvents);
  }

  // Process each track
  for (const [trackId, trackEvents] of eventsByTrack.entries()) {
    // Sort events chronologically within track
    trackEvents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });

    // Apply simple alternating pattern
    for (let i = 0; i < trackEvents.length; i++) {
      const event = trackEvents[i];
      const baseX = getEventX(event.date);
      const baseY = getEventY(trackId);

      let finalY = baseY;
      let needsConnector = false;

      // Deterministic alternating pattern
      if (i === 0) {
        // First event: baseline position
        finalY = baseY;
        needsConnector = false;
      } else if (i % 2 === 1) {
        // Odd index: move UP
        const level = Math.ceil(i / 2);
        finalY = baseY - (level * cfg.adjustmentStep);
        needsConnector = true;
      } else {
        // Even index: move DOWN
        const level = i / 2;
        finalY = baseY + (level * cfg.adjustmentStep);
        needsConnector = true;
      }

      // Store position
      positions.set(event.id, {
        x: baseX,
        y: finalY,
        needsConnector,
      });
    }
  }

  return positions;
}
