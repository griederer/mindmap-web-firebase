/**
 * Timeline Event Info Panel - Konva
 * Displays detailed information for a timeline event
 */

import { useEffect, useRef } from 'react';
import { Group, Rect, Text, Line, Circle } from 'react-konva';
import Konva from 'konva';
import { TimelineEvent } from '../../types/project';

interface TimelineEventInfoPanelProps {
  event: TimelineEvent;
  eventPosition: { x: number; y: number };
  eventWidth: number;
  eventHeight: number;
  trackColor: string;
}

const PANEL_WIDTH = 280;
const PANEL_PADDING = 16;
const PANEL_OFFSET_X = 20;

export default function TimelineEventInfoPanel({
  event,
  eventPosition,
  eventWidth,
  eventHeight,
  trackColor,
}: TimelineEventInfoPanelProps) {
  const groupRef = useRef<Konva.Group>(null);

  if (!event.description) return null;

  // Position panel to the right of the event
  const panelX = eventPosition.x + eventWidth + PANEL_OFFSET_X;
  const panelY = eventPosition.y;

  // Animate panel appearance on mount
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.to({
        opacity: 1,
        x: 0, // Slide from offset to final position
        duration: 0.8,
        easing: Konva.Easings.EaseOut,
      });
    }
  }, []);

  // Calculate panel height based on text content
  const fontSize = 13;
  const lineHeight = fontSize * 1.4;
  const textWidth = PANEL_WIDTH - PANEL_PADDING * 2;
  const avgCharsPerLine = Math.floor(textWidth / (fontSize * 0.6));
  const estimatedLines = Math.ceil(event.description.length / avgCharsPerLine);
  const textHeight = estimatedLines * lineHeight;

  // Add space for date and title
  const titleHeight = 20;
  const dateHeight = 18;
  const panelHeight = Math.max(120, titleHeight + dateHeight + textHeight + PANEL_PADDING * 3);

  // Connection line from event to panel
  const lineStartX = eventPosition.x + eventWidth;
  const lineStartY = eventPosition.y + eventHeight / 2;
  const lineEndX = panelX;
  const lineEndY = panelY + panelHeight / 2;

  // Format date nicely
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Group
      ref={groupRef}
      x={20} // Start offset to the right
      opacity={0} // Start invisible
    >
      {/* Connector line */}
      <Line
        points={[lineStartX, lineStartY, lineEndX, lineEndY]}
        stroke={trackColor}
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
        stroke={trackColor}
        strokeWidth={2}
        cornerRadius={8}
        shadowColor="rgba(0, 0, 0, 0.3)"
        shadowBlur={20}
        shadowOffsetY={4}
        shadowEnabled={true}
      />

      {/* Event title */}
      <Text
        x={panelX + PANEL_PADDING}
        y={panelY + PANEL_PADDING}
        width={PANEL_WIDTH - PANEL_PADDING * 2}
        text={event.title}
        fontSize={15}
        fontFamily="Inter"
        fontStyle="600"
        fill="#1F2937"
        wrap="word"
      />

      {/* Event date with icon */}
      <Circle
        x={panelX + PANEL_PADDING + 6}
        y={panelY + PANEL_PADDING + titleHeight + 8}
        radius={5}
        fill={trackColor}
        opacity={0.2}
      />
      <Text
        x={panelX + PANEL_PADDING + 16}
        y={panelY + PANEL_PADDING + titleHeight}
        text={formattedDate}
        fontSize={12}
        fontFamily="Inter"
        fill="#6B7280"
      />

      {/* Event description */}
      <Text
        x={panelX + PANEL_PADDING}
        y={panelY + PANEL_PADDING + titleHeight + dateHeight + 8}
        width={PANEL_WIDTH - PANEL_PADDING * 2}
        text={event.description}
        fontSize={13}
        fontFamily="system-ui, -apple-system, sans-serif"
        fill="#374151"
        lineHeight={1.4}
        wrap="word"
      />
    </Group>
  );
}
