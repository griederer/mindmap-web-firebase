/**
 * Canvas Component - Konva
 * Main canvas container for rendering mind map with zoom and pan
 */

import { useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { useViewportStore } from '../../stores/viewportStore';
import { useProjectStore } from '../../stores/projectStore';
import NodeComponent from './NodeComponent';
import Connector from './Connector';

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Viewport state
  const { x, y, zoom, width, height, setViewportSize } = useViewportStore();
  
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
          width={width}
          height={height}
          scaleX={zoom}
          scaleY={zoom}
          x={x}
          y={y}
          draggable
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
    </div>
  );
}
