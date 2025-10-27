import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Canvas from './components/Canvas/Canvas';
import ProjectGallery from './components/ProjectGallery/ProjectGallery';
import NodeDetails from './components/Canvas/NodeDetails';
import ThemeToggle from './components/ThemeToggle';
import { useView } from './contexts/ViewContext';
import { useProjectStore } from './stores/projectStore';
import { calculateLayout } from './utils/layoutEngine';

function App() {
  const { currentView, showGallery, showCanvas } = useView();
  const { loadProject, nodes, rootNodeId, currentProject } = useProjectStore();

  // Load WWII project on mount (only for canvas view)
  useEffect(() => {
    if (currentView === 'canvas' && !nodes) {
      fetch('/examples/wwii-project.json')
        .then(res => res.json())
        .then(project => {
          const { nodes: layoutedNodes } = calculateLayout(project.nodes, project.rootNodeId);
          loadProject({
            ...project,
            nodes: layoutedNodes,
          });
        })
        .catch(err => console.error('Failed to load WWII project:', err));
    }
  }, [currentView, loadProject, nodes]);

  const handleNewProject = () => {
    // Create new project
    const newProject = {
      projectId: `project-${Date.now()}`,
      metadata: {
        title: 'New Project',
        description: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: '1.0.0',
      },
      nodes: {
        root: {
          id: 'root',
          title: 'Root Node',
          description: '',
          children: [],
          level: 0,
          parentId: null,
          position: { x: 100, y: 300 },
          isExpanded: true,
          isVisible: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      },
      rootNodeId: 'root',
      actions: [],
    };

    loadProject(newProject);
    showCanvas(newProject.projectId);
  };

  // Gallery view
  if (currentView === 'gallery') {
    return <ProjectGallery onProjectSelect={showCanvas} onNewProject={handleNewProject} />;
  }

  // Canvas view
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-obsidian-bg">
      {/* Header */}
      <header className="bg-white dark:bg-obsidian-sidebar border-b border-gray-200 dark:border-obsidian-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Back button */}
          <button
            onClick={showGallery}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-600 dark:text-obsidian-text-muted hover:text-gray-900 dark:hover:text-obsidian-text hover:bg-gray-100 dark:hover:bg-obsidian-card rounded-md transition-colors text-sm"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Projects
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-obsidian-border"></div>

          <h1 className="text-xl font-semibold text-gray-900 dark:text-obsidian-text">
            {currentProject?.metadata?.title || nodes && rootNodeId ? 'Segunda Guerra Mundial' : 'NODEM'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <div className="h-4 w-px bg-gray-300 dark:bg-obsidian-border"></div>
          <span className="text-xs text-gray-500 dark:text-obsidian-text-muted font-mono">{window.location.hostname}</span>
        </div>
      </header>

      {/* Canvas (full width, no sidebar) */}
      <main className="flex-1 overflow-hidden relative">
        <Canvas />
      </main>

      {/* Node Details Panel */}
      <NodeDetails />
    </div>
  );
}

export default App;
