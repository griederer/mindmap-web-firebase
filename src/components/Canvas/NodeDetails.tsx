/**
 * NodeDetails Component
 * Detail panel overlay showing node information
 */

import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';

export default function NodeDetails() {
  const { detailNodeId, closeDetails } = useUIStore();
  const { nodes } = useProjectStore();

  if (!detailNodeId) return null;

  const node = nodes[detailNodeId];
  if (!node) return null;

  return (
    <>
      {/* Dark overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeDetails}
      />

      {/* Detail panel */}
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-orange-500 text-white p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Node Details</h2>
          <button
            onClick={closeDetails}
            className="p-2 hover:bg-orange-600 rounded-lg transition-colors"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <p className="text-lg font-semibold text-gray-900">{node.title}</p>
          </div>

          {/* Description */}
          {node.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div className="max-h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{node.description}</p>
              </div>
            </div>
          )}

          {/* Images */}
          {node.images && node.images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images ({node.images.length})
              </label>
              <div className="grid grid-cols-2 gap-2">
                {node.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.data}
                    alt={image.filename}
                    className="w-full rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      // TODO: Implement fullscreen image view
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Level</label>
              <p className="text-sm text-gray-900">Level {node.level}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Children</label>
              <p className="text-sm text-gray-900">
                {node.children.length} {node.children.length === 1 ? 'child' : 'children'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <p className="text-sm text-gray-900">
                {node.isExpanded ? 'Expanded' : 'Collapsed'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Created</label>
              <p className="text-sm text-gray-900">
                {new Date(node.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Last Updated
              </label>
              <p className="text-sm text-gray-900">
                {new Date(node.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={closeDetails}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
