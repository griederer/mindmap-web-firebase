/**
 * Tests for Canvas Performance Optimization Utilities
 */

import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import Konva from 'konva';
import {
  setupViewportCulling,
  cacheComplexNode,
  clearNodeCache,
  disableShadowsDuringAnimation,
  enableShadowsAfterAnimation,
  getCachedNodeCount,
} from './canvasOptimizer';
import { Node } from '../../types/node';

describe('canvasOptimizer', () => {
  describe('setupViewportCulling', () => {
    let mockStage: Konva.Stage;
    let nodes: Node[];

    beforeEach(() => {
      // Create a mock stage
      mockStage = {
        width: vi.fn(() => 1920),
        height: vi.fn(() => 1080),
        scaleX: vi.fn(() => 1),
        position: vi.fn(() => ({ x: 0, y: 0 })),
      } as unknown as Konva.Stage;

      // Create test nodes at various positions
      nodes = [
        { id: 'node1', position: { x: 100, y: 100 }, title: 'Node 1', description: '', children: [], level: 0, parentId: null, isExpanded: true, isVisible: true, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 'node2', position: { x: 3000, y: 100 }, title: 'Node 2', description: '', children: [], level: 0, parentId: null, isExpanded: true, isVisible: true, createdAt: Date.now(), updatedAt: Date.now() }, // Outside viewport (right)
        { id: 'node3', position: { x: 500, y: 500 }, title: 'Node 3', description: '', children: [], level: 0, parentId: null, isExpanded: true, isVisible: true, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 'node4', position: { x: 100, y: 2000 }, title: 'Node 4', description: '', children: [], level: 0, parentId: null, isExpanded: true, isVisible: true, createdAt: Date.now(), updatedAt: Date.now() }, // Outside viewport (bottom)
        { id: 'node5', position: { x: -1000, y: 100 }, title: 'Node 5', description: '', children: [], level: 0, parentId: null, isExpanded: true, isVisible: true, createdAt: Date.now(), updatedAt: Date.now() }, // Outside viewport (left)
      ];
    });

    it('should return all nodes when viewport covers all nodes', () => {
      const visibleNodes = setupViewportCulling(mockStage, nodes);

      // With default buffer of 500px, nodes at 100, 500 should be visible
      // Node at 2000 and 2000 should be outside even with buffer
      expect(visibleNodes.length).toBeGreaterThan(0);
      expect(visibleNodes.some(n => n.id === 'node1')).toBe(true);
      expect(visibleNodes.some(n => n.id === 'node3')).toBe(true);
    });

    it('should filter out nodes outside viewport bounds', () => {
      const visibleNodes = setupViewportCulling(mockStage, nodes);

      // Nodes at x=3000, y=2000 should be filtered out (outside 1920x1080 + 500px buffer)
      expect(visibleNodes.some(n => n.id === 'node2')).toBe(false);
      expect(visibleNodes.some(n => n.id === 'node4')).toBe(false);
      expect(visibleNodes.some(n => n.id === 'node5')).toBe(false);
    });

    it('should include nodes within custom buffer distance', () => {
      // Increase buffer to 3000px
      const visibleNodes = setupViewportCulling(mockStage, nodes, 3000);

      // Now nodes at x=3000, y=2000 should be visible with larger buffer
      expect(visibleNodes.some(n => n.id === 'node2')).toBe(true);
      expect(visibleNodes.some(n => n.id === 'node4')).toBe(true);
    });

    it('should account for viewport position offset', () => {
      // Move viewport to the right (x: -1000 means viewport shifted right by 1000px)
      (mockStage.position as Mock).mockReturnValue({ x: -1000, y: 0 });

      const visibleNodes = setupViewportCulling(mockStage, nodes);

      // Node1 at x=100 might now be outside on the left
      // Node2 at x=2000 might now be within range
      expect(visibleNodes.length).toBeGreaterThan(0);
    });

    it('should account for zoom level', () => {
      // Zoom out (scale 0.5 means viewport shows 2x the area)
      (mockStage.scaleX as Mock).mockReturnValue(0.5);

      const visibleNodes = setupViewportCulling(mockStage, nodes);

      // More nodes should be visible due to larger viewport
      expect(visibleNodes.length).toBeGreaterThanOrEqual(2);
    });

    it('should return empty array when no nodes in viewport', () => {
      // Move all nodes far outside viewport
      const farNodes: Node[] = [
        { id: 'far1', position: { x: 10000, y: 10000 }, title: 'Far 1', description: '', children: [], level: 0, parentId: null, isExpanded: true, isVisible: true, createdAt: Date.now(), updatedAt: Date.now() },
        { id: 'far2', position: { x: -10000, y: -10000 }, title: 'Far 2', description: '', children: [], level: 0, parentId: null, isExpanded: true, isVisible: true, createdAt: Date.now(), updatedAt: Date.now() },
      ];

      const visibleNodes = setupViewportCulling(mockStage, farNodes);

      expect(visibleNodes.length).toBe(0);
    });

    it('should return empty array for empty input', () => {
      const visibleNodes = setupViewportCulling(mockStage, []);

      expect(visibleNodes.length).toBe(0);
    });
  });

  describe('cacheComplexNode', () => {
    it('should cache node with more than 5 children', () => {
      const mockGroup = {
        getChildren: vi.fn(() => new Array(6).fill({})),
        cache: vi.fn(),
      } as unknown as Konva.Group;

      cacheComplexNode(mockGroup);

      expect(mockGroup.cache).toHaveBeenCalledWith({ pixelRatio: 1 });
    });

    it('should not cache node with 5 or fewer children', () => {
      const mockGroup = {
        getChildren: vi.fn(() => new Array(5).fill({})),
        cache: vi.fn(),
      } as unknown as Konva.Group;

      cacheComplexNode(mockGroup);

      expect(mockGroup.cache).not.toHaveBeenCalled();
    });

    it('should not cache node with no children', () => {
      const mockGroup = {
        getChildren: vi.fn(() => []),
        cache: vi.fn(),
      } as unknown as Konva.Group;

      cacheComplexNode(mockGroup);

      expect(mockGroup.cache).not.toHaveBeenCalled();
    });
  });

  describe('clearNodeCache', () => {
    it('should clear cache from node', () => {
      const mockGroup = {
        clearCache: vi.fn(),
      } as unknown as Konva.Group;

      clearNodeCache(mockGroup);

      expect(mockGroup.clearCache).toHaveBeenCalled();
    });
  });

  describe('disableShadowsDuringAnimation', () => {
    it('should disable shadows on all shapes in layer', () => {
      const mockShape1 = {
        shadowBlur: vi.fn(() => 10),
        shadowColor: vi.fn(() => '#000'),
        shadowOffsetX: vi.fn(() => 5),
        shadowOffsetY: vi.fn(() => 5),
        shadowOpacity: vi.fn(() => 0.5),
        shadowEnabled: vi.fn(() => true),
        setAttr: vi.fn(),
      };

      const mockShape2 = {
        shadowBlur: vi.fn(() => 8),
        shadowColor: vi.fn(() => '#333'),
        shadowOffsetX: vi.fn(() => 2),
        shadowOffsetY: vi.fn(() => 2),
        shadowOpacity: vi.fn(() => 0.3),
        shadowEnabled: vi.fn(() => true),
        setAttr: vi.fn(),
      };

      const mockLayer = {
        find: vi.fn(() => [mockShape1, mockShape2]),
        batchDraw: vi.fn(),
      } as unknown as Konva.Layer;

      disableShadowsDuringAnimation(mockLayer);

      // Verify shapes had shadow settings stored
      expect(mockShape1.setAttr).toHaveBeenCalledWith('_originalShadow', expect.any(Object));
      expect(mockShape2.setAttr).toHaveBeenCalledWith('_originalShadow', expect.any(Object));

      // Verify layer was redrawn
      expect(mockLayer.batchDraw).toHaveBeenCalled();
    });

    it('should handle layer with no shapes', () => {
      const mockLayer = {
        find: vi.fn(() => []),
        batchDraw: vi.fn(),
      } as unknown as Konva.Layer;

      disableShadowsDuringAnimation(mockLayer);

      expect(mockLayer.batchDraw).toHaveBeenCalled();
    });
  });

  describe('enableShadowsAfterAnimation', () => {
    it('should restore shadows on all shapes in layer', () => {
      const originalShadow = {
        shadowBlur: 10,
        shadowColor: '#000',
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        shadowOpacity: 0.5,
        shadowEnabled: true,
      };

      const mockShape = {
        getAttr: vi.fn(() => originalShadow),
        shadowBlur: vi.fn(),
        shadowColor: vi.fn(),
        shadowOffsetX: vi.fn(),
        shadowOffsetY: vi.fn(),
        shadowOpacity: vi.fn(),
        shadowEnabled: vi.fn(),
        setAttr: vi.fn(),
      };

      const mockLayer = {
        find: vi.fn(() => [mockShape]),
        batchDraw: vi.fn(),
      } as unknown as Konva.Layer;

      enableShadowsAfterAnimation(mockLayer);

      // Verify shadows were restored
      expect(mockShape.shadowBlur).toHaveBeenCalledWith(10);
      expect(mockShape.shadowColor).toHaveBeenCalledWith('#000');
      expect(mockShape.shadowOffsetX).toHaveBeenCalledWith(5);
      expect(mockShape.shadowOffsetY).toHaveBeenCalledWith(5);
      expect(mockShape.shadowOpacity).toHaveBeenCalledWith(0.5);
      expect(mockShape.shadowEnabled).toHaveBeenCalledWith(true);

      // Verify metadata was cleaned up
      expect(mockShape.setAttr).toHaveBeenCalledWith('_originalShadow', undefined);

      // Verify layer was redrawn
      expect(mockLayer.batchDraw).toHaveBeenCalled();
    });

    it('should handle shapes without stored shadow data', () => {
      const mockShape = {
        getAttr: vi.fn(() => undefined),
        shadowBlur: vi.fn(),
        setAttr: vi.fn(),
      };

      const mockLayer = {
        find: vi.fn(() => [mockShape]),
        batchDraw: vi.fn(),
      } as unknown as Konva.Layer;

      enableShadowsAfterAnimation(mockLayer);

      // Should not restore shadows if no data stored
      expect(mockShape.shadowBlur).not.toHaveBeenCalled();
      expect(mockLayer.batchDraw).toHaveBeenCalled();
    });
  });

  describe('getCachedNodeCount', () => {
    it('should count cached nodes in stage', () => {
      const mockGroup1 = { isCached: vi.fn(() => true) };
      const mockGroup2 = { isCached: vi.fn(() => false) };
      const mockGroup3 = { isCached: vi.fn(() => true) };

      const mockStage = {
        find: vi.fn(() => [mockGroup1, mockGroup2, mockGroup3]),
      } as unknown as Konva.Stage;

      const count = getCachedNodeCount(mockStage);

      expect(count).toBe(2);
    });

    it('should return 0 when no nodes are cached', () => {
      const mockGroup1 = { isCached: vi.fn(() => false) };
      const mockGroup2 = { isCached: vi.fn(() => false) };

      const mockStage = {
        find: vi.fn(() => [mockGroup1, mockGroup2]),
      } as unknown as Konva.Stage;

      const count = getCachedNodeCount(mockStage);

      expect(count).toBe(0);
    });

    it('should return 0 when no groups exist', () => {
      const mockStage = {
        find: vi.fn(() => []),
      } as unknown as Konva.Stage;

      const count = getCachedNodeCount(mockStage);

      expect(count).toBe(0);
    });
  });
});
