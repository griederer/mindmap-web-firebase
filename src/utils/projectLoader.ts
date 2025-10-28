/**
 * Project Loader - Modular Project System
 * Handles loading of folder-based projects with multiple JSON files
 */

import { ProjectBundle } from '../types/project';

/**
 * Load a modular project from a folder
 * Uses File System Access API to read directory
 */
export async function loadModularProject(): Promise<ProjectBundle> {
  try {
    // Request directory access from user
    const dirHandle = await (window as any).showDirectoryPicker({
      mode: 'read',
    });

    // Load project.json first (metadata)
    const metadataFile = await dirHandle.getFileHandle('project.json');
    const metadataContent = await (await metadataFile.getFile()).text();
    const projectData = JSON.parse(metadataContent);

    // Initialize bundle
    const bundle: ProjectBundle = {
      projectId: projectData.projectId,
      metadata: {
        title: projectData.metadata.title,
        description: projectData.metadata.description,
        createdAt: projectData.metadata.createdAt,
        updatedAt: projectData.metadata.updatedAt,
        version: projectData.version,
        views: projectData.views,
      },
    };

    // Load each enabled view
    for (const [viewType, viewConfig] of Object.entries(projectData.views)) {
      const config = viewConfig as { enabled: boolean; file: string; default?: boolean };
      if (!config.enabled) continue;

      try {
        const viewFile = await dirHandle.getFileHandle(config.file);
        const viewContent = await (await viewFile.getFile()).text();
        const viewData = JSON.parse(viewContent);

        // Assign to bundle based on view type
        if (viewType === 'mindmap') {
          bundle.mindmap = viewData;
        } else if (viewType === 'timeline') {
          bundle.timeline = viewData;
        } else if (viewType === 'kanban') {
          bundle.kanban = viewData;
        } else if (viewType === 'matrix') {
          bundle.matrix = viewData;
        }
      } catch (err) {
        console.warn(`View file ${config.file} not found for ${viewType}, skipping`);
      }
    }

    return bundle;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('User cancelled folder selection');
    }
    throw new Error(`Failed to load project: ${err.message}`);
  }
}

/**
 * Load a legacy single-file JSON project
 * Provides backward compatibility
 */
export async function loadLegacyProject(file: File): Promise<ProjectBundle> {
  const content = await file.text();
  const legacyProject = JSON.parse(content);

  // Convert to modular format
  return {
    projectId: legacyProject.projectId,
    metadata: {
      ...legacyProject.metadata,
      version: legacyProject.metadata.version || '1.0.0',
      views: {
        mindmap: {
          enabled: true,
          default: true,
          file: 'mindmap.json',
        },
      },
    },
    mindmap: {
      rootNodeId: legacyProject.rootNodeId,
      nodes: legacyProject.nodes,
    },
    actions: legacyProject.actions,
    relationships: legacyProject.relationships,
  };
}

/**
 * Detect available views in a project bundle
 * Used for auto-detection when views aren't explicitly configured
 */
export function detectAvailableViews(bundle: ProjectBundle): string[] {
  const views: string[] = [];

  // Mindmap is always available if nodes exist
  if (bundle.mindmap) {
    views.push('mindmap');
  }

  // Timeline is available if timeline data exists
  if (bundle.timeline) {
    views.push('timeline');
  }

  // Kanban is available if kanban data exists
  if (bundle.kanban) {
    views.push('kanban');
  }

  // Matrix is available if matrix data exists
  if (bundle.matrix) {
    views.push('matrix');
  }

  return views;
}

/**
 * Get default view for a project
 * Returns the view marked as default, or 'mindmap' as fallback
 */
export function getDefaultView(bundle: ProjectBundle): string {
  if (!bundle.metadata.views) return 'mindmap';

  for (const [viewType, viewConfig] of Object.entries(bundle.metadata.views)) {
    if (viewConfig.default && viewConfig.enabled) {
      return viewType;
    }
  }

  // Fallback to first enabled view
  for (const [viewType, viewConfig] of Object.entries(bundle.metadata.views)) {
    if (viewConfig.enabled) {
      return viewType;
    }
  }

  return 'mindmap';
}

/**
 * Validate project bundle structure
 * Ensures required fields are present and valid
 */
export function validateProjectBundle(bundle: ProjectBundle): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!bundle.projectId) {
    errors.push('Missing projectId');
  }

  if (!bundle.metadata) {
    errors.push('Missing metadata');
  }

  if (!bundle.mindmap && !bundle.timeline && !bundle.kanban && !bundle.matrix) {
    errors.push('No view data found (at least one view required)');
  }

  // Validate mindmap if present
  if (bundle.mindmap) {
    if (!bundle.mindmap.rootNodeId) {
      errors.push('Mindmap missing rootNodeId');
    }
    if (!bundle.mindmap.nodes || Object.keys(bundle.mindmap.nodes).length === 0) {
      errors.push('Mindmap has no nodes');
    }
  }

  // Validate timeline if present
  if (bundle.timeline) {
    if (!bundle.timeline.config) {
      errors.push('Timeline missing config');
    }
    if (!bundle.timeline.events || !Array.isArray(bundle.timeline.events)) {
      errors.push('Timeline missing events array');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
