/**
 * Auto Focus Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateBoundingBox,
  calculateOptimalZoom,
  calculateCameraPosition,
  calculateBoundingBoxWithPanel,
  AUTO_FOCUS_CONSTANTS,
  type BoundingBox,
  type ViewportDimensions,
} from './autoFocusUtils';
import { Node } from '../types/node';

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

describe('autoFocusUtils', () => {
  describe('calculateBoundingBox', () => {
    it('should return empty bounding box for empty array', () => {
      const bbox = calculateBoundingBox({}, []);
      expect(bbox).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    });

    it('should calculate bounding box for single node with padding', () => {
      const nodes = {
        'node1': createMockNode('node1', 100, 200),
      };

      const bbox = calculateBoundingBox(nodes, ['node1']);

      // Expected: node at (100, 200), size 200x60, padding 100
      // minX = 100 - 100 = 0
      // minY = 200 - 100 = 100
      // maxX = 100 + 200 = 300, width = 300 - 100 + 200 = 400
      // maxY = 200 + 60 = 260, height = 260 - 200 + 200 = 260
      expect(bbox.x).toBe(0);
      expect(bbox.y).toBe(100);
      expect(bbox.width).toBe(400);
      expect(bbox.height).toBe(260);
    });

    it('should calculate bounding box for multiple nodes', () => {
      const nodes = {
        'node1': createMockNode('node1', 0, 0),
        'node2': createMockNode('node2', 300, 100),
        'node3': createMockNode('node3', 600, 200),
      };

      const bbox = calculateBoundingBox(nodes, ['node1', 'node2', 'node3']);

      // minX = 0, minY = 0
      // maxX = 600 + 200 = 800, maxY = 200 + 60 = 260
      // With padding: x = -100, y = -100, width = 1000, height = 460
      expect(bbox.x).toBe(-100);
      expect(bbox.y).toBe(-100);
      expect(bbox.width).toBe(1000);
      expect(bbox.height).toBe(460);
    });

    it('should handle missing nodes gracefully', () => {
      const nodes = {
        'node1': createMockNode('node1', 100, 200),
      };

      const bbox = calculateBoundingBox(nodes, ['node1', 'nonexistent', 'node2']);

      // Should calculate based only on node1
      expect(bbox.x).toBe(0);
      expect(bbox.y).toBe(100);
      expect(bbox.width).toBe(400);
      expect(bbox.height).toBe(260);
    });

    it('should return empty bbox when all nodeIds are invalid', () => {
      const bbox = calculateBoundingBox({}, ['nonexistent1', 'nonexistent2']);
      expect(bbox).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    });
  });

  describe('calculateOptimalZoom', () => {
    it('should return 1 for empty bounding box', () => {
      const viewport: ViewportDimensions = { width: 1920, height: 1080 };
      const bbox: BoundingBox = { x: 0, y: 0, width: 0, height: 0 };

      const zoom = calculateOptimalZoom(bbox, viewport);
      expect(zoom).toBe(1);
    });

    it('should calculate zoom to fit content horizontally', () => {
      const viewport: ViewportDimensions = { width: 1920, height: 1080 };
      const bbox: BoundingBox = { x: 0, y: 0, width: 2000, height: 500 };

      const zoom = calculateOptimalZoom(bbox, viewport);

      // zoomX = (1920 / 2000) * 0.9 = 0.864
      // zoomY = (1080 / 500) * 0.9 = 1.944
      // Should use smaller (zoomX)
      expect(zoom).toBeCloseTo(0.864, 2);
    });

    it('should calculate zoom to fit content vertically', () => {
      const viewport: ViewportDimensions = { width: 1920, height: 1080 };
      const bbox: BoundingBox = { x: 0, y: 0, width: 500, height: 2000 };

      const zoom = calculateOptimalZoom(bbox, viewport);

      // zoomX = (1920 / 500) * 0.9 = 3.456
      // zoomY = (1080 / 2000) * 0.9 = 0.486
      // Should use smaller (zoomY)
      expect(zoom).toBeCloseTo(0.486, 2);
    });

    it('should clamp zoom to MIN_ZOOM (0.25)', () => {
      const viewport: ViewportDimensions = { width: 1920, height: 1080 };
      const bbox: BoundingBox = { x: 0, y: 0, width: 20000, height: 20000 };

      const zoom = calculateOptimalZoom(bbox, viewport);

      // Calculated zoom would be very small, should clamp to MIN_ZOOM
      expect(zoom).toBe(AUTO_FOCUS_CONSTANTS.MIN_ZOOM);
    });

    it('should clamp zoom to MAX_ZOOM (4.0)', () => {
      const viewport: ViewportDimensions = { width: 1920, height: 1080 };
      const bbox: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };

      const zoom = calculateOptimalZoom(bbox, viewport);

      // Calculated zoom would be > 4.0, should clamp to MAX_ZOOM
      expect(zoom).toBe(AUTO_FOCUS_CONSTANTS.MAX_ZOOM);
    });

    it('should apply COMFORT_FACTOR for breathing room', () => {
      const viewport: ViewportDimensions = { width: 1000, height: 1000 };
      const bbox: BoundingBox = { x: 0, y: 0, width: 1000, height: 1000 };

      const zoom = calculateOptimalZoom(bbox, viewport);

      // Without comfort factor: zoom = 1.0
      // With comfort factor (0.9): zoom = 0.9
      expect(zoom).toBe(0.9);
    });
  });

  describe('calculateCameraPosition', () => {
    it('should center content in viewport', () => {
      const viewport: ViewportDimensions = { width: 1920, height: 1080 };
      const bbox: BoundingBox = { x: 0, y: 0, width: 400, height: 260 };
      const zoom = 1;

      const camera = calculateCameraPosition(bbox, zoom, viewport);

      // Content center: (200, 130)
      // Viewport center: (960, 540)
      // Camera: (960 - 200, 540 - 130) = (760, 410)
      expect(camera.x).toBe(760);
      expect(camera.y).toBe(410);
    });

    it('should account for zoom level in positioning', () => {
      const viewport: ViewportDimensions = { width: 1920, height: 1080 };
      const bbox: BoundingBox = { x: 0, y: 0, width: 400, height: 260 };
      const zoom = 2;

      const camera = calculateCameraPosition(bbox, zoom, viewport);

      // Content center: (200, 130)
      // With zoom 2: (960 - 200*2, 540 - 130*2) = (560, 280)
      expect(camera.x).toBe(560);
      expect(camera.y).toBe(280);
    });

    it('should center negative coordinates correctly', () => {
      const viewport: ViewportDimensions = { width: 1920, height: 1080 };
      const bbox: BoundingBox = { x: -100, y: -100, width: 1000, height: 460 };
      const zoom = 1;

      const camera = calculateCameraPosition(bbox, zoom, viewport);

      // Content center: (-100 + 500, -100 + 230) = (400, 130)
      // Camera: (960 - 400, 540 - 130) = (560, 410)
      expect(camera.x).toBe(560);
      expect(camera.y).toBe(410);
    });
  });

  describe('calculateBoundingBoxWithPanel', () => {
    it('should return empty bbox for missing node', () => {
      const bbox = calculateBoundingBoxWithPanel({}, 'nonexistent', 240, 500);
      expect(bbox).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    });

    it('should include both node and panel in bounding box', () => {
      const nodes = {
        'node1': createMockNode('node1', 100, 200),
      };

      const panelWidth = 240;
      const panelHeight = 400;

      const bbox = calculateBoundingBoxWithPanel(nodes, 'node1', panelWidth, panelHeight);

      // Node: x=100, y=200, width=200, height=60
      // Panel: x=100+200+20=320, y=200, width=240, height=400
      // minX = 100, maxX = 320+240=560
      // minY = 200, maxY = max(200+60, 200+400) = 600
      // With padding: x=-0, y=100, width=660, height=600
      expect(bbox.x).toBe(0);  // 100 - 100
      expect(bbox.y).toBe(100); // 200 - 100
      expect(bbox.width).toBe(660); // (560-100) + 200
      expect(bbox.height).toBe(600); // (600-200) + 200
    });

    it('should handle panel taller than node', () => {
      const nodes = {
        'node1': createMockNode('node1', 0, 0),
      };

      const panelWidth = 240;
      const panelHeight = 800; // Much taller than node (60px)

      const bbox = calculateBoundingBoxWithPanel(nodes, 'node1', panelWidth, panelHeight);

      // maxY should be determined by panel height
      expect(bbox.height).toBe(1000); // 800 + 200 padding
    });

    it('should handle panel shorter than node', () => {
      const nodes = {
        'node1': createMockNode('node1', 0, 0),
      };

      const panelWidth = 240;
      const panelHeight = 20; // Shorter than node (60px)

      const bbox = calculateBoundingBoxWithPanel(nodes, 'node1', panelWidth, panelHeight);

      // maxY should be determined by node height
      expect(bbox.height).toBe(260); // 60 + 200 padding
    });
  });
});
