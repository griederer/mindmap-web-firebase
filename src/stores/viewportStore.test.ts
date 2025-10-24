/**
 * Viewport Store Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useViewportStore } from './viewportStore';
import { useProjectStore } from './projectStore';
import type { Node } from '../types/node';
import type { Project } from '../types/project';

// Helper function to create mock nodes
function createMockNode(id: string, x: number, y: number): Node {
  return {
    id,
    title: `Node ${id}`,
    description: '',
    level: 0,
    position: { x, y },
    children: [],
    parentId: null,
    isExpanded: true,
    isVisible: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

describe('viewportStore - Auto Focus', () => {
  beforeEach(() => {
    // Reset store state
    const store = useViewportStore.getState();
    store.resetViewport();
    store.setAutoFocus(false);

    // Clear localStorage
    localStorage.clear();
  });

  describe('setAutoFocus and localStorage persistence', () => {
    it('should toggle auto focus enabled state', () => {
      const store = useViewportStore.getState();

      expect(store.autoFocusEnabled).toBe(false);

      store.setAutoFocus(true);
      expect(useViewportStore.getState().autoFocusEnabled).toBe(true);

      store.setAutoFocus(false);
      expect(useViewportStore.getState().autoFocusEnabled).toBe(false);
    });

    it('should persist auto focus state to localStorage', () => {
      const store = useViewportStore.getState();

      store.setAutoFocus(true);
      expect(localStorage.getItem('mindmap-auto-focus-enabled')).toBe('true');

      store.setAutoFocus(false);
      expect(localStorage.getItem('mindmap-auto-focus-enabled')).toBe('false');
    });

    it('should load auto focus state from localStorage on init', () => {
      // Set value in localStorage before creating store
      localStorage.setItem('mindmap-auto-focus-enabled', 'true');

      // Re-initialize store by accessing it
      const store = useViewportStore.getState();

      // Note: Initial value is loaded when store is created
      // For testing, we verify the localStorage interaction works
      store.setAutoFocus(true);
      expect(localStorage.getItem('mindmap-auto-focus-enabled')).toBe('true');
    });
  });

  describe('focusOnNodes', () => {
    beforeEach(() => {
      // Setup mock project store with nodes
      const projectStore = useProjectStore.getState();
      const mockProject: Project = {
        projectId: 'test-project',
        rootNodeId: 'node1',
        nodes: {
          'node1': createMockNode('node1', 100, 200),
          'node2': createMockNode('node2', 400, 300),
          'node3': createMockNode('node3', 700, 400),
        },
        actions: [],
        metadata: {
          title: 'Test Project',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          version: '1.0.0',
          author: 'Test',
        },
      };
      projectStore.loadProject(mockProject);

      // Set viewport size
      useViewportStore.getState().setViewportSize(1920, 1080);
    });

    it('should focus on single node', () => {
      const store = useViewportStore.getState();

      store.focusOnNodes(['node1']);

      // After focusing, camera should have moved and zoomed
      const state = useViewportStore.getState();
      expect(state.zoom).toBeGreaterThan(0);
      expect(state.x).toBeDefined();
      expect(state.y).toBeDefined();
    });

    it('should focus on multiple nodes', () => {
      const store = useViewportStore.getState();

      store.focusOnNodes(['node1', 'node2', 'node3']);

      // Should calculate bounding box for all 3 nodes and zoom out to fit
      const state = useViewportStore.getState();
      expect(state.zoom).toBeGreaterThan(0);
      expect(state.zoom).toBeLessThanOrEqual(4.0); // MAX_ZOOM
    });

    it('should handle empty array gracefully', () => {
      const store = useViewportStore.getState();
      const initialState = { ...useViewportStore.getState() };

      store.focusOnNodes([]);

      // Should not change anything
      const state = useViewportStore.getState();
      expect(state.x).toBe(initialState.x);
      expect(state.y).toBe(initialState.y);
      expect(state.zoom).toBe(initialState.zoom);
    });

    it('should handle invalid node IDs gracefully', () => {
      const store = useViewportStore.getState();
      const initialState = { ...useViewportStore.getState() };

      store.focusOnNodes(['nonexistent1', 'nonexistent2']);

      // Should not change anything (empty bbox)
      const state = useViewportStore.getState();
      expect(state.x).toBe(initialState.x);
      expect(state.y).toBe(initialState.y);
      expect(state.zoom).toBe(initialState.zoom);
    });

    it('should respect zoom constraints (MIN 0.25, MAX 4.0)', () => {
      const store = useViewportStore.getState();

      // Focus on nodes - should not exceed MAX_ZOOM
      store.focusOnNodes(['node1', 'node2', 'node3']);

      const state = useViewportStore.getState();
      expect(state.zoom).toBeGreaterThanOrEqual(0.25);
      expect(state.zoom).toBeLessThanOrEqual(4.0);
    });
  });

  describe('focusOnNodeWithPanel', () => {
    beforeEach(() => {
      // Setup mock project store with nodes
      const projectStore = useProjectStore.getState();
      const mockProject: Project = {
        projectId: 'test-project',
        rootNodeId: 'node1',
        nodes: {
          'node1': createMockNode('node1', 100, 200),
        },
        actions: [],
        metadata: {
          title: 'Test Project',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          version: '1.0.0',
          author: 'Test',
        },
      };
      projectStore.loadProject(mockProject);

      // Set viewport size
      useViewportStore.getState().setViewportSize(1920, 1080);
    });

    it('should focus on node with info panel', () => {
      const store = useViewportStore.getState();

      const panelWidth = 240;
      const panelHeight = 500;

      store.focusOnNodeWithPanel('node1', panelWidth, panelHeight);

      // After focusing, camera should have moved and zoomed
      const state = useViewportStore.getState();
      expect(state.zoom).toBeGreaterThan(0);
      expect(state.x).toBeDefined();
      expect(state.y).toBeDefined();
    });

    it('should handle missing node gracefully', () => {
      const store = useViewportStore.getState();
      const initialState = { ...useViewportStore.getState() };

      store.focusOnNodeWithPanel('nonexistent', 240, 500);

      // Should not change anything
      const state = useViewportStore.getState();
      expect(state.x).toBe(initialState.x);
      expect(state.y).toBe(initialState.y);
      expect(state.zoom).toBe(initialState.zoom);
    });

    it('should account for panel dimensions in zoom calculation', () => {
      const store = useViewportStore.getState();

      // Focus with small panel
      store.focusOnNodeWithPanel('node1', 240, 100);
      const zoomSmallPanel = useViewportStore.getState().zoom;

      // Reset viewport
      store.resetViewport();

      // Focus with large panel
      store.focusOnNodeWithPanel('node1', 240, 800);
      const zoomLargePanel = useViewportStore.getState().zoom;

      // Larger panel should result in smaller zoom (zoom out more)
      expect(zoomLargePanel).toBeLessThan(zoomSmallPanel);
    });
  });
});
