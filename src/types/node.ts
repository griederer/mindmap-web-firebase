/**
 * Node Type Definitions for NODEM v3.0
 * Represents a single node in the mind map hierarchy
 * Supports organic mindmap features: bidirectional layout, styles, images
 */

export interface NodePosition {
  x: number;
  y: number;
}

// Node visual styles
export type NodeStyle = 'boxed' | 'text' | 'bubble' | 'minimal';

// Layout side for bidirectional mindmaps
export type LayoutSide = 'left' | 'right' | 'auto';

// Image display modes
export type ImageDisplayMode = 'thumbnail' | 'inline' | 'icon';

export interface NodeImage {
  id: string;          // Unique identifier (e.g., "img-1234567890")
  data: string;        // Base64 data URI (e.g., "data:image/png;base64,...")
  filename: string;    // Original filename (e.g., "stalingrad.jpg")
  size: number;        // File size in bytes
  addedAt: number;     // Timestamp when added
  displayMode?: ImageDisplayMode; // How to display the image
  width?: number;      // Display width
  height?: number;     // Display height
}

// Branch color palette for organic mindmaps
export const BRANCH_COLORS = [
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#EF4444', // Red
  '#84CC16', // Lime
] as const;

export type BranchColor = typeof BRANCH_COLORS[number];

export interface Node {
  // Core identification
  id: string;

  // Content
  title: string;
  description: string;
  images?: NodeImage[]; // Optional array of attached images

  // Hierarchy
  children: string[]; // Array of child node IDs
  level: number; // Depth in tree (0 = root)
  parentId: string | null;

  // Layout
  position: NodePosition;
  layoutSide?: LayoutSide; // Which side of root (bidirectional)

  // Visual styling (v3.0)
  style?: NodeStyle; // Node appearance style
  branchColor?: string; // Color for this branch (inherited by children)
  branchIndex?: number; // Index for auto-color assignment

  // Visual state
  isExpanded: boolean;
  isVisible: boolean; // Hidden when parent collapsed

  // Node type (for special nodes like timeline)
  nodeType?: 'default' | 'timeline' | 'year' | 'event';

  // Timeline-specific data
  timelineConfig?: {
    startYear: number;
    endYear: number;
    layout: 'horizontal-with-vertical-events';
  };

  // Year-specific data (for year nodes)
  year?: number;

  // Event-specific data
  eventDate?: string; // ISO date string
  eventCategory?: string; // e.g., "Europa", "Pacífico"

  // Metadata
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}

export type NodeId = string;

/**
 * Type guard to validate NodeImage at runtime
 */
export function isValidNodeImage(obj: unknown): obj is NodeImage {
  if (typeof obj !== 'object' || obj === null) return false;

  const image = obj as Record<string, unknown>;

  return (
    typeof image.id === 'string' &&
    typeof image.data === 'string' &&
    image.data.startsWith('data:image/') &&
    typeof image.filename === 'string' &&
    typeof image.size === 'number' &&
    image.size > 0 &&
    typeof image.addedAt === 'number' &&
    image.addedAt > 0
  );
}

/**
 * Connector label for annotating relationships
 */
export interface ConnectorLabel {
  fromId: string;
  toId: string;
  label: string;
}

/**
 * Get branch color by index (cycles through palette)
 */
export function getBranchColor(index: number): string {
  return BRANCH_COLORS[index % BRANCH_COLORS.length];
}

/**
 * Calculate stroke width based on node level (thicker near root)
 */
export function getConnectorWidth(level: number): number {
  return Math.max(1.5, 4 - level * 0.6);
}

/**
 * Default node style
 */
export const DEFAULT_NODE_STYLE: NodeStyle = 'boxed';

/**
 * Default layout side
 */
export const DEFAULT_LAYOUT_SIDE: LayoutSide = 'auto';
