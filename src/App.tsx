import { useEffect } from 'react';
import Canvas from './components/Canvas/Canvas';
import TimelineCanvas from './components/Timeline/TimelineCanvas';
import Sidebar from './components/Layout/Sidebar';
import ViewSwitcher from './components/Layout/ViewSwitcher';
import NodeDetails from './components/Canvas/NodeDetails';
import { useProjectStore } from './stores/projectStore';
import { useUIStore } from './stores/uiStore';
import { calculateLayout } from './utils/layoutEngine';

function App() {
  const { loadProject, currentProject } = useProjectStore();
  const { currentView } = useUIStore();

  // Load WWII project on mount
  useEffect(() => {
    fetch('/examples/wwii-project.json')
      .then(res => res.json())
      .then(project => {
        // Calculate layout for nodes
        const { nodes: layoutedNodes } = calculateLayout(project.nodes, project.rootNodeId);

        // Load project with calculated positions
        loadProject({
          ...project,
          nodes: layoutedNodes,
        });
      })
      .catch(err => console.error('Failed to load WWII project:', err));
  }, [loadProject]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-gray-900">NODEM</h1>
          <div className="h-6 w-px bg-gray-300"></div>
          <p className="text-sm text-gray-600">
            {currentProject?.metadata.title || 'No project loaded'}
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* View Switcher */}
          <ViewSwitcher />

          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="font-mono">{window.location.hostname}</span>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Canvas - Render based on current view */}
        <main className="flex-1 overflow-hidden relative">
          {currentView === 'mindmap' && <Canvas />}
          {currentView === 'timeline' && <TimelineCanvas />}
          {currentView === 'kanban' && (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Kanban View</p>
                <p className="text-xs text-gray-400">Coming soon...</p>
              </div>
            </div>
          )}
          {currentView === 'matrix' && (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Matrix View</p>
                <p className="text-xs text-gray-400">Coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Node Details Panel */}
      <NodeDetails />
    </div>
  );
}

export default App;
