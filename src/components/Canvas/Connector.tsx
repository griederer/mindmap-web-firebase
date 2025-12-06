/**
 * Connector Component - Konva
 * Renders animated Bezier curve connectors between parent and child nodes
 * Supports chalkboard style with sketchy hand-drawn lines
 */

import { useEffect, useRef, useMemo } from 'react';
import { Line, Group } from 'react-konva';
import { Node } from '../../types/node';
import { Theme } from '../../types/theme';
import Konva from 'konva';

interface ConnectorProps {
  fromNode: Node;
  toNode: Node;
  theme: Theme;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

// Generate sketchy line points with wobble effect
function getSketchyLinePoints(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  wobble: number = 2
): number[] {
  const points: number[] = [];
  const segments = 30;

  // Calculate control points for organic curve
  const dx = toX - fromX;
  const controlPointOffset = Math.abs(dx) * 0.4;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    // Cubic Bezier interpolation
    const cp1x = fromX + controlPointOffset;
    const cp1y = fromY;
    const cp2x = toX - controlPointOffset;
    const cp2y = toY;

    // Bezier formula
    const x =
      Math.pow(1 - t, 3) * fromX +
      3 * Math.pow(1 - t, 2) * t * cp1x +
      3 * (1 - t) * Math.pow(t, 2) * cp2x +
      Math.pow(t, 3) * toX;

    const y =
      Math.pow(1 - t, 3) * fromY +
      3 * Math.pow(1 - t, 2) * t * cp1y +
      3 * (1 - t) * Math.pow(t, 2) * cp2y +
      Math.pow(t, 3) * toY;

    // Add wobble (more in the middle, less at ends)
    const wobbleAmount = wobble * Math.sin(t * Math.PI);
    const wobbleX = (Math.random() - 0.5) * wobbleAmount;
    const wobbleY = (Math.random() - 0.5) * wobbleAmount;

    points.push(x + wobbleX, y + wobbleY);
  }

  return points;
}

export default function Connector({ fromNode, toNode, theme }: ConnectorProps) {
  const lineRef = useRef<Konva.Line>(null);
  const isChalkboard = theme.effects.handDrawn;

  // Calculate connection points
  const fromX = fromNode.position.x + NODE_WIDTH;
  const fromY = fromNode.position.y + NODE_HEIGHT / 2;
  const toX = toNode.position.x;
  const toY = toNode.position.y + NODE_HEIGHT / 2;

  // Generate sketchy points for chalkboard style
  const sketchyPoints = useMemo(() => {
    if (!isChalkboard) return [];
    return getSketchyLinePoints(fromX, fromY, toX, toY, 3);
  }, [isChalkboard, fromX, fromY, toX, toY]);

  // Standard Bezier points
  const controlPointOffset = Math.abs(toX - fromX) * 0.5;
  const standardPoints = [
    fromX, fromY,
    fromX + controlPointOffset, fromY,
    toX - controlPointOffset, toY,
    toX, toY,
  ];

  // Animate connector visibility
  useEffect(() => {
    if (lineRef.current) {
      const bothVisible = fromNode.isVisible && toNode.isVisible;
      lineRef.current.to({
        opacity: bothVisible ? (isChalkboard ? 0.7 : 1) : 0,
        duration: bothVisible ? 0.4 : 0.35,
        easing: bothVisible ? Konva.Easings.EaseOut : Konva.Easings.EaseIn,
      });
    }
  }, [fromNode.isVisible, toNode.isVisible, isChalkboard]);

  // Animate connector position changes
  useEffect(() => {
    if (lineRef.current && !isChalkboard) {
      const newPoints = [
        fromX, fromY,
        fromX + controlPointOffset, fromY,
        toX - controlPointOffset, toY,
        toX, toY,
      ];

      lineRef.current.to({
        points: newPoints,
        duration: 0.6,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [fromX, fromY, toX, toY, controlPointOffset, isChalkboard]);

  // Determine line color from theme
  const lineColor = isChalkboard
    ? theme.colors.connectionDefault
    : theme.colors.connectionDefault;

  if (isChalkboard) {
    // Chalkboard style: multiple overlapping sketchy lines for chalk effect
    return (
      <Group>
        {/* Main chalk line */}
        <Line
          ref={lineRef}
          points={sketchyPoints}
          stroke={lineColor}
          strokeWidth={theme.effects.connectionWidth}
          lineCap="round"
          lineJoin="round"
          opacity={0}
          shadowColor={lineColor}
          shadowBlur={theme.effects.glowEffect ? 3 : 0}
          shadowOpacity={0.3}
        />
        {/* Secondary chalk line for texture */}
        <Line
          points={getSketchyLinePoints(fromX, fromY, toX, toY, 2)}
          stroke={lineColor}
          strokeWidth={1}
          lineCap="round"
          lineJoin="round"
          opacity={fromNode.isVisible && toNode.isVisible ? 0.3 : 0}
        />
      </Group>
    );
  }

  // Standard style
  return (
    <Line
      ref={lineRef}
      points={standardPoints}
      stroke={lineColor}
      strokeWidth={theme.effects.connectionWidth}
      bezier={true}
      tension={0}
      lineCap="round"
      lineJoin="round"
      opacity={0}
    />
  );
}
