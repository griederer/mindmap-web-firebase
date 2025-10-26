/**
 * Relationship Assignment Submenu
 * DOM-based submenu for assigning nodes to relationships
 */

import { useRelationshipStore } from '../../stores/relationshipStore';

interface RelationshipAssignMenuProps {
  nodeId: string;
  nodeX: number;
  nodeY: number;
  viewportX: number;
  viewportY: number;
  zoom: number;
  onClose: () => void;
}

export default function RelationshipAssignMenu({
  nodeId,
  nodeX,
  nodeY,
  viewportX,
  viewportY,
  zoom,
  onClose,
}: RelationshipAssignMenuProps) {
  const { relationships, toggleNodeInRelationship } = useRelationshipStore();

  // Convert Konva coordinates to screen coordinates
  const screenX = (nodeX * zoom) + viewportX;
  const screenY = (nodeY * zoom) + viewportY;

  const handleToggle = (relationshipId: string) => {
    toggleNodeInRelationship(relationshipId, nodeId);
  };

  if (relationships.length === 0) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-[60]"
          onClick={onClose}
        />

        {/* Empty state message */}
        <div
          className="fixed bg-gray-900 text-white rounded-lg shadow-2xl p-4 z-[70] border border-gray-700"
          style={{
            left: `${screenX + 100}px`,
            top: `${screenY - 40}px`,
            minWidth: '250px',
          }}
        >
          <p className="text-sm text-gray-400">
            No relationships created yet. Use the Relationships button (top right) to create one.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60]"
        onClick={onClose}
      />

      {/* Submenu */}
      <div
        className="fixed bg-gray-900 rounded-lg shadow-2xl p-3 z-[70] border border-gray-700"
        style={{
          left: `${screenX + 100}px`,
          top: `${screenY - 40}px`,
          minWidth: '250px',
          maxWidth: '300px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        <h3 className="text-white font-medium text-sm mb-3">
          Assign to Relationships
        </h3>

        <div className="space-y-2">
          {relationships.map((rel) => {
            const isAssigned = rel.nodeIds.includes(nodeId);

            return (
              <label
                key={rel.id}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isAssigned}
                  onChange={() => handleToggle(rel.id)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-gray-900 cursor-pointer"
                />
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: rel.color }}
                />
                <span className="text-white text-sm flex-1 truncate">
                  {rel.title}
                </span>
                <span className="text-xs text-gray-500">
                  {rel.nodeIds.length}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
}
