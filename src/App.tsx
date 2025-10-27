import { useEffect } from 'react';
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Layout/Sidebar';
import NodeDetails from './components/Canvas/NodeDetails';
import ThemeToggle from './components/ThemeToggle';
import { useProjectStore } from './stores/projectStore';
import { calculateLayout } from './utils/layoutEngine';

function App() {
  const { loadProject, nodes, rootNodeId } = useProjectStore();

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
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-obsidian-bg">
      {/* Header */}
      <header className="bg-white dark:bg-obsidian-sidebar border-b border-gray-200 dark:border-obsidian-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-obsidian-text">NODEM</h1>
          <div className="h-6 w-px bg-gray-300 dark:bg-obsidian-border"></div>
          <p className="text-sm text-gray-600 dark:text-obsidian-text-muted">
            {nodes && rootNodeId ? 'Segunda Guerra Mundial' : 'Loading...'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <div className="h-4 w-px bg-gray-300 dark:bg-obsidian-border"></div>
          <span className="text-xs text-gray-500 dark:text-obsidian-text-muted font-mono">{window.location.hostname}</span>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Canvas */}
        <main className="flex-1 overflow-hidden relative">
          <Canvas />
        </main>
      </div>

      {/* Node Details Panel */}
      <NodeDetails />
    </div>
  );
}

export default App;
