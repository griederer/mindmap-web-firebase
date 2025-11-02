/**
 * Animation Progress Indicator
 * Shows visual feedback when viewport animations are in progress
 */

import { useViewportStore } from '../../stores/viewportStore';

export default function AnimationIndicator() {
  const { animationInProgress } = useViewportStore();

  if (!animationInProgress) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        <span className="text-sm font-medium">Animating...</span>
      </div>
    </div>
  );
}
