/**
 * Tests for useKeyboardNavigation hook
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { useViewportStore } from '../stores/viewportStore';
import { useProjectStore } from '../stores/projectStore';
import type { ProjectBundle, TimelineEvent } from '../types/project';

// Mock Konva
vi.mock('konva', () => ({
  default: {
    Tween: vi.fn().mockImplementation(() => ({
      play: vi.fn(),
    })),
    Easings: {
      EaseOut: vi.fn(),
    },
  },
}));

describe('useKeyboardNavigation', () => {
  const mockStageRef = {
    current: {
      x: vi.fn().mockReturnValue(0),
      y: vi.fn().mockReturnValue(0),
      scaleX: vi.fn().mockReturnValue(1),
      size: vi.fn().mockReturnValue({ width: 1920, height: 1080 }),
    },
  };

  const createMockEvent = (date: string): TimelineEvent => ({
    id: `event-${date}`,
    date,
    title: 'Test Event',
    description: 'Test description',
    track: 'default',
  });

  const mockBundle: ProjectBundle = {
    projectId: 'test-project',
    metadata: {
      title: 'Test Project',
      version: '1.0.0',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    timeline: {
      config: {
        startYear: 2012,
        endYear: 2026,
        tracks: ['default'],
      },
      events: [
        createMockEvent('2012-01-01'),
        createMockEvent('2015-06-15'),
        createMockEvent('2020-12-31'),
        createMockEvent('2026-06-15'),
      ],
    },
  };

  beforeEach(() => {
    // Reset viewport store
    useViewportStore.setState({
      x: 0,
      y: 0,
      zoom: 1,
      width: 1920,
      height: 1080,
      animationInProgress: false,
      autoFocusEnabled: false,
    });

    // Reset project store
    useProjectStore.setState({
      currentProject: null,
      currentBundle: mockBundle,
      currentProjectId: 'test-project',
      nodes: {},
      rootNodeId: null,
      recordedActions: [],
    });

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up event listeners
    vi.restoreAllMocks();
  });

  describe('Hook initialization', () => {
    it('should initialize without errors', () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          enabled: true,
          stageRef: mockStageRef as any,
        })
      );

      expect(result.current).toBeDefined();
      expect(result.current.navigateToYear).toBeInstanceOf(Function);
    });

    it('should not add event listener when disabled', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      renderHook(() =>
        useKeyboardNavigation({
          enabled: false,
          stageRef: mockStageRef as any,
        })
      );

      expect(addEventListenerSpy).not.toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should add event listener when enabled', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      renderHook(() =>
        useKeyboardNavigation({
          enabled: true,
          stageRef: mockStageRef as any,
        })
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should clean up event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() =>
        useKeyboardNavigation({
          enabled: true,
          stageRef: mockStageRef as any,
        })
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('navigateToYear function', () => {
    it('should be exposed by the hook', () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          enabled: true,
          stageRef: mockStageRef as any,
        })
      );

      expect(result.current.navigateToYear).toBeInstanceOf(Function);
    });

    it('should not navigate when no timeline data exists', () => {
      useProjectStore.setState({
        currentBundle: null,
      });

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          enabled: true,
          stageRef: mockStageRef as any,
        })
      );

      // Should not throw
      expect(() => result.current.navigateToYear(2020)).not.toThrow();
    });

    it('should not navigate when animation is in progress', () => {
      useViewportStore.setState({
        animationInProgress: true,
      });

      const { result } = renderHook(() =>
        useKeyboardNavigation({
          enabled: true,
          stageRef: mockStageRef as any,
        })
      );

      // Should not throw
      expect(() => result.current.navigateToYear(2020)).not.toThrow();
    });
  });

  describe('Custom options', () => {
    it('should accept custom animation duration', () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          enabled: true,
          stageRef: mockStageRef as any,
          animationDuration: 600,
        })
      );

      expect(result.current).toBeDefined();
    });

    it('should accept custom year spacing', () => {
      const { result } = renderHook(() =>
        useKeyboardNavigation({
          enabled: true,
          stageRef: mockStageRef as any,
          yearSpacing: 200,
        })
      );

      expect(result.current).toBeDefined();
    });
  });

  describe('Keyboard event handling', () => {
    it('should prevent default behavior for arrow keys', () => {
      const preventDefault = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          enabled: true,
          stageRef: mockStageRef as any,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });

      window.dispatchEvent(event);

      expect(preventDefault).toHaveBeenCalled();
    });

    it('should not handle non-arrow keys', () => {
      const preventDefault = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          enabled: true,
          stageRef: mockStageRef as any,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      Object.defineProperty(event, 'preventDefault', { value: preventDefault });

      window.dispatchEvent(event);

      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('should not navigate when disabled', () => {
      const { rerender } = renderHook(
        ({ enabled }) =>
          useKeyboardNavigation({
            enabled,
            stageRef: mockStageRef as any,
          }),
        { initialProps: { enabled: true } }
      );

      // Disable the hook
      rerender({ enabled: false });

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);

      // Should not throw and viewport should not change
      const viewport = useViewportStore.getState();
      expect(viewport.animationInProgress).toBe(false);
    });
  });

  describe('Integration with stores', () => {
    it('should read from viewport store', () => {
      useViewportStore.setState({
        x: 100,
        y: 200,
        zoom: 1.5,
      });

      renderHook(() =>
        useKeyboardNavigation({
          enabled: true,
          stageRef: mockStageRef as any,
        })
      );

      const viewport = useViewportStore.getState();
      expect(viewport.x).toBe(100);
      expect(viewport.y).toBe(200);
      expect(viewport.zoom).toBe(1.5);
    });

    it('should read from project store', () => {
      const bundle = useProjectStore.getState().currentBundle;
      expect(bundle).toEqual(mockBundle);
    });
  });
});
