/**
 * Layout Engine v3.0
 * Calculates node positions for bidirectional organic mindmaps
 * Supports left/right branches with color-coded hierarchy
 */

import { Node, NodeId, LayoutSide, getBranchColor } from '../types/node';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const HORIZONTAL_SPACING = 80; // Space between parent and children
const VERTICAL_SPACING = 30; // Minimum space between sibling nodes
const ROOT_X = 500; // Center X position for root

interface LayoutResult {
  nodes: Record<NodeId, Node>;
}

interface LayoutOptions {
  bidirectional?: boolean; // Enable left/right layout
  autoBalance?: boolean; // Auto-distribute children to both sides
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
 * Determine which side a child should be on (for auto-balance)
 */
function determineLayoutSide(
  childIndex: number,
  totalChildren: number,
  existingSide?: LayoutSide
): 'left' | 'right' {
  // If explicitly set, use that
  if (existingSide === 'left' || existingSide === 'right') {
    return existingSide;
  }

  // Auto-balance: alternate or split evenly
  // First half goes right, second half goes left
  return childIndex < Math.ceil(totalChildren / 2) ? 'right' : 'left';
}

/**
 * Assign branch colors to first-level children
 */
function assignBranchColors(
  nodes: Record<NodeId, Node>,
  rootNodeId: NodeId
): Record<NodeId, Node> {
  const root = nodes[rootNodeId];
  if (!root) return nodes;

  const updatedNodes = { ...nodes };

  // Assign colors to level-1 children
  root.children.forEach((childId, index) => {
    const child = updatedNodes[childId];
    if (child) {
      updatedNodes[childId] = {
        ...child,
        branchIndex: index,
        branchColor: getBranchColor(index),
      };

      // Propagate color to all descendants
      propagateBranchColor(updatedNodes, childId, index);
    }
  });

  return updatedNodes;
}

/**
 * Propagate branch color to all descendants
 */
function propagateBranchColor(
  nodes: Record<NodeId, Node>,
  nodeId: NodeId,
  branchIndex: number
): void {
  const node = nodes[nodeId];
  if (!node) return;

  node.children.forEach(childId => {
    const child = nodes[childId];
    if (child) {
      nodes[childId] = {
        ...child,
        branchIndex,
        branchColor: getBranchColor(branchIndex),
      };
      propagateBranchColor(nodes, childId, branchIndex);
    }
  });
}

/**
 * Calculate bidirectional horizontal tree layout
 * Children can be positioned to left OR right of parent
 */
export function calculateLayout(
  nodes: Record<NodeId, Node>,
  rootNodeId: NodeId,
  options: LayoutOptions = { bidirectional: true, autoBalance: true }
): LayoutResult {
  let updatedNodes = { ...nodes };

  // Assign branch colors first
  updatedNodes = assignBranchColors(updatedNodes, rootNodeId);

  // Position root at center
  if (updatedNodes[rootNodeId]) {
    updatedNodes[rootNodeId] = {
      ...updatedNodes[rootNodeId],
      position: { x: ROOT_X, y: 400 },
      style: updatedNodes[rootNodeId].style || 'boxed',
    };
  }

  const root = updatedNodes[rootNodeId];
  if (!root || !root.isExpanded || root.children.length === 0) {
    return { nodes: updatedNodes };
  }

  // Separate children into left and right groups
  const leftChildren: string[] = [];
  const rightChildren: string[] = [];

  root.children.forEach((childId, index) => {
    const child = updatedNodes[childId];
    if (!child || !child.isVisible) return;

    const side = options.bidirectional
      ? determineLayoutSide(index, root.children.length, child.layoutSide)
      : 'right';

    // Update node with its assigned side
    updatedNodes[childId] = {
      ...updatedNodes[childId],
      layoutSide: side,
    };

    if (side === 'left') {
      leftChildren.push(childId);
    } else {
      rightChildren.push(childId);
    }
  });

  // Position right-side children
  const rootCenterY = root.position.y + NODE_HEIGHT / 2;
  positionChildrenOnSide(updatedNodes, root.position.x, rootCenterY, rightChildren, 'right');

  // Position left-side children
  positionChildrenOnSide(updatedNodes, root.position.x, rootCenterY, leftChildren, 'left');

  return { nodes: updatedNodes };
}

/**
 * Position children on one side (left or right)
 */
function positionChildrenOnSide(
  nodes: Record<NodeId, Node>,
  parentX: number,
  parentCenterY: number,
  childIds: string[],
  side: 'left' | 'right'
): void {
  if (childIds.length === 0) return;

  // Calculate total height needed
  const subtreeHeights = childIds.map(childId =>
    calculateSubtreeHeight(nodes, childId)
  );

  const totalHeight = subtreeHeights.reduce((sum, h) => sum + h, 0) +
    (childIds.length - 1) * VERTICAL_SPACING;

  // Start positioning from top
  let currentY = parentCenterY - totalHeight / 2;

  childIds.forEach((childId, index) => {
    const child = nodes[childId];
    const subtreeHeight = subtreeHeights[index];

    if (child) {
      // Calculate X position based on side
      const childX = side === 'right'
        ? parentX + NODE_WIDTH + HORIZONTAL_SPACING
        : parentX - NODE_WIDTH - HORIZONTAL_SPACING;

      // Center the child within its subtree height
      const childCenterY = currentY + subtreeHeight / 2;

      nodes[childId] = {
        ...child,
        position: { x: childX, y: childCenterY - NODE_HEIGHT / 2 },
        layoutSide: side,
      };

      // Recursively position this child's children (all on same side)
      positionDescendants(nodes, childId, childCenterY, side);

      // Move to next sibling position
      currentY += subtreeHeight + VERTICAL_SPACING;
    }
  });
}

/**
 * Position all descendants of a node (maintaining side)
 */
function positionDescendants(
  nodes: Record<NodeId, Node>,
  parentId: NodeId,
  parentCenterY: number,
  side: 'left' | 'right'
): void {
  const parent = nodes[parentId];
  if (!parent || !parent.isExpanded || parent.children.length === 0) return;

  const visibleChildren = parent.children.filter(
    childId => nodes[childId]?.isVisible
  );

  if (visibleChildren.length === 0) return;

  const subtreeHeights = visibleChildren.map(childId =>
    calculateSubtreeHeight(nodes, childId)
  );

  const totalHeight = subtreeHeights.reduce((sum, h) => sum + h, 0) +
    (visibleChildren.length - 1) * VERTICAL_SPACING;

  let currentY = parentCenterY - totalHeight / 2;

  visibleChildren.forEach((childId, index) => {
    const child = nodes[childId];
    const subtreeHeight = subtreeHeights[index];

    if (child) {
      const childX = side === 'right'
        ? parent.position.x + NODE_WIDTH + HORIZONTAL_SPACING
        : parent.position.x - NODE_WIDTH - HORIZONTAL_SPACING;

      const childCenterY = currentY + subtreeHeight / 2;

      nodes[childId] = {
        ...child,
        position: { x: childX, y: childCenterY - NODE_HEIGHT / 2 },
        layoutSide: side,
      };

      // Recursively position children
      positionDescendants(nodes, childId, childCenterY, side);

      currentY += subtreeHeight + VERTICAL_SPACING;
    }
  });
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

/**
 * Get center point of all visible nodes
 */
export function getNodesCenter(nodes: Record<NodeId, Node>): { x: number; y: number } {
  const bounds = getNodesBounds(nodes);
  return {
    x: bounds.minX + bounds.width / 2,
    y: bounds.minY + bounds.height / 2,
  };
}

// Export constants for use in components
export { NODE_WIDTH, NODE_HEIGHT, ROOT_X };
