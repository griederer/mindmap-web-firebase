/**
 * Relationship Modal Component
 * Form for creating and editing relationships
 */

import { useState, useEffect } from 'react';
import { useRelationshipStore, getRandomRelationshipColor } from '../../stores/relationshipStore';
import { Relationship, RELATIONSHIP_COLORS, LINE_TYPES, LineType } from '../../types/relationship';

interface RelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationship?: Relationship | null;
}

export default function RelationshipModal({ isOpen, onClose, relationship }: RelationshipModalProps) {
  const { addRelationship, updateRelationship } = useRelationshipStore();

  // Form state
  const [title, setTitle] = useState('');
  const [color, setColor] = useState<string>(RELATIONSHIP_COLORS[0]);
  const [lineType, setLineType] = useState<LineType>('solid');
  const [lineWidth, setLineWidth] = useState(2);

  // Initialize form when editing or opening
  useEffect(() => {
    if (relationship) {
      setTitle(relationship.title);
      setColor(relationship.color);
      setLineType(relationship.lineType);
      setLineWidth(relationship.lineWidth);
    } else if (isOpen) {
      // Reset for new relationship
      setTitle('');
      setColor(getRandomRelationshipColor());
      setLineType('solid');
      setLineWidth(2);
    }
  }, [relationship, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (relationship) {
      // Update existing
      updateRelationship(relationship.id, {
        title: title.trim(),
        color,
        lineType,
        lineWidth,
      });
    } else {
      // Create new
      addRelationship({
        title: title.trim(),
        color,
        lineType,
        lineWidth,
        nodeIds: [],
        isVisible: true,
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
        <div
          className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md border border-gray-700"
          style={{ animation: 'scaleIn 0.2s ease-out' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              {relationship ? 'Edit Relationship' : 'New Relationship'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Dependencies, Cross-references"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color
              </label>
              <div className="grid grid-cols-8 gap-2">
                {RELATIONSHIP_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Line Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Line Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {LINE_TYPES.map((lt) => (
                  <button
                    key={lt.value}
                    type="button"
                    onClick={() => setLineType(lt.value)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      lineType === lt.value
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">{lt.label}</div>
                    <div className="text-xs opacity-75">{lt.preview}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Line Width */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Line Width: {lineWidth}px
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1px</span>
                <span>5px</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {relationship ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
