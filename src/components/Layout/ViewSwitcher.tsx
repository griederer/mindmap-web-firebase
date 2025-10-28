/**
 * ViewSwitcher Component
 * Allows switching between different project views (Mindmap, Timeline, etc.)
 */

import { Map, Calendar, Grid3x3, Kanban } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';
import { ViewType } from '../../types/project';

interface ViewOption {
  id: ViewType;
  name: string;
  icon: React.ReactNode;
}

const VIEW_OPTIONS: ViewOption[] = [
  { id: 'mindmap', name: 'Mindmap', icon: <Map className="w-4 h-4" strokeWidth={2} /> },
  { id: 'timeline', name: 'Timeline', icon: <Calendar className="w-4 h-4" strokeWidth={2} /> },
  { id: 'kanban', name: 'Kanban', icon: <Kanban className="w-4 h-4" strokeWidth={2} /> },
  { id: 'matrix', name: 'Matrix', icon: <Grid3x3 className="w-4 h-4" strokeWidth={2} /> },
];

export default function ViewSwitcher() {
  const { currentView, setView } = useUIStore();
  const { currentBundle } = useProjectStore();

  // If no project loaded, don't show switcher
  if (!currentBundle) return null;

  // Get available views from project metadata
  const availableViews = currentBundle.metadata.views
    ? Object.entries(currentBundle.metadata.views)
        .filter(([, config]) => config.enabled)
        .map(([viewType]) => viewType as ViewType)
    : ['mindmap'];

  // Filter view options to only show available views
  const visibleViews = VIEW_OPTIONS.filter((view) => availableViews.includes(view.id));

  // If only one view available, don't show switcher
  if (visibleViews.length <= 1) return null;

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
      {visibleViews.map((view) => (
        <button
          key={view.id}
          onClick={() => setView(view.id)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
            transition-all duration-200
            ${
              currentView === view.id
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }
          `}
        >
          {view.icon}
          <span>{view.name}</span>
        </button>
      ))}
    </div>
  );
}
