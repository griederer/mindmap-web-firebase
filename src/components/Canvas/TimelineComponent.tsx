/**
 * TimelineComponent - Horizontal tracks timeline
 * Renders timeline with horizontal tracks (Europa, Pacífico, Diplomacia)
 * Events appear as colored circles positioned on tracks at their date
 */

import { useMemo } from 'react';
import { Group, Rect, Text, Circle, Line } from 'react-konva';
import { Node } from '../../types/node';
import { TimelineEvent, TimelineConfig } from '../../types/project';
import { calculateLabelPositions } from '../../utils/timeline/collisionDetection';

interface TimelineComponentProps {
  timelineNode: Node;
  events: TimelineEvent[];
  tracks: TimelineConfig['tracks'];
  onEventClick: (eventId: string) => void;
  position: { x: number; y: number };
}

// Layout constants (as per PRD)
const YEAR_SPACING = 280;
const TRACK_HEIGHT = 100;
const TRACK_SPACING = 20;
const TIMELINE_Y_OFFSET = 80;
const EVENT_CIRCLE_RADIUS = 10;
const EVENT_LABEL_OFFSET_X = 15;
const TRACK_LABEL_WIDTH = 120;

export default function TimelineComponent({
  timelineNode,
  events,
  tracks,
  onEventClick,
  position,
}: TimelineComponentProps) {
  const { timelineConfig } = timelineNode;

  if (!timelineConfig || !tracks) return null;

  const { startYear, endYear } = timelineConfig;

  // Generate year range
  const years: number[] = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  const timelineLength = (years.length - 1) * YEAR_SPACING;
  const totalHeight = tracks.length * (TRACK_HEIGHT + TRACK_SPACING);

  /**
   * Calculate X position for an event based on its date
   */
  const getEventX = (eventDate: string): number => {
    const date = new Date(eventDate);
    const eventYear = date.getFullYear();
    const yearsSinceStart = eventYear - startYear;

    // Calculate day offset within the year
    const startOfYear = new Date(eventYear, 0, 1);
    const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const dayOffset = (dayOfYear / 365) * YEAR_SPACING;

    return (yearsSinceStart * YEAR_SPACING) + dayOffset;
  };

  /**
   * Calculate Y position for an event based on its track
   */
  const getEventY = (trackId: string): number => {
    const trackIndex = tracks.findIndex(t => t.id === trackId);
    if (trackIndex === -1) return 0;

    return TIMELINE_Y_OFFSET + (trackIndex * (TRACK_HEIGHT + TRACK_SPACING)) + TRACK_HEIGHT / 2;
  };

  /**
   * Calculate label positions with collision detection (cached with useMemo)
   */
  const labelPositions = useMemo(() => {
    // Calculate positions using collision detection utility
    const positions = calculateLabelPositions(events, tracks, getEventX, getEventY, {
      labelHeight: 30, // Much larger for guaranteed vertical space
      charWidth: 10, // Wider character estimation
      adjustmentStep: 80, // Very large spacing - guaranteed separation
      connectorThreshold: 5,
      maxAttempts: 50, // Many attempts to find space
    });

    // Convert to final positions with track label offset
    const finalPositions = new Map<string, { x: number; y: number; needsConnector: boolean }>();

    positions.forEach((pos, eventId) => {
      const event = events.find(e => e.id === eventId);
      if (event) {
        finalPositions.set(eventId, {
          x: TRACK_LABEL_WIDTH + pos.x + EVENT_LABEL_OFFSET_X,
          y: pos.y - 8, // Slight vertical offset for better alignment
          needsConnector: pos.needsConnector,
        });
      }
    });

    return finalPositions;
  }, [events, tracks, startYear, endYear]);

  return (
    <Group x={position.x} y={position.y}>
      {/* Render year axis at the top */}
      <Group>
        {/* Horizontal axis line */}
        <Line
          points={[
            TRACK_LABEL_WIDTH,
            TIMELINE_Y_OFFSET - 30,
            TRACK_LABEL_WIDTH + timelineLength,
            TIMELINE_Y_OFFSET - 30,
          ]}
          stroke="#D1D5DB"
          strokeWidth={2}
        />

        {/* Year markers and labels */}
        {years.map((year, index) => {
          const yearX = TRACK_LABEL_WIDTH + (index * YEAR_SPACING);

          return (
            <Group key={year}>
              {/* Year label above axis */}
              <Text
                x={yearX - 25}
                y={TIMELINE_Y_OFFSET - 60}
                text={year.toString()}
                fontSize={16}
                fontFamily="Inter"
                fontStyle="700"
                fill="#1F2937"
                width={50}
                align="center"
              />

              {/* Vertical dotted line from year down through all tracks */}
              <Line
                points={[
                  yearX,
                  TIMELINE_Y_OFFSET - 30,
                  yearX,
                  TIMELINE_Y_OFFSET + totalHeight,
                ]}
                stroke="#E5E7EB"
                strokeWidth={1}
                dash={[5, 5]}
              />

              {/* Year marker circle on axis */}
              <Circle
                x={yearX}
                y={TIMELINE_Y_OFFSET - 30}
                radius={5}
                fill="#3B82F6"
              />
            </Group>
          );
        })}
      </Group>

      {/* Render tracks */}
      {tracks.map((track, trackIndex) => {
        const trackY = TIMELINE_Y_OFFSET + (trackIndex * (TRACK_HEIGHT + TRACK_SPACING));

        return (
          <Group key={track.id}>
            {/* Track label on the left */}
            <Text
              x={0}
              y={trackY + TRACK_HEIGHT / 2 - 10}
              text={track.name}
              fontSize={14}
              fontFamily="Inter"
              fontStyle="600"
              fill="#1F2937"
              width={TRACK_LABEL_WIDTH - 10}
              align="right"
            />

            {/* Horizontal track line */}
            <Line
              points={[
                TRACK_LABEL_WIDTH,
                trackY + TRACK_HEIGHT / 2,
                TRACK_LABEL_WIDTH + timelineLength,
                trackY + TRACK_HEIGHT / 2,
              ]}
              stroke={track.color}
              strokeWidth={3}
              opacity={0.3}
            />

            {/* Track background rect for hover area */}
            <Rect
              x={TRACK_LABEL_WIDTH}
              y={trackY}
              width={timelineLength}
              height={TRACK_HEIGHT}
              fill="transparent"
            />
          </Group>
        );
      })}

      {/* Render events as circles on their tracks */}
      {events.map(event => {
        // Skip events with invalid tracks
        const track = tracks.find(t => t.id === event.track);
        if (!track) {
          console.warn(`Event ${event.id} has invalid track: ${event.track}`);
          return null;
        }

        const eventX = TRACK_LABEL_WIDTH + getEventX(event.date);
        const eventY = getEventY(event.track);
        const labelPos = labelPositions.get(event.id);

        return (
          <Group key={event.id}>
            {/* Event circle */}
            <Circle
              x={eventX}
              y={eventY}
              radius={EVENT_CIRCLE_RADIUS}
              fill={track.color}
              stroke="#FFFFFF"
              strokeWidth={2}
              shadowColor="rgba(0, 0, 0, 0.3)"
              shadowBlur={8}
              shadowOffsetY={2}
              onClick={() => onEventClick(event.id)}
              onTap={() => onEventClick(event.id)}
              onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                if (container) {
                  container.style.cursor = 'pointer';
                }
              }}
              onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) {
                  container.style.cursor = 'default';
                }
              }}
            />

            {/* Connector line (if label was adjusted) */}
            {labelPos && labelPos.needsConnector && (
              <Line
                points={[
                  eventX + EVENT_LABEL_OFFSET_X,
                  eventY,
                  labelPos.x - 5,
                  labelPos.y + 8,
                ]}
                stroke={track.color}
                strokeWidth={1}
                opacity={0.5}
                dash={[3, 3]}
              />
            )}

            {/* Event title label - using collision-free position */}
            {labelPos && (
              <Text
                x={labelPos.x}
                y={labelPos.y}
                text={event.title}
                fontSize={13}
                fontFamily="Inter"
                fontStyle="500"
                fill="#1F2937"
                onClick={() => onEventClick(event.id)}
                onTap={() => onEventClick(event.id)}
                onMouseEnter={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) {
                    container.style.cursor = 'pointer';
                  }
                }}
                onMouseLeave={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) {
                    container.style.cursor = 'default';
                  }
                }}
              />
            )}
          </Group>
        );
      })}
    </Group>
  );
}
