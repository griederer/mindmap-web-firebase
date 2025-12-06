import { useEffect } from 'react';
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Layout/Sidebar';
import NodeDetails from './components/Canvas/NodeDetails';
import { useProjectStore } from './stores/projectStore';
import { useViewportStore } from './stores/viewportStore';
import { useThemeStore } from './stores/themeStore';
import { loadPmapFromUrl } from './utils/projectLoader';

// Expose stores to window for testing in development
if (process.env.NODE_ENV === 'development') {
  (window as any).__STORES__ = {
    projectStore: useProjectStore,
    viewportStore: useViewportStore,
  };
}

function App() {
  const { loadProjectBundle, currentProject } = useProjectStore();
  const { focusOnNodes } = useViewportStore();
  const { currentTheme } = useThemeStore();
  const isChalkboard = currentTheme.colors.backgroundPattern === 'chalkboard';

  // Load project from .pmap format on mount
  useEffect(() => {
    loadPmapFromUrl('/examples/design-thinking.json')
      .then(({ bundle }) => {
        // Load project bundle
        loadProjectBundle(bundle);

        // Auto-focus on all visible nodes after loading
        setTimeout(() => {
          if (bundle.mindmap?.nodes) {
            const visibleNodeIds = Object.values(bundle.mindmap.nodes)
              .filter((node: any) => node.isVisible)
              .map((node: any) => node.id);
            focusOnNodes(visibleNodeIds, false);
          }
        }, 100);
      })
      .catch(err => console.error('Failed to load project:', err));
  }, [loadProjectBundle, focusOnNodes]);

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: isChalkboard ? '#1a2a1a' : '#f9fafb' }}>
      {/* Header */}
      <header
        className="px-6 py-4 flex items-center justify-between border-b"
        style={{
          backgroundColor: isChalkboard ? '#1a2a1a' : 'white',
          borderColor: isChalkboard ? 'rgba(255,255,255,0.2)' : '#e5e7eb'
        }}
      >
        <div className="flex items-center space-x-6">
          <h1
            className="text-2xl font-bold"
            style={{
              fontFamily: isChalkboard ? "'Caveat', cursive" : 'inherit',
              color: isChalkboard ? '#ffffff' : '#111827',
              fontSize: isChalkboard ? '2rem' : undefined
            }}
          >
            MyMindmap
          </h1>
          <div className="h-6 w-px" style={{ backgroundColor: isChalkboard ? 'rgba(255,255,255,0.3)' : '#d1d5db' }}></div>
          <p
            className="text-sm"
            style={{
              fontFamily: isChalkboard ? "'Caveat', cursive" : 'inherit',
              color: isChalkboard ? 'rgba(255,255,255,0.8)' : '#4b5563',
              fontSize: isChalkboard ? '1.1rem' : undefined
            }}
          >
            {currentProject?.metadata.title || 'No project loaded'}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div
            className="flex items-center space-x-2 text-xs"
            style={{ color: isChalkboard ? 'rgba(255,255,255,0.5)' : '#6b7280' }}
          >
            <span className="font-mono">{window.location.hostname}</span>
          </div>
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
