/**
 * Timeline Ribbon
 * Floating ribbon button to toggle timeline visibility
 */

import { useUIStore } from '../../stores/uiStore';
import { useViewportStore } from '../../stores/viewportStore';
import { useProjectStore } from '../../stores/projectStore';

// Timeline layout constants (must match TimelineComponent)
const YEAR_SPACING = 280;
const TRACK_HEIGHT = 100;
const TRACK_SPACING = 20;
const TIMELINE_Y_OFFSET = 80;
const TRACK_LABEL_WIDTH = 120;

export default function TimelineRibbon() {
  const { timelineRibbonOpen, toggleTimelineRibbon } = useUIStore();
  const { setPosition, setZoom } = useViewportStore();
  const currentBundle = useProjectStore((state) => state.currentBundle);

  const handleToggle = () => {
    const wasOpen = timelineRibbonOpen;
    toggleTimelineRibbon();

    // If opening timeline, auto-focus on it after a delay
    if (!wasOpen && currentBundle?.timeline) {
      setTimeout(() => {
        // Calculate timeline dimensions
        const timeline = currentBundle.timeline;
        if (!timeline?.config) return;

        const startYear = timeline.config.startDate ? new Date(timeline.config.startDate).getFullYear() : 1939;
        const endYear = timeline.config.endDate ? new Date(timeline.config.endDate).getFullYear() : 1945;
        const numYears = endYear - startYear + 1;
        const numTracks = timeline.config.tracks?.length || 3;

        // Timeline dimensions
        const timelineWidth = TRACK_LABEL_WIDTH + (numYears - 1) * YEAR_SPACING + 200; // Extra padding
        const timelineHeight = TIMELINE_Y_OFFSET + numTracks * (TRACK_HEIGHT + TRACK_SPACING) + 100;

        // Timeline position (matches Canvas.tsx)
        const timelineX = 100;
        const timelineY = 800;

        // Calculate center point of timeline
        const centerX = timelineX + timelineWidth / 2;
        const centerY = timelineY + timelineHeight / 2;

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate zoom to fit timeline
        const zoomX = viewportWidth / timelineWidth;
        const zoomY = viewportHeight / timelineHeight;
        const targetZoom = Math.min(zoomX, zoomY, 1) * 0.8; // 80% of screen

        // Calculate position to center timeline
        const targetX = (viewportWidth / 2) - (centerX * targetZoom);
        const targetY = (viewportHeight / 2) - (centerY * targetZoom);

        // Apply zoom and position
        setZoom(targetZoom);
        setPosition(targetX, targetY);
      }, 150);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`fixed right-20 top-6 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
        timelineRibbonOpen
          ? 'bg-blue-600 hover:bg-blue-700'
          : 'bg-gray-800 hover:bg-gray-700'
      }`}
      title={timelineRibbonOpen ? 'Close Timeline' : 'Open Timeline'}
    >
      {/* Timeline Icon */}
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  );
}
