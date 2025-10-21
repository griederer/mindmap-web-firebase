import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Stage, Layer } from 'react-konva';
import Connector from './Connector';
import { Node } from '../../types/node';

const fromNode: Node = {
  id: 'parent',
  title: 'Parent',
  description: '',
  children: ['child'],
  level: 0,
  parentId: null,
  position: { x: 100, y: 300 },
  isExpanded: true,
  isVisible: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const toNode: Node = {
  id: 'child',
  title: 'Child',
  description: '',
  children: [],
  level: 1,
  parentId: 'parent',
  position: { x: 400, y: 300 },
  isExpanded: false,
  isVisible: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe('Connector', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Stage width={800} height={600}>
        <Layer>
          <Connector fromNode={fromNode} toNode={toNode} />
        </Layer>
      </Stage>
    );
    expect(container).toBeInTheDocument();
  });

  it('renders connector between horizontal nodes', () => {
    const { container } = render(
      <Stage width={800} height={600}>
        <Layer>
          <Connector fromNode={fromNode} toNode={toNode} />
        </Layer>
      </Stage>
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders connector between vertical nodes', () => {
    const verticalToNode: Node = {
      ...toNode,
      position: { x: 400, y: 500 },
    };

    const { container } = render(
      <Stage width={800} height={600}>
        <Layer>
          <Connector fromNode={fromNode} toNode={verticalToNode} />
        </Layer>
      </Stage>
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders connector with different positions', () => {
    const customFromNode: Node = {
      ...fromNode,
      position: { x: 50, y: 100 },
    };

    const customToNode: Node = {
      ...toNode,
      position: { x: 700, y: 400 },
    };

    const { container } = render(
      <Stage width={800} height={600}>
        <Layer>
          <Connector fromNode={customFromNode} toNode={customToNode} />
        </Layer>
      </Stage>
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});
