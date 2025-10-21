/**
 * Layout Engine
 * Calculates node positions in horizontal tree layout with proper subtree spacing
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
 * Calculate the total height of a subtree (only visible/expanded nodes)
 */
function calculateSubtreeHeight(
  nodes: Record<NodeId, Node>,
  nodeId: NodeId
): number {
  const node = nodes[nodeId];
  if (!node) return 0;

  // If node has no visible children, return just its own height
  if (!node.isExpanded || node.children.length === 0) {
    return NODE_HEIGHT;
  }

  // Calculate height of all visible children
  const childrenHeight = node.children.reduce((total, childId) => {
    const child = nodes[childId];
    if (!child || !child.isVisible) return total;
    return total + calculateSubtreeHeight(nodes, childId) + VERTICAL_SPACING;
  }, 0) - VERTICAL_SPACING; // Remove last spacing

  // Return the larger of: node height or children total height
  return Math.max(NODE_HEIGHT, childrenHeight);
}

/**
 * Calculate horizontal tree layout
 * Children are positioned to the right of parent with vertical spacing
 * Takes into account subtree heights to avoid overlaps
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
  const positionChildren = (parentId: NodeId, parentCenterY: number) => {
    const parent = updatedNodes[parentId];
    if (!parent || !parent.isExpanded || parent.children.length === 0) return;

    const visibleChildren = parent.children.filter(
      childId => updatedNodes[childId]?.isVisible
    );

    if (visibleChildren.length === 0) return;

    // Calculate total height needed for all children and their subtrees
    const subtreeHeights = visibleChildren.map(childId =>
      calculateSubtreeHeight(updatedNodes, childId)
    );

    const totalHeight = subtreeHeights.reduce((sum, h) => sum + h, 0) +
      (visibleChildren.length - 1) * VERTICAL_SPACING;

    // Start positioning from top
    let currentY = parentCenterY - totalHeight / 2;

    visibleChildren.forEach((childId, index) => {
      const child = updatedNodes[childId];
      const subtreeHeight = subtreeHeights[index];

      if (child) {
        // Position child to the right of parent
        const childX = parent.position.x + NODE_WIDTH + HORIZONTAL_SPACING;

        // Center the child within its subtree height
        const childCenterY = currentY + subtreeHeight / 2;

        updatedNodes[childId] = {
          ...child,
          position: { x: childX, y: childCenterY - NODE_HEIGHT / 2 },
        };

        // Recursively position this child's children
        positionChildren(childId, childCenterY);

        // Move to next sibling position (after this subtree)
        currentY += subtreeHeight + VERTICAL_SPACING;
      }
    });
  };

  // Start layout from root
  const rootY = updatedNodes[rootNodeId]?.position.y || 300;
  positionChildren(rootNodeId, rootY + NODE_HEIGHT / 2);

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
