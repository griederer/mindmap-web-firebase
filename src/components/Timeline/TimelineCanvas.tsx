/**
 * TimelineCanvas Component - Konva
 * Timeline view with pan/zoom/focus capabilities matching mindmap
 */

import { useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Line, Circle } from 'react-konva';
import Konva from 'konva';
import { useViewportStore } from '../../stores/viewportStore';
import { useProjectStore } from '../../stores/projectStore';
import { TimelineEvent } from '../../types/project';
import ZoomControls from '../Canvas/ZoomControls';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const ZOOM_SPEED = 0.1;

// Timeline layout constants
const TIMELINE_HEIGHT = 120;
const TRACK_HEIGHT = 80;
const TRACK_SPACING = 20;
const EVENT_RADIUS = 8;
const EVENT_SPACING = 150; // Pixels per year

export default function TimelineCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Viewport state
  const { x, y, zoom, width, height, setViewportSize, setZoom, setPosition } = useViewportStore();

  // Project state
  const { currentBundle } = useProjectStore();

  const timeline = currentBundle?.timeline;
  const tracks = timeline?.config?.tracks || [];
  const events = timeline?.events || [];

  // Update viewport size when container resizes
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setViewportSize(
          containerRef.current.offsetWidth,
          containerRef.current.offsetHeight
        );
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [setViewportSize]);

  // Convert date string to x position
  const dateToX = (dateStr: string): number => {
    if (!timeline?.config) return 0;

    const date = new Date(dateStr);
    const startDate = new Date(timeline.config.startDate);
    const yearsDiff = (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    return yearsDiff * EVENT_SPACING;
  };

  // Get track index from track ID
  const getTrackIndex = (trackId: string): number => {
    return tracks.findIndex(t => t.id === trackId);
  };

  // Handle wheel zoom
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldZoom = zoom;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - x) / oldZoom,
      y: (pointer.y - y) / oldZoom,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newZoom = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, oldZoom + direction * ZOOM_SPEED)
    );

    setZoom(newZoom);

    const newPos = {
      x: pointer.x - mousePointTo.x * newZoom,
      y: pointer.y - mousePointTo.y * newZoom,
    };

    setPosition(newPos.x, newPos.y);
  };

  // Handle drag (pan)
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setPosition(e.target.x(), e.target.y());
  };

  // Handle double-click on event to focus
  const handleEventDoubleClick = (event: TimelineEvent) => {
    const eventX = dateToX(event.date);
    const trackIdx = getTrackIndex(event.track);
    const eventY = TIMELINE_HEIGHT + trackIdx * (TRACK_HEIGHT + TRACK_SPACING) + TRACK_HEIGHT / 2;

    // Center on event with smooth animation
    const stage = stageRef.current;
    if (!stage) return;

    const newX = width / 2 - eventX * zoom;
    const newY = height / 2 - eventY * zoom;

    stage.to({
      x: newX,
      y: newY,
      duration: 0.5,
      easing: Konva.Easings.EaseOut,
      onFinish: () => {
        setPosition(newX, newY);
      },
    });
  };

  // Render timeline axis
  const renderTimelineAxis = () => {
    if (!timeline?.config) return null;

    const startDate = new Date(timeline.config.startDate);
    const endDate = new Date(timeline.config.endDate);
    const years = endDate.getFullYear() - startDate.getFullYear() + 1;

    const elements: JSX.Element[] = [];

    // Main axis line
    elements.push(
      <Line
        key="axis-line"
        points={[0, TIMELINE_HEIGHT - 30, years * EVENT_SPACING, TIMELINE_HEIGHT - 30]}
        stroke="#9CA3AF"
        strokeWidth={2}
      />
    );

    // Year markers
    for (let i = 0; i < years; i++) {
      const year = startDate.getFullYear() + i;
      const xPos = i * EVENT_SPACING;

      elements.push(
        <Line
          key={`marker-${year}`}
          points={[xPos, TIMELINE_HEIGHT - 40, xPos, TIMELINE_HEIGHT - 20]}
          stroke="#9CA3AF"
          strokeWidth={2}
        />,
        <Text
          key={`label-${year}`}
          x={xPos - 20}
          y={TIMELINE_HEIGHT - 60}
          text={year.toString()}
          fontSize={14}
          fontFamily="Inter"
          fill="#6B7280"
        />
      );
    }

    return elements;
  };

  // Render track lanes
  const renderTracks = () => {
    return tracks.map((track, idx) => {
      const yPos = TIMELINE_HEIGHT + idx * (TRACK_HEIGHT + TRACK_SPACING);

      return (
        <Rect
          key={track.id}
          x={-1000}
          y={yPos}
          width={10000}
          height={TRACK_HEIGHT}
          fill="#FFFFFF"
          stroke="#E5E7EB"
          strokeWidth={1}
          cornerRadius={8}
        />
      );
    });
  };

  // Render track labels
  const renderTrackLabels = () => {
    return tracks.map((track, idx) => {
      const yPos = TIMELINE_HEIGHT + idx * (TRACK_HEIGHT + TRACK_SPACING);

      return (
        <Text
          key={`label-${track.id}`}
          x={20}
          y={yPos + 10}
          text={track.name}
          fontSize={12}
          fontFamily="Inter"
          fontStyle="600"
          fill={track.color}
        />
      );
    });
  };

  // Render events
  const renderEvents = () => {
    return events.map((event) => {
      const eventX = dateToX(event.date);
      const trackIdx = getTrackIndex(event.track);
      const eventY = TIMELINE_HEIGHT + trackIdx * (TRACK_HEIGHT + TRACK_SPACING) + TRACK_HEIGHT / 2;

      const track = tracks.find(t => t.id === event.track);
      const color = track?.color || '#3B82F6';

      return (
        <Circle
          key={event.id}
          x={eventX}
          y={eventY}
          radius={EVENT_RADIUS}
          fill={color}
          stroke="#FFFFFF"
          strokeWidth={2}
          shadowColor="#000000"
          shadowBlur={4}
          shadowOpacity={0.2}
          shadowOffsetY={2}
          onDblClick={() => handleEventDoubleClick(event)}
          onTap={() => handleEventDoubleClick(event)}
          onMouseEnter={(e) => {
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = 'pointer';
          }}
          onMouseLeave={(e) => {
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = 'default';
          }}
        />
      );
    });
  };

  return (
    <div ref={containerRef} className="w-full h-full relative bg-gray-50">
      {timeline ? (
        <>
          <Stage
            ref={stageRef}
            width={width}
            height={height}
            draggable
            x={x}
            y={y}
            scaleX={zoom}
            scaleY={zoom}
            onWheel={handleWheel}
            onDragEnd={handleDragEnd}
          >
            <Layer>
              {/* Timeline axis */}
              {renderTimelineAxis()}

              {/* Track lanes */}
              {renderTracks()}

              {/* Track labels */}
              {renderTrackLabels()}

              {/* Events */}
              {renderEvents()}
            </Layer>
          </Stage>

          {/* Zoom controls */}
          <ZoomControls />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-600">No timeline data available</p>
            <p className="text-xs text-gray-400 mt-1">Load a project with timeline view</p>
          </div>
        </div>
      )}
    </div>
  );
}
