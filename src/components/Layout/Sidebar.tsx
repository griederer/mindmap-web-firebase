/**
 * Sidebar Component - Linear Style
 * Minimalist project management sidebar with collapse functionality
 * Now with Firebase persistence
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Plus, CircleDot, Trash2, Cloud, CloudOff } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { useSidebarStore } from '../../stores/sidebarStore';
import { useViewportStore } from '../../stores/viewportStore';
import { useSaveStatusStore } from '../../stores/saveStatusStore';
import { calculateLayout } from '../../utils/layoutEngine';
import { listProjects, loadProject, createProject, deleteProject, type ProjectListItem } from '../../services/firebaseService';
import { Download } from 'lucide-react';

export default function Sidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActionsExpanded, setIsActionsExpanded] = useState(true);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [cloudProjects, setCloudProjects] = useState<ProjectListItem[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const { loadProjectBundle, currentProject } = useProjectStore();
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const { focusOnNodes } = useViewportStore();
  const { status: saveStatus } = useSaveStatusStore();

  // Load projects from Firebase on mount
  useEffect(() => {
    loadCloudProjects();
  }, []);

  const loadCloudProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const projects = await listProjects();
      setCloudProjects(projects);
    } catch (err: any) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

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

  const handleLoadCloudProject = async (projectId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const bundle = await loadProject(projectId);
      if (!bundle) {
        throw new Error('Project not found');
      }

      // Apply layout to mindmap nodes if present
      if (bundle.mindmap) {
        const { nodes: layoutedNodes } = calculateLayout(
          bundle.mindmap.nodes,
          bundle.mindmap.rootNodeId
        );
        bundle.mindmap.nodes = layoutedNodes;
      }

      loadProjectBundle(bundle);

      // Auto-focus on all visible nodes after loading
      if (bundle.mindmap) {
        setTimeout(() => {
          const visibleNodeIds = Object.values(bundle.mindmap!.nodes)
            .filter(node => node.isVisible)
            .map(node => node.id);
          focusOnNodes(visibleNodeIds, false);
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewProject = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const title = prompt('Project name:', 'New Project');
      if (!title) {
        setIsLoading(false);
        return;
      }

      const bundle = await createProject(title);

      // Apply layout
      if (bundle.mindmap) {
        const { nodes: layoutedNodes } = calculateLayout(
          bundle.mindmap.nodes,
          bundle.mindmap.rootNodeId
        );
        bundle.mindmap.nodes = layoutedNodes;
      }

      loadProjectBundle(bundle);

      // Refresh project list
      await loadCloudProjects();

      // Auto-focus on root node
      if (bundle.mindmap) {
        setTimeout(() => {
          focusOnNodes([bundle.mindmap!.rootNodeId], false);
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await deleteProject(projectId);
      await loadCloudProjects();

      // Clear current project if it was deleted
      if (currentProject?.projectId === projectId) {
        useProjectStore.getState().clearProject();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
    }
  };

  // Load demo project (WW2 mindmap for testing)
  const handleLoadDemo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/examples/ww2-mindmap.json');
      const data = await response.json();

      // Apply layout
      if (data.mindmap) {
        const { nodes: layoutedNodes } = calculateLayout(
          data.mindmap.nodes,
          data.mindmap.rootNodeId
        );
        data.mindmap.nodes = layoutedNodes;
      }

      const bundle = {
        projectId: `demo-${Date.now()}`,
        metadata: {
          title: data.metadata.title,
          description: data.metadata.description,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        mindmap: data.mindmap,
        relationships: [],
      };

      loadProjectBundle(bundle);

      // Auto-focus on visible nodes
      if (bundle.mindmap) {
        setTimeout(() => {
          const visibleNodeIds = Object.values(bundle.mindmap!.nodes)
            .filter(node => node.isVisible)
            .map(node => node.id);
          focusOnNodes(visibleNodeIds, false);
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load demo');
    } finally {
      setIsLoading(false);
    }
  };

  // Save status indicator
  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Cloud className="w-3 h-3 text-blue-500 animate-pulse" />;
      case 'saved':
        return <Cloud className="w-3 h-3 text-green-500" />;
      case 'error':
        return <CloudOff className="w-3 h-3 text-red-500" />;
      case 'pending':
        return <Cloud className="w-3 h-3 text-yellow-500" />;
      default:
        return <Cloud className="w-3 h-3 text-gray-400" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return 'Error';
      case 'pending':
        return 'Pending...';
      default:
        return '';
    }
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
            {getSaveStatusIcon()}
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
        {/* Save status */}
        {currentProject && (
          <div className="flex items-center gap-1" title={getSaveStatusText()}>
            {getSaveStatusIcon()}
            <span className="text-xs text-gray-500">{getSaveStatusText()}</span>
          </div>
        )}
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
                onClick={handleLoadDemo}
                disabled={isLoading}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-orange-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 text-orange-500" strokeWidth={2} />
                <span className="text-sm text-orange-600">Load WW2 Demo (41 nodes)</span>
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
              {isLoadingProjects ? (
                <div className="text-xs text-gray-400 px-2 py-4">
                  Loading projects...
                </div>
              ) : cloudProjects.length === 0 ? (
                <div className="text-xs text-gray-400 px-2 py-4">
                  No projects yet
                </div>
              ) : (
                <div className="space-y-1">
                  {cloudProjects.map((project) => (
                    <div
                      key={project.projectId}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer group ${
                        currentProject?.projectId === project.projectId ? 'bg-orange-50' : ''
                      }`}
                      onClick={() => handleLoadCloudProject(project.projectId)}
                    >
                      <CircleDot
                        className={`w-4 h-4 flex-shrink-0 ${
                          currentProject?.projectId === project.projectId
                            ? 'text-orange-500'
                            : 'text-gray-400'
                        }`}
                        strokeWidth={2}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {project.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {project.nodeCount} nodes
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteProject(project.projectId, e)}
                        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded hover:bg-red-100 transition-all"
                        title="Delete project"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">v2.0.0 (stable)</div>
      </div>
    </div>
  );
}
