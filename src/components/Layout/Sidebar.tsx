/**
 * Sidebar Component
 * Left sidebar with project list and management controls
 */

import { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { calculateLayout } from '../../utils/layoutEngine';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  return (
    <>
      {/* Sidebar container */}
      <div
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0'
        }`}
        style={{ overflow: 'hidden' }}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
        </div>

        {/* Project actions */}
        <div className="p-4 space-y-2 border-b border-gray-200">
          <button
            onClick={handleNewProject}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + New Project
          </button>

          <button
            onClick={handleLoadProject}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Open Project'}
          </button>

          <button
            onClick={handleSaveProject}
            disabled={isLoading || !currentProject}
            className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Project'}
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Current project info */}
        {currentProject && (
          <div className="p-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Current Project</h3>
              <p className="text-sm text-gray-600">{currentProject.metadata.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {Object.keys(currentProject.nodes).length} nodes
              </p>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">NODEM v1.0</p>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        title={isOpen ? 'Hide Sidebar' : 'Show Sidebar'}
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          )}
        </svg>
      </button>
    </>
  );
}
