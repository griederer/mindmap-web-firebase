/**
 * Relationship Sidebar
 * Collapsible sidebar for managing custom node relationships
 */

import { useState } from 'react';
import { X, Plus, Link2 } from 'lucide-react';
import { useRelationshipStore } from '../../stores/relationshipStore';
import RelationshipList from './RelationshipList';
import RelationshipModal from './RelationshipModal';

interface RelationshipSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RelationshipSidebar({ isOpen, onClose }: RelationshipSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRelationshipId, setEditingRelationshipId] = useState<string | null>(null);

  const { relationships, getRelationshipById } = useRelationshipStore();

  const handleNewRelationship = () => {
    setEditingRelationshipId(null);
    setIsModalOpen(true);
  };

  const handleEditRelationship = (id: string) => {
    setEditingRelationshipId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRelationshipId(null);
  };

  if (!isOpen) return null;

  const editingRelationship = editingRelationshipId
    ? getRelationshipById(editingRelationshipId)
    : null;

  return (
    <>
      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 h-full w-80 bg-gray-900 bg-opacity-95 shadow-2xl z-50 flex flex-col"
        style={{
          animation: 'slideInRight 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Relationships</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-150 w-8 h-8 flex items-center justify-center rounded-lg"
            aria-label="Close sidebar"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* New Relationship Button */}
        <div className="p-4">
          <button
            onClick={handleNewRelationship}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-150 flex items-center justify-center gap-2 shadow-sm hover:shadow"
          >
            <Plus size={18} strokeWidth={2} />
            New Relationship
          </button>
        </div>

        {/* Relationship List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {relationships.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <Link2 size={64} strokeWidth={1} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm mb-2">No relationships yet</p>
              <p className="text-xs text-gray-500">
                Create one to connect nodes across your mind map
              </p>
            </div>
          ) : (
            <RelationshipList onEdit={handleEditRelationship} />
          )}
        </div>
      </div>

      {/* Modal */}
      <RelationshipModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        relationship={editingRelationship}
      />

      {/* CSS Animation */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
