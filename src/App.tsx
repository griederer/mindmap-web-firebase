import { useEffect } from 'react';
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Layout/Sidebar';
import NodeDetails from './components/Canvas/NodeDetails';
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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">NODEM</h1>
          <div className="h-6 w-px bg-gray-300"></div>
          <p className="text-sm text-gray-600">
            {nodes && rootNodeId ? 'Segunda Guerra Mundial' : 'Loading...'}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span className="font-mono">{window.location.hostname}</span>
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
