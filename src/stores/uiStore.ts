/**
 * UI Store - Zustand
 * Manages UI state (selected node, focus mode, panels, etc.)
 */

import { create } from 'zustand';
import { NodeId } from '../types/node';

interface UIState {
  // Node selection
  selectedNodeId: NodeId | null;

  // Focus mode (blur non-focused nodes)
  focusedNodeId: NodeId | null;
  isFocusMode: boolean;

  // Detail panel
  detailPanelOpen: boolean;
  detailPanelNodeId: NodeId | null;
  detailNodeId: NodeId | null; // Alias for compatibility

  // Inline info panel (shows on canvas)
  infoPanelNodeId: NodeId | null;

  // Fullscreen image
  fullscreenImageUrl: string | null;

  // Sidebar
  sidebarOpen: boolean;

  // Operations
  selectNode: (nodeId: NodeId | null) => void;
  setFocusMode: (nodeId: NodeId | null) => void;
  clearFocus: () => void;
  openDetailPanel: (nodeId: NodeId) => void;
  openDetails: (nodeId: NodeId) => void; // Alias
  closeDetailPanel: () => void;
  closeDetails: () => void; // Alias
  toggleDetailPanel: () => void;
  toggleInfoPanel: (nodeId: NodeId | null) => void;
  openFullscreenImage: (imageUrl: string) => void;
  closeFullscreenImage: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  selectedNodeId: null,
  focusedNodeId: null,
  isFocusMode: false,
  detailPanelOpen: false,
  detailPanelNodeId: null,
  detailNodeId: null,
  infoPanelNodeId: null,
  fullscreenImageUrl: null,
  sidebarOpen: true,
  
  // Select a node
  selectNode: (nodeId: NodeId | null) => {
    // Close info panel when selecting a different node
    const { infoPanelNodeId } = get();
    if (infoPanelNodeId && infoPanelNodeId !== nodeId) {
      set({ selectedNodeId: nodeId, infoPanelNodeId: null });
    } else {
      set({ selectedNodeId: nodeId });
    }
  },
  
  // Set focus mode on a specific node
  setFocusMode: (nodeId: NodeId | null) => {
    set({
      focusedNodeId: nodeId,
      isFocusMode: nodeId !== null,
    });
  },
  
  // Clear focus mode
  clearFocus: () => {
    set({
      focusedNodeId: null,
      isFocusMode: false,
    });
  },
  
  // Open detail panel for a node
  openDetailPanel: (nodeId: NodeId) => {
    set({
      detailPanelOpen: true,
      detailPanelNodeId: nodeId,
      detailNodeId: nodeId,
    });
  },

  // Alias for openDetailPanel
  openDetails: (nodeId: NodeId) => {
    set({
      detailPanelOpen: true,
      detailPanelNodeId: nodeId,
      detailNodeId: nodeId,
    });
  },

  // Close detail panel
  closeDetailPanel: () => {
    set({
      detailPanelOpen: false,
      detailPanelNodeId: null,
      detailNodeId: null,
    });
  },

  // Alias for closeDetailPanel
  closeDetails: () => {
    set({
      detailPanelOpen: false,
      detailPanelNodeId: null,
      detailNodeId: null,
    });
  },
  
  // Toggle detail panel
  toggleDetailPanel: () => {
    const { detailPanelOpen } = get();
    if (detailPanelOpen) {
      set({
        detailPanelOpen: false,
        detailPanelNodeId: null,
      });
    } else if (get().selectedNodeId) {
      set({
        detailPanelOpen: true,
        detailPanelNodeId: get().selectedNodeId,
      });
    }
  },

  // Toggle inline info panel
  toggleInfoPanel: (nodeId: NodeId | null) => {
    const { infoPanelNodeId } = get();
    if (infoPanelNodeId === nodeId) {
      set({ infoPanelNodeId: null });
    } else {
      set({ infoPanelNodeId: nodeId });
    }
  },
  
  // Open fullscreen image
  openFullscreenImage: (imageUrl: string) => {
    set({ fullscreenImageUrl: imageUrl });
  },
  
  // Close fullscreen image
  closeFullscreenImage: () => {
    set({ fullscreenImageUrl: null });
  },
  
  // Toggle sidebar
  toggleSidebar: () => {
    const { sidebarOpen } = get();
    set({ sidebarOpen: !sidebarOpen });
  },
  
  // Set sidebar state
  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },
}));
