/**
 * Viewport Store - Zustand
 * Manages camera position, zoom level, and viewport transformations
 */

import { create } from 'zustand';
import Konva from 'konva';
import { useProjectStore } from './projectStore';
import {
  calculateBoundingBox,
  calculateOptimalZoom,
  calculateCameraPosition,
  calculateBoundingBoxWithPanel,
  AUTO_FOCUS_CONSTANTS,
} from '../utils/autoFocusUtils';
import { AnimationQueue } from '../utils/performance/animationThrottle';
import {
  disableShadowsDuringAnimation,
  enableShadowsAfterAnimation,
} from '../utils/performance/canvasOptimizer';

interface ViewportState {
  // Camera position
  x: number;
  y: number;

  // Zoom level (1 = 100%, 2 = 200%, 0.5 = 50%)
  zoom: number;

  // Viewport dimensions
  width: number;
  height: number;

  // Auto Focus mode
  autoFocusEnabled: boolean;

  // Animation management
  animationInProgress: boolean;
  animationQueue: AnimationQueue;
  stageRef: Konva.Stage | null;
  layerRef: Konva.Layer | null;

  // Operations
  setPosition: (x: number, y: number) => void;
  pan: (deltaX: number, deltaY: number) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setViewportSize: (width: number, height: number) => void;
  focusOnPoint: (x: number, y: number, zoom?: number) => void;
  resetViewport: () => void;

  // Auto Focus operations
  setAutoFocus: (enabled: boolean) => void;
  focusOnNodes: (nodeIds: string[], animate?: boolean) => void;
  focusOnNodeWithPanel: (nodeId: string, panelWidth: number, panelHeight: number, animate?: boolean) => void;

  // Animation helpers
  setAnimationInProgress: (inProgress: boolean) => void;
  cancelCurrentAnimation: () => void;
  setStageRef: (stage: Konva.Stage | null, layer: Konva.Layer | null) => void;
}

const DEFAULT_ZOOM = 1;
const MIN_ZOOM = AUTO_FOCUS_CONSTANTS.MIN_ZOOM; // 0.25
const MAX_ZOOM = AUTO_FOCUS_CONSTANTS.MAX_ZOOM; // 4.0
const ZOOM_STEP = 0.2;

// LocalStorage key for Auto Focus persistence
const AUTO_FOCUS_STORAGE_KEY = 'mindmap-auto-focus-enabled';

// Load Auto Focus setting from localStorage
const loadAutoFocusSetting = (): boolean => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem(AUTO_FOCUS_STORAGE_KEY);
  return saved === 'true';
};

export const useViewportStore = create<ViewportState>((set, get) => ({
  // Initial state (centered viewport)
  x: 0,
  y: 0,
  zoom: DEFAULT_ZOOM,
  width: typeof window !== 'undefined' ? window.innerWidth : 1920,
  height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  autoFocusEnabled: loadAutoFocusSetting(),
  animationInProgress: false,
  animationQueue: new AnimationQueue(),
  stageRef: null,
  layerRef: null,
  
  // Set absolute position
  setPosition: (x: number, y: number) => {
    set({ x, y });
  },
  
  // Pan by delta
  pan: (deltaX: number, deltaY: number) => {
    const { x, y } = get();
    set({
      x: x + deltaX,
      y: y + deltaY,
    });
  },
  
  // Set zoom level
  setZoom: (zoom: number) => {
    const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
    set({ zoom: clampedZoom });
  },
  
  // Zoom in by step
  zoomIn: () => {
    const { zoom } = get();
    const newZoom = Math.min(MAX_ZOOM, zoom + ZOOM_STEP);
    set({ zoom: newZoom });
  },
  
  // Zoom out by step
  zoomOut: () => {
    const { zoom } = get();
    const newZoom = Math.max(MIN_ZOOM, zoom - ZOOM_STEP);
    set({ zoom: newZoom });
  },
  
  // Reset zoom to 100%
  resetZoom: () => {
    set({ zoom: DEFAULT_ZOOM });
  },
  
  // Update viewport dimensions
  setViewportSize: (width: number, height: number) => {
    set({ width, height });
  },
  
  // Focus camera on a specific point
  focusOnPoint: (x: number, y: number, zoom?: number) => {
    const { width, height } = get();
    set({
      x: width / 2 - x,
      y: height / 2 - y,
      zoom: zoom ?? get().zoom,
    });
  },
  
  // Reset to default viewport
  resetViewport: () => {
    set({
      x: 0,
      y: 0,
      zoom: DEFAULT_ZOOM,
    });
  },

  // Toggle Auto Focus mode and persist to localStorage
  setAutoFocus: (enabled: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTO_FOCUS_STORAGE_KEY, enabled.toString());
    }
    set({ autoFocusEnabled: enabled });
  },

  // Focus camera on a set of nodes with dynamic zoom
  focusOnNodes: (nodeIds: string[], animate: boolean = true) => {
    console.log('[ViewportStore] focusOnNodes called:', { nodeIds, animate });
    const { width, height, stageRef, layerRef, animationQueue } = get();
    const nodes = useProjectStore.getState().nodes;

    // Calculate bounding box for specified nodes
    const bbox = calculateBoundingBox(nodes, nodeIds);

    // Handle empty bounding box
    if (bbox.width === 0 || bbox.height === 0) {
      console.log('[ViewportStore] Empty bounding box, aborting');
      return;
    }

    // Calculate optimal zoom and camera position
    const optimalZoom = calculateOptimalZoom(bbox, { width, height });
    const camera = calculateCameraPosition(bbox, optimalZoom, { width, height });

    console.log('[ViewportStore] Calculated target:', { x: camera.x, y: camera.y, zoom: optimalZoom });

    // If animation disabled or stage not ready, update instantly
    if (!animate || !stageRef) {
      set((state) => ({
        ...state,
        x: camera.x,
        y: camera.y,
        zoom: optimalZoom,
      }));
      return;
    }

    // Smooth animated transition
    set({ animationInProgress: true });

    // Disable shadows for performance during animation
    if (layerRef) {
      disableShadowsDuringAnimation(layerRef);
    }

    // Animate stage with smooth easing
    animationQueue.add({
      stage: stageRef,
      target: {
        x: camera.x,
        y: camera.y,
        scaleX: optimalZoom,
        scaleY: optimalZoom,
      },
      duration: 1.2,
      easing: Konva.Easings.EaseInOut,
      priority: 10,
    }).then(() => {
      // Re-enable shadows after animation completes
      if (layerRef) {
        enableShadowsAfterAnimation(layerRef);
      }

      // Update Zustand state to match final animated position
      set({
        x: camera.x,
        y: camera.y,
        zoom: optimalZoom,
        animationInProgress: false,
      });
    }).catch((err) => {
      console.warn('[ViewportStore] Animation cancelled:', err);
      set({ animationInProgress: false });
    });
  },

  // Focus camera on a node with its info panel visible
  focusOnNodeWithPanel: (
    nodeId: string,
    panelWidth: number,
    panelHeight: number,
    animate: boolean = true
  ) => {
    console.log('[ViewportStore] focusOnNodeWithPanel called:', {
      nodeId,
      panelWidth,
      panelHeight,
      animate
    });
    const { width, height, stageRef, layerRef, animationQueue } = get();
    const nodes = useProjectStore.getState().nodes;

    // Calculate bounding box including panel
    const bbox = calculateBoundingBoxWithPanel(nodes, nodeId, panelWidth, panelHeight);

    // Handle empty bounding box
    if (bbox.width === 0 || bbox.height === 0) {
      console.log('[ViewportStore] Empty bounding box, aborting');
      return;
    }

    // Calculate optimal zoom and camera position
    const optimalZoom = calculateOptimalZoom(bbox, { width, height });
    const camera = calculateCameraPosition(bbox, optimalZoom, { width, height });

    console.log('[ViewportStore] Calculated target:', { x: camera.x, y: camera.y, zoom: optimalZoom });

    // If animation disabled or stage not ready, update instantly
    if (!animate || !stageRef) {
      set((state) => ({
        ...state,
        x: camera.x,
        y: camera.y,
        zoom: optimalZoom,
      }));
      return;
    }

    // Smooth animated transition
    set({ animationInProgress: true });

    // Disable shadows for performance during animation
    if (layerRef) {
      disableShadowsDuringAnimation(layerRef);
    }

    // Animate stage with smooth easing
    animationQueue.add({
      stage: stageRef,
      target: {
        x: camera.x,
        y: camera.y,
        scaleX: optimalZoom,
        scaleY: optimalZoom,
      },
      duration: 1.2,
      easing: Konva.Easings.EaseInOut,
      priority: 10,
    }).then(() => {
      // Re-enable shadows after animation completes
      if (layerRef) {
        enableShadowsAfterAnimation(layerRef);
      }

      // Update Zustand state to match final animated position
      set({
        x: camera.x,
        y: camera.y,
        zoom: optimalZoom,
        animationInProgress: false,
      });
    }).catch((err) => {
      console.warn('[ViewportStore] Animation cancelled:', err);
      set({ animationInProgress: false });
    });
  },

  // Set animation in progress state
  setAnimationInProgress: (inProgress: boolean) => {
    set({ animationInProgress: inProgress });
  },

  // Cancel current animation
  cancelCurrentAnimation: () => {
    const { animationQueue } = get();
    animationQueue.cancel();
    set({ animationInProgress: false });
  },

  // Set stage and layer references for animations
  setStageRef: (stage: Konva.Stage | null, layer: Konva.Layer | null) => {
    set({ stageRef: stage, layerRef: layer });
  },
}));
