/**
 * Project Store - Zustand
 * Manages current project state, nodes, and recorded actions
 */

import { create } from 'zustand';
import { Project, ProjectId } from '../types/project';
import { Node, NodeId } from '../types/node';
import { Action } from '../types/action';

interface ProjectState {
  // Current project
  currentProject: Project | null;
  currentProjectId: ProjectId | null;
  
  // Node operations
  nodes: Record<NodeId, Node>;
  rootNodeId: NodeId | null;
  
  // Actions
  recordedActions: Action[];
  
  // Operations
  loadProject: (project: Project) => void;
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
    const { nodes } = get();
    set({
      nodes: {
        ...nodes,
        [node.id]: node,
      },
    });
  },
  
  // Delete a node and all its children
  deleteNode: (nodeId: NodeId) => {
    const { nodes } = get();
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
    
    set({ nodes: newNodes });
  },
  
  // Toggle node expansion
  toggleNodeExpansion: (nodeId: NodeId) => {
    const { nodes } = get();
    const node = nodes[nodeId];
    if (!node) return;
    
    const newExpanded = !node.isExpanded;
    
    // Update node expansion state
    const updatedNodes = { ...nodes };
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
    set({ nodes: updatedNodes });
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
