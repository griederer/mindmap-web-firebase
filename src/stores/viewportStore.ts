/**
 * Viewport Store - Zustand
 * Manages camera position, zoom level, and viewport transformations
 */

import { create } from 'zustand';

interface ViewportState {
  // Camera position
  x: number;
  y: number;
  
  // Zoom level (1 = 100%, 2 = 200%, 0.5 = 50%)
  zoom: number;
  
  // Viewport dimensions
  width: number;
  height: number;
  
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
}

const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.2;

export const useViewportStore = create<ViewportState>((set, get) => ({
  // Initial state (centered viewport)
  x: 0,
  y: 0,
  zoom: DEFAULT_ZOOM,
  width: typeof window !== 'undefined' ? window.innerWidth : 1920,
  height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  
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
}));
