/**
 * Canvas Component - Konva
 * Main canvas container for rendering mind map with zoom and pan
 */

import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import { useViewportStore } from '../../stores/viewportStore';
import { useProjectStore } from '../../stores/projectStore';
import NodeComponent from './NodeComponent';
import Connector from './Connector';
import ZoomControls from './ZoomControls';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const ZOOM_SPEED = 0.1;

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Viewport state
  const { x, y, zoom, width, height, setViewportSize, setZoom, setPosition } = useViewportStore();

  // Project state
  const { nodes, rootNodeId } = useProjectStore();
  
  // Update viewport size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setViewportSize(clientWidth, clientHeight);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [setViewportSize]);

  // Handle mouse wheel zoom
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldZoom = zoom;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Calculate new zoom
    const delta = e.evt.deltaY > 0 ? -ZOOM_SPEED : ZOOM_SPEED;
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, oldZoom + delta));

    // Zoom towards cursor position
    const mousePointTo = {
      x: (pointer.x - x) / oldZoom,
      y: (pointer.y - y) / oldZoom,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newZoom,
      y: pointer.y - mousePointTo.y * newZoom,
    };

    setZoom(newZoom);
    setPosition(newPos.x, newPos.y);
  };

  // Handle stage drag to update viewport state
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const stage = e.target as Konva.Stage;
    setPosition(stage.x(), stage.y());
  };
  
  // Get all visible nodes
  const visibleNodes = Object.values(nodes).filter(node => node.isVisible);
  
  // Get all connectors (between visible parent and child nodes)
  const connectors: Array<{ from: string; to: string }> = [];
  visibleNodes.forEach(node => {
    if (node.parentId && nodes[node.parentId]?.isVisible) {
      connectors.push({ from: node.parentId, to: node.id });
    }
  });
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-gray-50"
      style={{ overflow: 'hidden' }}
    >
      {width > 0 && height > 0 && (
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          scaleX={zoom}
          scaleY={zoom}
          x={x}
          y={y}
          draggable
          onWheel={handleWheel}
          onDragEnd={handleDragEnd}
        >
          <Layer>
            {/* Render connectors first (behind nodes) */}
            {connectors.map(({ from, to }) => (
              <Connector
                key={`${from}-${to}`}
                fromNode={nodes[from]}
                toNode={nodes[to]}
              />
            ))}
            
            {/* Render visible nodes */}
            {visibleNodes.map(node => (
              <NodeComponent
                key={node.id}
                node={node}
              />
            ))}
          </Layer>
        </Stage>
      )}
      
      {/* Empty state */}
      {!rootNodeId && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-lg mb-2">No project loaded</p>
            <p className="text-sm">Create or open a project to get started</p>
          </div>
        </div>
      )}

      {/* Zoom controls */}
      {rootNodeId && <ZoomControls />}
    </div>
  );
}
