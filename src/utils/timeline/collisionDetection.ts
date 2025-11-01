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
 * Algorithm:
 * 1. Group events by track
 * 2. Sort events chronologically within each track
 * 3. For each event, calculate bounding box
 * 4. Check for collisions with previously placed labels
 * 5. If collision detected, adjust Y position (alternating up/down)
 * 6. Mark needsConnector if label moved >5px from base
 * 7. Maximum 10 adjustment attempts per label
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
  const placedBoxes: BoundingBox[] = [];

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

  // Sort events chronologically within each track
  for (const [trackId, trackEvents] of eventsByTrack.entries()) {
    trackEvents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });

    // Process each event
    for (const event of trackEvents) {
      const baseX = getEventX(event.date);
      const baseY = getEventY(trackId);

      // Calculate label dimensions
      const labelWidth = event.title.length * cfg.charWidth;
      const labelHeight = cfg.labelHeight;

      // Try to place label without collision
      let finalY = baseY;
      let needsConnector = false;
      let placed = false;

      // Attempt to place at base position first
      let candidateBox: BoundingBox = {
        x: baseX,
        y: baseY,
        width: labelWidth,
        height: labelHeight,
      };

      // Check for collision at base position
      if (!placedBoxes.some(box => hasCollision(candidateBox, box))) {
        placed = true;
      } else {
        // Try alternating up/down adjustments
        for (let attempt = 1; attempt <= cfg.maxAttempts && !placed; attempt++) {
          const direction = attempt % 2 === 0 ? 1 : -1; // Alternate: up (-1), down (+1)
          const offset = Math.ceil(attempt / 2) * cfg.adjustmentStep;
          const adjustedY = baseY + direction * offset;

          candidateBox = {
            x: baseX,
            y: adjustedY,
            width: labelWidth,
            height: labelHeight,
          };

          // Check if this position is collision-free
          if (!placedBoxes.some(box => hasCollision(candidateBox, box))) {
            finalY = adjustedY;
            needsConnector = Math.abs(adjustedY - baseY) > cfg.connectorThreshold;
            placed = true;
          }
        }
      }

      // Store position (use base position if no collision-free spot found)
      positions.set(event.id, {
        x: baseX,
        y: finalY,
        needsConnector,
      });

      // Add to placed boxes for future collision checks
      placedBoxes.push({
        x: baseX,
        y: finalY,
        width: labelWidth,
        height: labelHeight,
      });
    }
  }

  return positions;
}
