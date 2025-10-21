/**
 * Layout Engine
 * Calculates node positions in horizontal tree layout
 */

import { Node, NodeId } from '../types/node';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const HORIZONTAL_SPACING = 100; // Space between parent and children
const VERTICAL_SPACING = 40; // Minimum space between sibling nodes

interface LayoutResult {
  nodes: Record<NodeId, Node>;
}

/**
 * Calculate horizontal tree layout
 * Children are positioned to the right of parent with vertical spacing
 */
export function calculateLayout(
  nodes: Record<NodeId, Node>,
  rootNodeId: NodeId
): LayoutResult {
  const updatedNodes = { ...nodes };
  
  // Start root at origin
  if (updatedNodes[rootNodeId]) {
    updatedNodes[rootNodeId] = {
      ...updatedNodes[rootNodeId],
      position: { x: 100, y: 300 },
    };
  }
  
  // Recursively position children
  const positionChildren = (parentId: NodeId, parentY: number) => {
    const parent = updatedNodes[parentId];
    if (!parent || parent.children.length === 0) return;
    
    const childIds = parent.children;
    const totalHeight = childIds.length * NODE_HEIGHT + (childIds.length - 1) * VERTICAL_SPACING;
    
    // Center children vertically around parent
    let currentY = parentY - totalHeight / 2 + NODE_HEIGHT / 2;
    
    childIds.forEach((childId) => {
      const child = updatedNodes[childId];
      if (child) {
        // Position child to the right of parent
        const childX = parent.position.x + NODE_WIDTH + HORIZONTAL_SPACING;
        
        updatedNodes[childId] = {
          ...child,
          position: { x: childX, y: currentY },
        };
        
        // Recursively position this child's children
        positionChildren(childId, currentY + NODE_HEIGHT / 2);
        
        // Move to next sibling position
        currentY += NODE_HEIGHT + VERTICAL_SPACING;
      }
    });
  };
  
  // Start layout from root
  positionChildren(rootNodeId, updatedNodes[rootNodeId]?.position.y || 300);
  
  return { nodes: updatedNodes };
}

/**
 * Get bounding box of all visible nodes
 */
export function getNodesBounds(nodes: Record<NodeId, Node>): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  const visibleNodes = Object.values(nodes).filter(n => n.isVisible);
  
  if (visibleNodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  visibleNodes.forEach(node => {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + NODE_WIDTH);
    maxY = Math.max(maxY, node.position.y + NODE_HEIGHT);
  });
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
