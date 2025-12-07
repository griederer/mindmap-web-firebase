/**
 * Connector Component - Konva v3.0
 * Renders organic Bezier curve connectors between parent and child nodes
 * Supports bidirectional layout, branch colors, and variable stroke widths
 */

import { useEffect, useRef, memo } from 'react';
import { Group, Line, Text } from 'react-konva';
import { Node, getConnectorWidth } from '../../types/node';
import Konva from 'konva';

interface ConnectorProps {
  fromNode: Node;
  toNode: Node;
  label?: string; // Optional annotation on connector
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const DEFAULT_COLOR = '#fb923c'; // Fallback orange

function ConnectorInner({ fromNode, toNode, label }: ConnectorProps) {
  const lineRef = useRef<Konva.Line>(null);
  const labelRef = useRef<Konva.Text>(null);

  // Determine which side the child is on (left or right of parent)
  const isLeftSide = toNode.layoutSide === 'left';

  // Get connector color from child's branch color (or fallback)
  const connectorColor = toNode.branchColor || DEFAULT_COLOR;

  // Get stroke width based on child's level (thicker near root)
  const strokeWidth = getConnectorWidth(toNode.level);

  // Calculate connection points based on layout side
  const calculatePoints = () => {
    if (isLeftSide) {
      // LEFT SIDE: Parent connects from LEFT edge, child connects from RIGHT edge
      const fromX = fromNode.position.x; // Left edge of parent
      const fromY = fromNode.position.y + NODE_HEIGHT / 2;
      const toX = toNode.position.x + NODE_WIDTH; // Right edge of child
      const toY = toNode.position.y + NODE_HEIGHT / 2;

      // Bezier control points (flipped for left side)
      const controlPointOffset = Math.abs(fromX - toX) * 0.5;
      const cp1X = fromX - controlPointOffset;
      const cp1Y = fromY;
      const cp2X = toX + controlPointOffset;
      const cp2Y = toY;

      return [fromX, fromY, cp1X, cp1Y, cp2X, cp2Y, toX, toY];
    } else {
      // RIGHT SIDE: Parent connects from RIGHT edge, child connects from LEFT edge
      const fromX = fromNode.position.x + NODE_WIDTH; // Right edge of parent
      const fromY = fromNode.position.y + NODE_HEIGHT / 2;
      const toX = toNode.position.x; // Left edge of child
      const toY = toNode.position.y + NODE_HEIGHT / 2;

      // Bezier control points
      const controlPointOffset = Math.abs(toX - fromX) * 0.5;
      const cp1X = fromX + controlPointOffset;
      const cp1Y = fromY;
      const cp2X = toX - controlPointOffset;
      const cp2Y = toY;

      return [fromX, fromY, cp1X, cp1Y, cp2X, cp2Y, toX, toY];
    }
  };

  const points = calculatePoints();

  // Calculate label position (midpoint of Bezier curve)
  const getLabelPosition = () => {
    // Approximate midpoint using cubic Bezier formula at t=0.5
    const t = 0.5;
    const [x0, y0, x1, y1, x2, y2, x3, y3] = points;

    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    const x = mt3 * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3;
    const y = mt3 * y0 + 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3 * y3;

    return { x, y };
  };

  // Animate connector visibility (fade in/out with nodes)
  useEffect(() => {
    if (lineRef.current) {
      const bothVisible = fromNode.isVisible && toNode.isVisible;

      lineRef.current.to({
        opacity: bothVisible ? 1 : 0,
        duration: bothVisible ? 0.4 : 0.35,
        easing: bothVisible ? Konva.Easings.EaseOut : Konva.Easings.EaseIn,
      });
    }

    if (labelRef.current && label) {
      const bothVisible = fromNode.isVisible && toNode.isVisible;

      labelRef.current.to({
        opacity: bothVisible ? 0.8 : 0,
        duration: bothVisible ? 0.4 : 0.35,
        easing: bothVisible ? Konva.Easings.EaseOut : Konva.Easings.EaseIn,
      });
    }
  }, [fromNode.isVisible, toNode.isVisible, label]);

  // Animate connector position changes to sync with nodes
  useEffect(() => {
    if (lineRef.current) {
      const newPoints = calculatePoints();

      lineRef.current.to({
        points: newPoints,
        duration: 0.6,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [
    fromNode.position.x,
    fromNode.position.y,
    toNode.position.x,
    toNode.position.y,
    isLeftSide,
  ]);

  const labelPos = getLabelPosition();

  return (
    <Group>
      {/* Main connector line */}
      <Line
        ref={lineRef}
        points={points}
        stroke={connectorColor}
        strokeWidth={strokeWidth}
        bezier={true}
        tension={0}
        lineCap="round"
        lineJoin="round"
        opacity={0}
        shadowColor={connectorColor}
        shadowBlur={2}
        shadowOpacity={0.3}
      />

      {/* Optional label */}
      {label && (
        <Text
          ref={labelRef}
          x={labelPos.x - 40}
          y={labelPos.y - 8}
          width={80}
          text={label}
          fontSize={10}
          fontFamily="system-ui, -apple-system, sans-serif"
          fill="#6b7280"
          align="center"
          opacity={0}
        />
      )}
    </Group>
  );
}

// Memoized component - only re-renders when necessary
const Connector = memo(ConnectorInner, (prevProps, nextProps) => {
  return (
    prevProps.fromNode.position.x === nextProps.fromNode.position.x &&
    prevProps.fromNode.position.y === nextProps.fromNode.position.y &&
    prevProps.toNode.position.x === nextProps.toNode.position.x &&
    prevProps.toNode.position.y === nextProps.toNode.position.y &&
    prevProps.fromNode.isVisible === nextProps.fromNode.isVisible &&
    prevProps.toNode.isVisible === nextProps.toNode.isVisible &&
    prevProps.toNode.layoutSide === nextProps.toNode.layoutSide &&
    prevProps.toNode.branchColor === nextProps.toNode.branchColor &&
    prevProps.toNode.level === nextProps.toNode.level &&
    prevProps.label === nextProps.label
  );
});

export default Connector;
