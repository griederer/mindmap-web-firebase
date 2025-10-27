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

  const handleProjectClick = async (projectId: string) => {
    try {
      setIsLoading(true);

      // Load the WWII project when clicking Segunda Guerra Mundial
      if (projectId === 'segunda-guerra-mundial') {
        const response = await fetch('/examples/wwii-project.json');
        const project = await response.json();

        const { nodes: layoutedNodes } = calculateLayout(project.nodes, project.rootNodeId);
        loadProject({
          ...project,
          nodes: layoutedNodes,
        });
      }

      onProjectSelect(projectId);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load project:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-obsidian-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-obsidian-sidebar border-b-2 border-gray-200 dark:border-obsidian-border px-16 py-10 shadow-md">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-obsidian-text">
              Your Projects
            </h1>
            <ThemeToggle />
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <div className="flex-1 max-w-lg relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-obsidian-text-muted"
                strokeWidth={1.5}
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-3.5 bg-gray-50 dark:bg-obsidian-card border border-gray-200 dark:border-obsidian-border rounded-lg text-base text-gray-900 dark:text-obsidian-text placeholder:text-gray-400 dark:placeholder:text-obsidian-text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-obsidian-accent/20 focus:border-indigo-300 dark:focus:border-obsidian-accent transition-all"
              />
            </div>

            {/* Actions */}
            <button
              onClick={handleLoadFromFile}
              disabled={isLoading}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-white dark:bg-obsidian-card border border-gray-200 dark:border-obsidian-border text-gray-700 dark:text-obsidian-text rounded-lg hover:bg-gray-50 dark:hover:bg-obsidian-bg transition-colors text-base font-medium disabled:opacity-50"
            >
              <FolderOpen size={20} strokeWidth={1.5} />
              Open File
            </button>

            <button
              onClick={onNewProject}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-gray-900 dark:bg-obsidian-accent text-white rounded-lg hover:bg-gray-800 dark:hover:bg-obsidian-accent/80 transition-colors text-base font-medium"
            >
              <Plus size={20} strokeWidth={2} />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="flex-1 overflow-y-auto px-16 py-12">
        <div className="max-w-[1600px] mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-32">
              <FileText size={80} className="mx-auto text-gray-300 dark:text-obsidian-text-muted mb-6" strokeWidth={1} />
              <h3 className="text-2xl font-medium text-gray-600 dark:text-obsidian-text-muted mb-3">
                No projects found
              </h3>
              <p className="text-base text-gray-500 dark:text-obsidian-text-muted">
                {searchQuery ? 'Try a different search term' : 'Create your first project to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  disabled={isLoading}
                  className="group relative bg-white dark:bg-obsidian-card border-2 border-gray-200 dark:border-obsidian-border rounded-2xl p-12 hover:shadow-2xl hover:border-indigo-400 dark:hover:border-obsidian-accent/50 dark:hover:bg-obsidian-sidebar transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed min-h-[420px]"
                >
                  {/* Thumbnail placeholder */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-obsidian-bg dark:to-obsidian-card rounded-xl mb-10 flex items-center justify-center border border-gray-200 dark:border-obsidian-border min-h-[240px]">
                    <FileText
                      size={120}
                      className="text-gray-300 dark:text-obsidian-text-muted"
                      strokeWidth={0.8}
                    />
                  </div>

                  {/* Project info */}
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-obsidian-text mb-5 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-obsidian-accent transition-colors">
                    {project.name}
                  </h3>

                  <div className="flex items-center gap-6 text-lg text-gray-500 dark:text-obsidian-text-muted">
                    <span className="font-semibold">{project.nodeCount} nodes</span>
                    <span className="text-gray-300 dark:text-obsidian-border">•</span>
                    <div className="flex items-center gap-2">
                      <Clock size={18} strokeWidth={1.5} />
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
