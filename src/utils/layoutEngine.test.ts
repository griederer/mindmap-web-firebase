import { describe, it, expect } from 'vitest';
import { calculateLayout, getNodesBounds } from './layoutEngine';
import { Node, NodeId } from '../types/node';

describe('layoutEngine', () => {
  describe('calculateLayout', () => {
    it('positions root node at origin', () => {
      const nodes: Record<NodeId, Node> = {
        root: {
          id: 'root',
          title: 'Root',
          description: '',
          children: [],
          level: 0,
          parentId: null,
          position: { x: 0, y: 0 },
          isExpanded: true,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      };

      const { nodes: layoutedNodes } = calculateLayout(nodes, 'root');

      expect(layoutedNodes.root.position).toEqual({ x: 100, y: 300 });
    });

    it('positions children to the right of parent', () => {
      const nodes: Record<NodeId, Node> = {
        root: {
          id: 'root',
          title: 'Root',
          description: '',
          children: ['child1'],
          level: 0,
          parentId: null,
          position: { x: 0, y: 0 },
          isExpanded: true,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        child1: {
          id: 'child1',
          title: 'Child 1',
          description: '',
          children: [],
          level: 1,
          parentId: 'root',
          position: { x: 0, y: 0 },
          isExpanded: false,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      };

      const { nodes: layoutedNodes } = calculateLayout(nodes, 'root');

      expect(layoutedNodes.child1.position.x).toBeGreaterThan(
        layoutedNodes.root.position.x
      );
    });

    it('centers children vertically around parent', () => {
      const nodes: Record<NodeId, Node> = {
        root: {
          id: 'root',
          title: 'Root',
          description: '',
          children: ['child1', 'child2', 'child3'],
          level: 0,
          parentId: null,
          position: { x: 0, y: 0 },
          isExpanded: true,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        child1: {
          id: 'child1',
          title: 'Child 1',
          description: '',
          children: [],
          level: 1,
          parentId: 'root',
          position: { x: 0, y: 0 },
          isExpanded: false,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        child2: {
          id: 'child2',
          title: 'Child 2',
          description: '',
          children: [],
          level: 1,
          parentId: 'root',
          position: { x: 0, y: 0 },
          isExpanded: false,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        child3: {
          id: 'child3',
          title: 'Child 3',
          description: '',
          children: [],
          level: 1,
          parentId: 'root',
          position: { x: 0, y: 0 },
          isExpanded: false,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      };

      const { nodes: layoutedNodes } = calculateLayout(nodes, 'root');

      // Middle child should be at same Y as root
      const rootY = layoutedNodes.root.position.y;
      const child2Y = layoutedNodes.child2.position.y;

      expect(Math.abs(child2Y - rootY)).toBeLessThan(50);
    });

    it('handles nested children recursively', () => {
      const nodes: Record<NodeId, Node> = {
        root: {
          id: 'root',
          title: 'Root',
          description: '',
          children: ['child1'],
          level: 0,
          parentId: null,
          position: { x: 0, y: 0 },
          isExpanded: true,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        child1: {
          id: 'child1',
          title: 'Child 1',
          description: '',
          children: ['grandchild1'],
          level: 1,
          parentId: 'root',
          position: { x: 0, y: 0 },
          isExpanded: true,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        grandchild1: {
          id: 'grandchild1',
          title: 'Grandchild 1',
          description: '',
          children: [],
          level: 2,
          parentId: 'child1',
          position: { x: 0, y: 0 },
          isExpanded: false,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      };

      const { nodes: layoutedNodes } = calculateLayout(nodes, 'root');

      expect(layoutedNodes.grandchild1.position.x).toBeGreaterThan(
        layoutedNodes.child1.position.x
      );
    });
  });

  describe('getNodesBounds', () => {
    it('returns zero bounds for no nodes', () => {
      const bounds = getNodesBounds({});

      expect(bounds).toEqual({
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0,
        width: 0,
        height: 0,
      });
    });

    it('calculates bounds for single node', () => {
      const nodes: Record<NodeId, Node> = {
        root: {
          id: 'root',
          title: 'Root',
          description: '',
          children: [],
          level: 0,
          parentId: null,
          position: { x: 100, y: 300 },
          isExpanded: true,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      };

      const bounds = getNodesBounds(nodes);

      expect(bounds.minX).toBe(100);
      expect(bounds.minY).toBe(300);
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('calculates bounds for multiple nodes', () => {
      const nodes: Record<NodeId, Node> = {
        root: {
          id: 'root',
          title: 'Root',
          description: '',
          children: [],
          level: 0,
          parentId: null,
          position: { x: 100, y: 300 },
          isExpanded: true,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        child1: {
          id: 'child1',
          title: 'Child 1',
          description: '',
          children: [],
          level: 1,
          parentId: 'root',
          position: { x: 400, y: 200 },
          isExpanded: false,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      };

      const bounds = getNodesBounds(nodes);

      expect(bounds.minX).toBe(100);
      expect(bounds.minY).toBe(200);
      expect(bounds.width).toBeGreaterThan(300);
    });

    it('ignores invisible nodes', () => {
      const nodes: Record<NodeId, Node> = {
        visible: {
          id: 'visible',
          title: 'Visible',
          description: '',
          children: [],
          level: 0,
          parentId: null,
          position: { x: 100, y: 300 },
          isExpanded: true,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        hidden: {
          id: 'hidden',
          title: 'Hidden',
          description: '',
          children: [],
          level: 1,
          parentId: 'visible',
          position: { x: 1000, y: 1000 },
          isExpanded: false,
          isVisible: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      };

      const bounds = getNodesBounds(nodes);

      expect(bounds.maxX).toBeLessThan(1000);
      expect(bounds.maxY).toBeLessThan(1000);
    });
  });
});
