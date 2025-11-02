/**
 * TimelineCanvas Component - Konva
 * Timeline view with pan/zoom/focus capabilities matching mindmap
 */

import { useEffect, useRef, useMemo, useState } from 'react';
import { Stage, Layer, Rect, Text, Line, Circle, Group } from 'react-konva';
import Konva from 'konva';
import { useViewportStore } from '../../stores/viewportStore';
import { useProjectStore } from '../../stores/projectStore';
import { TimelineEvent } from '../../types/project';
import ZoomControls from '../Canvas/ZoomControls';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { calculateLabelPositions } from '../../utils/timeline/collisionDetection';
import { AnimationQueue } from '../../utils/performance/animationThrottle';
import {
  disableShadowsDuringAnimation,
  enableShadowsAfterAnimation,
} from '../../utils/performance/canvasOptimizer';

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
  const layerRef = useRef<Konva.Layer>(null);

  // Animation queue for smooth transitions
  const [animationQueue] = useState(() => new AnimationQueue());

  // Viewport state
  const { x, y, zoom, width, height, setViewportSize, setZoom, setPosition } = useViewportStore();

  // Project state
  const { currentBundle } = useProjectStore();

  const timeline = currentBundle?.timeline;
  const tracks = timeline?.config?.tracks || [];
  const events = timeline?.events || [];

  // Keyboard navigation for timeline (arrow keys) - smooth GPU-accelerated
  useKeyboardNavigation({
    enabled: true,
    stageRef,
    layerRef,
    animationQueue,
    animationDuration: 1200,
    yearSpacing: EVENT_SPACING,
  });

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

  // Cleanup on unmount - cancel animations
  useEffect(() => {
    return () => {
      const stage = stageRef.current;
      if (stage) {
        stage.stopDrag();
        // Cancel all tweens on the stage
        const tweens = stage.find('Tween');
        tweens.forEach((tween: any) => {
          if (tween.destroy) {
            tween.destroy();
          }
        });
      }
    };
  }, []);

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

    // Center on event with smooth GPU-accelerated animation
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (!stage) return;

    const newX = width / 2 - eventX * zoom;
    const newY = height / 2 - eventY * zoom;

    // Disable shadows for performance boost during animation
    if (layer) {
      disableShadowsDuringAnimation(layer);
    }

    // Set animation flag BEFORE starting animation
    useViewportStore.setState({ animationInProgress: true });

    // Use AnimationQueue for smooth, conflict-free transitions
    animationQueue.add({
      stage: stage,
      target: {
        x: newX,
        y: newY,
        scaleX: zoom,
        scaleY: zoom,
      },
      duration: 1.2,
      easing: Konva.Easings.EaseInOut,
      priority: 10,
    }).then(() => {
      // Re-enable shadows after animation
      if (layer) {
        enableShadowsAfterAnimation(layer);
      }

      // Update state to match final position
      setPosition(newX, newY);

      // Clear animation flag with small delay to prevent Canvas re-animation
      setTimeout(() => {
        useViewportStore.setState({ animationInProgress: false });
      }, 50);
    }).catch((err) => {
      console.warn('[TimelineCanvas] Animation cancelled:', err);
      useViewportStore.setState({ animationInProgress: false });
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

  // Apply viewport culling for events (only render visible ones)
  const visibleEvents = useMemo(() => {
    if (!stageRef.current || events.length === 0) {
      return events;
    }

    const stage = stageRef.current;
    const stageWidth = stage.width();
    const stageHeight = stage.height();
    const scale = stage.scaleX();
    const position = stage.position();

    // Calculate visible bounds in world coordinates (with 500px buffer)
    const buffer = 500;
    const minX = -position.x / scale - buffer;
    const maxX = (-position.x + stageWidth) / scale + buffer;
    const minY = -position.y / scale - buffer;
    const maxY = (-position.y + stageHeight) / scale + buffer;

    // Filter events that are within visible bounds
    return events.filter(event => {
      const eventX = dateToX(event.date);
      const trackIdx = getTrackIndex(event.track);
      const eventY = TIMELINE_HEIGHT + trackIdx * (TRACK_HEIGHT + TRACK_SPACING) + TRACK_HEIGHT / 2;

      return eventX >= minX && eventX <= maxX && eventY >= minY && eventY <= maxY;
    });
  }, [events, x, y, zoom, width, height, timeline]);

  // Calculate label positions with collision detection (for visible events only)
  const labelPositions = useMemo(() => {
    if (!tracks || visibleEvents.length === 0) {
      return new Map();
    }

    // Helper functions for collision detection
    const getEventXForCollision = (eventDate: string): number => {
      return dateToX(eventDate);
    };

    const getEventYForCollision = (trackId: string): number => {
      const trackIdx = getTrackIndex(trackId);
      return TIMELINE_HEIGHT + trackIdx * (TRACK_HEIGHT + TRACK_SPACING) + TRACK_HEIGHT / 2;
    };

    // Calculate collision-free positions
    const positions = calculateLabelPositions(
      visibleEvents,
      tracks,
      getEventXForCollision,
      getEventYForCollision,
      {
        labelHeight: 20,
        charWidth: 7,
        adjustmentStep: 25,
        connectorThreshold: 5,
        maxAttempts: 10,
      }
    );

    return positions;
  }, [visibleEvents, tracks, dateToX, getTrackIndex]);

  // Render visible events only (viewport culling applied)
  const renderEvents = () => {
    return visibleEvents.map((event) => {
      const eventX = dateToX(event.date);
      const trackIdx = getTrackIndex(event.track);
      const eventY = TIMELINE_HEIGHT + trackIdx * (TRACK_HEIGHT + TRACK_SPACING) + TRACK_HEIGHT / 2;

      const track = tracks.find(t => t.id === event.track);
      const color = track?.color || '#3B82F6';

      // Get collision-free label position
      const labelPos = labelPositions.get(event.id);
      const labelX = labelPos ? labelPos.x + 15 : eventX + 15;
      const labelY = labelPos ? labelPos.y - 8 : eventY - 8;
      const needsConnector = labelPos ? labelPos.needsConnector : false;

      return (
        <Group key={event.id}>
          {/* Event circle */}
          <Circle
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

          {/* Connector line (if label was adjusted) */}
          {needsConnector && (
            <Line
              points={[
                eventX + 15,
                eventY,
                labelX - 5,
                labelY + 8,
              ]}
              stroke={color}
              strokeWidth={1}
              opacity={0.5}
              dash={[3, 3]}
            />
          )}

          {/* Event label with collision-free position */}
          <Text
            x={labelX}
            y={labelY}
            text={event.title}
            fontSize={13}
            fontFamily="Inter"
            fontStyle="500"
            fill="#1F2937"
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
        </Group>
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
            <Layer ref={layerRef}>
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
