import { useEffect } from 'react';
import Canvas from './components/Canvas/Canvas';
import { useProjectStore } from './stores/projectStore';
import { calculateLayout } from './utils/layoutEngine';

function App() {
  const { loadProject, nodes, rootNodeId } = useProjectStore();

  // Load demo project on mount
  useEffect(() => {
    fetch('/examples/demo-project.json')
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
      .catch(err => console.error('Failed to load demo project:', err));
  }, [loadProject]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">NODEM</h1>
          <div className="h-6 w-px bg-gray-300"></div>
          <p className="text-sm text-gray-600">
            {nodes && rootNodeId ? 'Demo Project' : 'Loading...'}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span className="font-mono">{window.location.hostname}</span>
        </div>
      </header>

      {/* Canvas */}
      <main className="flex-1 overflow-hidden">
        <Canvas />
      </main>
    </div>
  );
}

export default App;
