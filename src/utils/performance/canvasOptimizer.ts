/**
 * Canvas Performance Optimization Utilities
 * Provides utilities for optimizing Konva canvas rendering performance
 */

import Konva from 'konva';
import { Node } from '../../types/node';

/**
 * Enable batch drawing on a Konva layer
 * Replaces immediate draw() calls with batched updates for better performance
 */
export function enableBatchDrawing(layer: Konva.Layer): void {
  // Konva automatically batches draw calls when using batchDraw()
  // This is a no-op function but serves as documentation
  // In practice, replace layer.draw() with layer.batchDraw() in code
}

/**
 * Setup viewport culling to render only visible nodes
 * Returns filtered array of nodes that are within viewport bounds + buffer
 *
 * @param stage - Konva stage instance
 * @param nodes - All nodes in the project
 * @param buffer - Extra pixels to include beyond viewport (default: 500)
 * @returns Filtered array of visible nodes
 */
export function setupViewportCulling(
  stage: Konva.Stage,
  nodes: Node[],
  buffer: number = 500
): Node[] {
  // Get stage dimensions and position
  const stageWidth = stage.width();
  const stageHeight = stage.height();
  const scale = stage.scaleX(); // Assuming uniform scale
  const position = stage.position();

  // Calculate visible bounds in world coordinates
  const minX = -position.x / scale - buffer;
  const maxX = (-position.x + stageWidth) / scale + buffer;
  const minY = -position.y / scale - buffer;
  const maxY = (-position.y + stageHeight) / scale + buffer;

  // Filter nodes that are within visible bounds
  return nodes.filter(node => {
    const { x, y } = node;
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  });
}

/**
 * Cache a complex node for improved rendering performance
 * Only caches nodes with >5 child elements
 *
 * @param nodeShape - Konva group representing the node
 */
export function cacheComplexNode(nodeShape: Konva.Group): void {
  // Check if node has enough children to benefit from caching
  const children = nodeShape.getChildren();
  if (children.length > 5) {
    // Apply cache with optimal pixel ratio for performance
    nodeShape.cache({ pixelRatio: 1 });
  }
}

/**
 * Clear cache from a node when it's edited
 *
 * @param nodeShape - Konva group representing the node
 */
export function clearNodeCache(nodeShape: Konva.Group): void {
  nodeShape.clearCache();
}

/**
 * Disable shadows on all shapes in a layer temporarily
 * Used during animations to improve performance
 *
 * @param layer - Konva layer to disable shadows on
 */
export function disableShadowsDuringAnimation(layer: Konva.Layer): void {
  // Store original shadow settings
  const shapes = layer.find('Shape'); // Get all shapes

  shapes.forEach(shape => {
    // Store original shadow settings as metadata
    const shadowBlur = shape.shadowBlur();
    const shadowColor = shape.shadowColor();
    const shadowOffsetX = shape.shadowOffsetX();
    const shadowOffsetY = shape.shadowOffsetY();
    const shadowOpacity = shape.shadowOpacity();
    const shadowEnabled = shape.shadowEnabled();

    // Store in custom data attribute
    shape.setAttr('_originalShadow', {
      shadowBlur,
      shadowColor,
      shadowOffsetX,
      shadowOffsetY,
      shadowOpacity,
      shadowEnabled,
    });

    // Disable shadows
    shape.shadowEnabled(false);
  });

  layer.batchDraw();
}

/**
 * Re-enable shadows on all shapes in a layer after animation
 * Restores shadows to their original state
 *
 * @param layer - Konva layer to restore shadows on
 */
export function enableShadowsAfterAnimation(layer: Konva.Layer): void {
  // Restore shadow settings
  const shapes = layer.find('Shape');

  shapes.forEach(shape => {
    const originalShadow = shape.getAttr('_originalShadow');

    if (originalShadow) {
      // Restore original shadow settings
      shape.shadowBlur(originalShadow.shadowBlur);
      shape.shadowColor(originalShadow.shadowColor);
      shape.shadowOffsetX(originalShadow.shadowOffsetX);
      shape.shadowOffsetY(originalShadow.shadowOffsetY);
      shape.shadowOpacity(originalShadow.shadowOpacity);
      shape.shadowEnabled(originalShadow.shadowEnabled);

      // Clean up metadata
      shape.setAttr('_originalShadow', undefined);
    }
  });

  layer.batchDraw();
}

/**
 * Calculate number of cached nodes in a stage
 * Useful for monitoring cache usage
 *
 * @param stage - Konva stage
 * @returns Number of cached nodes
 */
export function getCachedNodeCount(stage: Konva.Stage): number {
  let count = 0;

  const groups = stage.find('Group');
  groups.forEach(group => {
    if (group.isCached()) {
      count++;
    }
  });

  return count;
}
