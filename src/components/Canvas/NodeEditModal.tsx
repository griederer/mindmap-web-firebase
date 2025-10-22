/**
 * Node Edit Modal
 * Modal dialog for editing node title and description
 */

import { useEffect, useState } from 'react';
import { Node } from '../../types/node';

interface NodeEditModalProps {
  node: Node;
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeId: string, updates: { title: string; description: string }) => void;
  viewportX?: number;
  viewportY?: number;
  zoom?: number;
}

export default function NodeEditModal({
  node,
  isOpen,
  onClose,
  onSave,
  viewportX = 0,
  viewportY = 0,
  zoom = 1,
}: NodeEditModalProps) {
  const [title, setTitle] = useState(node.title);
  const [description, setDescription] = useState(node.description || '');

  useEffect(() => {
    setTitle(node.title);
    setDescription(node.description || '');
  }, [node]);

  if (!isOpen) return null;

  // Calculate modal position near the node
  const NODE_WIDTH = 200;
  const MODAL_OFFSET_X = 50; // Space from node

  const screenX = (node.position.x * zoom) + viewportX;
  const screenY = (node.position.y * zoom) + viewportY;

  // Position modal to the right of the node
  const modalLeft = screenX + (NODE_WIDTH * zoom) + MODAL_OFFSET_X;
  const modalTop = screenY;

  const handleSave = () => {
    onSave(node.id, { title, description });
    onClose();
  };

  const handleCancel = () => {
    setTitle(node.title);
    setDescription(node.description || '');
    onClose();
  };

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${modalLeft}px`,
        top: `${modalTop}px`,
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden pointer-events-auto"
        style={{
          animation: 'fadeSlideIn 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Edit Node</h2>
          <button
            onClick={handleCancel}
            className="text-white hover:text-gray-200 transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              placeholder="Enter node title"
              autoFocus
            />
          </div>

          {/* Description textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none transition-all"
              placeholder="Add description (optional)"
              rows={6}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
