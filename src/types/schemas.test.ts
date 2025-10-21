import { describe, it, expect } from 'vitest';
import {
  NodeSchema,
  ActionSchema,
  ProjectSchema,
  ExpandActionSchema,
  ZoomActionSchema,
} from './schemas';

describe('NodeSchema', () => {
  it('validates a valid node', () => {
    const validNode = {
      id: 'node-1',
      title: 'Test Node',
      description: 'A test node',
      children: ['child-1', 'child-2'],
      level: 0,
      parentId: null,
      position: { x: 100, y: 200 },
      isExpanded: true,
      isVisible: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    expect(() => NodeSchema.parse(validNode)).not.toThrow();
  });

  it('rejects node with empty title', () => {
    const invalidNode = {
      id: 'node-1',
      title: '',
      description: 'Test',
      children: [],
      level: 0,
      parentId: null,
      position: { x: 0, y: 0 },
      isExpanded: false,
      isVisible: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    expect(() => NodeSchema.parse(invalidNode)).toThrow();
  });

  it('rejects node with negative level', () => {
    const invalidNode = {
      id: 'node-1',
      title: 'Test',
      description: 'Test',
      children: [],
      level: -1,
      parentId: null,
      position: { x: 0, y: 0 },
      isExpanded: false,
      isVisible: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    expect(() => NodeSchema.parse(invalidNode)).toThrow();
  });
});

describe('ActionSchema', () => {
  it('validates expand action', () => {
    const expandAction = {
      id: 'action-1',
      type: 'expand' as const,
      nodeId: 'node-1',
      timestamp: Date.now(),
    };

    expect(() => ExpandActionSchema.parse(expandAction)).not.toThrow();
    expect(() => ActionSchema.parse(expandAction)).not.toThrow();
  });

  it('validates zoom action with optional fields', () => {
    const zoomAction = {
      id: 'action-2',
      type: 'zoom' as const,
      level: 1.5,
      targetX: 100,
      targetY: 200,
      timestamp: Date.now(),
    };

    expect(() => ZoomActionSchema.parse(zoomAction)).not.toThrow();
    expect(() => ActionSchema.parse(zoomAction)).not.toThrow();
  });

  it('rejects zoom action with negative level', () => {
    const invalidZoom = {
      id: 'action-3',
      type: 'zoom' as const,
      level: -1,
      timestamp: Date.now(),
    };

    expect(() => ZoomActionSchema.parse(invalidZoom)).toThrow();
  });

  it('rejects action with invalid type', () => {
    const invalidAction = {
      id: 'action-4',
      type: 'invalid-type',
      timestamp: Date.now(),
    };

    expect(() => ActionSchema.parse(invalidAction)).toThrow();
  });
});

describe('ProjectSchema', () => {
  it('validates a complete project', () => {
    const validProject = {
      projectId: 'proj-1',
      metadata: {
        title: 'Test Project',
        description: 'A test project',
        author: 'Test Author',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: '1.0.0',
        tags: ['test', 'demo'],
      },
      nodes: {
        'node-1': {
          id: 'node-1',
          title: 'Root',
          description: 'Root node',
          children: [],
          level: 0,
          parentId: null,
          position: { x: 0, y: 0 },
          isExpanded: true,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      },
      rootNodeId: 'node-1',
      actions: [],
      settings: {
        defaultZoom: 1,
        theme: 'light' as const,
      },
    };

    expect(() => ProjectSchema.parse(validProject)).not.toThrow();
  });

  it('rejects project with invalid version format', () => {
    const invalidProject = {
      projectId: 'proj-2',
      metadata: {
        title: 'Test',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: 'invalid-version',
      },
      nodes: {},
      rootNodeId: 'root',
      actions: [],
    };

    expect(() => ProjectSchema.parse(invalidProject)).toThrow();
  });

  it('validates project with minimal metadata', () => {
    const minimalProject = {
      projectId: 'proj-3',
      metadata: {
        title: 'Minimal',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: '1.0.0',
      },
      nodes: {},
      rootNodeId: 'root',
      actions: [],
    };

    expect(() => ProjectSchema.parse(minimalProject)).not.toThrow();
  });
});
