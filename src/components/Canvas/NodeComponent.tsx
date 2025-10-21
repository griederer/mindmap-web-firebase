/**
 * Node Component - Konva
 * Renders individual mind map node with title and expand button
 */

import { useEffect, useRef } from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import { Node } from '../../types/node';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import Konva from 'konva';

interface NodeComponentProps {
  node: Node;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const NODE_PADDING = 12;
const EXPAND_BUTTON_RADIUS = 8;

export default function NodeComponent({ node }: NodeComponentProps) {
  const { toggleNodeExpansion } = useProjectStore();
  const { selectedNodeId, selectNode } = useUIStore();
  const groupRef = useRef<Konva.Group>(null);

  const isSelected = selectedNodeId === node.id;
  const hasChildren = node.children.length > 0;

  // Animate node appearance
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.to({
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 0.3,
        easing: Konva.Easings.EaseOut,
      });
    }
  }, []);
  
  const handleClick = () => {
    selectNode(node.id);
  };
  
  const handleExpandClick = (e: any) => {
    e.cancelBubble = true; // Prevent node selection
    toggleNodeExpansion(node.id);
  };
  
  return (
    <Group
      ref={groupRef}
      x={node.position.x}
      y={node.position.y}
      opacity={0}
      scaleX={0.8}
      scaleY={0.8}
      onClick={handleClick}
    >
      {/* Node background */}
      <Rect
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        fill="white"
        cornerRadius={8}
        shadowColor="rgba(0, 0, 0, 0.1)"
        shadowBlur={10}
        shadowOffsetY={2}
        stroke={isSelected ? '#fb923c' : '#e5e7eb'}
        strokeWidth={isSelected ? 2 : 1}
      />
      
      {/* Node title */}
      <Text
        x={NODE_PADDING}
        y={NODE_PADDING}
        width={NODE_WIDTH - NODE_PADDING * 2 - (hasChildren ? 30 : 0)}
        height={NODE_HEIGHT - NODE_PADDING * 2}
        text={node.title}
        fontSize={14}
        fontFamily="system-ui, -apple-system, sans-serif"
        fill="#1f2937"
        verticalAlign="middle"
        wrap="word"
        ellipsis={true}
      />
      
      {/* Expand/collapse button */}
      {hasChildren && (
        <Group
          x={NODE_WIDTH - 24}
          y={NODE_HEIGHT / 2}
          onClick={handleExpandClick}
        >
          {/* Button background */}
          <Circle
            radius={EXPAND_BUTTON_RADIUS}
            fill={node.isExpanded ? '#fb923c' : '#f3f4f6'}
            stroke={node.isExpanded ? '#ea580c' : '#d1d5db'}
            strokeWidth={1}
          />
          
          {/* Plus/minus icon */}
          <Text
            x={-EXPAND_BUTTON_RADIUS}
            y={-EXPAND_BUTTON_RADIUS}
            width={EXPAND_BUTTON_RADIUS * 2}
            height={EXPAND_BUTTON_RADIUS * 2}
            text={node.isExpanded ? '−' : '+'}
            fontSize={12}
            fontFamily="system-ui"
            fill={node.isExpanded ? 'white' : '#6b7280'}
            align="center"
            verticalAlign="middle"
          />
        </Group>
      )}
      
      {/* Level indicator (visual debugging) */}
      {node.level > 0 && (
        <Text
          x={NODE_PADDING}
          y={NODE_HEIGHT - 18}
          text={`L${node.level}`}
          fontSize={10}
          fontFamily="monospace"
          fill="#9ca3af"
        />
      )}
    </Group>
  );
}
