/**
 * TimelineComponent - Horizontal tracks timeline
 * Renders timeline with horizontal tracks (Europa, Pacífico, Diplomacia)
 * Events appear as colored circles positioned on tracks at their date
 */

import { Group, Rect, Text, Circle, Line } from 'react-konva';
import { Node } from '../../types/node';
import { TimelineEvent, TimelineConfig } from '../../types/project';

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
   * Calculate label positions with collision detection
   */
  const calculateLabelPositions = () => {
    // Sort events by track and then by date
    const sortedEvents = [...events].sort((a, b) => {
      const trackA = tracks.findIndex(t => t.id === a.track);
      const trackB = tracks.findIndex(t => t.id === b.track);
      if (trackA !== trackB) return trackA - trackB;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const labelPositions = new Map<string, { x: number; y: number }>();
    const MIN_LABEL_SPACING = 15; // Minimum vertical spacing between labels
    const LABEL_HEIGHT = 16; // Approximate height of label text

    // Group events by track
    const eventsByTrack = tracks.map(track =>
      sortedEvents.filter(e => e.track === track.id)
    );

    eventsByTrack.forEach((trackEvents) => {
      const usedPositions: Array<{ x: number; y: number; width: number }> = [];

      trackEvents.forEach(event => {
        const eventX = TRACK_LABEL_WIDTH + getEventX(event.date);
        const baseEventY = getEventY(event.track);
        let labelY = baseEventY - 8;

        // Estimate label width (approximate: 7px per character)
        const estimatedWidth = event.title.length * 7;
        const labelX = eventX + EVENT_LABEL_OFFSET_X;

        // Check for collisions with existing labels
        let attempts = 0;
        const MAX_ATTEMPTS = 10;

        while (attempts < MAX_ATTEMPTS) {
          let hasCollision = false;

          for (const used of usedPositions) {
            // Check horizontal overlap
            const horizontalOverlap =
              labelX < used.x + used.width + 5 &&
              labelX + estimatedWidth + 5 > used.x;

            // Check vertical overlap
            const verticalOverlap =
              Math.abs(labelY - used.y) < LABEL_HEIGHT + MIN_LABEL_SPACING;

            if (horizontalOverlap && verticalOverlap) {
              hasCollision = true;
              break;
            }
          }

          if (!hasCollision) {
            break;
          }

          // Adjust position: alternate above and below
          if (attempts % 2 === 0) {
            labelY = baseEventY - 8 - ((attempts / 2 + 1) * (LABEL_HEIGHT + MIN_LABEL_SPACING));
          } else {
            labelY = baseEventY - 8 + ((attempts / 2 + 1) * (LABEL_HEIGHT + MIN_LABEL_SPACING));
          }

          attempts++;
        }

        usedPositions.push({ x: labelX, y: labelY, width: estimatedWidth });
        labelPositions.set(event.id, { x: labelX, y: labelY });
      });
    });

    return labelPositions;
  };

  const labelPositions = calculateLabelPositions();

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

            {/* Event title label - using auto-layout position */}
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
