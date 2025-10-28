/**
 * Node Type Definitions for NODEM
 * Represents a single node in the mind map hierarchy
 */

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeImage {
  id: string;          // Unique identifier (e.g., "img-1234567890")
  data: string;        // Base64 data URI (e.g., "data:image/png;base64,...")
  filename: string;    // Original filename (e.g., "stalingrad.jpg")
  size: number;        // File size in bytes
  addedAt: number;     // Timestamp when added
}

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
