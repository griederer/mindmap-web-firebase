/**
 * Node Type Definitions for NODEM
 * Represents a single node in the mind map hierarchy
 */

export interface NodePosition {
  x: number;
  y: number;
}

export interface Node {
  // Core identification
  id: string;
  
  // Content
  title: string;
  description: string;
  image?: string; // URL or base64
  
  // Hierarchy
  children: string[]; // Array of child node IDs
  level: number; // Depth in tree (0 = root)
  parentId: string | null;
  
  // Layout
  position: NodePosition;
  
  // Visual state
  isExpanded: boolean;
  isVisible: boolean; // Hidden when parent collapsed
  
  // Metadata
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}

export type NodeId = string;
