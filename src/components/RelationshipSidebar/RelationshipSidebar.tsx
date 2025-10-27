/**
 * Relationship Sidebar
 * Collapsible sidebar for managing custom node relationships
 */

import { useState } from 'react';
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
        className="fixed right-0 top-0 h-full w-72 bg-gray-900 bg-opacity-95 shadow-2xl z-50 flex flex-col"
        style={{
          animation: 'slideInRight 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Relationships</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* New Relationship Button */}
        <div className="p-4">
          <button
            onClick={handleNewRelationship}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Relationship
          </button>
        </div>

        {/* Relationship List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {relationships.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
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
