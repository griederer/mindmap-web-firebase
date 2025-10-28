/**
 * Project Type Definitions for NODEM
 * Represents a complete mind map project with nodes and presentation actions
 */

import { Node } from './node';
import { Action } from './action';
import { Relationship } from './relationship';

export interface ProjectMetadata {
  title: string;
  description?: string;
  author?: string;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  thumbnail?: string; // Base64 or URL
  tags?: string[];
  version: string; // Semantic version (e.g., "1.0.0")
}

export interface Project {
  // Core identification
  projectId: string;

  // Metadata
  metadata: ProjectMetadata;

  // Data structure
  nodes: Record<string, Node>; // Map of nodeId -> Node
  rootNodeId: string; // ID of the root node

  // Relationships
  relationships?: Relationship[]; // Custom node relationships

  // Presentation
  actions: Action[]; // Ordered array of recorded actions

  // Settings
  settings?: {
    defaultZoom?: number;
    defaultPosition?: { x: number; y: number };
    theme?: 'light' | 'dark';
  };
}

export type ProjectId = string;

// ============================================================================
// MODULAR PROJECT SYSTEM (v1.5+)
// ============================================================================

/**
 * View configuration for modular projects
 */
export interface ViewConfig {
  enabled: boolean;
  default?: boolean;
  file: string;
  config?: Record<string, any>;
}

/**
 * Modular project metadata with view configuration
 */
export interface ModularProjectMetadata extends ProjectMetadata {
  views?: {
    [viewType: string]: ViewConfig;
  };
}

/**
 * Timeline data structure
 */
export interface TimelineData {
  config: TimelineConfig;
  events: TimelineEvent[];
}

export interface TimelineConfig {
  startDate: string;
  endDate: string;
  granularity: 'year' | 'month' | 'day';
  tracks: TimelineTrack[];
}

export interface TimelineTrack {
  id: string;
  name: string;
  color: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  track: string;
  linkedNodeId?: string;
  images?: Array<{
    url: string;
    caption: string;
  }>;
}

/**
 * Kanban data structure (placeholder for future)
 */
export interface KanbanData {
  config: {
    columns: Array<{
      id: string;
      name: string;
      color: string;
    }>;
  };
  cards: Array<{
    id: string;
    title: string;
    description: string;
    column: string;
    linkedNodeId?: string;
  }>;
}

/**
 * Matrix data structure (placeholder for future)
 */
export interface MatrixData {
  config: {
    rows: Array<{ id: string; name: string }>;
    columns: Array<{ id: string; name: string; type: string }>;
  };
  cells: Array<{
    rowId: string;
    columnId: string;
    value: any;
    linkedNodeId?: string;
  }>;
}

/**
 * Complete project bundle with all views
 */
export interface ProjectBundle {
  metadata: ModularProjectMetadata;
  projectId: string;
  mindmap?: {
    rootNodeId: string;
    nodes: Record<string, Node>;
  };
  timeline?: TimelineData;
  kanban?: KanbanData;
  matrix?: MatrixData;
  // Legacy fields for backward compatibility
  actions?: Action[];
  relationships?: Relationship[];
}

/**
 * View type identifier
 */
export type ViewType = 'mindmap' | 'timeline' | 'kanban' | 'matrix';

/**
 * View metadata
 */
export interface ViewInfo {
  id: ViewType;
  name: string;
  icon: string;
  description: string;
}

/**
 * Available view definitions
 */
export const AVAILABLE_VIEWS: Record<ViewType, ViewInfo> = {
  mindmap: {
    id: 'mindmap',
    name: 'Mindmap',
    icon: '🗺️',
    description: 'Visual de mapa mental con nodos y conexiones',
  },
  timeline: {
    id: 'timeline',
    name: 'Timeline',
    icon: '📅',
    description: 'Línea de tiempo cronológica de eventos',
  },
  kanban: {
    id: 'kanban',
    name: 'Kanban',
    icon: '📋',
    description: 'Tablero kanban para gestión de tareas',
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix',
    icon: '📊',
    description: 'Vista de matriz para análisis comparativo',
  },
};
