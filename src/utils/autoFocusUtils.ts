/**
 * Auto Focus Utilities
 * Algorithms for bounding box calculation, dynamic zoom, and camera positioning
 */

import { Node, NodeId } from '../types/node';

/**
 * Bounding box representing the area occupied by nodes
 */
export interface BoundingBox {
  x: number;      // Top-left X coordinate
  y: number;      // Top-left Y coordinate
  width: number;  // Total width
  height: number; // Total height
}

/**
 * Viewport dimensions
 */
export interface ViewportDimensions {
  width: number;  // Viewport width in pixels
  height: number; // Viewport height in pixels
}

/**
 * Camera position in canvas space
 */
export interface CameraPosition {
  x: number; // Camera X offset
  y: number; // Camera Y offset
}

/**
 * Constants for Auto Focus calculations
 */
export const AUTO_FOCUS_CONSTANTS = {
  NODE_WIDTH: 200,       // Standard node width
  NODE_HEIGHT: 60,       // Standard node height
  PADDING: 100,          // Padding around content
  MIN_ZOOM: 0.25,        // Minimum zoom level (25%)
  MAX_ZOOM: 4.0,         // Maximum zoom level (400%)
  COMFORT_FACTOR: 0.9,   // 10% breathing room
} as const;

/**
 * Calculate bounding box for a set of nodes with padding
 *
 * @param nodes - Record of all nodes in the project
 * @param nodeIds - Array of node IDs to include in bounding box
 * @returns BoundingBox containing all specified nodes plus padding
 */
export function calculateBoundingBox(
  nodes: Record<NodeId, Node>,
  nodeIds: NodeId[]
): BoundingBox {
  const { NODE_WIDTH, NODE_HEIGHT, PADDING } = AUTO_FOCUS_CONSTANTS;

  // Handle empty array
  if (nodeIds.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  // Find bounds of all specified nodes
  nodeIds.forEach(nodeId => {
    const node = nodes[nodeId];
    if (!node) return; // Skip missing nodes

    const nodeX = node.position.x;
    const nodeY = node.position.y;

    minX = Math.min(minX, nodeX);
    minY = Math.min(minY, nodeY);
    maxX = Math.max(maxX, nodeX + NODE_WIDTH);
    maxY = Math.max(maxY, nodeY + NODE_HEIGHT);
  });

  // Handle case where no valid nodes found
  if (minX === Infinity) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  // Add padding and return bounding box
  return {
    x: minX - PADDING,
    y: minY - PADDING,
    width: (maxX - minX) + (PADDING * 2),
    height: (maxY - minY) + (PADDING * 2),
  };
}

/**
 * Calculate optimal zoom level to fit content in viewport
 *
 * @param bbox - Bounding box of content to fit
 * @param viewport - Viewport dimensions
 * @returns Optimal zoom level (clamped to MIN_ZOOM and MAX_ZOOM)
 */
export function calculateOptimalZoom(
  bbox: BoundingBox,
  viewport: ViewportDimensions
): number {
  const { MIN_ZOOM, MAX_ZOOM, COMFORT_FACTOR } = AUTO_FOCUS_CONSTANTS;

  // Handle empty bounding box
  if (bbox.width === 0 || bbox.height === 0) {
    return 1; // Default zoom
  }

  // Calculate zoom needed to fit horizontally and vertically
  const zoomX = (viewport.width / bbox.width) * COMFORT_FACTOR;
  const zoomY = (viewport.height / bbox.height) * COMFORT_FACTOR;

  // Use the smaller zoom (most restrictive dimension)
  const optimalZoom = Math.min(zoomX, zoomY);

  // Clamp to min/max bounds
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, optimalZoom));
}

/**
 * Calculate camera position to center content in viewport
 *
 * @param bbox - Bounding box of content to center
 * @param zoom - Current zoom level
 * @param viewport - Viewport dimensions
 * @returns Camera position (x, y offsets)
 */
export function calculateCameraPosition(
  bbox: BoundingBox,
  zoom: number,
  viewport: ViewportDimensions
): CameraPosition {
  // Calculate center point of bounding box
  const centerX = bbox.x + bbox.width / 2;
  const centerY = bbox.y + bbox.height / 2;

  // Calculate camera position to center this point in viewport
  // Camera position is: viewport_center - (content_center * zoom)
  return {
    x: viewport.width / 2 - centerX * zoom,
    y: viewport.height / 2 - centerY * zoom,
  };
}

/**
 * Calculate bounding box for a node with its info panel visible
 * Info panel appears to the right of the node
 *
 * @param nodes - Record of all nodes in the project
 * @param nodeId - ID of the node with visible info panel
 * @param panelWidth - Width of the info panel
 * @param panelHeight - Height of the info panel
 * @returns BoundingBox containing node + panel + padding
 */
export function calculateBoundingBoxWithPanel(
  nodes: Record<NodeId, Node>,
  nodeId: NodeId,
  panelWidth: number,
  panelHeight: number
): BoundingBox {
  const { NODE_WIDTH, NODE_HEIGHT, PADDING } = AUTO_FOCUS_CONSTANTS;

  const node = nodes[nodeId];
  if (!node) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const nodeX = node.position.x;
  const nodeY = node.position.y;

  // Panel is positioned to the right of the node (with small gap)
  const PANEL_GAP = 20;
  const panelX = nodeX + NODE_WIDTH + PANEL_GAP;

  // Calculate bounds that include both node and panel
  const minX = nodeX;
  const minY = Math.min(nodeY, nodeY); // Node top
  const maxX = panelX + panelWidth;
  const maxY = Math.max(nodeY + NODE_HEIGHT, nodeY + panelHeight);

  // Add padding and return
  return {
    x: minX - PADDING,
    y: minY - PADDING,
    width: (maxX - minX) + (PADDING * 2),
    height: (maxY - minY) + (PADDING * 2),
  };
}
