/**
 * Relationship Lines Component
 * Renders mesh connections for custom node relationships with curved lines
 */

import { Line, Path } from 'react-konva';
import { useRelationshipStore } from '../../stores/relationshipStore';
import { useProjectStore } from '../../stores/projectStore';
import { Node } from '../../types/node';
import { Relationship } from '../../types/relationship';

export default function RelationshipLines() {
  const { getVisibleRelationships } = useRelationshipStore();
  const { nodes } = useProjectStore();

  const visibleRelationships = getVisibleRelationships();

  // Generate mesh connections for each relationship
  const generateMeshConnections = (relationship: Relationship): Array<{ from: Node; to: Node }> => {
    const connections: Array<{ from: Node; to: Node }> = [];

    // Get all visible nodes in this relationship
    const relationshipNodes = relationship.nodeIds
      .map((id) => nodes[id])
      .filter((node) => node && node.isVisible);

    // Create connections between all pairs (mesh pattern)
    for (let i = 0; i < relationshipNodes.length; i++) {
      for (let j = i + 1; j < relationshipNodes.length; j++) {
        connections.push({
          from: relationshipNodes[i],
          to: relationshipNodes[j],
        });
      }
    }

    return connections;
  };

  // Convert line type to dash pattern
  const getDashPattern = (lineType: Relationship['lineType']): number[] | undefined => {
    switch (lineType) {
      case 'solid':
        return undefined;
      case 'dashed':
        return [10, 5];
      case 'dotted':
        return [2, 4];
      default:
        return undefined;
    }
  };

  // Generate SVG path for curved connection (quadratic Bézier)
  const generateCurvedPath = (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    curvature: number = 0.3
  ): string => {
    // Calculate midpoint
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;

    // Calculate perpendicular offset for control point
    const dx = toX - fromX;
    const dy = toY - fromY;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Perpendicular vector (rotated 90 degrees)
    const perpX = -dy / length;
    const perpY = dx / length;

    // Control point offset (creates the curve)
    const offset = length * curvature;
    const controlX = midX + perpX * offset;
    const controlY = midY + perpY * offset;

    // SVG path: M (move to start) Q (quadratic curve to end with control point)
    return `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;
  };

  return (
    <>
      {visibleRelationships.map((relationship) => {
        const connections = generateMeshConnections(relationship);
        const dashPattern = getDashPattern(relationship.lineType);

        return connections.map(({ from, to }, index) => {
          const NODE_WIDTH = 200;
          const NODE_HEIGHT = 100;

          // Calculate connection points (center of nodes)
          const fromX = from.position.x + NODE_WIDTH / 2;
          const fromY = from.position.y + NODE_HEIGHT / 2;
          const toX = to.position.x + NODE_WIDTH / 2;
          const toY = to.position.y + NODE_HEIGHT / 2;

          // Generate curved path
          const curvePath = generateCurvedPath(fromX, fromY, toX, toY, 0.3);

          return (
            <Path
              key={`${relationship.id}-${from.id}-${to.id}-${index}`}
              data={curvePath}
              stroke={relationship.color}
              strokeWidth={relationship.lineWidth}
              dash={dashPattern}
              opacity={0.7}
              listening={false}
              lineCap="round"
              lineJoin="round"
            />
          );
        });
      })}
    </>
  );
}
