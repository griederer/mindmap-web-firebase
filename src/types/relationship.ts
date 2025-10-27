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

// Preset color palette for relationships (Linear-inspired muted palette)
export const RELATIONSHIP_COLORS = [
  '#94A3B8', // Slate Gray - Primary neutral
  '#64748B', // Cool Gray - Secondary neutral
  '#6366F1', // Muted Indigo - Professional blue
  '#8B5CF6', // Soft Purple - Elegant accent
  '#06B6D4', // Muted Cyan - Professional teal
  '#10B981', // Muted Emerald - Success/growth
  '#F59E0B', // Muted Amber - Warm accent
  '#EF4444', // Muted Rose - Alert/critical
] as const;

// Line type options for UI
export const LINE_TYPES: { value: LineType; label: string; preview: string }[] = [
  { value: 'solid', label: 'Solid', preview: '──────' },
  { value: 'dashed', label: 'Dashed', preview: '─ ─ ─ ─' },
  { value: 'dotted', label: 'Dotted', preview: '· · · · ·' },
];
