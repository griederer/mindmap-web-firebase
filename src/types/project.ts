/**
 * Project Type Definitions for MyMindmap
 * Represents a complete mind map project with nodes
 * Clean version - mindmap only
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
// MODULAR PROJECT SYSTEM
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
    mindmap?: ViewConfig;
  };
}

/**
 * Complete project bundle
 */
export interface ProjectBundle {
  metadata: ModularProjectMetadata;
  projectId: string;
  mindmap?: {
    rootNodeId: string;
    nodes: Record<string, Node>;
  };
  // Legacy fields for backward compatibility
  actions?: Action[];
  relationships?: Relationship[];
}
