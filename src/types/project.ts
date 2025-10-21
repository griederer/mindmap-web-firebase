/**
 * Project Type Definitions for NODEM
 * Represents a complete mind map project with nodes and presentation actions
 */

import { Node } from './node';
import { Action } from './action';

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
