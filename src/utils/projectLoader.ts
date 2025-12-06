/**
 * Project Loader - Modular Project System
 * Handles loading of folder-based projects with multiple JSON files
 * Also supports .pmap files from the MCP server
 * Clean version - mindmap only
 */

import { ProjectBundle } from '../types/project';
import { Node } from '../types/node';
import { Relationship } from '../types/relationship';

/**
 * Interface for .pmap file structure from MCP server
 */
interface PmapFile {
  name: string;
  content: string;
  nodes: Record<string, {
    description?: string;
    notes?: string;
    images?: Array<{ data: string; filename: string }>;
    showInfo?: boolean;
    categoryId?: string;
  }>;
  categories?: Array<{ id: string; name: string; color: string }>;
  relationships?: Array<{ id: string; name: string; color: string; dashPattern?: string }>;
  customOrders?: Record<string, string[]>;
  metadata?: {
    created: string;
    modified: string;
    version: string;
  };
  customPositions?: Record<string, { x: number; y: number }>;
  connections?: Array<{
    id: string;
    fromNodeId: string;
    toNodeId: string;
    relationshipId: string;
  }>;
  focusedNode?: string | null;
}

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

    // Load mindmap view if enabled
    const mindmapConfig = projectData.views?.mindmap;
    if (mindmapConfig?.enabled) {
      try {
        const viewFile = await dirHandle.getFileHandle(mindmapConfig.file);
        const viewContent = await (await viewFile.getFile()).text();
        bundle.mindmap = JSON.parse(viewContent);
      } catch (err) {
        console.warn(`Mindmap file ${mindmapConfig.file} not found, skipping`);
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

  if (!bundle.mindmap) {
    errors.push('No mindmap data found');
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

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Load a .pmap file from MCP server
 * Converts the outline-based format to ProjectBundle
 */
export async function loadPmapProject(file: File): Promise<{ bundle: ProjectBundle }> {
  const content = await file.text();
  const pmap: PmapFile = JSON.parse(content);

  // Parse content (outline format) into nodes
  const nodes = parsePmapContent(pmap);

  // Apply custom positions
  if (pmap.customPositions) {
    for (const [nodeId, pos] of Object.entries(pmap.customPositions)) {
      if (nodes[nodeId]) {
        nodes[nodeId].position = pos;
      }
    }
  }

  // Convert relationships from .pmap format to web app format
  const relationships: Relationship[] = [];
  if (pmap.relationships && pmap.connections) {
    // Group connections by relationship
    const connectionsByRelationship = new Map<string, string[]>();

    for (const conn of pmap.connections) {
      const nodeIds = connectionsByRelationship.get(conn.relationshipId) || [];
      if (!nodeIds.includes(conn.fromNodeId)) nodeIds.push(conn.fromNodeId);
      if (!nodeIds.includes(conn.toNodeId)) nodeIds.push(conn.toNodeId);
      connectionsByRelationship.set(conn.relationshipId, nodeIds);
    }

    // Create relationships
    for (const rel of pmap.relationships) {
      const nodeIds = connectionsByRelationship.get(rel.id) || [];
      relationships.push({
        id: rel.id,
        title: rel.name,
        color: rel.color,
        lineType: rel.dashPattern && rel.dashPattern !== '0' ? 'dashed' : 'solid',
        lineWidth: 2,
        nodeIds,
        isVisible: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }

  // Find root node
  const rootNodeId = Object.keys(nodes).find(id => nodes[id].parentId === null) || 'node-0';

  // Create bundle
  const bundle: ProjectBundle = {
    projectId: `pmap-${Date.now()}`,
    metadata: {
      title: pmap.name,
      description: '',
      createdAt: pmap.metadata?.created ? new Date(pmap.metadata.created).getTime() : Date.now(),
      updatedAt: pmap.metadata?.modified ? new Date(pmap.metadata.modified).getTime() : Date.now(),
      version: pmap.metadata?.version || '2.0',
      views: {
        mindmap: {
          enabled: true,
          default: true,
          file: 'mindmap.json',
        },
      },
    },
    mindmap: {
      rootNodeId,
      nodes,
    },
    relationships,
  };

  return { bundle };
}

/**
 * Parse .pmap content (outline format) into Node objects
 */
function parsePmapContent(pmap: PmapFile): Record<string, Node> {
  const nodes: Record<string, Node> = {};
  const lines = pmap.content.split('\n').filter(line => line.trim());

  // Track parent at each level
  const parentStack: { id: string; level: number }[] = [];
  let nodeIndex = 0;

  for (const line of lines) {
    // Determine level from prefix
    let level = 0;
    let title = line;

    if (line.startsWith('* ')) {
      level = 2;
      title = line.substring(2);
    } else if (line.match(/^\d+\.\s/)) {
      level = 1;
      title = line.replace(/^\d+\.\s/, '');
    } else {
      level = 0;
    }

    // Parse title and description (separated by |)
    const [nodeTitle, nodeDescription] = title.split('|').map(s => s.trim());

    const nodeId = `node-${nodeIndex}`;

    // Find parent
    while (parentStack.length > 0 && parentStack[parentStack.length - 1].level >= level) {
      parentStack.pop();
    }
    const parentId = parentStack.length > 0 ? parentStack[parentStack.length - 1].id : null;

    // Get additional metadata from pmap.nodes
    const pmapNodeData = pmap.nodes[nodeId] || {};

    // Create node
    const node: Node = {
      id: nodeId,
      title: nodeTitle,
      description: pmapNodeData.description || nodeDescription || '',
      children: [],
      level,
      parentId,
      position: { x: 100 + level * 250, y: 100 + nodeIndex * 80 },
      isExpanded: true,
      isVisible: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Add images if present
    if (pmapNodeData.images && pmapNodeData.images.length > 0) {
      node.images = pmapNodeData.images.map((img, i) => ({
        id: `img-${nodeId}-${i}`,
        data: img.data,
        filename: img.filename,
        size: img.data.length,
        addedAt: Date.now(),
      }));
    }

    nodes[nodeId] = node;

    // Add to parent's children
    if (parentId && nodes[parentId]) {
      nodes[parentId].children.push(nodeId);
    }

    // Push to parent stack
    parentStack.push({ id: nodeId, level });
    nodeIndex++;
  }

  return nodes;
}

/**
 * Load a project from a URL (supports both .pmap and ProjectBundle formats)
 */
export async function loadPmapFromUrl(url: string): Promise<{ bundle: ProjectBundle }> {
  const response = await fetch(url);
  const data = await response.json();

  // Detect format: ProjectBundle has 'mindmap.nodes', .pmap has 'content'
  if (data.mindmap && data.mindmap.nodes) {
    // Standard ProjectBundle format
    return {
      bundle: {
        projectId: data.projectId || `project-${Date.now()}`,
        metadata: data.metadata,
        mindmap: data.mindmap,
        relationships: data.relationships || [],
        actions: data.actions || [],
      }
    };
  }

  // .pmap format (outline-based)
  const pmap: PmapFile = data;
  const nodes = parsePmapContent(pmap);

  // Apply custom positions
  if (pmap.customPositions) {
    for (const [nodeId, pos] of Object.entries(pmap.customPositions)) {
      if (nodes[nodeId]) {
        nodes[nodeId].position = pos;
      }
    }
  }

  // Convert relationships
  const relationships: Relationship[] = [];
  if (pmap.relationships && pmap.connections) {
    const connectionsByRelationship = new Map<string, string[]>();
    for (const conn of pmap.connections) {
      const nodeIds = connectionsByRelationship.get(conn.relationshipId) || [];
      if (!nodeIds.includes(conn.fromNodeId)) nodeIds.push(conn.fromNodeId);
      if (!nodeIds.includes(conn.toNodeId)) nodeIds.push(conn.toNodeId);
      connectionsByRelationship.set(conn.relationshipId, nodeIds);
    }

    for (const rel of pmap.relationships) {
      const nodeIds = connectionsByRelationship.get(rel.id) || [];
      relationships.push({
        id: rel.id,
        title: rel.name,
        color: rel.color,
        lineType: rel.dashPattern && rel.dashPattern !== '0' ? 'dashed' : 'solid',
        lineWidth: 2,
        nodeIds,
        isVisible: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }

  const rootNodeId = Object.keys(nodes).find(id => nodes[id].parentId === null) || 'node-0';

  const bundle: ProjectBundle = {
    projectId: `pmap-${Date.now()}`,
    metadata: {
      title: pmap.name,
      description: '',
      createdAt: pmap.metadata?.created ? new Date(pmap.metadata.created).getTime() : Date.now(),
      updatedAt: pmap.metadata?.modified ? new Date(pmap.metadata.modified).getTime() : Date.now(),
      version: pmap.metadata?.version || '1.0',
      views: { mindmap: { enabled: true, file: 'inline' } },
    },
    mindmap: {
      nodes,
      rootNodeId,
    },
    relationships,
  };

  return { bundle };
}

/**
 * Check if a file is a .pmap file
 */
export function isPmapFile(file: File): boolean {
  return file.name.endsWith('.pmap') || file.name.endsWith('.json');
}
