/**
 * UI Store - Zustand
 * Manages UI state (selected node, focus mode, panels, etc.)
 */

import { create } from 'zustand';
import { NodeId } from '../types/node';
import { ViewType, TimelineEvent } from '../types/project';

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

  // Timeline event info panel
  selectedTimelineEvent: TimelineEvent | null;

  // Fullscreen image
  fullscreenImageUrl: string | null;

  // Sidebar
  sidebarOpen: boolean;

  // Timeline ribbon
  timelineRibbonOpen: boolean;

  // Current view
  currentView: ViewType;

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
  selectTimelineEvent: (event: TimelineEvent | null) => void;
  openFullscreenImage: (imageUrl: string) => void;
  closeFullscreenImage: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleTimelineRibbon: () => void;
  setTimelineRibbonOpen: (open: boolean) => void;
  setView: (view: ViewType) => void;
  closeTopPanel: () => boolean; // Returns true if something was closed
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
  selectedTimelineEvent: null,
  fullscreenImageUrl: null,
  sidebarOpen: true,
  timelineRibbonOpen: false,
  currentView: 'mindmap',
  
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
      set({ infoPanelNodeId: nodeId, selectedTimelineEvent: null });
    }
  },

  // Select timeline event (opens info panel for event)
  selectTimelineEvent: (event: TimelineEvent | null) => {
    set({
      selectedTimelineEvent: event,
      infoPanelNodeId: null, // Close node info panel
    });
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

  // Toggle timeline ribbon
  toggleTimelineRibbon: () => {
    const { timelineRibbonOpen } = get();
    set({ timelineRibbonOpen: !timelineRibbonOpen });
  },

  // Set timeline ribbon state
  setTimelineRibbonOpen: (open: boolean) => {
    set({ timelineRibbonOpen: open });
  },

  // Set current view - auto-focus to main node when exiting timeline
  setView: (view: ViewType) => {
    const previousView = get().currentView;

    // If switching from timeline to mindmap, auto-focus on main node
    if (previousView === 'timeline' && view === 'mindmap') {
      console.log('[UIStore] Switching from timeline to mindmap - triggering auto-focus');

      // Import stores dynamically to avoid circular dependencies
      import('./viewportStore').then(({ useViewportStore }) => {
        import('./projectStore').then(({ useProjectStore }) => {
          const { focusOnNodes } = useViewportStore.getState();
          const { nodes } = useProjectStore.getState();

          // Find root node (node without parent)
          const rootNode = Object.values(nodes).find(node => !node.parent);

          if (rootNode) {
            console.log(`[UIStore] Auto-focusing on root node: ${rootNode.title}`);
            // Focus on root node with animation
            focusOnNodes([rootNode.id], true);
          }
        });
      });
    }

    set({ currentView: view });
  },

  // Close the topmost open panel/modal in priority order
  closeTopPanel: () => {
    const {
      fullscreenImageUrl,
      infoPanelNodeId,
      selectedTimelineEvent,
      detailPanelOpen,
      sidebarOpen,
    } = get();

    // Priority order (highest to lowest):
    // 1. Fullscreen image
    if (fullscreenImageUrl) {
      set({ fullscreenImageUrl: null });
      return true;
    }

    // 2. Inline info panel
    if (infoPanelNodeId) {
      set({ infoPanelNodeId: null });
      return true;
    }

    // 3. Timeline event panel
    if (selectedTimelineEvent) {
      set({ selectedTimelineEvent: null });
      return true;
    }

    // 4. Detail panel
    if (detailPanelOpen) {
      set({
        detailPanelOpen: false,
        detailPanelNodeId: null,
        detailNodeId: null,
      });
      return true;
    }

    // 5. Sidebar
    if (sidebarOpen) {
      set({ sidebarOpen: false });
      return true;
    }

    // Nothing was open
    return false;
  },
}));
