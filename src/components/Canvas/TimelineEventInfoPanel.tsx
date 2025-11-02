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

const PANEL_WIDTH = 240;
const PANEL_PADDING = 12;
const PANEL_OFFSET_Y = -15; // Position above event

export default function TimelineEventInfoPanel({
  event,
  eventPosition,
  eventWidth,
  eventHeight,
  trackColor,
}: TimelineEventInfoPanelProps) {
  const groupRef = useRef<Konva.Group>(null);

  if (!event.description) return null;

  // Calculate panel height first to position above event
  const TITLE_FONT_SIZE = 15;
  const TITLE_LINE_HEIGHT = TITLE_FONT_SIZE * 1.5;
  const DESC_FONT_SIZE = 13;
  const DESC_LINE_HEIGHT = DESC_FONT_SIZE * 1.4;
  const DATE_HEIGHT = 24;
  const SPACING = 12;

  const textWidth = PANEL_WIDTH - PANEL_PADDING * 2;

  // Calculate title height (can wrap to multiple lines)
  const titleCharsPerLine = Math.floor(textWidth / (TITLE_FONT_SIZE * 0.6));
  const titleLines = Math.ceil(event.title.length / titleCharsPerLine);
  const titleHeight = titleLines * TITLE_LINE_HEIGHT;

  // Calculate description height
  const descCharsPerLine = Math.floor(textWidth / (DESC_FONT_SIZE * 0.6));
  const descLines = Math.ceil(event.description.length / descCharsPerLine);
  const descHeight = descLines * DESC_LINE_HEIGHT;

  const panelHeight = PANEL_PADDING + titleHeight + SPACING + DATE_HEIGHT + SPACING + descHeight + PANEL_PADDING;

  // Position panel ABOVE the event, centered horizontally
  const panelX = eventPosition.x + eventWidth / 2 - PANEL_WIDTH / 2;
  const panelY = eventPosition.y - panelHeight + PANEL_OFFSET_Y;

  // Animate panel appearance on mount
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.to({
        opacity: 1,
        y: 0, // Slide from offset to final position
        duration: 0.3,
        easing: Konva.Easings.EaseOut,
      });
    }
  }, []);

  // Connection line from event to panel bottom
  const lineStartX = eventPosition.x + eventWidth / 2;
  const lineStartY = eventPosition.y;
  const lineEndX = panelX + PANEL_WIDTH / 2;
  const lineEndY = panelY + panelHeight;

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
      y={-10} // Start offset upward
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
        fontSize={TITLE_FONT_SIZE}
        fontFamily="Inter"
        fontStyle="600"
        fill="#1F2937"
        wrap="word"
        lineHeight={1.5}
      />

      {/* Event date with icon */}
      <Circle
        x={panelX + PANEL_PADDING + 6}
        y={panelY + PANEL_PADDING + titleHeight + SPACING + 8}
        radius={5}
        fill={trackColor}
        opacity={0.2}
      />
      <Text
        x={panelX + PANEL_PADDING + 16}
        y={panelY + PANEL_PADDING + titleHeight + SPACING + 4}
        text={formattedDate}
        fontSize={12}
        fontFamily="Inter"
        fill="#6B7280"
      />

      {/* Event description */}
      <Text
        x={panelX + PANEL_PADDING}
        y={panelY + PANEL_PADDING + titleHeight + SPACING + DATE_HEIGHT + SPACING}
        width={PANEL_WIDTH - PANEL_PADDING * 2}
        text={event.description}
        fontSize={DESC_FONT_SIZE}
        fontFamily="system-ui, -apple-system, sans-serif"
        fill="#374151"
        lineHeight={1.4}
        wrap="word"
      />
    </Group>
  );
}
