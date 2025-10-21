/**
 * Connector Component - Konva
 * Renders Bezier curve connectors between parent and child nodes
 */

import { Line } from 'react-konva';
import { Node } from '../../types/node';

interface ConnectorProps {
  fromNode: Node;
  toNode: Node;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const CONNECTOR_COLOR = '#fb923c'; // Orange-400
const CONNECTOR_WIDTH = 2;

export default function Connector({ fromNode, toNode }: ConnectorProps) {
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
      points={points}
      stroke={CONNECTOR_COLOR}
      strokeWidth={CONNECTOR_WIDTH}
      bezier={true}
      tension={0}
      lineCap="round"
      lineJoin="round"
    />
  );
}
