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

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        handleCancel();
      }
      // Cmd/Ctrl + Enter to save
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, title, description]);

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
        className="bg-white rounded-2xl shadow-2xl w-[800px] max-h-[90vh] min-h-[500px] overflow-hidden pointer-events-auto flex flex-col"
        style={{
          animation: 'fadeSlideIn 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-10 py-6 flex items-center justify-between flex-shrink-0">
          <h2 className="text-2xl font-semibold text-white tracking-tight">Edit Node</h2>
          <button
            onClick={handleCancel}
            className="text-white hover:text-gray-200 transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="px-10 py-8 space-y-8 overflow-y-auto flex-1">
          {/* Title input */}
          <div>
            <label
              htmlFor="node-title"
              className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
            >
              Title
            </label>
            <input
              id="node-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Enter node title"
              autoFocus
            />
          </div>

          {/* Description textarea */}
          <div>
            <label
              htmlFor="node-description"
              className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
            >
              Description
            </label>
            <textarea
              id="node-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all leading-relaxed"
              placeholder="Add description (optional)"
              rows={12}
            />
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
            <span className="font-medium">Tip:</span> Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Esc</kbd> to cancel or <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">⌘/Ctrl+Enter</kbd> to save
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 px-10 py-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 text-base text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium min-w-[100px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-base text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md hover:shadow-lg min-w-[140px]"
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
