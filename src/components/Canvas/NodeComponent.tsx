/**
 * Node Component - Konva
 * Renders individual mind map node with title and expand button
 * Optimized with React.memo for performance
 */

import { useEffect, useRef, useCallback, memo } from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import { Node } from '../../types/node';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import Konva from 'konva';

interface NodeComponentProps {
  node: Node;
  isSelected: boolean;
  isFocused: boolean;
  isBlurred: boolean;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const NODE_PADDING = 12;
const EXPAND_BUTTON_RADIUS = 8;

function NodeComponentInner({ node, isSelected, isFocused, isBlurred }: NodeComponentProps) {
  const toggleNodeExpansion = useProjectStore((state) => state.toggleNodeExpansion);
  const selectNode = useUIStore((state) => state.selectNode);
  const groupRef = useRef<Konva.Group>(null);

  const hasChildren = node.children.length > 0;

  // Animate node appearance on mount with smooth fade
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.to({
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1.2,
        easing: Konva.Easings.EaseOut,
      });
    }
  }, []);

  // Animate position changes with smooth easing
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.to({
        x: node.position.x,
        y: node.position.y,
        duration: 0.6,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [node.position.x, node.position.y]);

  // Animate visibility changes (appear/disappear smoothly)
  useEffect(() => {
    if (groupRef.current) {
      if (node.isVisible) {
        // Fade in when becoming visible
        const targetOpacity = isBlurred ? 0.3 : 1;
        groupRef.current.to({
          opacity: targetOpacity,
          scaleX: 1,
          scaleY: 1,
          duration: 1.2, // Smooth 1.2s fade in
          easing: Konva.Easings.EaseOut,
        });
      } else {
        // Fade out when becoming invisible
        groupRef.current.to({
          opacity: 0,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 1.0, // Smooth 1.0s fade out
          easing: Konva.Easings.EaseIn,
        });
      }
    }
  }, [node.isVisible, isBlurred]);

  // Animate focus/blur transitions
  useEffect(() => {
    if (groupRef.current && node.isVisible) {
      const targetOpacity = isBlurred ? 0.3 : 1;
      groupRef.current.to({
        opacity: targetOpacity,
        duration: 0.5,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [isBlurred, node.isVisible]);

  const handleClick = useCallback(() => {
    selectNode(node.id);
  }, [selectNode, node.id]);

  const handleExpandClick = useCallback((e: any) => {
    e.cancelBubble = true; // Prevent node selection
    toggleNodeExpansion(node.id);
  }, [toggleNodeExpansion, node.id]);

  
  return (
    <Group
      ref={groupRef}
      x={node.position.x}
      y={node.position.y}
      opacity={isBlurred ? 0.3 : 0}
      scaleX={0.95}
      scaleY={0.95}
      onClick={handleClick}
    >
      {/* Glow effect for focused node */}
      {isFocused && (
        <Rect
          width={NODE_WIDTH + 16}
          height={NODE_HEIGHT + 16}
          x={-8}
          y={-8}
          fill="transparent"
          cornerRadius={12}
          shadowColor="#fb923c"
          shadowBlur={25}
          shadowOpacity={0.6}
          shadowEnabled={true}
        />
      )}

      {/* Node background */}
      <Rect
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        fill="white"
        cornerRadius={8}
        shadowColor={isFocused ? 'rgba(251, 146, 60, 0.3)' : 'rgba(0, 0, 0, 0.1)'}
        shadowBlur={isFocused ? 20 : 10}
        shadowOffsetY={isFocused ? 4 : 2}
        stroke={isSelected ? '#fb923c' : (isFocused ? '#fb923c' : '#e5e7eb')}
        strokeWidth={isSelected || isFocused ? 2 : 1}
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

// Memoized component - only re-renders when props change
const NodeComponent = memo(NodeComponentInner, (prevProps, nextProps) => {
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.node.title === nextProps.node.title &&
    prevProps.node.position.x === nextProps.node.position.x &&
    prevProps.node.position.y === nextProps.node.position.y &&
    prevProps.node.isVisible === nextProps.node.isVisible &&
    prevProps.node.isExpanded === nextProps.node.isExpanded &&
    prevProps.node.children.length === nextProps.node.children.length &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.isBlurred === nextProps.isBlurred
  );
});

export default NodeComponent;
