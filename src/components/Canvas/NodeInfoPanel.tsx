/**
 * Node Info Panel - Konva
 * Displays detailed information/description for a node
 */

import { Group, Rect, Text, Line } from 'react-konva';
import { Node } from '../../types/node';

interface NodeInfoPanelProps {
  node: Node;
  nodeWidth: number;
  nodeHeight: number;
}

const PANEL_WIDTH = 240;
const PANEL_PADDING = 16;
const PANEL_OFFSET_X = 20;

export default function NodeInfoPanel({ node, nodeWidth, nodeHeight }: NodeInfoPanelProps) {
  if (!node.description) return null;

  // Position panel to the right of the node
  const panelX = node.position.x + nodeWidth + PANEL_OFFSET_X;
  const panelY = node.position.y;

  // Calculate panel height based on text content
  // Estimate wrapped lines: avg 40 chars per line with word wrap
  const fontSize = 13;
  const lineHeight = fontSize * 1.4; // lineHeight multiplier
  const textWidth = PANEL_WIDTH - PANEL_PADDING * 2;
  const avgCharsPerLine = Math.floor(textWidth / (fontSize * 0.6)); // Rough estimate
  const estimatedLines = Math.ceil(node.description.length / avgCharsPerLine);
  const panelHeight = Math.max(80, estimatedLines * lineHeight + PANEL_PADDING * 2 + 10);

  // Connection line from node to panel
  const lineStartX = node.position.x + nodeWidth;
  const lineStartY = node.position.y + nodeHeight / 2;
  const lineEndX = panelX;
  const lineEndY = panelY + panelHeight / 2;

  return (
    <Group>
      {/* Connector line */}
      <Line
        points={[lineStartX, lineStartY, lineEndX, lineEndY]}
        stroke="#FB923C"
        strokeWidth={2}
        dash={[5, 5]}
      />

      {/* Panel background */}
      <Rect
        x={panelX}
        y={panelY}
        width={PANEL_WIDTH}
        height={panelHeight}
        fill="white"
        stroke="#FB923C"
        strokeWidth={2}
        cornerRadius={8}
        shadowColor="rgba(0, 0, 0, 0.3)"
        shadowBlur={20}
        shadowOffsetY={4}
        shadowEnabled={true}
      />

      {/* Panel content */}
      <Text
        x={panelX + PANEL_PADDING}
        y={panelY + PANEL_PADDING}
        width={PANEL_WIDTH - PANEL_PADDING * 2}
        text={node.description}
        fontSize={13}
        fontFamily="system-ui, -apple-system, sans-serif"
        fill="#374151"
        lineHeight={1.4}
        wrap="word"
      />
    </Group>
  );
}
