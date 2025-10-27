/**
 * Project Gallery Component
 * Home screen showing all projects in a grid layout (Coggle-style)
 */

import { useState } from 'react';
import { Plus, Search, FolderOpen, FileText, Clock } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { useProjectStore } from '../../stores/projectStore';
import { calculateLayout } from '../../utils/layoutEngine';

// Mock projects - TODO: Replace with actual project fetching
const MOCK_PROJECTS = [
  {
    id: 'segunda-guerra-mundial',
    name: 'Segunda Guerra Mundial',
    nodeCount: 13,
    lastModified: '2 hours ago',
    thumbnail: null,
  },
  {
    id: 'product-roadmap-2025',
    name: 'Product Roadmap 2025',
    nodeCount: 8,
    lastModified: '1 day ago',
    thumbnail: null,
  },
];

interface ProjectGalleryProps {
  onProjectSelect: (projectId: string) => void;
  onNewProject: () => void;
}

export default function ProjectGallery({ onProjectSelect, onNewProject }: ProjectGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loadProject } = useProjectStore();

  const filteredProjects = MOCK_PROJECTS.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadFromFile = async () => {
    try {
      setIsLoading(true);

      // Use File System Access API
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
        throw new Error('Invalid project file');
      }

      // Calculate layout
      const { nodes: layoutedNodes } = calculateLayout(project.nodes, project.rootNodeId);

      loadProject({
        ...project,
        nodes: layoutedNodes,
      });

      // Navigate to canvas
      onProjectSelect(project.projectId);
      setIsLoading(false);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Failed to load project:', err);
      }
      setIsLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    // TODO: Load project from storage
    onProjectSelect(projectId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-obsidian-bg">
      {/* Header */}
      <div className="bg-white dark:bg-obsidian-sidebar border-b border-gray-200 dark:border-obsidian-border px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-obsidian-text">
              Your Projects
            </h1>
            <ThemeToggle />
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-obsidian-text-muted"
                strokeWidth={1.5}
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-obsidian-card border border-gray-200 dark:border-obsidian-border rounded-lg text-sm text-gray-900 dark:text-obsidian-text placeholder:text-gray-400 dark:placeholder:text-obsidian-text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-obsidian-accent/20 focus:border-indigo-300 dark:focus:border-obsidian-accent transition-all"
              />
            </div>

            {/* Actions */}
            <button
              onClick={handleLoadFromFile}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-obsidian-card border border-gray-200 dark:border-obsidian-border text-gray-700 dark:text-obsidian-text rounded-lg hover:bg-gray-50 dark:hover:bg-obsidian-bg transition-colors text-sm font-medium disabled:opacity-50"
            >
              <FolderOpen size={18} strokeWidth={1.5} />
              Open File
            </button>

            <button
              onClick={onNewProject}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-obsidian-accent text-white rounded-lg hover:bg-gray-800 dark:hover:bg-obsidian-accent/80 transition-colors text-sm font-medium"
            >
              <Plus size={18} strokeWidth={2} />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={64} className="mx-auto text-gray-300 dark:text-obsidian-text-muted mb-4" strokeWidth={1} />
              <h3 className="text-lg font-medium text-gray-600 dark:text-obsidian-text-muted mb-2">
                No projects found
              </h3>
              <p className="text-sm text-gray-500 dark:text-obsidian-text-muted">
                {searchQuery ? 'Try a different search term' : 'Create your first project to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className="group relative bg-white dark:bg-obsidian-card border border-gray-200 dark:border-obsidian-border rounded-lg p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-obsidian-accent/30 dark:hover:bg-obsidian-sidebar transition-all duration-200 text-left"
                >
                  {/* Thumbnail placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-obsidian-bg dark:to-obsidian-card rounded-md mb-4 flex items-center justify-center">
                    <FileText
                      size={48}
                      className="text-gray-300 dark:text-obsidian-text-muted"
                      strokeWidth={1}
                    />
                  </div>

                  {/* Project info */}
                  <h3 className="text-base font-semibold text-gray-900 dark:text-obsidian-text mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-obsidian-accent transition-colors">
                    {project.name}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-obsidian-text-muted">
                    <span>{project.nodeCount} nodes</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock size={12} strokeWidth={1.5} />
                      <span>{project.lastModified}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
