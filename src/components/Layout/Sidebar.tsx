/**
 * Sidebar Component
 * Left sidebar with project list and management controls
 */

import { useState } from 'react';
import { Plus, FolderOpen, Save, ChevronLeft, ChevronRight, Search, Clock, FileText } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { calculateLayout } from '../../utils/layoutEngine';

// Mock data for projects - TODO: Replace with actual project fetching
const MOCK_PROJECTS = [
  {
    id: 'segunda-guerra-mundial',
    name: 'Segunda Guerra Mundial',
    nodeCount: 13,
    lastModified: '2 hours ago',
    isActive: true,
  },
  {
    id: 'product-roadmap-2025',
    name: 'Product Roadmap 2025',
    nodeCount: 8,
    lastModified: '1 day ago',
    isActive: false,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { loadProject, currentProject, saveProject } = useProjectStore();

  const handleLoadProject = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use File System Access API to load JSON file
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'NODEM Project Files',
            accept: {
              'application/json': ['.json'],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      });

      const file = await fileHandle.getFile();
      const contents = await file.text();
      const project = JSON.parse(contents);

      // Validate project structure
      if (!project.projectId || !project.nodes || !project.rootNodeId) {
        throw new Error('Invalid project file: missing required fields');
      }

      // Calculate layout for nodes
      const { nodes: layoutedNodes } = calculateLayout(project.nodes, project.rootNodeId);

      // Load project with calculated positions
      loadProject({
        ...project,
        nodes: layoutedNodes,
      });

      setIsLoading(false);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User cancelled - not an error
        setIsLoading(false);
        return;
      }
      setError(err.message || 'Failed to load project');
      setIsLoading(false);
    }
  };

  const handleSaveProject = async () => {
    if (!currentProject) {
      setError('No project loaded');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use File System Access API to save JSON file
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: `${currentProject.metadata.title || 'project'}.json`,
        types: [
          {
            description: 'NODEM Project Files',
            accept: {
              'application/json': ['.json'],
            },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      const projectData = saveProject();
      await writable.write(JSON.stringify(projectData, null, 2));
      await writable.close();

      setIsLoading(false);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User cancelled - not an error
        setIsLoading(false);
        return;
      }
      setError(err.message || 'Failed to save project');
      setIsLoading(false);
    }
  };

  const handleNewProject = () => {
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
  };

  const filteredProjects = MOCK_PROJECTS.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Sidebar container */}
      <div
        className={`bg-white dark:bg-obsidian-sidebar border-r border-gray-200 dark:border-obsidian-border flex flex-col transition-all duration-300 ${
          isOpen ? 'w-80' : 'w-0'
        }`}
        style={{ overflow: 'hidden' }}
      >
        {/* Sidebar header */}
        <div className="px-6 py-5 border-b border-gray-200/50 dark:border-obsidian-border">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-obsidian-text tracking-tight">Projects</h2>
        </div>

        {/* Search bar */}
        <div className="px-6 py-4 border-b border-gray-200/50 dark:border-obsidian-border">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-obsidian-text-muted" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50/50 dark:bg-obsidian-card border border-transparent dark:border-obsidian-border rounded-md hover:bg-gray-100/50 dark:hover:bg-obsidian-bg focus:outline-none focus:bg-white dark:focus:bg-obsidian-card focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-obsidian-accent/20 focus:border-indigo-300 dark:focus:border-obsidian-accent transition-all duration-150 placeholder:text-gray-400 dark:placeholder:text-obsidian-text-muted text-gray-900 dark:text-obsidian-text"
            />
          </div>
        </div>

        {/* New Project button */}
        <div className="px-6 py-4">
          <button
            onClick={handleNewProject}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 dark:bg-obsidian-accent text-white text-sm rounded-md hover:bg-gray-800 dark:hover:bg-obsidian-accent/80 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Plus size={16} strokeWidth={2} />
            New Project
          </button>
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <div className="py-3">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-obsidian-text-muted uppercase tracking-wide mb-3 px-0.5">
              Recent Projects
            </h3>
            <div className="space-y-1">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`group relative px-3 py-2.5 rounded-md transition-all duration-150 cursor-pointer ${
                    project.isActive
                      ? 'bg-indigo-50/50 dark:bg-obsidian-accent/10 border border-indigo-200/50 dark:border-obsidian-accent/30'
                      : 'hover:bg-gray-50 dark:hover:bg-obsidian-card border border-transparent dark:border-transparent'
                  }`}
                  onClick={handleLoadProject}
                >
                  {/* Project info */}
                  <div className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 mt-0.5">
                      <FileText
                        size={14}
                        className={project.isActive ? 'text-indigo-600 dark:text-obsidian-accent' : 'text-gray-400 dark:text-obsidian-text-muted'}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium truncate leading-5 ${
                        project.isActive ? 'text-gray-900 dark:text-obsidian-text' : 'text-gray-700 dark:text-obsidian-text'
                      }`}>
                        {project.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-obsidian-text-muted">
                        <span>{project.nodeCount} nodes</span>
                        <span className="text-gray-300 dark:text-obsidian-border">•</span>
                        <div className="flex items-center gap-1">
                          <Clock size={10} strokeWidth={1.5} className="text-gray-400 dark:text-obsidian-text-muted" />
                          <span>{project.lastModified}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions (show on hover) */}
                  <div className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveProject();
                        }}
                        className="p-1 bg-white/80 dark:bg-obsidian-card/80 backdrop-blur-sm border border-gray-200/50 dark:border-obsidian-border rounded hover:bg-white dark:hover:bg-obsidian-card hover:border-gray-300 dark:hover:border-obsidian-border transition-colors"
                        title="Save project"
                      >
                        <Save size={12} strokeWidth={1.5} className="text-gray-600 dark:text-obsidian-text" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mx-4 mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-200/50 dark:border-obsidian-border space-y-3">
          <button
            onClick={handleLoadProject}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-obsidian-card border border-gray-200/80 dark:border-obsidian-border text-gray-700 dark:text-obsidian-text text-sm rounded-md hover:bg-gray-50 dark:hover:bg-obsidian-bg hover:border-gray-300 dark:hover:border-obsidian-border transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <FolderOpen size={14} strokeWidth={1.5} />
            {isLoading ? 'Loading...' : 'Open from File'}
          </button>
          <p className="text-xs text-gray-400 dark:text-obsidian-text-muted text-center font-medium">NODEM v1.0</p>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-50 p-1.5 bg-white dark:bg-obsidian-card border border-gray-200/80 dark:border-obsidian-border rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-obsidian-bg hover:border-gray-300 dark:hover:border-obsidian-border hover:shadow transition-all duration-150"
        title={isOpen ? 'Hide Sidebar' : 'Show Sidebar'}
      >
        {isOpen ? (
          <ChevronLeft size={16} strokeWidth={1.5} className="text-gray-500 dark:text-obsidian-text" />
        ) : (
          <ChevronRight size={16} strokeWidth={1.5} className="text-gray-500 dark:text-obsidian-text" />
        )}
      </button>
    </>
  );
}
