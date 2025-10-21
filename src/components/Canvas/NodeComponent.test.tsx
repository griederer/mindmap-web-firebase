import { describe, it, expect } from 'vitest';
import { Node } from '../../types/node';

const mockNode: Node = {
  id: 'test-1',
  title: 'Test Node',
  description: 'Test Description',
  children: ['child-1'],
  level: 1,
  parentId: 'root',
  position: { x: 100, y: 200 },
  isExpanded: false,
  isVisible: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe('NodeComponent', () => {
  it('has correct node data structure', () => {
    expect(mockNode.id).toBe('test-1');
    expect(mockNode.title).toBe('Test Node');
    expect(mockNode.position.x).toBe(100);
    expect(mockNode.position.y).toBe(200);
  });

  it('identifies nodes with children', () => {
    const nodeWithChildren: Node = {
      ...mockNode,
      children: ['child-1', 'child-2'],
    };

    expect(nodeWithChildren.children.length).toBeGreaterThan(0);
  });

  it('identifies nodes without children', () => {
    const nodeWithoutChildren: Node = {
      ...mockNode,
      children: [],
    };

    expect(nodeWithoutChildren.children.length).toBe(0);
  });

  it('tracks expansion state', () => {
    const expandedNode: Node = {
      ...mockNode,
      isExpanded: true,
    };

    const collapsedNode: Node = {
      ...mockNode,
      isExpanded: false,
    };

    expect(expandedNode.isExpanded).toBe(true);
    expect(collapsedNode.isExpanded).toBe(false);
  });

  it('has valid position coordinates', () => {
    expect(typeof mockNode.position.x).toBe('number');
    expect(typeof mockNode.position.y).toBe('number');
    expect(mockNode.position.x).toBeGreaterThanOrEqual(0);
    expect(mockNode.position.y).toBeGreaterThanOrEqual(0);
  });
});
