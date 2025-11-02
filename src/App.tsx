import { useEffect, useRef } from 'react';
import Canvas from './components/Canvas/Canvas';
import TimelineCanvas from './components/Timeline/TimelineCanvas';
import Sidebar from './components/Layout/Sidebar';
import NodeDetails from './components/Canvas/NodeDetails';
import ViewSwitcher from './components/Layout/ViewSwitcher';
import { useProjectStore } from './stores/projectStore';
import { useViewportStore } from './stores/viewportStore';
import { useUIStore } from './stores/uiStore';
import { calculateLayout } from './utils/layoutEngine';

function App() {
  const { loadProjectBundle, currentProject } = useProjectStore();
  const { focusOnNodes } = useViewportStore();
  const { currentView } = useUIStore();

  // Track previous view for detecting view changes
  const previousViewRef = useRef<string>(currentView);

  // Load IA Responsable project on mount
  useEffect(() => {
    fetch('/examples/ia-responsable.json')
      .then(res => res.json())
      .then(data => {
        // Calculate layout for mindmap nodes
        const { nodes: layoutedNodes } = calculateLayout(data.mindmap.nodes, data.mindmap.rootNodeId);

        // Collapse all nodes - only root visible
        const collapsedNodes = Object.fromEntries(
          Object.entries(layoutedNodes).map(([id, node]: [string, any]) => {
            if (node.level === 0) {
              // Root node collapsed with children hidden
              return [id, { ...node, isExpanded: false }];
            }
            // All other nodes invisible
            return [id, { ...node, isExpanded: false, isVisible: false }];
          })
        );

        // Create project bundle
        const bundle = {
          projectId: data.projectId,
          metadata: data.metadata,
          mindmap: {
            nodes: collapsedNodes,
            rootNodeId: data.mindmap.rootNodeId,
          },
          timeline: data.timeline,
        };

        // Load project bundle
        loadProjectBundle(bundle);

        // Auto-focus on root node only after loading
        setTimeout(() => {
          const rootId = Object.values(collapsedNodes).find(
            (node: any) => node.level === 0
          )?.id;
          if (rootId) {
            focusOnNodes([rootId], false);
          }
        }, 100);
      })
      .catch(err => console.error('Failed to load IA Responsable project:', err));
  }, [loadProjectBundle, focusOnNodes]);

  // Auto-focus root node when exiting timeline view
  useEffect(() => {
    const previousView = previousViewRef.current;

    // Detect transition from timeline to mindmap
    if (previousView === 'timeline' && currentView === 'mindmap') {
      console.log('[View Switch] Exiting timeline view, focusing on root node');

      // Focus on root node if project is loaded
      if (currentProject?.nodes) {
        const rootId = Object.values(currentProject.nodes).find(
          (node: any) => node.level === 0
        )?.id;

        if (rootId) {
          // Small delay to ensure view switch is complete
          setTimeout(() => {
            focusOnNodes([rootId], false);
          }, 100);
        }
      }
    }

    // Update previous view
    previousViewRef.current = currentView;
  }, [currentView, currentProject, focusOnNodes]);

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
          {currentView === 'timeline' ? <TimelineCanvas /> : <Canvas />}
        </main>
      </div>

      {/* Node Details Panel */}
      <NodeDetails />
    </div>
  );
}

export default App;
