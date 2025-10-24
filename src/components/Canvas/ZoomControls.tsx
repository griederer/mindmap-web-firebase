/**
 * ZoomControls Component
 * UI controls for zoom and viewport management
 */

import { useViewportStore } from '../../stores/viewportStore';
import { useProjectStore } from '../../stores/projectStore';
import { getNodesBounds } from '../../utils/layoutEngine';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

export default function ZoomControls() {
  const { zoom, width, height, setZoom, setPosition, autoFocusEnabled, setAutoFocus } = useViewportStore();
  const { nodes } = useProjectStore();

  const handleZoomIn = () => {
    const newZoom = Math.min(MAX_ZOOM, zoom + 0.25);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(MIN_ZOOM, zoom - 0.25);
    setZoom(newZoom);
  };

  const handleReset = () => {
    setZoom(1);
    setPosition(0, 0);
  };

  const handleFitToScreen = () => {
    const bounds = getNodesBounds(nodes);

    if (bounds.width === 0 || bounds.height === 0) {
      handleReset();
      return;
    }

    // Add padding (10% on each side)
    const padding = 0.1;
    const paddedWidth = bounds.width * (1 + padding * 2);
    const paddedHeight = bounds.height * (1 + padding * 2);

    // Calculate zoom to fit
    const scaleX = width / paddedWidth;
    const scaleY = height / paddedHeight;
    const newZoom = Math.min(scaleX, scaleY, MAX_ZOOM);

    // Calculate pan to center
    const centerX = bounds.minX + bounds.width / 2;
    const centerY = bounds.minY + bounds.height / 2;

    const newX = width / 2 - centerX * newZoom;
    const newY = height / 2 - centerY * newZoom;

    setZoom(newZoom);
    setPosition(newX, newY);
  };

  const handleToggleAutoFocus = () => {
    setAutoFocus(!autoFocusEnabled);
  };

  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-2">
      {/* Zoom percentage display */}
      <div className="bg-white rounded-lg shadow-lg px-3 py-2 text-center">
        <span className="text-sm font-medium text-gray-700">
          {zoomPercentage}%
        </span>
      </div>

      {/* Zoom controls */}
      <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white transition-colors"
          title="Zoom In (25%)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <button
          onClick={handleZoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white transition-colors"
          title="Zoom Out (25%)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <div className="h-px bg-gray-200 my-1" />

        <button
          onClick={handleReset}
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          title="Reset View (100%)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <div className="h-px bg-gray-200 my-1" />

        <button
          onClick={handleToggleAutoFocus}
          className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
            autoFocusEnabled
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              : 'hover:bg-gray-100'
          }`}
          title={autoFocusEnabled ? 'Auto Focus: On' : 'Auto Focus: Off'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        <button
          onClick={handleFitToScreen}
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          title="Fit to Screen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
