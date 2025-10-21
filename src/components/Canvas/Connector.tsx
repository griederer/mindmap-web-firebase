/**
 * Connector Component - Konva
 * Renders animated Bezier curve connectors between parent and child nodes
 */

import { useEffect, useRef } from 'react';
import { Line } from 'react-konva';
import { Node } from '../../types/node';
import Konva from 'konva';

interface ConnectorProps {
  fromNode: Node;
  toNode: Node;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const CONNECTOR_COLOR = '#fb923c'; // Orange-400
const CONNECTOR_WIDTH = 2;

export default function Connector({ fromNode, toNode }: ConnectorProps) {
  const lineRef = useRef<Konva.Line>(null);

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
  }, [fromNode.isVisible, toNode.isVisible]);

  // Animate connector position changes to sync with nodes
  useEffect(() => {
    if (lineRef.current) {
      // Calculate connection points
      const fromX = fromNode.position.x + NODE_WIDTH;
      const fromY = fromNode.position.y + NODE_HEIGHT / 2;
      const toX = toNode.position.x;
      const toY = toNode.position.y + NODE_HEIGHT / 2;

      // Calculate Bezier control points
      const controlPointOffset = Math.abs(toX - fromX) * 0.5;
      const cp1X = fromX + controlPointOffset;
      const cp1Y = fromY;
      const cp2X = toX - controlPointOffset;
      const cp2Y = toY;

      // Generate points for Bezier curve
      const newPoints = [
        fromX, fromY,
        cp1X, cp1Y,
        cp2X, cp2Y,
        toX, toY,
      ];

      lineRef.current.to({
        points: newPoints,
        duration: 0.6,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [fromNode.position.x, fromNode.position.y, toNode.position.x, toNode.position.y]);

  // Calculate connection points
  // From: right center of parent node
  const fromX = fromNode.position.x + NODE_WIDTH;
  const fromY = fromNode.position.y + NODE_HEIGHT / 2;
  
  // To: left center of child node
  const toX = toNode.position.x;
  const toY = toNode.position.y + NODE_HEIGHT / 2;
  
  // Calculate Bezier control points for smooth curve
  const controlPointOffset = Math.abs(toX - fromX) * 0.5;
  const cp1X = fromX + controlPointOffset;
  const cp1Y = fromY;
  const cp2X = toX - controlPointOffset;
  const cp2Y = toY;
  
  // Generate points for Bezier curve
  const points = [
    fromX, fromY,  // Start point
    cp1X, cp1Y,     // Control point 1
    cp2X, cp2Y,     // Control point 2
    toX, toY,       // End point
  ];
  
  return (
    <Line
      ref={lineRef}
      points={points}
      stroke={CONNECTOR_COLOR}
      strokeWidth={CONNECTOR_WIDTH}
      bezier={true}
      tension={0}
      lineCap="round"
      lineJoin="round"
      opacity={0}
    />
  );
}
