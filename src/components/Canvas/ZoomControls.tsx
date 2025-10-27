/**
 * ZoomControls Component
 * UI controls for zoom and viewport management
 */

import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Maximize2 } from 'lucide-react';
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
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all duration-150 text-gray-700"
          title="Zoom In (25%)"
        >
          <ZoomIn size={20} strokeWidth={1.5} />
        </button>

        <button
          onClick={handleZoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all duration-150 text-gray-700"
          title="Zoom Out (25%)"
        >
          <ZoomOut size={20} strokeWidth={1.5} />
        </button>

        <div className="h-px bg-gray-200 my-1" />

        <button
          onClick={handleReset}
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-50 transition-all duration-150 text-gray-700"
          title="Reset View (100%)"
        >
          <RotateCcw size={20} strokeWidth={1.5} />
        </button>

        <div className="h-px bg-gray-200 my-1" />

        <button
          onClick={handleToggleAutoFocus}
          className={`w-10 h-10 flex items-center justify-center rounded transition-all duration-150 ${
            autoFocusEnabled
              ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          title={autoFocusEnabled ? 'Auto Focus: On' : 'Auto Focus: Off'}
        >
          {autoFocusEnabled ? (
            <Eye size={20} strokeWidth={1.5} />
          ) : (
            <EyeOff size={20} strokeWidth={1.5} />
          )}
        </button>

        <button
          onClick={handleFitToScreen}
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-50 transition-all duration-150 text-gray-700"
          title="Fit to Screen"
        >
          <Maximize2 size={20} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
