/**
 * Relationship Modal Component
 * Form for creating and editing relationships
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-[60]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
        <div
          className="bg-white dark:bg-obsidian-sidebar rounded-lg shadow-2xl w-full max-w-md border border-gray-200/50 dark:border-obsidian-border"
          style={{ animation: 'scaleIn 0.2s ease-out' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-obsidian-border">
            <h2 className="text-base font-semibold text-gray-900 dark:text-obsidian-text">
              {relationship ? 'Edit Relationship' : 'New Relationship'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-obsidian-text-muted hover:text-gray-600 dark:hover:text-obsidian-text hover:bg-gray-100 dark:hover:bg-obsidian-card transition-colors duration-150 w-7 h-7 flex items-center justify-center rounded-md"
              aria-label="Close modal"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-obsidian-text mb-2 uppercase tracking-wide">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Dependencies, Cross-references"
                className="w-full bg-white dark:bg-obsidian-card text-gray-900 dark:text-obsidian-text text-sm border border-gray-300 dark:border-obsidian-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-obsidian-accent/20 focus:border-indigo-400 dark:focus:border-obsidian-accent transition-all duration-150 placeholder:text-gray-400 dark:placeholder:text-obsidian-text-muted"
                autoFocus
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-obsidian-text mb-2 uppercase tracking-wide">
                Color
              </label>
              <div className="grid grid-cols-8 gap-2">
                {RELATIONSHIP_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-md transition-all duration-150 ${
                      color === c ? 'ring-2 ring-indigo-400 dark:ring-obsidian-accent ring-offset-2 ring-offset-white dark:ring-offset-obsidian-sidebar scale-105' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Line Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-obsidian-text mb-2 uppercase tracking-wide">
                Line Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {LINE_TYPES.map((lt) => (
                  <button
                    key={lt.value}
                    type="button"
                    onClick={() => setLineType(lt.value)}
                    className={`px-3 py-2.5 rounded-md border transition-all duration-150 ${
                      lineType === lt.value
                        ? 'bg-indigo-50 dark:bg-obsidian-accent/10 border-indigo-300 dark:border-obsidian-accent/30 text-indigo-900 dark:text-obsidian-accent'
                        : 'bg-white dark:bg-obsidian-card border-gray-200 dark:border-obsidian-border text-gray-700 dark:text-obsidian-text hover:border-gray-300 dark:hover:border-obsidian-border hover:bg-gray-50 dark:hover:bg-obsidian-bg'
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1">{lt.label}</div>
                    <div className="text-xs text-gray-500 dark:text-obsidian-text-muted">{lt.preview}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Line Width */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-obsidian-text mb-2 uppercase tracking-wide">
                Line Width: {lineWidth}px
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-full accent-indigo-500 dark:accent-obsidian-accent"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-obsidian-text-muted mt-2">
                <span>1px</span>
                <span>5px</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white dark:bg-obsidian-card hover:bg-gray-50 dark:hover:bg-obsidian-bg text-gray-700 dark:text-obsidian-text font-medium py-2 px-4 text-sm rounded-md border border-gray-200 dark:border-obsidian-border hover:border-gray-300 dark:hover:border-obsidian-border transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gray-900 dark:bg-obsidian-accent hover:bg-gray-800 dark:hover:bg-obsidian-accent/80 text-white font-medium py-2 px-4 text-sm rounded-md transition-colors duration-150"
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
