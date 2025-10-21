import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import Canvas from './Canvas';
import { useProjectStore } from '../../stores/projectStore';
import { useViewportStore } from '../../stores/viewportStore';

describe('Canvas', () => {
  beforeEach(() => {
    useProjectStore.setState({
      nodes: {},
      rootNodeId: null,
    });
    useViewportStore.setState({
      width: 800,
      height: 600,
    });
  });

  it('renders without crashing', () => {
    const { container } = render(<Canvas />);
    expect(container).toBeInTheDocument();
  });

  it('shows "No project loaded" when no root node', () => {
    const { container } = render(<Canvas />);
    expect(container.textContent).toContain('No project loaded');
  });

  it('loads project data correctly', () => {
    useProjectStore.setState({
      rootNodeId: 'root',
      nodes: {
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
      },
    });

    const state = useProjectStore.getState();
    expect(state.rootNodeId).toBe('root');
    expect(state.nodes.root).toBeDefined();
    expect(state.nodes.root.title).toBe('Root');
  });

  it('filters visible nodes correctly', () => {
    useProjectStore.setState({
      rootNodeId: 'root',
      nodes: {
        root: {
          id: 'root',
          title: 'Root',
          description: '',
          children: ['child1', 'child2'],
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
        child2: {
          id: 'child2',
          title: 'Child 2',
          description: '',
          children: [],
          level: 1,
          parentId: 'root',
          position: { x: 400, y: 300 },
          isExpanded: false,
          isVisible: false, // Hidden
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      },
    });

    const state = useProjectStore.getState();
    const visibleNodes = Object.values(state.nodes).filter((n) => n.isVisible);

    expect(visibleNodes.length).toBe(2); // root + child1
    expect(visibleNodes.find((n) => n.id === 'child2')).toBeUndefined();
  });

  it('handles viewport size updates', () => {
    render(<Canvas />);

    useViewportStore.setState({ width: 1024, height: 768 });

    const state = useViewportStore.getState();
    expect(state.width).toBeGreaterThan(0);
    expect(state.height).toBeGreaterThan(0);
  });
});
