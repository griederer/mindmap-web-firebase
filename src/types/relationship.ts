/**
 * Relationship Types
 * Custom connections between nodes beyond hierarchical structure
 */

export type LineType = 'solid' | 'dashed' | 'dotted';

export interface Relationship {
  id: string; // UUID
  title: string; // e.g., "Dependencies", "Cross-references"
  color: string; // Hex color (e.g., "#EF4444")
  lineType: LineType; // Visual style
  lineWidth: number; // 1-5px
  nodeIds: string[]; // Array of node IDs in this relationship
  isVisible: boolean; // Toggle state (show/hide lines)
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}

// Preset color palette for relationships
export const RELATIONSHIP_COLORS = [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
] as const;

// Line type options for UI
export const LINE_TYPES: { value: LineType; label: string; preview: string }[] = [
  { value: 'solid', label: 'Solid', preview: '──────' },
  { value: 'dashed', label: 'Dashed', preview: '─ ─ ─ ─' },
  { value: 'dotted', label: 'Dotted', preview: '· · · · ·' },
];
