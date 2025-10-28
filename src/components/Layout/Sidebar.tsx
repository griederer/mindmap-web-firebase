/**
 * Sidebar Component - Linear Style
 * Minimalist project management sidebar with collapse functionality
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Plus, FolderOpen, CircleDot } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { useSidebarStore } from '../../stores/sidebarStore';
import { calculateLayout } from '../../utils/layoutEngine';

export default function Sidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActionsExpanded, setIsActionsExpanded] = useState(true);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

  const { loadProject, currentProject } = useProjectStore();
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  // Keyboard shortcut: Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleCollapse();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCollapse]);

  const handleLoadProject = async () => {
    try {
      setIsLoading(true);
      setError(null);

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

      if (!project.projectId || !project.nodes || !project.rootNodeId) {
        throw new Error('Invalid project file: missing required fields');
      }

      const { nodes: layoutedNodes } = calculateLayout(project.nodes, project.rootNodeId);

      loadProject({
        ...project,
        nodes: layoutedNodes,
      });

      setIsLoading(false);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setIsLoading(false);
        return;
      }
      setError(err.message || 'Failed to load project');
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

  // Collapsed state (48px width)
  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-3 transition-all duration-300">
        {/* Expand button */}
        <button
          onClick={toggleCollapse}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors mb-4"
          title="Expand sidebar (⌘B)"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" strokeWidth={2} />
        </button>

        {/* Logo letter */}
        <div className="mb-6">
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-900">N</span>
          </div>
        </div>

        {/* Project indicator */}
        {currentProject && (
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <CircleDot className="w-4 h-4 text-orange-500" strokeWidth={2} />
            </div>
          </div>
        )}

        {/* Action icons */}
        <div className="mt-auto flex flex-col gap-1">
          <button
            onClick={handleNewProject}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="New Project"
          >
            <Plus className="w-4 h-4 text-gray-600" strokeWidth={2} />
          </button>
          <button
            onClick={handleLoadProject}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Open Project"
          >
            <FolderOpen className="w-4 h-4 text-gray-600" strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  // Expanded state (256px width)
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleCollapse}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
            title="Collapse sidebar (⌘B)"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" strokeWidth={2} />
          </button>
          <span className="text-sm font-semibold text-gray-900">NODEM</span>
        </div>
      </div>

      {/* Content sections */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Actions section - Collapsible */}
        <div className="px-3 pt-8 pb-6">
          <button
            onClick={() => setIsActionsExpanded(!isActionsExpanded)}
            className="w-full flex items-center justify-between px-1 py-1.5 hover:bg-gray-50 rounded-md transition-colors group"
          >
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Actions
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                isActionsExpanded ? '' : '-rotate-90'
              }`}
              strokeWidth={2}
            />
          </button>

          {isActionsExpanded && (
            <div className="mt-3 space-y-1">
              <button
                onClick={handleNewProject}
                disabled={isLoading}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 text-gray-600" strokeWidth={2} />
                <span className="text-sm text-gray-700">New Project</span>
              </button>

              <button
                onClick={handleLoadProject}
                disabled={isLoading}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FolderOpen className="w-4 h-4 text-gray-600" strokeWidth={2} />
                <span className="text-sm text-gray-700">
                  {isLoading ? 'Loading...' : 'Open Project'}
                </span>
              </button>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-1 text-xs text-red-600 hover:text-red-800 underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* My Projects section - Collapsible */}
        <div className="px-3 pt-2 pb-6 flex-1 overflow-hidden flex flex-col">
          <button
            onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
            className="w-full flex items-center justify-between px-1 py-1.5 hover:bg-gray-50 rounded-md transition-colors group flex-shrink-0"
          >
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              My Projects
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                isProjectsExpanded ? '' : '-rotate-90'
              }`}
              strokeWidth={2}
            />
          </button>

          {isProjectsExpanded && (
            <div className="mt-3 overflow-auto flex-1">
              {/* Current project */}
              {currentProject ? (
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left">
                    <CircleDot className="w-4 h-4 text-orange-500 flex-shrink-0" strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {currentProject.metadata.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Object.keys(currentProject.nodes).length} nodes
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="text-xs text-gray-400 px-2 py-4">
                  No projects open
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">v1.4.0</div>
      </div>
    </div>
  );
}
