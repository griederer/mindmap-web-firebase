/**
 * Node Component - Konva
 * Renders individual mind map node with theme support
 * Supports chalkboard style with chalk-like text
 */

import { useEffect, useRef, useMemo } from 'react';
import { Group, Rect, Text, Circle, Line } from 'react-konva';
import { Node } from '../../types/node';
import { Theme } from '../../types/theme';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import Konva from 'konva';

interface NodeComponentProps {
  node: Node;
  theme: Theme;
  branchIndex?: number;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const NODE_PADDING = 12;
const EXPAND_BUTTON_RADIUS = 10;

// Generate sketchy rectangle points for hand-drawn effect
function getSketchyRectPoints(width: number, height: number, wobble: number = 3): number[] {
  const points: number[] = [];
  const segments = 20;

  // Top edge
  for (let i = 0; i <= segments; i++) {
    const x = (width / segments) * i;
    const y = Math.random() * wobble - wobble / 2;
    points.push(x, y);
  }

  // Right edge
  for (let i = 0; i <= segments; i++) {
    const x = width + Math.random() * wobble - wobble / 2;
    const y = (height / segments) * i;
    points.push(x, y);
  }

  // Bottom edge
  for (let i = segments; i >= 0; i--) {
    const x = (width / segments) * i;
    const y = height + Math.random() * wobble - wobble / 2;
    points.push(x, y);
  }

  // Left edge
  for (let i = segments; i >= 0; i--) {
    const x = Math.random() * wobble - wobble / 2;
    const y = (height / segments) * i;
    points.push(x, y);
  }

  return points;
}

export default function NodeComponent({ node, theme, branchIndex = 0 }: NodeComponentProps) {
  const { toggleNodeExpansion } = useProjectStore();
  const {
    selectedNodeId,
    selectNode,
    isFocusMode,
    focusedNodeId,
  } = useUIStore();
  const groupRef = useRef<Konva.Group>(null);

  const isSelected = selectedNodeId === node.id;
  const hasChildren = node.children.length > 0;
  const isFocused = focusedNodeId === node.id;
  const isBlurred = isFocusMode && !isFocused && node.isVisible;

  // Determine node color based on level and theme
  const nodeColor = useMemo(() => {
    if (node.level === 0) {
      return theme.colors.branchColors[0]; // Root uses first color
    }
    if (node.level === 1) {
      return theme.colors.branchColors[branchIndex % theme.colors.branchColors.length];
    }
    // Children inherit parent's branch color
    return theme.colors.branchColors[branchIndex % theme.colors.branchColors.length];
  }, [node.level, branchIndex, theme.colors.branchColors]);

  // Check if using chalkboard theme
  const isChalkboard = theme.effects.handDrawn;

  // Generate sketchy border for chalkboard style
  const sketchyPoints = useMemo(() => {
    if (!isChalkboard) return [];
    return getSketchyRectPoints(NODE_WIDTH, NODE_HEIGHT, 2);
  }, [isChalkboard]);

  // Animate node appearance on mount
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

  // Animate position changes
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

  // Animate visibility changes
  useEffect(() => {
    if (groupRef.current) {
      if (node.isVisible) {
        const targetOpacity = isBlurred ? 0.3 : 1;
        groupRef.current.to({
          opacity: targetOpacity,
          scaleX: 1,
          scaleY: 1,
          duration: 1.2,
          easing: Konva.Easings.EaseOut,
        });
      } else {
        groupRef.current.to({
          opacity: 0,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 1.0,
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

  const handleClick = () => {
    selectNode(node.id);
  };

  const handleExpandClick = (e: any) => {
    e.cancelBubble = true;
    toggleNodeExpansion(node.id);
  };

  // Calculate font size based on level
  const fontSize = node.level === 0 ? 18 : node.level === 1 ? 16 : 14;

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
      {/* Glow effect for selected/focused node (chalkboard) */}
      {isChalkboard && (isSelected || isFocused) && (
        <Rect
          width={NODE_WIDTH + 8}
          height={NODE_HEIGHT + 8}
          x={-4}
          y={-4}
          fill="transparent"
          shadowColor={nodeColor}
          shadowBlur={20}
          shadowOpacity={0.8}
          shadowEnabled={true}
        />
      )}

      {/* Node background - chalkboard style (no fill, just border) */}
      {isChalkboard ? (
        <>
          {/* Sketchy hand-drawn border */}
          <Line
            points={sketchyPoints}
            stroke={nodeColor}
            strokeWidth={isSelected || isFocused ? 3 : 2}
            closed={true}
            opacity={0.8}
            lineCap="round"
            lineJoin="round"
          />
        </>
      ) : (
        /* Standard style with filled background */
        <Rect
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          fill={theme.colors.nodeBackground}
          cornerRadius={theme.effects.nodeShape === 'rounded' ? 8 : 0}
          shadowColor={isFocused ? 'rgba(251, 146, 60, 0.3)' : 'rgba(0, 0, 0, 0.1)'}
          shadowBlur={theme.effects.nodeShadow ? (isFocused ? 20 : 10) : 0}
          shadowOffsetY={theme.effects.nodeShadow ? (isFocused ? 4 : 2) : 0}
          stroke={isSelected ? theme.colors.selectionRing : theme.colors.nodeBorder}
          strokeWidth={isSelected || isFocused ? 2 : 1}
        />
      )}

      {/* Node title */}
      <Text
        x={NODE_PADDING}
        y={NODE_PADDING}
        width={NODE_WIDTH - NODE_PADDING * 2 - (hasChildren ? 30 : 0)}
        height={NODE_HEIGHT - NODE_PADDING * 2}
        text={node.title}
        fontSize={fontSize}
        fontFamily={theme.fonts.title}
        fontStyle={node.level === 0 ? 'bold' : 'normal'}
        fill={isChalkboard ? nodeColor : theme.colors.nodeText}
        verticalAlign="middle"
        wrap="word"
        ellipsis={true}
        shadowColor={isChalkboard ? nodeColor : undefined}
        shadowBlur={isChalkboard && theme.effects.glowEffect ? 2 : 0}
        shadowOpacity={0.5}
      />

      {/* Expand/collapse button */}
      {hasChildren && (
        <Group
          x={NODE_WIDTH - 24}
          y={NODE_HEIGHT / 2}
          onClick={handleExpandClick}
        >
          {isChalkboard ? (
            /* Chalk style button */
            <>
              <Circle
                radius={EXPAND_BUTTON_RADIUS}
                stroke={nodeColor}
                strokeWidth={2}
                fill="transparent"
              />
              <Text
                x={-EXPAND_BUTTON_RADIUS}
                y={-EXPAND_BUTTON_RADIUS}
                width={EXPAND_BUTTON_RADIUS * 2}
                height={EXPAND_BUTTON_RADIUS * 2}
                text={node.isExpanded ? '-' : '+'}
                fontSize={16}
                fontFamily={theme.fonts.title}
                fill={nodeColor}
                align="center"
                verticalAlign="middle"
              />
            </>
          ) : (
            /* Standard style button */
            <>
              <Circle
                radius={EXPAND_BUTTON_RADIUS}
                fill={node.isExpanded ? '#fb923c' : '#f3f4f6'}
                stroke={node.isExpanded ? '#ea580c' : '#d1d5db'}
                strokeWidth={1}
              />
              <Text
                x={-EXPAND_BUTTON_RADIUS}
                y={-EXPAND_BUTTON_RADIUS}
                width={EXPAND_BUTTON_RADIUS * 2}
                height={EXPAND_BUTTON_RADIUS * 2}
                text={node.isExpanded ? '-' : '+'}
                fontSize={14}
                fontFamily="system-ui"
                fill={node.isExpanded ? 'white' : '#6b7280'}
                align="center"
                verticalAlign="middle"
              />
            </>
          )}
        </Group>
      )}

      {/* Level indicator for root node (chalkboard style) */}
      {isChalkboard && node.level === 0 && (
        <Line
          points={[0, NODE_HEIGHT + 5, NODE_WIDTH, NODE_HEIGHT + 5]}
          stroke={nodeColor}
          strokeWidth={1}
          opacity={0.5}
          dash={[5, 5]}
        />
      )}
    </Group>
  );
}
