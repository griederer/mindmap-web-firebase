/**
 * Tests for collision detection algorithm
 */

import { describe, it, expect } from 'vitest';
import { calculateLabelPositions, hasCollision } from './collisionDetection';
import { TimelineEvent } from '../../types/project';

describe('hasCollision', () => {
  it('should detect overlap when boxes intersect', () => {
    const box1 = { x: 0, y: 0, width: 100, height: 50 };
    const box2 = { x: 50, y: 25, width: 100, height: 50 };

    expect(hasCollision(box1, box2)).toBe(true);
  });

  it('should return false when boxes are horizontally separated', () => {
    const box1 = { x: 0, y: 0, width: 50, height: 50 };
    const box2 = { x: 100, y: 0, width: 50, height: 50 };

    expect(hasCollision(box1, box2)).toBe(false);
  });

  it('should return false when boxes are vertically separated', () => {
    const box1 = { x: 0, y: 0, width: 50, height: 50 };
    const box2 = { x: 0, y: 100, width: 50, height: 50 };

    expect(hasCollision(box1, box2)).toBe(false);
  });

  it('should detect overlap when boxes touch edges', () => {
    const box1 = { x: 0, y: 0, width: 50, height: 50 };
    const box2 = { x: 50, y: 0, width: 50, height: 50 };

    expect(hasCollision(box1, box2)).toBe(true); // Touching edges = collision (need spacing)
  });

  it('should detect complete overlap', () => {
    const box1 = { x: 0, y: 0, width: 100, height: 100 };
    const box2 = { x: 0, y: 0, width: 100, height: 100 };

    expect(hasCollision(box1, box2)).toBe(true);
  });
});

describe('calculateLabelPositions', () => {
  const createEvent = (id: string, date: string, title: string, track: string = 'default'): TimelineEvent => ({
    id,
    date,
    title,
    description: '',
    track,
  });

  const simpleGetEventX = (date: string): number => {
    const d = new Date(date);
    return d.getTime() / (1000 * 60 * 60 * 24); // Days since epoch
  };

  const simpleGetEventY = (trackId: string): number => {
    return trackId === 'default' ? 100 : 200;
  };

  it('should return empty map for empty events array', () => {
    const positions = calculateLabelPositions([], [], simpleGetEventX, simpleGetEventY);

    expect(positions.size).toBe(0);
  });

  it('should place single event at base position', () => {
    const events: TimelineEvent[] = [createEvent('event1', '2024-01-01', 'Event 1')];

    const positions = calculateLabelPositions(events, [], simpleGetEventX, simpleGetEventY);

    expect(positions.size).toBe(1);
    const pos = positions.get('event1');
    expect(pos).toBeDefined();
    expect(pos?.y).toBe(100); // Base Y position
    expect(pos?.needsConnector).toBe(false);
  });

  it('should place non-overlapping events at base positions', () => {
    const events: TimelineEvent[] = [
      createEvent('event1', '2024-01-01', 'A'),
      createEvent('event2', '2024-06-01', 'B'), // Far enough apart
    ];

    const positions = calculateLabelPositions(events, [], simpleGetEventX, simpleGetEventY);

    expect(positions.size).toBe(2);
    const pos1 = positions.get('event1');
    const pos2 = positions.get('event2');
    expect(pos1?.needsConnector).toBe(false);
    expect(pos2?.needsConnector).toBe(false);
  });

  it('should adjust overlapping events vertically', () => {
    // Two events very close together (same date, long titles)
    const events: TimelineEvent[] = [
      createEvent('event1', '2024-01-01', 'Long Title 1'),
      createEvent('event2', '2024-01-01', 'Long Title 2'), // Same date = overlap
    ];

    const positions = calculateLabelPositions(events, [], simpleGetEventX, simpleGetEventY);

    expect(positions.size).toBe(2);
    const pos1 = positions.get('event1');
    const pos2 = positions.get('event2');

    // First event should be at base position
    expect(pos1?.y).toBe(100);
    expect(pos1?.needsConnector).toBe(false);

    // Second event should be adjusted
    expect(pos2?.y).not.toBe(100); // Moved from base
    expect(pos2?.needsConnector).toBe(true); // Needs connector line
  });

  it('should alternate adjustment direction (up, down, up, down...)', () => {
    // Create 4 overlapping events
    const events: TimelineEvent[] = [
      createEvent('event1', '2024-01-01', 'Very Long Title 1'),
      createEvent('event2', '2024-01-01', 'Very Long Title 2'),
      createEvent('event3', '2024-01-01', 'Very Long Title 3'),
      createEvent('event4', '2024-01-01', 'Very Long Title 4'),
    ];

    const positions = calculateLabelPositions(events, [], simpleGetEventX, simpleGetEventY);

    const pos1 = positions.get('event1');
    const pos2 = positions.get('event2');
    const pos3 = positions.get('event3');
    const pos4 = positions.get('event4');

    // First at base
    expect(pos1?.y).toBe(100);

    // Others should be adjusted in alternating pattern
    expect(pos2?.y).toBeLessThan(100); // Up
    expect(pos3?.y).toBeGreaterThan(100); // Down
    expect(pos4?.y).toBeLessThan(100); // Up again
  });

  it('should respect connectorThreshold', () => {
    const events: TimelineEvent[] = [
      createEvent('event1', '2024-01-01', 'A'),
      createEvent('event2', '2024-01-01', 'B'),
    ];

    const positions = calculateLabelPositions(events, [], simpleGetEventX, simpleGetEventY, {
      adjustmentStep: 3, // Small adjustment
      connectorThreshold: 5, // Threshold higher than adjustment
    });

    const pos2 = positions.get('event2');
    expect(pos2?.needsConnector).toBe(false); // Adjustment < threshold
  });

  it('should handle multiple tracks independently', () => {
    const events: TimelineEvent[] = [
      createEvent('event1', '2024-01-01', 'Long Title', 'track1'),
      createEvent('event2', '2024-01-01', 'Long Title', 'track2'),
    ];

    const getEventY = (trackId: string): number => {
      return trackId === 'track1' ? 100 : 300; // Different Y positions
    };

    const positions = calculateLabelPositions(events, [], simpleGetEventX, getEventY);

    const pos1 = positions.get('event1');
    const pos2 = positions.get('event2');

    // Both at base positions since different tracks = no collision
    expect(pos1?.y).toBe(100);
    expect(pos2?.y).toBe(300);
    expect(pos1?.needsConnector).toBe(false);
    expect(pos2?.needsConnector).toBe(false);
  });

  it('should sort events chronologically', () => {
    // Add events out of order
    const events: TimelineEvent[] = [
      createEvent('event3', '2024-03-01', 'C'),
      createEvent('event1', '2024-01-01', 'A'),
      createEvent('event2', '2024-02-01', 'B'),
    ];

    const positions = calculateLabelPositions(events, [], simpleGetEventX, simpleGetEventY);

    expect(positions.size).toBe(3);
    // All should be positioned (implementation sorts internally)
    expect(positions.has('event1')).toBe(true);
    expect(positions.has('event2')).toBe(true);
    expect(positions.has('event3')).toBe(true);
  });

  it('should handle maximum adjustment attempts', () => {
    // Create many overlapping events
    const events: TimelineEvent[] = Array.from({ length: 15 }, (_, i) =>
      createEvent(`event${i + 1}`, '2024-01-01', `Very Long Title ${i + 1}`)
    );

    const positions = calculateLabelPositions(events, [], simpleGetEventX, simpleGetEventY, {
      maxAttempts: 10,
    });

    // All events should get a position (may overlap after max attempts)
    expect(positions.size).toBe(15);
    expect(Array.from(positions.values()).every(pos => pos.y !== undefined)).toBe(true);
  });

  it('should calculate label width based on title length', () => {
    const events: TimelineEvent[] = [
      createEvent('short', '2024-01-01', 'AB'),
      createEvent('long', '2024-01-01', 'ABCDEFGHIJKLMNOP'),
    ];

    const positions = calculateLabelPositions(events, [], simpleGetEventX, simpleGetEventY, {
      charWidth: 10,
    });

    const posShort = positions.get('short');
    const posLong = positions.get('long');

    // First (short) at base, second (long) adjusted due to collision
    expect(posShort?.y).toBe(100);
    expect(posLong?.needsConnector).toBe(true);
  });

  it('should handle custom configuration', () => {
    const events: TimelineEvent[] = [
      createEvent('event1', '2024-01-01', 'A'),
      createEvent('event2', '2024-01-01', 'B'),
    ];

    const positions = calculateLabelPositions(events, [], simpleGetEventX, simpleGetEventY, {
      labelHeight: 30,
      charWidth: 10,
      adjustmentStep: 50,
      connectorThreshold: 10,
      maxAttempts: 5,
    });

    const pos2 = positions.get('event2');

    // Verify adjustment used custom step
    expect(Math.abs(pos2!.y - 100)).toBeGreaterThanOrEqual(50);
  });

  describe('Performance', () => {
    it('should handle 100 events in under 50ms', () => {
      const events: TimelineEvent[] = Array.from({ length: 100 }, (_, i) =>
        createEvent(`event${i + 1}`, `2024-${String(i % 12 + 1).padStart(2, '0')}-01`, `Event ${i + 1}`)
      );

      const start = performance.now();
      const positions = calculateLabelPositions(events, [], simpleGetEventX, simpleGetEventY);
      const duration = performance.now() - start;

      expect(positions.size).toBe(100);
      expect(duration).toBeLessThan(50);
    });
  });
});
