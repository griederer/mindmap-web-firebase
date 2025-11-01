/**
 * Tests for year navigation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  calculateYearPositions,
  findNearestYear,
  findNextYear,
  findPreviousYear,
  calculateOptimalZoomForYear,
} from './yearNavigation';
import { TimelineEvent } from '../../types/project';

describe('calculateYearPositions', () => {
  it('should calculate positions for a range of years with default spacing', () => {
    const positions = calculateYearPositions(2012, 2026);

    expect(positions.size).toBe(15); // 2012 to 2026 inclusive
    expect(positions.get(2012)).toBe(0);
    expect(positions.get(2013)).toBe(150);
    expect(positions.get(2014)).toBe(300);
    expect(positions.get(2026)).toBe(2100); // 14 years * 150px
  });

  it('should calculate positions with custom spacing', () => {
    const positions = calculateYearPositions(2020, 2023, 200);

    expect(positions.size).toBe(4);
    expect(positions.get(2020)).toBe(0);
    expect(positions.get(2021)).toBe(200);
    expect(positions.get(2022)).toBe(400);
    expect(positions.get(2023)).toBe(600);
  });

  it('should handle single year timeline', () => {
    const positions = calculateYearPositions(2020, 2020);

    expect(positions.size).toBe(1);
    expect(positions.get(2020)).toBe(0);
  });

  it('should handle two-year timeline', () => {
    const positions = calculateYearPositions(2024, 2025, 100);

    expect(positions.size).toBe(2);
    expect(positions.get(2024)).toBe(0);
    expect(positions.get(2025)).toBe(100);
  });
});

describe('findNearestYear', () => {
  const positions = calculateYearPositions(2012, 2026, 150);

  it('should find exact year match', () => {
    expect(findNearestYear(0, positions)).toBe(2012);
    expect(findNearestYear(150, positions)).toBe(2013);
    expect(findNearestYear(300, positions)).toBe(2014);
  });

  it('should find nearest year when between two years', () => {
    expect(findNearestYear(50, positions)).toBe(2012); // Closer to 2012 (0px)
    expect(findNearestYear(100, positions)).toBe(2013); // Closer to 2013 (150px)
    expect(findNearestYear(75, positions)).toBe(2012); // Exactly halfway, picks first
  });

  it('should handle position before first year', () => {
    expect(findNearestYear(-100, positions)).toBe(2012);
  });

  it('should handle position after last year', () => {
    expect(findNearestYear(3000, positions)).toBe(2026);
  });

  it('should work with custom spacing', () => {
    const customPositions = calculateYearPositions(2020, 2023, 200);

    expect(findNearestYear(0, customPositions)).toBe(2020);
    expect(findNearestYear(250, customPositions)).toBe(2021); // Closer to 200px
    expect(findNearestYear(500, customPositions)).toBe(2022); // Closer to 400px
  });
});

describe('findNextYear', () => {
  const positions = calculateYearPositions(2012, 2026, 150);

  it('should find next year in sequence', () => {
    expect(findNextYear(2012, positions)).toBe(2013);
    expect(findNextYear(2013, positions)).toBe(2014);
    expect(findNextYear(2025, positions)).toBe(2026);
  });

  it('should wrap from last year to first year', () => {
    expect(findNextYear(2026, positions)).toBe(2012);
  });

  it('should handle year not in timeline (returns first year)', () => {
    expect(findNextYear(2030, positions)).toBe(2012);
    expect(findNextYear(2000, positions)).toBe(2012);
  });

  it('should work with single year timeline', () => {
    const singleYear = calculateYearPositions(2020, 2020);
    expect(findNextYear(2020, singleYear)).toBe(2020); // Wraps to itself
  });

  it('should work with two-year timeline', () => {
    const twoYears = calculateYearPositions(2024, 2025);
    expect(findNextYear(2024, twoYears)).toBe(2025);
    expect(findNextYear(2025, twoYears)).toBe(2024); // Wraps around
  });
});

describe('findPreviousYear', () => {
  const positions = calculateYearPositions(2012, 2026, 150);

  it('should find previous year in sequence', () => {
    expect(findPreviousYear(2026, positions)).toBe(2025);
    expect(findPreviousYear(2025, positions)).toBe(2024);
    expect(findPreviousYear(2013, positions)).toBe(2012);
  });

  it('should wrap from first year to last year', () => {
    expect(findPreviousYear(2012, positions)).toBe(2026);
  });

  it('should handle year not in timeline (returns last year)', () => {
    expect(findPreviousYear(2030, positions)).toBe(2026);
    expect(findPreviousYear(2000, positions)).toBe(2026);
  });

  it('should work with single year timeline', () => {
    const singleYear = calculateYearPositions(2020, 2020);
    expect(findPreviousYear(2020, singleYear)).toBe(2020); // Wraps to itself
  });

  it('should work with two-year timeline', () => {
    const twoYears = calculateYearPositions(2024, 2025);
    expect(findPreviousYear(2025, twoYears)).toBe(2024);
    expect(findPreviousYear(2024, twoYears)).toBe(2025); // Wraps around
  });
});

describe('calculateOptimalZoomForYear', () => {
  const createEvent = (date: string): TimelineEvent => ({
    id: `event-${date}`,
    date,
    title: 'Test Event',
    description: 'Test description',
    category: 'Tecnología',
    color: '#3B82F6',
  });

  it('should return default zoom when no events in year', () => {
    // Use a year that definitely has no events
    const events: TimelineEvent[] = [
      createEvent('2024-06-15'),
      createEvent('2025-06-15'),
    ];

    // Request zoom for 2020 which has no events
    const zoom = calculateOptimalZoomForYear(2020, events, 1920, 150);

    expect(zoom).toBe(1.0);
  });

  it('should calculate zoom for single event (uses default spacing)', () => {
    const events: TimelineEvent[] = [createEvent('2024-06-15')];

    const zoom = calculateOptimalZoomForYear(2024, events, 1920, 150);

    // Single event: eventSpan = 0 + 200 (padding) = 200
    // targetWidth = 1920 * 0.8 = 1536
    // optimalZoom = 1536 / max(150, 200) = 1536 / 200 = 7.68
    // Clamped to 4.0 (MAX_ZOOM)
    expect(zoom).toBe(4.0);
  });

  it('should calculate zoom for multiple events close together', () => {
    const events: TimelineEvent[] = [
      createEvent('2024-01-01'),
      createEvent('2024-01-15'),
      createEvent('2024-01-30'),
    ];

    const zoom = calculateOptimalZoomForYear(2024, events, 1920, 150);

    // Events within ~30 days of each other
    // Should zoom in significantly but be clamped to max
    expect(zoom).toBe(4.0);
  });

  it('should calculate zoom for events spread across year', () => {
    const events: TimelineEvent[] = [
      createEvent('2024-01-01'),
      createEvent('2024-06-15'),
      createEvent('2024-12-31'),
    ];

    const zoom = calculateOptimalZoomForYear(2024, events, 1920, 150);

    // Events spread across full year
    // eventSpan ≈ 365 days worth of pixels + 200 padding
    // Should result in moderate zoom
    expect(zoom).toBeGreaterThan(0.25);
    expect(zoom).toBeLessThanOrEqual(4.0);
  });

  it('should clamp zoom to minimum 0.25', () => {
    const events: TimelineEvent[] = [
      createEvent('2024-01-01'),
      createEvent('2024-12-31'),
    ];

    // Very small viewport should clamp to min zoom
    const zoom = calculateOptimalZoomForYear(2024, events, 200, 150);

    expect(zoom).toBeGreaterThanOrEqual(0.25);
  });

  it('should clamp zoom to maximum 4.0', () => {
    const events: TimelineEvent[] = [createEvent('2024-06-15')];

    // Very large viewport with single event should clamp to max zoom
    const zoom = calculateOptimalZoomForYear(2024, events, 10000, 150);

    expect(zoom).toBeLessThanOrEqual(4.0);
  });

  it('should handle custom spacing parameter', () => {
    // Use events spread across the year to avoid max zoom clamp
    const events: TimelineEvent[] = [
      createEvent('2024-01-01'),
      createEvent('2024-12-31'),
    ];

    // Use smaller viewport to avoid hitting max zoom
    const zoom1 = calculateOptimalZoomForYear(2024, events, 800, 150);
    const zoom2 = calculateOptimalZoomForYear(2024, events, 800, 300);

    // Different spacing should produce different zoom levels
    // (spacing affects the denominator in zoom calculation)
    expect(zoom1).not.toBe(zoom2);
    expect(zoom1).toBeGreaterThan(0.25);
    expect(zoom2).toBeGreaterThan(0.25);
  });

  it('should only consider events from specified year', () => {
    const events: TimelineEvent[] = [
      createEvent('2023-12-31'),
      createEvent('2024-06-15'),
      createEvent('2025-01-01'),
    ];

    const zoom = calculateOptimalZoomForYear(2024, events, 1920, 150);

    // Should only consider the 2024 event (single event = max zoom)
    expect(zoom).toBe(4.0);
  });
});
