/**
 * Canvas Component - Konva
 * Main canvas container for rendering mind map with zoom and pan
 */

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import Konva from 'konva';
import { useViewportStore } from '../../stores/viewportStore';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import { Node } from '../../types/node';
import NodeComponent from './NodeComponent';
import Connector from './Connector';
import ZoomControls from './ZoomControls';
import NodeActionMenu from './NodeActionMenu';
import NodeInfoPanel from './NodeInfoPanel';
import NodeEditModal from './NodeEditModal';
import ImageViewer from './ImageViewer';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const ZOOM_SPEED = 0.1;

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Viewport state
  const { x, y, zoom, width, height, setViewportSize, setZoom, setPosition, autoFocusEnabled, focusOnNodes, focusOnNodeWithPanel } = useViewportStore();

  // Project state
  const { nodes, rootNodeId, addNode, deleteNode, updateNode } = useProjectStore();

  // UI state
  const {
    selectedNodeId,
    selectNode,
    infoPanelNodeId,
    focusedNodeId,
    toggleInfoPanel,
    setFocusMode,
  } = useUIStore();

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [nodeToEdit, setNodeToEdit] = useState<Node | null>(null);

  // Image viewer state
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<import('../../types/node').NodeImage[]>([]);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);

  // Close edit modal if node becomes invisible
  useEffect(() => {
    if (nodeToEdit && !nodes[nodeToEdit.id]?.isVisible) {
      setEditModalOpen(false);
      setNodeToEdit(null);
    }
  }, [nodeToEdit, nodes]);

  // Track previous visible nodes to detect changes
  const previousVisibleNodesRef = useRef<Set<string>>(new Set());

  // Auto Focus: Watch for node expansion/collapse
  useEffect(() => {
    if (!autoFocusEnabled) return;

    // Get current visible node IDs
    const currentVisibleIds = new Set(
      Object.values(nodes).filter(node => node.isVisible).map(node => node.id)
    );

    const previousVisibleIds = previousVisibleNodesRef.current;

    // Detect if this is the first render (no previous state)
    if (previousVisibleIds.size === 0) {
      previousVisibleNodesRef.current = currentVisibleIds;
      return;
    }

    // Check if visible nodes changed
    const visibilityChanged =
      currentVisibleIds.size !== previousVisibleIds.size ||
      [...currentVisibleIds].some(id => !previousVisibleIds.has(id)) ||
      [...previousVisibleIds].some(id => !currentVisibleIds.has(id));

    if (!visibilityChanged) return;

    // Focus on ALL currently visible nodes
    const nodesToFocus = [...currentVisibleIds];

    console.log('[Auto Focus] Visibility change detected:', {
      previous: previousVisibleIds.size,
      current: currentVisibleIds.size,
      nodesToFocus: nodesToFocus.slice(0, 5) // Show first 5 for debugging
    });

    // Trigger Auto Focus FIRST
    focusOnNodes(nodesToFocus, true);

    // CRITICAL: Update ref AFTER calling focusOnNodes
    // This ensures the viewport state change happens before we update our tracking
    // Small delay allows the animation system to process the state change
    setTimeout(() => {
      previousVisibleNodesRef.current = currentVisibleIds;
    }, 100);
  }, [nodes, autoFocusEnabled, focusOnNodes]);

  // Auto Focus: Watch for info panel display and focus on node + panel
  useEffect(() => {
    if (!autoFocusEnabled || !infoPanelNodeId) return;

    const node = nodes[infoPanelNodeId];
    if (!node) return;

    // Calculate approximate panel height based on content
    // Base height + description lines + images
    const PANEL_WIDTH = 240;
    const BASE_HEIGHT = 120; // Header + padding
    const descriptionLines = Math.ceil((node.description?.length || 0) / 30);
    const descriptionHeight = descriptionLines * 20;
    const imagesHeight = (node.images?.length || 0) * 80; // Thumbnail height
    const estimatedPanelHeight = BASE_HEIGHT + descriptionHeight + imagesHeight;

    console.log('[Auto Focus] Info panel detected:', {
      nodeId: infoPanelNodeId,
      panelWidth: PANEL_WIDTH,
      panelHeight: estimatedPanelHeight
    });

    // CRITICAL: Call Auto Focus IMMEDIATELY (no delay)
    // The 50ms debounce in the animation system will handle batching
    console.log('[Auto Focus] Calling focusOnNodeWithPanel immediately');
    focusOnNodeWithPanel(infoPanelNodeId, PANEL_WIDTH, estimatedPanelHeight, true);
  }, [infoPanelNodeId, autoFocusEnabled, nodes, focusOnNodeWithPanel]);

  // Track if we should animate (vs instant update for manual interactions)
  const shouldAnimateRef = useRef(true);
  const previousValuesRef = useRef({ x, y, zoom });
  const animationTimeoutRef = useRef<number | null>(null);
  const initialPositionSetRef = useRef(false);

  // Set initial position once
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || initialPositionSetRef.current) return;

    stage.x(x);
    stage.y(y);
    stage.scaleX(zoom);
    stage.scaleY(zoom);
    initialPositionSetRef.current = true;
  }, [x, y, zoom]);

  // Smooth camera transitions using Konva animations
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !initialPositionSetRef.current) return;

    const prev = previousValuesRef.current;
    const hasChanged = prev.x !== x || prev.y !== y || prev.zoom !== zoom;

    if (!hasChanged) return;

    // Check if this is a manual interaction (wheel or drag)
    const isManualInteraction = !shouldAnimateRef.current;

    // DEBUG: Log animation trigger
    console.log('[Animation]', {
      type: isManualInteraction ? 'MANUAL' : 'AUTO_FOCUS',
      from: { x: prev.x, y: prev.y, zoom: prev.zoom },
      to: { x, y, zoom },
      shouldAnimate: shouldAnimateRef.current,
      timeoutPending: animationTimeoutRef.current !== null
    });

    if (isManualInteraction) {
      // Instant update for manual interactions
      console.log('[Animation] Applying instant update');
      stage.x(x);
      stage.y(y);
      stage.scaleX(zoom);
      stage.scaleY(zoom);
      shouldAnimateRef.current = true; // Reset for next Auto Focus
      previousValuesRef.current = { x, y, zoom };
    } else {
      // Debounce: Wait for all values (x, y, zoom) to arrive before animating
      if (animationTimeoutRef.current !== null) {
        console.log('[Animation] Clearing previous timeout');
        clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = window.setTimeout(() => {
        const from = { x: stage.x(), y: stage.y(), zoom: stage.scaleX() };
        const to = { x, y, zoom };
        const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));

        console.log('[Animation] Starting smooth animation:', {
          from,
          to,
          distance: distance.toFixed(2),
          zoomChange: (to.zoom - from.zoom).toFixed(3),
          duration: '4.0s'
        });

        // CRITICAL FIX: Ensure stage is at current position before animating
        // This prevents Konva from starting animation from wrong position
        const currentX = stage.x();
        const currentY = stage.y();
        const currentZoom = stage.scaleX();

        // Only animate if there's actually a change
        const hasSignificantChange =
          Math.abs(currentX - x) > 0.1 ||
          Math.abs(currentY - y) > 0.1 ||
          Math.abs(currentZoom - zoom) > 0.01;

        if (!hasSignificantChange) {
          console.log('[Animation] No significant change, skipping animation');
          previousValuesRef.current = { x, y, zoom };
          return;
        }

        // Smooth animation for Auto Focus
        // Note: Konva's .to() automatically stops previous animations on same properties
        stage.to({
          x,
          y,
          scaleX: zoom,
          scaleY: zoom,
          duration: 5.2, // 5.2 seconds (30% slower than 4s)
          easing: Konva.Easings.EaseInOut,
          onFinish: () => {
            console.log('[Animation] Animation completed');
            previousValuesRef.current = { x, y, zoom };
          }
        });
      }, 50); // Wait 50ms for all state updates to batch together
    }

    // Cleanup timeout on unmount
    return () => {
      if (animationTimeoutRef.current !== null) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [x, y, zoom]);

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

    // Disable animation for manual wheel zoom
    shouldAnimateRef.current = false;

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
    // Disable animation for manual drag
    shouldAnimateRef.current = false;

    const stage = e.target as Konva.Stage;
    setPosition(stage.x(), stage.y());
  };

  // Handle stage click to deselect node (click on empty space)
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Only deselect if clicking on the stage itself (not on a node)
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectNode(null);
      // Also close info panel when clicking on empty space
      if (infoPanelNodeId) {
        toggleInfoPanel(null);
      }
    }
  };
  
  // Get all nodes (including invisible ones for fade-out animation)
  const allNodes = Object.values(nodes);

  // Get all connectors (between parent and child nodes where both exist)
  const connectors: Array<{ from: string; to: string }> = [];
  allNodes.forEach(node => {
    if (node.parentId && nodes[node.parentId]) {
      connectors.push({ from: node.parentId, to: node.id });
    }
  });

  // Get selected node for action menu positioning
  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;
  const NODE_WIDTH = 200;
  const NODE_HEIGHT = 60;

  // Action menu handlers
  const handleEdit = () => {
    if (selectedNodeId && selectedNode) {
      setNodeToEdit(selectedNode);
      setEditModalOpen(true);
    }
  };

  const handleSaveEdit = (nodeId: string, updates: { title: string; description: string; images?: import('../../types/node').NodeImage[] }) => {
    updateNode(nodeId, updates);
  };

  const handleShowInfo = () => {
    if (selectedNodeId) {
      toggleInfoPanel(selectedNodeId);
    }
  };

  const handleFocus = () => {
    if (selectedNodeId) {
      // Toggle focus - if already focused, turn it off
      if (focusedNodeId === selectedNodeId) {
        setFocusMode(null);
      } else {
        setFocusMode(selectedNodeId);
      }
    }
  };

  const handleAddChild = () => {
    if (selectedNodeId && selectedNode) {
      const title = prompt('Enter child node title:');
      if (title) {
        const newNode: Node = {
          id: `node-${Date.now()}`,
          title,
          description: '',
          level: selectedNode.level + 1,
          position: { x: 0, y: 0 }, // Will be calculated by layout
          children: [],
          parentId: selectedNodeId,
          isExpanded: true,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        addNode(newNode);
      }
    }
  };

  const handleDelete = () => {
    if (selectedNodeId && selectedNode && selectedNode.parentId) {
      if (confirm(`Delete "${selectedNode.title}"?`)) {
        deleteNode(selectedNodeId);
      }
    }
  };
  
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
          draggable
          onWheel={handleWheel}
          onDragEnd={handleDragEnd}
          onClick={handleStageClick}
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
            
            {/* Render all nodes (visibility handled by component) */}
            {allNodes.map(node => (
              <NodeComponent
                key={node.id}
                node={node}
              />
            ))}

            {/* Render action menu above selected node (only if visible) */}
            {selectedNode && selectedNode.isVisible && (
              <NodeActionMenu
                x={selectedNode.position.x}
                y={selectedNode.position.y}
                onEdit={handleEdit}
                onShowInfo={handleShowInfo}
                onFocus={handleFocus}
                onAddChild={handleAddChild}
                onDelete={handleDelete}
              />
            )}

            {/* Render info panel next to node */}
            {infoPanelNodeId && nodes[infoPanelNodeId] && (
              <NodeInfoPanel
                node={nodes[infoPanelNodeId]}
                nodeWidth={NODE_WIDTH}
                nodeHeight={NODE_HEIGHT}
                onImageClick={(index) => {
                  const node = nodes[infoPanelNodeId];
                  if (node.images && node.images.length > 0) {
                    setViewerImages(node.images);
                    setViewerInitialIndex(index);
                    setImageViewerOpen(true);
                  }
                }}
              />
            )}
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

      {/* Edit modal */}
      {nodeToEdit && (
        <NodeEditModal
          node={nodeToEdit}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          viewportX={x}
          viewportY={y}
          zoom={zoom}
        />
      )}

      {/* Image viewer */}
      <ImageViewer
        images={viewerImages}
        initialIndex={viewerInitialIndex}
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
      />
    </div>
  );
}
