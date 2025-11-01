/**
 * Timeline Year Navigation Utilities
 * Handles year position calculations and navigation logic
 */

import { TimelineEvent } from '../../types/project';

/**
 * Calculate X positions for each year in the timeline
 * @param startYear - First year in timeline
 * @param endYear - Last year in timeline
 * @param spacing - Pixels between years (default: 150)
 * @returns Map of year → X position
 */
export function calculateYearPositions(
  startYear: number,
  endYear: number,
  spacing: number = 150
): Map<number, number> {
  const positions = new Map<number, number>();

  for (let year = startYear; year <= endYear; year++) {
    const yearOffset = year - startYear;
    positions.set(year, yearOffset * spacing);
  }

  return positions;
}

/**
 * Find the nearest year to a given X coordinate
 * @param currentX - Current X position in canvas
 * @param yearPositions - Map of year → X position
 * @returns Nearest year number
 */
export function findNearestYear(
  currentX: number,
  yearPositions: Map<number, number>
): number {
  let nearestYear = 0;
  let minDistance = Infinity;

  for (const [year, xPos] of yearPositions.entries()) {
    const distance = Math.abs(currentX - xPos);
    if (distance < minDistance) {
      minDistance = distance;
      nearestYear = year;
    }
  }

  return nearestYear;
}

/**
 * Find the next year in the timeline (with wrap-around)
 * @param currentYear - Current year
 * @param yearPositions - Map of year → X position
 * @returns Next year number (wraps to first year if at end)
 */
export function findNextYear(
  currentYear: number,
  yearPositions: Map<number, number>
): number {
  const years = Array.from(yearPositions.keys()).sort((a, b) => a - b);
  const currentIndex = years.indexOf(currentYear);

  if (currentIndex === -1) return years[0];
  if (currentIndex === years.length - 1) return years[0]; // Wrap to start

  return years[currentIndex + 1];
}

/**
 * Find the previous year in the timeline (with wrap-around)
 * @param currentYear - Current year
 * @param yearPositions - Map of year → X position
 * @returns Previous year number (wraps to last year if at start)
 */
export function findPreviousYear(
  currentYear: number,
  yearPositions: Map<number, number>
): number {
  const years = Array.from(yearPositions.keys()).sort((a, b) => a - b);
  const currentIndex = years.indexOf(currentYear);

  if (currentIndex === -1) return years[years.length - 1];
  if (currentIndex === 0) return years[years.length - 1]; // Wrap to end

  return years[currentIndex - 1];
}

/**
 * Calculate optimal zoom level to show all events in a given year
 * @param year - Target year
 * @param events - Array of timeline events
 * @param viewportWidth - Viewport width in pixels
 * @param spacing - Pixels between years (default: 150)
 * @returns Optimal zoom level (clamped between 0.25 and 4.0)
 */
export function calculateOptimalZoomForYear(
  year: number,
  events: TimelineEvent[],
  viewportWidth: number,
  spacing: number = 150
): number {
  // Filter events for this year
  const yearEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year;
  });

  // If no events, use default zoom
  if (yearEvents.length === 0) {
    return 1.0;
  }

  // Calculate span of events within the year
  const eventXPositions = yearEvents.map(event => {
    const eventDate = new Date(event.date);
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor(
      (eventDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
    );
    return (dayOfYear / 365) * spacing;
  });

  const minX = Math.min(...eventXPositions);
  const maxX = Math.max(...eventXPositions);
  const eventSpan = maxX - minX + 200; // Add padding (100px on each side)

  // Calculate zoom to fit events in viewport
  // Leave some margin (80% of viewport width)
  const targetWidth = viewportWidth * 0.8;
  let optimalZoom = targetWidth / Math.max(spacing, eventSpan);

  // Clamp zoom between 0.25 and 4.0
  optimalZoom = Math.max(0.25, Math.min(4.0, optimalZoom));

  return optimalZoom;
}
