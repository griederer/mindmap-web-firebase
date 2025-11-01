import { useEffect } from 'react';
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Layout/Sidebar';
import NodeDetails from './components/Canvas/NodeDetails';
import { useProjectStore } from './stores/projectStore';
import { useViewportStore } from './stores/viewportStore';
import { calculateLayout } from './utils/layoutEngine';

function App() {
  const { loadProjectBundle, currentProject } = useProjectStore();
  const { focusOnNodes } = useViewportStore();

  // Load IA Responsable project on mount
  useEffect(() => {
    fetch('/examples/ia-responsable.json')
      .then(res => res.json())
      .then(data => {
        // Calculate layout for mindmap nodes
        const { nodes: layoutedNodes } = calculateLayout(data.mindmap.nodes, data.mindmap.rootNodeId);

        // Create project bundle
        const bundle = {
          projectId: data.projectId,
          metadata: data.metadata,
          mindmap: {
            nodes: layoutedNodes,
            rootNodeId: data.mindmap.rootNodeId,
          },
          timeline: data.timeline,
        };

        // Load project bundle
        loadProjectBundle(bundle);

        // Auto-focus on all visible nodes after loading
        setTimeout(() => {
          const visibleNodeIds = Object.values(layoutedNodes)
            .filter((node: any) => node.isVisible)
            .map((node: any) => node.id);
          focusOnNodes(visibleNodeIds, false);
        }, 100);
      })
      .catch(err => console.error('Failed to load IA Responsable project:', err));
  }, [loadProjectBundle, focusOnNodes]);

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
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="font-mono">{window.location.hostname}</span>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Canvas - Always show mindmap (timeline is now a node type) */}
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
