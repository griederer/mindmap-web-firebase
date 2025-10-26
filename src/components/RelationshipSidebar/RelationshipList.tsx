/**
 * Relationship List Component
 * Displays all relationships with toggle, edit, and delete actions
 */

import { useRelationshipStore } from '../../stores/relationshipStore';
import { useViewportStore } from '../../stores/viewportStore';

interface RelationshipListProps {
  onEdit: (id: string) => void;
}

export default function RelationshipList({ onEdit }: RelationshipListProps) {
  const { relationships, toggleRelationshipVisibility, deleteRelationship } = useRelationshipStore();
  const { focusOnNodes } = useViewportStore();

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this relationship? All connections will be removed.')) {
      deleteRelationship(id);
    }
  };

  const handleFocusOnRelationship = (rel: typeof relationships[number]) => {
    if (rel.nodeIds.length > 0) {
      focusOnNodes(rel.nodeIds, true);
    }
  };

  return (
    <div className="space-y-3">
      {relationships.map((rel) => (
        <div
          key={rel.id}
          className={`bg-gray-800 rounded-lg p-3 border border-gray-700 transition-all ${
            rel.isVisible ? 'opacity-100' : 'opacity-50'
          }`}
        >
          {/* Header: Checkbox + Title */}
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={rel.isVisible}
              onChange={() => toggleRelationshipVisibility(rel.id)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-gray-900 cursor-pointer"
            />
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: rel.color }}
            />
            <h3
              onClick={() => handleFocusOnRelationship(rel)}
              className="text-white font-medium text-sm flex-1 truncate cursor-pointer hover:text-orange-400 transition-colors"
              title="Click to focus on relationship nodes"
            >
              {rel.title}
            </h3>
          </div>

          {/* Details: Line type + Node count */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3 ml-7">
            <div className="flex items-center gap-2">
              <span className="capitalize">{rel.lineType}</span>
              <span>•</span>
              <span>{rel.lineWidth}px</span>
            </div>
            <div className="bg-gray-700 px-2 py-0.5 rounded-full text-xs">
              {rel.nodeIds.length} {rel.nodeIds.length === 1 ? 'node' : 'nodes'}
            </div>
          </div>

          {/* Actions: Edit + Delete */}
          <div className="flex gap-2 ml-7">
            <button
              onClick={() => onEdit(rel.id)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1.5 px-3 rounded transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(rel.id)}
              className="bg-red-900 hover:bg-red-800 text-white text-xs py-1.5 px-3 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
