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
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isOpen ? 'w-80' : 'w-0'
        }`}
        style={{ overflow: 'hidden' }}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
        </div>

        {/* Search bar */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-150"
            />
          </div>
        </div>

        {/* New Project button */}
        <div className="px-4 pt-3 pb-2">
          <button
            onClick={handleNewProject}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow"
          >
            <Plus size={18} strokeWidth={2} />
            New Project
          </button>
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="py-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Recent Projects
            </h3>
            <div className="space-y-1.5">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`group relative p-3 rounded-lg transition-all duration-150 cursor-pointer ${
                    project.isActive
                      ? 'bg-orange-50 border border-orange-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={handleLoadProject}
                >
                  {/* Active indicator */}
                  {project.isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r"></div>
                  )}

                  {/* Project info */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <FileText
                        size={16}
                        className={project.isActive ? 'text-orange-600' : 'text-gray-400'}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium truncate ${
                        project.isActive ? 'text-orange-900' : 'text-gray-900'
                      }`}>
                        {project.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{project.nodeCount} nodes</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock size={11} strokeWidth={1.5} />
                          <span>{project.lastModified}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions (show on hover) */}
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveProject();
                        }}
                        className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                        title="Save project"
                      >
                        <Save size={12} strokeWidth={1.5} className="text-gray-600" />
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
          <div className="mx-4 mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleLoadProject}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            <FolderOpen size={16} strokeWidth={1.5} />
            {isLoading ? 'Loading...' : 'Open from File'}
          </button>
          <p className="text-xs text-gray-500 text-center">NODEM v1.0</p>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-150"
        title={isOpen ? 'Hide Sidebar' : 'Show Sidebar'}
      >
        {isOpen ? (
          <ChevronLeft size={20} strokeWidth={1.5} className="text-gray-600" />
        ) : (
          <ChevronRight size={20} strokeWidth={1.5} className="text-gray-600" />
        )}
      </button>
    </>
  );
}
