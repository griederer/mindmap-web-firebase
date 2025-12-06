/**
 * Project Store - Zustand
 * Manages current project state, nodes, and recorded actions
 */

import { create } from 'zustand';
import { Project, ProjectId, ProjectBundle } from '../types/project';
import { Node, NodeId } from '../types/node';
import { Action } from '../types/action';
import { calculateLayout } from '../utils/layoutEngine';
import { useUIStore } from './uiStore';
import { useRelationshipStore } from './relationshipStore';

interface ProjectState {
  // Current project
  currentProject: Project | null;
  currentProjectId: ProjectId | null;

  // Modular project bundle (v1.5+)
  currentBundle: ProjectBundle | null;

  // Node operations
  nodes: Record<NodeId, Node>;
  rootNodeId: NodeId | null;

  // Actions
  recordedActions: Action[];

  // Operations
  loadProject: (project: Project) => void;
  loadProjectBundle: (bundle: ProjectBundle) => void;
  saveProject: () => Project | null;
  clearProject: () => void;
  updateNode: (nodeId: NodeId, updates: Partial<Node>) => void;
  addNode: (node: Node) => void;
  deleteNode: (nodeId: NodeId) => void;
  toggleNodeExpansion: (nodeId: NodeId) => void;
  recordAction: (action: Action) => void;
  clearActions: () => void;
  updateProjectMetadata: (updates: Partial<Project['metadata']>) => void;
}


export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  currentProject: null,
  currentProjectId: null,
  currentBundle: null,
  nodes: {},
  rootNodeId: null,
  recordedActions: [],
  
  // Load a complete project
  loadProject: (project: Project) => {
    set({
      currentProject: project,
      currentProjectId: project.projectId,
      nodes: project.nodes,
      rootNodeId: project.rootNodeId,
      recordedActions: project.actions || [],
    });

    // Load relationships into relationshipStore
    const { setRelationships } = useRelationshipStore.getState();
    setRelationships(project.relationships || []);
  },

  // Load a modular project bundle
  loadProjectBundle: (bundle: ProjectBundle) => {
    // Convert bundle to legacy Project format for compatibility
    const project: Project = {
      projectId: bundle.projectId,
      metadata: bundle.metadata,
      nodes: bundle.mindmap?.nodes || {},
      rootNodeId: bundle.mindmap?.rootNodeId || '',
      actions: bundle.actions || [],
      relationships: bundle.relationships || [],
    };

    set({
      currentProject: project,
      currentProjectId: bundle.projectId,
      currentBundle: bundle,
      nodes: bundle.mindmap?.nodes || {},
      rootNodeId: bundle.mindmap?.rootNodeId || null,
      recordedActions: bundle.actions || [],
    });

    // Load relationships
    const { setRelationships } = useRelationshipStore.getState();
    setRelationships(bundle.relationships || []);

    // View handling removed - mindmap only
  },

  // Save current project (returns current state as Project)
  saveProject: () => {
    const { currentProject, nodes, rootNodeId, recordedActions } = get();
    if (!currentProject) return null;

    // Get relationships from relationshipStore
    const { relationships } = useRelationshipStore.getState();

    return {
      ...currentProject,
      nodes,
      rootNodeId: rootNodeId || '',
      relationships, // Include relationships in saved project
      actions: recordedActions,
      metadata: {
        ...currentProject.metadata,
        updatedAt: Date.now(),
      },
    };
  },
  
  // Clear current project
  clearProject: () => {
    set({
      currentProject: null,
      currentProjectId: null,
      nodes: {},
      rootNodeId: null,
      recordedActions: [],
    });

    // Clear relationships
    const { setRelationships } = useRelationshipStore.getState();
    setRelationships([]);
  },
  
  // Update a node
  updateNode: (nodeId: NodeId, updates: Partial<Node>) => {
    const { nodes } = get();
    if (!nodes[nodeId]) return;
    
    set({
      nodes: {
        ...nodes,
        [nodeId]: {
          ...nodes[nodeId],
          ...updates,
          updatedAt: Date.now(),
        },
      },
    });
  },
  
  // Add a new node
  addNode: (node: Node) => {
    const { nodes, rootNodeId } = get();
    const updatedNodes = {
      ...nodes,
      [node.id]: node,
    };

    // Update parent's children array
    if (node.parentId && updatedNodes[node.parentId]) {
      updatedNodes[node.parentId] = {
        ...updatedNodes[node.parentId],
        children: [...updatedNodes[node.parentId].children, node.id],
      };
    }

    // Recalculate layout
    if (rootNodeId) {
      const { nodes: layoutedNodes } = calculateLayout(updatedNodes, rootNodeId);
      set({ nodes: layoutedNodes });
    } else {
      set({ nodes: updatedNodes });
    }
  },
  
  // Delete a node and all its children
  deleteNode: (nodeId: NodeId) => {
    const { nodes, rootNodeId } = get();
    const nodeToDelete = nodes[nodeId];
    if (!nodeToDelete) return;

    // Recursively collect all child nodes
    const nodesToDelete = new Set<NodeId>([nodeId]);
    const collectChildren = (id: NodeId) => {
      const node = nodes[id];
      if (node) {
        node.children.forEach((childId) => {
          nodesToDelete.add(childId);
          collectChildren(childId);
        });
      }
    };
    collectChildren(nodeId);

    // Remove all collected nodes
    const newNodes = { ...nodes };
    nodesToDelete.forEach((id) => delete newNodes[id]);

    // Clean up relationships: remove all deleted nodes from all relationships
    const removeNodeFromRelationships = useRelationshipStore.getState().removeNodeFromAllRelationships;
    nodesToDelete.forEach((id) => removeNodeFromRelationships(id));

    // Update parent's children array
    if (nodeToDelete.parentId && newNodes[nodeToDelete.parentId]) {
      newNodes[nodeToDelete.parentId] = {
        ...newNodes[nodeToDelete.parentId],
        children: newNodes[nodeToDelete.parentId].children.filter(id => id !== nodeId),
      };
    }

    // Recalculate layout
    if (rootNodeId) {
      const { nodes: layoutedNodes } = calculateLayout(newNodes, rootNodeId);
      set({ nodes: layoutedNodes });
    } else {
      set({ nodes: newNodes });
    }
  },
  
  // Toggle node expansion
  toggleNodeExpansion: (nodeId: NodeId) => {
    const { nodes, rootNodeId } = get();
    const node = nodes[nodeId];
    if (!node || !rootNodeId) return;

    // Close info panel when expanding/collapsing nodes
    const { infoPanelNodeId, toggleInfoPanel } = useUIStore.getState();
    if (infoPanelNodeId) {
      toggleInfoPanel(null);
    }

    const newExpanded = !node.isExpanded;

    // Update node expansion state
    let updatedNodes = { ...nodes };
    updatedNodes[nodeId] = {
      ...node,
      isExpanded: newExpanded,
    };

    // Update children visibility
    const updateChildrenVisibility = (parentId: NodeId, visible: boolean) => {
      const parent = updatedNodes[parentId];
      if (!parent) return;

      parent.children.forEach((childId) => {
        const child = updatedNodes[childId];
        if (child) {
          updatedNodes[childId] = {
            ...child,
            isVisible: visible,
          };

          // Recursively hide children if parent is collapsed
          if (!visible || !child.isExpanded) {
            updateChildrenVisibility(childId, false);
          }
        }
      });
    };

    updateChildrenVisibility(nodeId, newExpanded);

    // Recalculate layout to prevent overlaps
    const { nodes: layoutedNodes } = calculateLayout(updatedNodes, rootNodeId);

    set({ nodes: layoutedNodes });
  },
  
  // Record an action
  recordAction: (action: Action) => {
    const { recordedActions } = get();
    set({
      recordedActions: [...recordedActions, action],
    });
  },
  
  // Clear all recorded actions
  clearActions: () => {
    set({ recordedActions: [] });
  },
  
  // Update project metadata
  updateProjectMetadata: (updates: Partial<Project['metadata']>) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    set({
      currentProject: {
        ...currentProject,
        metadata: {
          ...currentProject.metadata,
          ...updates,
          updatedAt: Date.now(),
        },
      },
    });
  },
}));
